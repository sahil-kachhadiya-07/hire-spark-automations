import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateJobAsync } from '@/store/slices/jobSlice';
import { AppDispatch } from '@/store';
import { getInterviewers } from '@/services/api.service';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Job } from '@/store/slices/jobSlice';

interface EditJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

interface Interviewer {
  id: string;
  username: string;
  email: string;
}

const EditJobModal = ({ open, onOpenChange, job }: EditJobModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [interviewersLoading, setInterviewersLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interviewer: '',
    status: 'draft'
  });

  // Update form data when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        interviewer: job.interviewer,
        status: job.status
      });
    }
  }, [job]);

  // Fetch interviewers when modal opens
  useEffect(() => {
    if (open) {
      fetchInterviewers();
    }
  }, [open]);

  const fetchInterviewers = async () => {
    setInterviewersLoading(true);
    try {
      const response = await getInterviewers();
      if (response.success) {
        setInterviewers(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load interviewers",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error fetching interviewers:', error);
      toast({
        title: "Error",
        description: "Failed to load interviewers",
        variant: "destructive",
      });
    } finally {
      setInterviewersLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) {
      toast({
        title: "Error",
        description: "No job selected for editing.",
        variant: "destructive",
      });
      return;
    }

    if (interviewersLoading) {
      toast({
        title: "Please wait",
        description: "Interviewers are still loading. Please wait and try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title || !formData.description || !formData.interviewer) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await dispatch(updateJobAsync({
        id: job.id,
        data: {
          title: formData.title,
          description: formData.description,
          interviewer: formData.interviewer,
        }
      })).unwrap();

      toast({
        title: "Job updated successfully",
        description: "Your job posting has been updated.",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'closed', label: 'Closed' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Update the job posting details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior React Developer"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={loading || interviewersLoading}
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading || interviewersLoading}
              rows={4}
            />
          </div>

          {/* Interviewer Assignment */}
          <div className="space-y-2">
            <Label htmlFor="interviewer">Assign Interviewer *</Label>
            <Select
              value={formData.interviewer}
              onValueChange={(value) => handleChange('interviewer', value)}
              disabled={loading || interviewersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  interviewersLoading 
                    ? "Loading interviewers..." 
                    : interviewers.length === 0 
                      ? "No interviewers available" 
                      : "Select an interviewer"
                } />
              </SelectTrigger>
              <SelectContent>
                {interviewersLoading ? (
                  <SelectItem value="_loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading interviewers...
                    </div>
                  </SelectItem>
                ) : interviewers.length === 0 ? (
                  <SelectItem value="_empty" disabled>
                    No interviewers available
                  </SelectItem>
                ) : (
                  interviewers.map((interviewer) => (
                    <SelectItem key={interviewer.id} value={interviewer.username}>
                      <div className="flex flex-col">
                        <span>{interviewer.username}</span>
                        <span className="text-xs text-muted-foreground">{interviewer.email}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
              disabled={loading || interviewersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading || interviewersLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={loading || interviewersLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobModal;
