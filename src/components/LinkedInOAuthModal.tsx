import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Linkedin, Shield, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { startLinkedInAuth, getLinkedInStatus, disconnectLinkedIn } from '@/services/api.service';

interface LinkedInOAuthModalProps {
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

const LinkedInOAuthModal = ({ open, onOpenChange }: LinkedInOAuthModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<LinkedInStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Fetch LinkedIn status when modal opens
  useEffect(() => {
    if (open) {
      fetchLinkedInStatus();
      // Check for OAuth callback results in URL
      checkOAuthCallback();
    }
  }, [open]);

  const checkOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    const linkedInError = urlParams.get('linkedin_error');
    const message = urlParams.get('message');

    if (linkedInConnected === 'true') {
      toast({
        title: "LinkedIn Connected!",
        description: message || "Your LinkedIn account has been connected successfully.",
        variant: "default",
      });
      fetchLinkedInStatus(); // Refresh status
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (linkedInError) {
      toast({
        title: "LinkedIn Connection Failed",
        description: `Error: ${decodeURIComponent(linkedInError)}`,
        variant: "destructive",
      });
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const fetchLinkedInStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await getLinkedInStatus();
      if (response.success) {
        setStatus(response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch LinkedIn status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch LinkedIn connection status.",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleConnect = async () => {
    // Allow connect if not connected or token has expired
    if (!status?.isConnected || !status?.tokenValid) {
      setConnecting(true);
      try {
        const response = await startLinkedInAuth();
        if (response.success && response.authUrl) {
          // Redirect to LinkedIn OAuth
          window.location.href = response.authUrl;
        } else {
          throw new Error(response.message || 'Failed to start LinkedIn authorization');
        }
      } catch (error: any) {
        console.error('LinkedIn auth error:', error);
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to start LinkedIn authorization. Please try again.",
          variant: "destructive",
        });
      } finally {
        setConnecting(false);
      }
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const response = await disconnectLinkedIn();
      if (response.success) {
        setStatus(null);
        toast({
          title: "Disconnected",
          description: "LinkedIn account has been disconnected successfully.",
          variant: "default",
        });
        fetchLinkedInStatus();
      }
    } catch (error: any) {
      console.error('Disconnect error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect LinkedIn account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (statusLoading) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking...
        </Badge>
      );
    }

    if (!status?.isConnected) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Not Connected
        </Badge>
      );
    }

    if (!status.tokenValid) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Token Expired
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-3 w-3" />
        Connected
      </Badge>
    );
  };

  const getProfileDisplayName = () => {
    if (status?.profile?.firstName || status?.profile?.lastName) {
      return `${status.profile.firstName || ''} ${status.profile.lastName || ''}`.trim();
    }
    return status?.linkedinEmail || 'LinkedIn User';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Integration
          </DialogTitle>
          <DialogDescription>
            Connect your LinkedIn account to automatically post job openings using OAuth 2.0 secure authentication.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <Linkedin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">LinkedIn Account</p>
                {status?.isConnected ? (
                  <p className="text-sm text-muted-foreground">
                    {getProfileDisplayName()}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Not connected</p>
                )}
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* OAuth Information */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This integration uses LinkedIn's official OAuth 2.0 API for secure authentication. 
              Your credentials are never stored on our servers.
            </AlertDescription>
          </Alert>

          {/* Connection Details */}
          {status?.isConnected && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span>{status.linkedinEmail || 'Not available'}</span>
              </div>
              {status.lastConnected && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Connected:</span>
                  <span>{new Date(status.lastConnected).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Token Status:</span>
                <span className={status.tokenValid ? 'text-green-600' : 'text-red-600'}>
                  {status.tokenValid ? 'Valid' : 'Expired'}
                </span>
              </div>
            </div>
          )}

          {/* Token Expiry Warning */}
          {status?.isConnected && !status.tokenValid && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your LinkedIn access token has expired. Please reconnect to continue posting to LinkedIn.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!status?.isConnected || !status.tokenValid ? (
              <Button 
                onClick={handleConnect} 
                disabled={connecting} 
                className="flex-1"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect LinkedIn
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect} 
                disabled={loading} 
                variant="destructive"
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    Disconnect
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedInOAuthModal;
