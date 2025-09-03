import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { generateJobPostAsync, publishJobPostAsync } from '@/store/slices/jobSlice';
import { generateJobPost as generateJobPostAPI } from '@/services/api.service';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Share, Edit, CheckCircle, Image, Sparkles, Settings, AlertTriangle } from 'lucide-react';
import LinkedInOAuthModal from './LinkedInOAuthModal';
import { getLinkedInStatus, publishJobPost } from '@/services/api.service';

interface JobPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string | null;
}

const socialPlatforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-700' },
  { id: 'indeed', name: 'Indeed', icon: '🔍', color: 'bg-blue-800' },
  { id: 'glassdoor', name: 'Glassdoor', icon: '🏢', color: 'bg-green-600' }
];

const JobPostModal = ({ open, onOpenChange, jobId }: JobPostModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [includeImage, setIncludeImage] = useState(true);
  const [companyInfo, setCompanyInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkedinCredentialsOpen, setLinkedinCredentialsOpen] = useState(false);
  const [linkedinStatus, setLinkedinStatus] = useState<{isConnected: boolean; linkedinEmail: string | null; tokenValid: boolean} | null>(null);

  const job = jobId ? jobs.find(j => j.id === jobId) : null;

  useEffect(() => {
    if (job?.jobPost) {
      setPostContent(job.jobPost.content);
      setSelectedPlatforms(job.jobPost.platforms || []);
      setImageUrl(job.jobPost.imageUrl || '');
      setIsEditing(false);
    } else {
      setPostContent('');
      setSelectedPlatforms([]);
      setImageUrl('');
      setIsEditing(false);
    }
  }, [job]);

  // Fetch LinkedIn status when modal opens
  useEffect(() => {
    if (open) {
      fetchLinkedInStatus();
    }
  }, [open]);

  const fetchLinkedInStatus = async () => {
    try {
      const response = await getLinkedInStatus();
      
      if (response.success) {
        setLinkedinStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching LinkedIn status:', error);
    }
  };

  const generatePost = async () => {
    if (!job) return;
    
    setGenerating(true);
    
    try {
      const response = await generateJobPostAPI(job.id, {
        useAI,
        includeImage,
        companyInfo: companyInfo.trim()
      });

      if (response.success) {
        setPostContent(response.data.jobPost.content);
        setImageUrl(response.data.jobPost.imageUrl || '');
        setIsEditing(true);

        toast({
          title: response.data.ai_metadata?.ai_generated ? "AI Job post generated!" : "Job post created",
          description: response.data.ai_metadata?.ai_generated 
            ? "AI has generated your job post with image. You can edit it before publishing." 
            : "Job post content has been saved.",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error generating job post:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate job post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const publishPost = async () => {
    if (!job || !postContent || selectedPlatforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one platform to publish.",
        variant: "destructive",
      });
      return;
    }

    // Check LinkedIn requirements
    if (selectedPlatforms.includes('linkedin')) {
      if (!linkedinStatus?.isConnected) {
        toast({
          title: "LinkedIn Not Connected",
          description: "Please connect your LinkedIn account first.",
          variant: "destructive",
        });
        return;
      }

      if (!linkedinStatus?.tokenValid) {
        toast({
          title: "LinkedIn Token Expired",
          description: "Please reconnect your LinkedIn account.",
          variant: "destructive",
        });
        return;
      }
    }

    setPublishing(true);
    
    try {
      const response = await publishJobPost(job.id, { platforms: selectedPlatforms, content: postContent });
      
      if (response.success) {
        toast({
          title: "Post published successfully",
          description: `Job post has been published to ${selectedPlatforms.length} platform(s).`,
        });

        // Show specific results if available
        if (response.data.publishResults && response.data.publishResults.length > 0) {
          const failures = response.data.publishResults.filter((r: any) => !r.success);
          if (failures.length > 0) {
            toast({
              title: "Some platforms failed",
              description: `Failed to publish to: ${failures.map((f: any) => f.platform).join(', ')}`,
              variant: "destructive",
            });
          }
        }

        // Clear LinkedIn password for security
        onOpenChange(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Publishing failed",
        description: error.message || "Failed to publish job post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {job.jobPost ? 'Manage Job Post' : 'Generate Job Post'}
            {job.jobPost?.publishedAt && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                Published
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {job.jobPost 
              ? 'Edit and republish your job post to social media platforms'
              : `Generate an AI-powered job post for "${job.title}"`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Post Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Job Post Content</Label>
              {!job.jobPost && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePost}
                  disabled={generating}
                  className="btn-secondary"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {postContent ? (
              <div className="space-y-2">
                <Textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  disabled={!isEditing && Boolean(job.jobPost?.publishedAt)}
                  rows={8}
                  className="resize-none"
                />
                {!isEditing && job.jobPost && !job.jobPost.publishedAt && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Content
                  </Button>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <div className="text-muted-foreground space-y-2">
                  <Wand2 className="h-8 w-8 mx-auto" />
                  <p>No job post generated yet</p>
                  <p className="text-sm">Click "Generate with AI" to create your job post</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Configuration (only show if no post exists yet) */}
          {!job.jobPost && (
            <div className="space-y-4 p-4 border border-muted rounded-lg bg-muted/5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <Label className="text-base font-medium">AI Generation Options</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-ai"
                    checked={useAI}
                    onCheckedChange={setUseAI}
                  />
                  <Label htmlFor="use-ai">Use AI to generate content</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-image"
                    checked={includeImage}
                    onCheckedChange={setIncludeImage}
                    disabled={!useAI}
                  />
                  <Label htmlFor="include-image">Generate image</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-info">Company Information (Optional)</Label>
                <Input
                  id="company-info"
                  placeholder="Enter company name or brief description..."
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  disabled={!useAI}
                />
              </div>
            </div>
          )}

          {/* Generated Image */}
          {imageUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <Label>Generated Image</Label>
              </div>
              <div className="border border-muted rounded-lg p-2">
                <img
                  src={imageUrl}
                  alt="Generated job post image"
                  className="w-full max-w-md mx-auto rounded-md"
                  onError={() => setImageUrl('')}
                />
              </div>
            </div>
          )}

          {/* Social Media Platforms */}
          {postContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Platforms to Publish</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLinkedinCredentialsOpen(true)}
                  className="text-xs"
                >
                  <Settings className="mr-1 h-3 w-3" />
                  LinkedIn Settings
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {socialPlatforms.map((platform) => {
                  const isLinkedIn = platform.id === 'linkedin';
                  const linkedInConnected = linkedinStatus?.isConnected;
                  
                  return (
                    <div
                      key={platform.id}
                      className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer ${
                        isLinkedIn && !linkedInConnected ? 'opacity-60' : ''
                      }`}
                      onClick={() => {
                        if (isLinkedIn && !linkedInConnected) {
                          toast({
                            title: "LinkedIn Not Connected",
                            description: "Please connect your LinkedIn account first.",
                            variant: "destructive",
                          });
                          return;
                        }
                        handlePlatformToggle(platform.id);
                      }}
                    >
                      <Checkbox
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => {
                          if (isLinkedIn && !linkedInConnected) {
                            toast({
                              title: "LinkedIn Not Connected",
                              description: "Please connect your LinkedIn account first.",
                              variant: "destructive",
                            });
                            return;
                          }
                          handlePlatformToggle(platform.id);
                        }}
                        disabled={isLinkedIn && !linkedInConnected}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.name}</span>
                        {isLinkedIn && (
                          <div className="ml-auto">
                            {linkedInConnected ? (
                              <Badge variant="outline" className="text-xs text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-red-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Not Connected
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {job.jobPost?.platforms?.includes(platform.id) && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Posted
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* LinkedIn Password Input */}
              {selectedPlatforms.includes('linkedin') && linkedinStatus?.isConnected && linkedinStatus?.tokenValid && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">LinkedIn account connected and ready for posting</span>
                </div>
              )}
              {selectedPlatforms.includes('linkedin') && linkedinStatus?.isConnected && !linkedinStatus?.tokenValid && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">LinkedIn token expired. Please reconnect your account.</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            
            {postContent && selectedPlatforms.length > 0 && (
              <Button
                onClick={publishPost}
                disabled={publishing}
                className="btn-primary"
              >
                {publishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Share className="mr-2 h-4 w-4" />
                    {job.jobPost?.publishedAt ? 'Republish' : 'Publish'} Post
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
      
      {/* LinkedIn OAuth Modal */}
      <LinkedInOAuthModal 
        open={linkedinCredentialsOpen} 
        onOpenChange={(open) => {
          setLinkedinCredentialsOpen(open);
          if (!open) {
            // Refresh LinkedIn status when OAuth modal closes
            fetchLinkedInStatus();
          }
        }} 
      />
    </Dialog>
  );
};

export default JobPostModal;