import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Linkedin, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { startLinkedInAuth, getLinkedInStatus, disconnectLinkedIn } from '@/services/api.service';

interface LinkedInCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LinkedInStatus {
  isConnected: boolean;
  linkedinEmail: string | null;
  lastConnected: string | null;
  tokenValid: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

const LinkedInCredentialsModal = ({ open, onOpenChange }: LinkedInCredentialsModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<LinkedInStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Fetch LinkedIn status when modal opens
  useEffect(() => {
    if (open) {
      fetchLinkedInStatus();
    }
  }, [open]);

  const fetchLinkedInStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await getLinkedInStatus();
      
      if (response.success) {
        setStatus(response.data);
        if (response.data.email) {
          setFormData(prev => ({ ...prev, email: response.data.email }));
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error fetching LinkedIn status:', error);
      toast({
        title: "Error",
        description: "Failed to load LinkedIn status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await setLinkedInCredentials(formData.email, formData.password);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "LinkedIn credentials saved successfully",
        });
        
        // Refresh status
        await fetchLinkedInStatus();
        
        // Clear password field for security
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error saving LinkedIn credentials:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save LinkedIn credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    
    try {
      const response = await disconnectLinkedIn();
      
      if (response.success) {
        toast({
          title: "Success",
          description: "LinkedIn account disconnected successfully",
        });
        
        // Refresh status and clear form
        await fetchLinkedInStatus();
        setFormData({ email: '', password: '' });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error disconnecting LinkedIn:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect LinkedIn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Integration
          </DialogTitle>
          <DialogDescription>
            Connect your LinkedIn account to automatically post job listings to your LinkedIn profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          {statusLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading status...</span>
            </div>
          ) : status ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Connection Status</span>
                <Badge variant={status.isConnected ? "default" : "secondary"} className="flex items-center gap-1">
                  {status.isConnected ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      Not Connected
                    </>
                  )}
                </Badge>
              </div>
              
              {status.isConnected && status.email && (
                <div className="text-sm text-muted-foreground">
                  <p>Connected account: {status.email}</p>
                  {status.lastConnected && (
                    <p>Last connected: {new Date(status.lastConnected).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your LinkedIn credentials are encrypted and stored securely. They are only used for automatic job posting and are never shared with third parties.
            </AlertDescription>
          </Alert>

          {/* Credentials Form */}
          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin-email">LinkedIn Email *</Label>
              <Input
                id="linkedin-email"
                type="email"
                placeholder="your-email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin-password">LinkedIn Password *</Label>
              <Input
                id="linkedin-password"
                type="password"
                placeholder="Your LinkedIn password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Password is encrypted before storage and never displayed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <div>
                {status?.isConnected && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Disconnect LinkedIn'
                    )}
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    status?.isConnected ? 'Update Credentials' : 'Connect LinkedIn'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Usage Instructions */}
          <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
            <p className="font-medium">How it works:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Connect your LinkedIn account using your login credentials</li>
              <li>When publishing jobs, select LinkedIn as a platform</li>
              <li>Jobs will be automatically posted to your LinkedIn profile</li>
              <li>You can disconnect your account anytime</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedInCredentialsModal;
