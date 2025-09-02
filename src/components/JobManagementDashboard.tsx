import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { deleteJob, setSelectedJob } from '@/store/slices/jobSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Calendar, User, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import JobCreationModal from './JobCreationModal';
import JobPostModal from './JobPostModal';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const JobManagementDashboard = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state: RootState) => state.jobs);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteJob = (jobId: string) => {
    dispatch(deleteJob(jobId));
    toast({
      title: "Job deleted",
      description: "The job has been successfully deleted.",
    });
  };

  const handleViewJobPost = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      dispatch(setSelectedJob(job));
      setSelectedJobId(jobId);
      setIsPostModalOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'closed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Job Management</h2>
          <p className="text-muted-foreground">Create, manage, and track your job postings</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {jobs.filter(job => job.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {jobs.filter(job => job.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.reduce((sum, job) => sum + job.applications, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="card-dashboard hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Job Details */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    {job.interviewer}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>

                {/* Applications Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {job.applications} applications received
                  </span>
                  {job.jobPost && (
                    <Badge variant="outline" className="text-xs">
                      Post Generated
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  {job.jobPost ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewJobPost(job.id)}
                      className="btn-secondary"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Post
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewJobPost(job.id)}
                      className="btn-secondary"
                    >
                      Generate Post
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="btn-secondary">
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{job.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <Card className="card-dashboard">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="text-4xl text-muted-foreground">📋</div>
              <h3 className="text-lg font-semibold">No jobs created yet</h3>
              <p className="text-muted-foreground">Get started by creating your first job posting.</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Job
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <JobCreationModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      
      <JobPostModal
        open={isPostModalOpen}
        onOpenChange={setIsPostModalOpen}
        jobId={selectedJobId}
      />
    </div>
  );
};

export default JobManagementDashboard;