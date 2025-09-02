import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  User,
  TrendingUp
} from 'lucide-react';

const MultiUserDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderHRDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 published today</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">8</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Scheduled interviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest HR activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New application received', candidate: 'John Smith', job: 'React Developer', time: '2 hours ago' },
                { action: 'Interview scheduled', candidate: 'Sarah Wilson', job: 'Product Manager', time: '4 hours ago' },
                { action: 'Job post published', job: 'UX Designer', platform: 'LinkedIn', time: '1 day ago' },
                { action: 'Candidate shortlisted', candidate: 'Mike Johnson', job: 'Backend Developer', time: '2 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-accent rounded-lg transition-colors">
                  <div className="mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.candidate && `${activity.candidate} • `}
                      {activity.job}
                      {activity.platform && ` on ${activity.platform}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used HR functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="btn-primary h-20 flex-col">
                <Briefcase className="h-6 w-6 mb-2" />
                Post New Job
              </Button>
              <Button variant="outline" className="btn-secondary h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Review Applications
              </Button>
              <Button variant="outline" className="btn-secondary h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="btn-secondary h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInterviewerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">5</div>
            <p className="text-xs text-muted-foreground">Awaiting feedback</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Your scheduled interviews for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { candidate: 'Alex Thompson', job: 'Senior React Developer', time: 'Today, 2:00 PM', status: 'confirmed' },
              { candidate: 'Maria Garcia', job: 'Senior React Developer', time: 'Today, 4:30 PM', status: 'confirmed' },
              { candidate: 'David Kim', job: 'Product Manager', time: 'Tomorrow, 10:00 AM', status: 'pending' },
              { candidate: 'Jennifer Liu', job: 'Senior React Developer', time: 'Tomorrow, 3:00 PM', status: 'confirmed' },
            ].map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{interview.candidate}</p>
                  <p className="text-sm text-muted-foreground">{interview.job}</p>
                  <p className="text-xs text-muted-foreground">{interview.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={interview.status === 'confirmed' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                    {interview.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="btn-secondary">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCandidateDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">2</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-primary">Shortlisted</div>
            <p className="text-xs text-muted-foreground">Current status</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your job applications and interview progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { job: 'Senior React Developer', company: 'TechCorp', status: 'Interview Scheduled', date: 'Today, 2:00 PM', stage: 'final' },
              { job: 'Frontend Developer', company: 'StartupXYZ', status: 'Under Review', date: 'Applied 3 days ago', stage: 'review' },
              { job: 'React Developer', company: 'BigTech Inc', status: 'Shortlisted', date: 'Applied 1 week ago', stage: 'shortlist' },
              { job: 'UI Developer', company: 'DesignStudio', status: 'Application Sent', date: 'Applied 2 weeks ago', stage: 'applied' },
            ].map((application, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{application.job}</p>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                  <p className="text-xs text-muted-foreground">{application.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={
                    application.stage === 'final' ? 'bg-success text-success-foreground' :
                    application.stage === 'shortlist' ? 'bg-primary text-primary-foreground' :
                    application.stage === 'review' ? 'bg-warning text-warning-foreground' :
                    'bg-secondary text-secondary-foreground'
                  }>
                    {application.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="btn-secondary">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold capitalize">{user.role} Dashboard</h2>
        <p className="text-muted-foreground">
          {user.role === 'hr' && 'Manage recruitment processes and track hiring metrics'}
          {user.role === 'interviewer' && 'Review candidates and conduct interviews'}
          {user.role === 'candidate' && 'Track your applications and interview progress'}
        </p>
      </div>

      {user.role === 'hr' && renderHRDashboard()}
      {user.role === 'interviewer' && renderInterviewerDashboard()}
      {user.role === 'candidate' && renderCandidateDashboard()}
    </div>
  );
};

export default MultiUserDashboard;