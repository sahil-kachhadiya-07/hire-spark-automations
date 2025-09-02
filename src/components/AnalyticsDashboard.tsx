import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  FileText, 
  Clock,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Resume } from '@/store/slices/analyticsSlice';

const AnalyticsDashboard = () => {
  const { data, loading } = useSelector((state: RootState) => state.analytics);

  const getSourceIcon = (source: Resume['source']) => {
    switch (source) {
      case 'linkedin': return '💼';
      case 'email': return '📧';
      case 'website': return '🌐';
      default: return '📄';
    }
  };

  const getStatusColor = (status: Resume['status']) => {
    switch (status) {
      case 'shortlisted': return 'bg-success text-success-foreground';
      case 'reviewed': return 'bg-primary text-primary-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: Resume['status']) => {
    switch (status) {
      case 'shortlisted': return <CheckCircle className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {data.activeJobPosts} active posts
            </p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Total received
            </p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{data.shortlistedCandidates}</div>
            <p className="text-xs text-muted-foreground">
              Ready for interview
            </p>
          </CardContent>
        </Card>

        <Card className="card-dashboard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((data.shortlistedCandidates / data.totalApplications) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Application to shortlist
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Performance */}
      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle>Social Media Performance</CardTitle>
          <CardDescription>
            Job post performance across different platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.socialMetrics.map((metric) => (
              <div key={metric.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{metric.platform}</div>
                    <Badge variant="outline">{metric.applications} applications</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {((metric.clicks / metric.impressions) * 100).toFixed(1)}% CTR
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{metric.impressions.toLocaleString()} impressions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                    <span>{metric.clicks} clicks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{metric.applications} applications</span>
                  </div>
                </div>

                <Progress 
                  value={((metric.clicks / metric.impressions) * 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Resumes */}
      <Card className="card-dashboard">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Latest resumes received from various channels
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="btn-secondary">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentResumes.map((resume) => (
              <div 
                key={resume.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {resume.candidateName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{resume.candidateName}</p>
                      <span className="text-lg">{getSourceIcon(resume.source)}</span>
                      <Badge className={getStatusColor(resume.status)}>
                        {getStatusIcon(resume.status)}
                        <span className="ml-1 capitalize">{resume.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{resume.email}</span>
                      <span>•</span>
                      <span>{resume.jobTitle}</span>
                      <span>•</span>
                      <span>{format(new Date(resume.receivedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {resume.score && (
                    <div className="text-right">
                      <div className="text-sm font-medium">Score: {resume.score}/100</div>
                      <Progress value={resume.score} className="w-16 h-2" />
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm" className="btn-secondary">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {data.recentResumes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground space-y-2">
                <FileText className="h-8 w-8 mx-auto" />
                <p>No applications received yet</p>
                <p className="text-sm">Applications will appear here when candidates apply to your jobs</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;