import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { generateJobPost, publishJobPost } from '@/store/slices/jobSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Share, Edit, CheckCircle } from 'lucide-react';

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
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const job = jobId ? jobs.find(j => j.id === jobId) : null;

  useEffect(() => {
    if (job?.jobPost) {
      setPostContent(job.jobPost.content);
      setSelectedPlatforms(job.jobPost.platforms || []);
      setIsEditing(false);
    } else {
      setPostContent('');
      setSelectedPlatforms([]);
      setIsEditing(false);
    }
  }, [job]);

  const generatePost = async () => {
    if (!job) return;
    
    setGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = `🚀 We're hiring a ${job.title}!

Join our innovative team and help us build the future of technology. We're looking for a talented professional to:

• Work on cutting-edge projects
• Collaborate with a dynamic team
• Grow your career in a supportive environment

Requirements:
${job.description}

Ready to take the next step in your career? Apply now!

#Hiring #${job.title.replace(/\s+/g, '')} #TechJobs #CareerOpportunity`;

      setPostContent(generatedContent);
      setIsEditing(true);
      
      dispatch(generateJobPost({
        jobId: job.id,
        content: generatedContent
      }));

      toast({
        title: "Job post generated",
        description: "AI has generated your job post. You can edit it before publishing.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate job post. Please try again.",
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

    setPublishing(true);
    
    try {
      // Simulate publishing to social platforms
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch(publishJobPost({
        jobId: job.id,
        platforms: selectedPlatforms
      }));

      toast({
        title: "Post published successfully",
        description: `Job post has been published to ${selectedPlatforms.length} platform(s).`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Publishing failed",
        description: "Failed to publish job post. Please try again.",
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

          {/* Social Media Platforms */}
          {postContent && (
            <div className="space-y-3">
              <Label>Select Platforms to Publish</Label>
              <div className="grid grid-cols-2 gap-3">
                {socialPlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{platform.icon}</span>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    {job.jobPost?.platforms?.includes(platform.id) && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Posted
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
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
    </Dialog>
  );
};

export default JobPostModal;