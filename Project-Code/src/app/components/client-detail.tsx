import { useParams, useNavigate } from 'react-router';
import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent } from './ui/tabs';
import {
  ArrowLeft,
  User,
  Target,
  TrendingUp,
  Calendar,
  Activity,
  Dumbbell,
  MessageSquare,
  Edit,
  FileText,
  BarChart3
} from 'lucide-react';
import { mockTrainerClients } from '../utils/mockData';
import { useState } from 'react';

const clientTabs = [
  { id: 'overview', label: 'Overview', path: '#overview' },
  { id: 'program', label: 'Training Program', path: '#program' },
  { id: 'progress', label: 'Progress History', path: '#progress' },
  { id: 'measurements', label: 'Measurements', path: '#measurements' },
  { id: 'notes', label: 'Notes', path: '#notes' },
];

export function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the client from mock data
  const client = mockTrainerClients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/trainer')}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title={client.name}
      role="Trainer"
      tabs={clientTabs}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/trainer')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Client Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={client.avatar}
              alt={client.name}
              className="size-24 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-medium mb-1">{client.name}</h1>
                  <p className="text-gray-600">{client.program}</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {client.progress}% Complete
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Start Weight</div>
                  <div className="text-lg font-medium">{client.startWeight} lbs</div>
                </div>
                <div>
                  <div className="text-gray-500">Current Weight</div>
                  <div className="text-lg font-medium">{client.currentWeight} lbs</div>
                </div>
                <div>
                  <div className="text-gray-500">Target Weight</div>
                  <div className="text-lg font-medium">{client.targetWeight} lbs</div>
                </div>
                <div>
                  <div className="text-gray-500">Weight Loss</div>
                  <div className="text-lg font-medium text-green-600">
                    {client.startWeight - client.currentWeight} lbs
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">{client.progress}%</span>
                </div>
                <Progress value={client.progress} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Goals</CardTitle>
                <Target className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm">{client.goals}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Next Session</CardTitle>
                <Calendar className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{client.nextSession}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Sessions Completed</CardTitle>
                <Activity className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">24</div>
                <p className="text-xs text-gray-500 mt-1">Out of 36 total</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <MessageSquare className="size-5" />
                  <span className="text-sm">Message Client</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Edit className="size-5" />
                  <span className="text-sm">Update Program</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <BarChart3 className="size-5" />
                  <span className="text-sm">Add Measurement</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <FileText className="size-5" />
                  <span className="text-sm">Add Note</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Weight measurement updated</p>
                    <p className="text-xs text-gray-500">Lost 2 lbs since last week</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Dumbbell className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed workout session</p>
                    <p className="text-xs text-gray-500">Upper body strength training</p>
                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Target className="size-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Milestone achieved</p>
                    <p className="text-xs text-gray-500">Reached 70% of target weight</p>
                    <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Training Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">{client.program}</h3>
                  <p className="text-sm text-gray-600 mb-4">{client.goals}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Duration</div>
                      <div className="font-medium">12 weeks</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Frequency</div>
                      <div className="font-medium">4x per week</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Focus</div>
                      <div className="font-medium">Weight Loss</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Weekly Schedule</h4>
                  <div className="space-y-2">
                    {['Monday - Upper Body', 'Wednesday - Lower Body', 'Friday - Cardio & Core', 'Saturday - Full Body'].map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{day}</span>
                        <Badge variant="outline">60 min</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Edit className="size-4 mr-2" />
                  Modify Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Week 8 Progress Check</div>
                      <div className="text-sm text-gray-500">April 15, 2026</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">On Track</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-gray-500">Weight</div>
                      <div className="font-medium">{client.currentWeight} lbs</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Change</div>
                      <div className="font-medium text-green-600">-2 lbs</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Progress</div>
                      <div className="font-medium">{client.progress}%</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Week 4 Progress Check</div>
                      <div className="text-sm text-gray-500">March 18, 2026</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-gray-500">Weight</div>
                      <div className="font-medium">167 lbs</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Change</div>
                      <div className="font-medium text-green-600">-3 lbs</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Progress</div>
                      <div className="font-medium">55%</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Initial Assessment</div>
                      <div className="text-sm text-gray-500">February 18, 2026</div>
                    </div>
                    <Badge variant="outline">Baseline</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-gray-500">Weight</div>
                      <div className="font-medium">{client.startWeight} lbs</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Target</div>
                      <div className="font-medium">{client.targetWeight} lbs</div>
                    </div>
                    <div>
                      <div className="text-gray-500">To Lose</div>
                      <div className="font-medium">{client.startWeight - client.targetWeight} lbs</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Body Measurements</CardTitle>
              <Button>
                <BarChart3 className="size-4 mr-2" />
                Add Measurement
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Weight</div>
                    <div className="text-xl font-medium">{client.currentWeight} lbs</div>
                    <div className="text-xs text-green-600 mt-1">-{client.startWeight - client.currentWeight} lbs</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Body Fat %</div>
                    <div className="text-xl font-medium">22%</div>
                    <div className="text-xs text-green-600 mt-1">-3%</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Waist</div>
                    <div className="text-xl font-medium">32 in</div>
                    <div className="text-xs text-green-600 mt-1">-2 in</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Chest</div>
                    <div className="text-xl font-medium">38 in</div>
                    <div className="text-xs text-gray-600 mt-1">+1 in</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trainer Notes</CardTitle>
              <Button>
                <FileText className="size-4 mr-2" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium">Session Notes - April 23, 2026</div>
                    <div className="text-xs text-gray-500">4 days ago</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Excellent progress on strength exercises. Client showed improvement in squat form.
                    Recommended increasing weight by 10lbs next session. Energy levels high throughout workout.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium">Nutrition Discussion - April 15, 2026</div>
                    <div className="text-xs text-gray-500">12 days ago</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Discussed meal planning strategies. Client committed to tracking macros more consistently.
                    Suggested increasing protein intake to support muscle recovery.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium">Goal Setting Session - March 1, 2026</div>
                    <div className="text-xs text-gray-500">2 months ago</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Set initial goals and expectations. Client motivated and committed to the program.
                    Target weight loss of 15 lbs over 12 weeks. Focus on building sustainable habits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
