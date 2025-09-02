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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground">Scheduled interviews</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">8</div>
            <p className="text-xs text-muted-foreground">Need feedback</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">6</div>
            <p className="text-xs text-muted-foreground">Selected candidates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Resume Analytics</CardTitle>
            <CardDescription>Recent applications and scoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { candidate: 'Alex Thompson', job: 'Senior React Developer', score: 92, status: 'shortlisted', source: 'LinkedIn' },
                { candidate: 'Maria Garcia', job: 'Senior React Developer', score: 78, status: 'reviewed', source: 'Email' },
                { candidate: 'David Kim', job: 'Product Manager', score: 85, status: 'pending', source: 'Website' },
                { candidate: 'Jennifer Liu', job: 'Senior React Developer', score: 89, status: 'shortlisted', source: 'LinkedIn' },
              ].map((resume, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{resume.candidate}</p>
                      <Badge className="text-xs">{resume.source}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{resume.job}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium">Score: {resume.score}%</span>
                      <Badge className={
                        resume.status === 'shortlisted' ? 'bg-success text-success-foreground' :
                        resume.status === 'reviewed' ? 'bg-primary text-primary-foreground' :
                        'bg-warning text-warning-foreground'
                      }>
                        {resume.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="btn-secondary">
                      View Resume
                    </Button>
                    <Button size="sm" className="btn-primary">
                      {resume.status === 'pending' ? 'Review' : 'Interview'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Candidate Actions</CardTitle>
            <CardDescription>Select or reject candidates and manage interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { candidate: 'Sarah Wilson', job: 'UX Designer', time: 'Today, 2:00 PM', action: 'interview' },
                { candidate: 'Michael Brown', job: 'Backend Developer', time: 'Tomorrow, 10:00 AM', action: 'interview' },
                { candidate: 'Lisa Chen', job: 'Product Manager', time: 'Pending Decision', action: 'review' },
                { candidate: 'Robert Taylor', job: 'Frontend Developer', time: 'Pending Decision', action: 'review' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{item.candidate}</p>
                    <p className="text-sm text-muted-foreground">{item.job}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    {item.action === 'review' ? (
                      <>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          Reject
                        </Button>
                        <Button size="sm" className="btn-primary">
                          Select
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="btn-primary">
                        Start Interview
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold capitalize">{user.role} Dashboard</h2>
        <p className="text-muted-foreground">
          {user.role === 'hr' && 'Manage recruitment processes and track hiring metrics'}
          {user.role === 'interviewer' && 'Review candidates, conduct interviews, and manage resume analytics'}
        </p>
      </div>

      {user.role === 'hr' && renderHRDashboard()}
      {user.role === 'interviewer' && renderInterviewerDashboard()}
    </div>
  );
};

export default MultiUserDashboard;