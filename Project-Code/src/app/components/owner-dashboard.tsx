import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PromotionAnalytics } from './promotion-analytics';
import {
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  UserPlus,
  Settings,
  BarChart3,
  Target,
  Plus,
  CheckCircle,
  X,
  AlertCircle,
  ClipboardList,
  RefreshCw,
  Clock,
  FileText,
  Send,
  Edit,
  Eye,
  Download
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockRevenueData, mockMembers, mockStaff, mockMembershipPlans } from '../utils/mockData';
import { useEffect, useState } from 'react';

const ownerTabs = [
  { id: 'analytics', label: 'Analytics', path: '#analytics' },
  { id: 'pricing', label: 'Pricing & Plans', path: '#pricing' },
  { id: 'staff', label: 'Staff Management', path: '#staff' },
  { id: 'tasks', label: 'Task Assignment', path: '#tasks' },
  { id: 'applications', label: 'Trainer Applications', path: '#applications' },
  { id: 'contracts', label: 'Contract Creation', path: '#contracts' },
  { id: 'promotions', label: 'Promotions & Campaigns', path: '#promotions' },
  { id: 'reports', label: 'Reports', path: '#reports' },
];

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const totalRevenue = mockRevenueData[mockRevenueData.length - 1].revenue;
  const totalMembers = mockMembers.length;
  const activeStaff = mockStaff.filter(s => s.status === 'Active').length;
  const monthlyGrowth = 12.5;

  // Task Assignment States (same as Manager)
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    type: '',
    assignedTo: '',
    deadline: '',
    frequency: ''
  });

  // Contract Creation States
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [contractData, setContractData] = useState({
    trainerEmail: '',
    trainerName: '',
    position: 'Personal Trainer',
    salary: '',
    workingHours: '',
    workDays: '',
    services: [] as string[],
    startDate: '',
  });

  const [contracts, setContracts] = useState([
    {
      id: '1',
      trainerName: 'Maria Papadopoulos',
      trainerEmail: 'maria.p@example.com',
      position: 'Personal Trainer',
      salary: '2500',
      workingHours: '40',
      workDays: 'Mon-Fri',
      services: ['Personal Training', 'Group Classes', 'Nutrition Consultation'],
      startDate: '2026-04-01',
      status: 'Pending',
      createdAt: '2026-03-15'
    }
  ]);

  // Trainer Applications States
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const [trainerApplications, setTrainerApplications] = useState([
    {
      id: '1',
      name: 'Maria Papadopoulos',
      email: 'maria.p@example.com',
      phone: '+30 698 123 4567',
      dateOfBirth: '1995-06-15',
      specialty: 'Yoga, Pilates, Personal Training',
      appliedDate: '2026-04-10',
      resumeUrl: '#',
      certificationsUrl: '#',
      status: 'Pending'
    },
    {
      id: '2',
      name: 'Nikos Dimitriou',
      email: 'nikos.d@example.com',
      phone: '+30 697 987 6543',
      dateOfBirth: '1992-03-22',
      specialty: 'HIIT, Strength Training, Boxing',
      appliedDate: '2026-04-12',
      resumeUrl: '#',
      certificationsUrl: '#',
      status: 'Pending'
    },
    {
      id: '3',
      name: 'Elena Georgiou',
      email: 'elena.g@example.com',
      phone: '+30 699 456 7890',
      dateOfBirth: '1998-11-08',
      specialty: 'Nutrition Consultation, Weight Loss Programs',
      appliedDate: '2026-04-08',
      resumeUrl: '#',
      certificationsUrl: '#',
      status: 'Under Review'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Greet Members at Entrance',
      description: 'Welcome members as they arrive and assist with check-ins',
      type: 'Member Service',
      assignedTo: 'John Smith',
      assignedToId: '3',
      deadline: '2026-03-20',
      frequency: 'Daily',
      status: 'Completed',
      completedAt: '2026-03-20 08:30 AM'
    },
    {
      id: '2',
      title: 'Equipment Maintenance Check',
      description: 'Inspect all cardio and strength equipment for safety and functionality',
      type: 'Maintenance',
      assignedTo: 'Lisa Anderson',
      assignedToId: '4',
      deadline: '2026-03-22',
      frequency: 'Weekly',
      status: 'In Progress',
      completedAt: null
    },
    {
      id: '3',
      title: 'Clean Locker Rooms',
      description: 'Deep clean and sanitize all locker room facilities',
      type: 'Cleaning',
      assignedTo: 'John Smith',
      assignedToId: '3',
      deadline: '2026-03-20',
      frequency: 'Daily',
      status: 'Pending',
      completedAt: null
    },
    {
      id: '4',
      title: 'Update Class Schedule Board',
      description: 'Update the weekly class schedule on the main board',
      type: 'Administrative',
      assignedTo: 'Sarah Johnson',
      assignedToId: '1',
      deadline: '2026-03-21',
      frequency: 'Weekly',
      status: 'Pending',
      completedAt: null
    }
  ]);

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'analytics';
    setActiveTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'analytics';
      setActiveTab(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCreateTask = () => {
    const employee = mockStaff.find(s => s.id === taskData.assignedTo);
    const newTask = {
      id: String(tasks.length + 1),
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      assignedTo: employee?.name || '',
      assignedToId: taskData.assignedTo,
      deadline: taskData.deadline,
      frequency: taskData.frequency,
      status: 'Pending',
      completedAt: null
    };

    setTasks([...tasks, newTask]);
    setShowCreateTask(false);
    setSuccessMessage(`Task "${taskData.title}" has been assigned to ${employee?.name}. They will receive a notification about this assignment.`);
    setShowSuccessModal(true);

    setTaskData({
      title: '',
      description: '',
      type: '',
      assignedTo: '',
      deadline: '',
      frequency: ''
    });
  };

  const handleReassignTask = (newEmployeeId: string) => {
    const employee = mockStaff.find(s => s.id === newEmployeeId);
    setTasks(tasks.map(t => 
      t.id === selectedTask.id 
        ? { ...t, assignedTo: employee?.name || '', assignedToId: newEmployeeId }
        : t
    ));
    setShowReassignModal(false);
    setSuccessMessage(`Task "${selectedTask.title}" has been reassigned to ${employee?.name}. They will receive a notification.`);
    setShowSuccessModal(true);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: 'Completed', completedAt: new Date().toLocaleString() }
        : t
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length
  };

  return (
    <DashboardLayout title="Business Overview" role="Gym Owner" tabs={ownerTabs}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="analytics" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
                <DollarSign className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" />
                  +{monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Active Members</CardTitle>
                <Users className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalMembers}</div>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <UserPlus className="size-3" />
                  +17 new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Staff Members</CardTitle>
                <Users className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{activeStaff}</div>
                <p className="text-xs text-gray-500 mt-1">All positions filled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Avg Revenue/Member</CardTitle>
                <Target className="size-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${(totalRevenue / totalMembers).toFixed(0)}</div>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" />
                  +8.3% growth
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Member Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="members" stroke="#10b981" strokeWidth={2} name="Members" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Member Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockMembershipPlans.map((plan) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{plan.name}</span>
                      <Badge variant="secondary">{plan.activeMembers} members</Badge>
                    </div>
                    <div className="text-2xl text-blue-600 mb-2">${plan.price}</div>
                    <div className="text-xs text-gray-500">
                      Revenue: ${(plan.price * plan.activeMembers).toLocaleString()}/month
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Membership Plans</CardTitle>
              <Button>
                <Settings className="size-4 mr-2" />
                Edit Pricing
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMembershipPlans.map((plan) => (
                  <div key={plan.id} className="p-4 sm:p-6 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl mb-1">{plan.name}</h3>
                        <div className="text-3xl text-blue-600 mb-2">${plan.price}<span className="text-sm text-gray-500">/{plan.duration.toLowerCase()}</span></div>
                      </div>
                      <Badge variant="secondary" className="self-start whitespace-nowrap">{plan.activeMembers} active members</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Features:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-sm">Monthly Revenue: <span className="text-lg">${(plan.price * plan.activeMembers).toLocaleString()}</span></span>
                      <Button variant="outline" size="sm">Modify Plan</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Staff Members</CardTitle>
              <Button>
                <UserPlus className="size-4 mr-2" />
                Add Staff
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={staff.avatar} alt={staff.name} className="size-8 rounded-full" />
                          <span>{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.role}</Badge>
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.hireDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Mobile-Optimized Task Assignment Section */}
          <div className="space-y-4">
            {/* Header with Add Task Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Task Assignment</h2>
              <Button 
                onClick={() => setShowCreateTask(true)}
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
              >
                <Plus className="size-4 mr-1" />
                Add Task
              </Button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-2">
                <ClipboardList className="size-4 text-gray-500" />
                <span className="text-sm text-gray-600">Total Tasks: {taskStats.total}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600"
              >
                <RefreshCw className="size-4 mr-1" />
                Refresh
              </Button>
            </div>

            {/* Status Cards - Mobile Optimized */}
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-500" />
                  <span className="text-gray-700">Completed: {taskStats.completed}</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-blue-500" />
                  <span className="text-gray-700">In Progress: {taskStats.inProgress}</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-5 text-yellow-500" />
                  <span className="text-gray-700">Pending: {taskStats.pending}</span>
                </div>
              </div>
            </div>

            {/* Task Cards - iPhone Style */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-4">
                    {/* Task Header with Emoji */}
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{task.type === 'Member Service' ? '👋' : task.type === 'Maintenance' ? '🔧' : task.type === 'Cleaning' ? '🧹' : '📋'}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-base mb-1">{task.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowReassignModal(true);
                        }}
                      >
                        <RefreshCw className="size-4 mr-1" />
                        Reassign
                      </Button>
                      {task.status !== 'Completed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <CheckCircle className="size-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm pt-3 border-t">
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Description</div>
                        <div className="text-gray-900 line-clamp-2">{task.description}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Assigned To</div>
                        <div className="text-gray-900">{task.assignedTo}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Deadline</div>
                        <div className="text-gray-900">{task.deadline}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Frequency</div>
                        <div className="text-gray-900">{task.frequency}</div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {task.completedAt && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        ✓ Completed: {task.completedAt}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="size-5" />
                  Trainer Applications
                </CardTitle>
                <Badge variant="secondary">{trainerApplications.filter(app => app.status === 'Pending').length} Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainerApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="font-medium">{application.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{application.email}</div>
                          <div className="text-gray-500">{application.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs">{application.specialty}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{new Date(application.appliedDate).toLocaleDateString('en-GB')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.status === 'Pending' ? 'secondary' :
                            application.status === 'Under Review' ? 'default' :
                            'secondary'
                          }
                          className={
                            application.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : ''
                          }
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowApplicationModal(true);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Application Details Modal */}
          {showApplicationModal && selectedApplication && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl">Trainer Application Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowApplicationModal(false);
                        setSelectedApplication(null);
                      }}
                      className="flex-shrink-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Full Name</Label>
                          <p className="font-medium break-words">{selectedApplication.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Email</Label>
                          <p className="font-medium break-all text-sm">{selectedApplication.email}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Phone</Label>
                          <p className="font-medium">{selectedApplication.phone}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Date of Birth</Label>
                          <p className="font-medium">{new Date(selectedApplication.dateOfBirth).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Professional Information</h3>
                      <div>
                        <Label className="text-gray-500">Specialty</Label>
                        <p className="font-medium">{selectedApplication.specialty}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Application Date</Label>
                        <p className="font-medium">{new Date(selectedApplication.appliedDate).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Submitted Documents</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-blue-100 rounded flex-shrink-0">
                              <FileText className="size-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Resume / CV</div>
                              <div className="text-sm text-gray-500 truncate">{selectedApplication.name}_Resume.pdf</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto flex-shrink-0">
                            <Download className="size-4 sm:mr-2" />
                            <span className="sm:inline">Download</span>
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-green-100 rounded flex-shrink-0">
                              <FileText className="size-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Certifications</div>
                              <div className="text-sm text-gray-500 truncate">{selectedApplication.name}_Certifications.pdf</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto flex-shrink-0">
                            <Download className="size-4 sm:mr-2" />
                            <span className="sm:inline">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Application Review</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Current Status</Label>
                          <Badge className="ml-2">{selectedApplication.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          <Label>Change Status</Label>
                          <Select
                            defaultValue={selectedApplication.status}
                            onValueChange={(value) => {
                              const updatedApplications = trainerApplications.map(app =>
                                app.id === selectedApplication.id ? { ...app, status: value } : app
                              );
                              setTrainerApplications(updatedApplications);
                              setSelectedApplication({ ...selectedApplication, status: value });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Under Review">Under Review</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowApplicationModal(false);
                          setSelectedApplication(null);
                        }}
                        className="flex-1 w-full"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          setShowApplicationModal(false);
                          setSelectedApplication(null);
                        }}
                        className="flex-1 w-full"
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          {/* Contract Creation Form */}
          {!showContractPreview ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Create Trainer Contract
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Trainer Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Trainer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trainerEmail">Trainer Email *</Label>
                        <Input
                          id="trainerEmail"
                          type="email"
                          placeholder="trainer@example.com"
                          value={contractData.trainerEmail}
                          onChange={(e) => setContractData({ ...contractData, trainerEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trainerName">Trainer Name *</Label>
                        <Input
                          id="trainerName"
                          placeholder="Full Name"
                          value={contractData.trainerName}
                          onChange={(e) => setContractData({ ...contractData, trainerName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select
                          value={contractData.position}
                          onValueChange={(value) => setContractData({ ...contractData, position: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Personal Trainer">Personal Trainer</SelectItem>
                            <SelectItem value="Group Fitness Instructor">Group Fitness Instructor</SelectItem>
                            <SelectItem value="Yoga Instructor">Yoga Instructor</SelectItem>
                            <SelectItem value="Pilates Instructor">Pilates Instructor</SelectItem>
                            <SelectItem value="Nutritionist">Nutritionist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary">Monthly Salary (€) *</Label>
                        <Input
                          id="salary"
                          type="number"
                          placeholder="2500"
                          value={contractData.salary}
                          onChange={(e) => setContractData({ ...contractData, salary: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">Working Hours/Week *</Label>
                        <Input
                          id="workingHours"
                          type="number"
                          placeholder="40"
                          value={contractData.workingHours}
                          onChange={(e) => setContractData({ ...contractData, workingHours: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workDays">Work Days *</Label>
                        <Input
                          id="workDays"
                          placeholder="Mon-Fri"
                          value={contractData.workDays}
                          onChange={(e) => setContractData({ ...contractData, workDays: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={contractData.startDate}
                          onChange={(e) => setContractData({ ...contractData, startDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Services to Provide *</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Personal Training',
                        'Group Classes',
                        'Nutrition Consultation',
                        'Fitness Assessment',
                        'Program Design',
                        'Online Coaching'
                      ].map((service) => (
                        <div
                          key={service}
                          onClick={() => {
                            const updatedServices = contractData.services.includes(service)
                              ? contractData.services.filter(s => s !== service)
                              : [...contractData.services, service];
                            setContractData({ ...contractData, services: updatedServices });
                          }}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                            contractData.services.includes(service)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={contractData.services.includes(service)}
                              onChange={() => {}}
                              className="size-4"
                            />
                            <span>{service}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowContractPreview(true)}
                      className="flex-1"
                      disabled={
                        !contractData.trainerEmail ||
                        !contractData.trainerName ||
                        !contractData.salary ||
                        !contractData.workingHours ||
                        !contractData.workDays ||
                        !contractData.startDate ||
                        contractData.services.length === 0
                      }
                    >
                      <Eye className="size-4 mr-2" />
                      Preview Contract
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Contract Preview */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl">Contract Preview</CardTitle>
                  <Button variant="outline" onClick={() => setShowContractPreview(false)} className="flex-shrink-0">
                    <Edit className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Contract Document Preview */}
                  <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
                    <div className="text-center border-b pb-4">
                      <h2 className="text-2xl">EMPLOYMENT CONTRACT</h2>
                      <p className="text-sm text-gray-600 mt-2">FitHub Gym & Fitness Center</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">PARTIES</h3>
                        <p className="text-sm text-gray-700">
                          This Employment Contract is entered into between <strong>FitHub Gym & Fitness Center</strong> (hereinafter "Employer")
                          and <strong>{contractData.trainerName}</strong> (hereinafter "Employee"), email: {contractData.trainerEmail}.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">POSITION AND DUTIES</h3>
                        <p className="text-sm text-gray-700 mb-2">
                          The Employee is hired as <strong>{contractData.position}</strong> and shall provide the following services:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {contractData.services.map((service, index) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">COMPENSATION</h3>
                          <p className="text-sm text-gray-700">Monthly Salary: <strong>€{contractData.salary}</strong></p>
                          <p className="text-sm text-gray-500 mt-1">Payment made monthly on the last business day</p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">WORKING HOURS</h3>
                          <p className="text-sm text-gray-700">Hours per Week: <strong>{contractData.workingHours} hours</strong></p>
                          <p className="text-sm text-gray-700">Work Days: <strong>{contractData.workDays} days per week</strong></p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">EMPLOYMENT PERIOD</h3>
                        <p className="text-sm text-gray-700">
                          Start Date: <strong>{new Date(contractData.startDate).toLocaleDateString('en-GB')}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">This is a permanent employment contract subject to a 3-month probationary period.</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">BENEFITS</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          <li>Free gym membership</li>
                          <li>Health insurance coverage</li>
                          <li>20 days paid annual leave</li>
                          <li>Professional development opportunities</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-t pt-4 text-xs text-gray-500">
                      <p>This contract is governed by the laws of Greece and European Union employment regulations.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowContractPreview(false)}
                      className="flex-1 w-full"
                    >
                      <X className="size-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        const newContract = {
                          id: String(contracts.length + 1),
                          ...contractData,
                          status: 'Pending',
                          createdAt: new Date().toISOString().split('T')[0]
                        };
                        setContracts([...contracts, newContract]);
                        setShowContractPreview(false);
                        setContractStartDate(undefined);
                        setContractData({
                          trainerEmail: '',
                          trainerName: '',
                          position: 'Personal Trainer',
                          salary: '',
                          workingHours: '',
                          workDays: '',
                          services: [],
                          startDate: '',
                        });
                        setSuccessMessage('Contract created and sent to trainer for review!');
                        setShowSuccessModal(true);
                      }}
                      className="flex-1 w-full"
                    >
                      <Send className="size-4 mr-2" />
                      Send Contract to Trainer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Contracts List */}
          <Card>
            <CardHeader>
              <CardTitle>Pending & Active Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contract.trainerName}</div>
                          <div className="text-sm text-gray-500">{contract.trainerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{contract.position}</TableCell>
                      <TableCell>€{contract.salary}/mo</TableCell>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>
                        <Badge variant={contract.status === 'Pending' ? 'secondary' : 'default'}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <PromotionAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="size-4 mr-2" />
                  Monthly Revenue Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="size-4 mr-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="size-4 mr-2" />
                  Profit & Loss Statement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="size-4 mr-2" />
                  Member Growth Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="size-4 mr-2" />
                  Retention Rate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="size-4 mr-2" />
                  Engagement Metrics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Task</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateTask(false)}>
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input id="taskTitle" value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Textarea id="taskDescription" value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskType">Type</Label>
                <Select value={taskData.type} onValueChange={(value) => setTaskData({ ...taskData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member Service">Member Service</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskAssignedTo">Assigned To</Label>
                <Select value={taskData.assignedTo} onValueChange={(value) => setTaskData({ ...taskData, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDeadline">Deadline</Label>
                <Input id="taskDeadline" type="date" value={taskData.deadline} onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskFrequency">Frequency</Label>
                <Select value={taskData.frequency} onValueChange={(value) => setTaskData({ ...taskData, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle></CardTitle>
              <Button variant="primary" size="sm" onClick={handleCreateTask}>
                Create Task
              </Button>
            </CardHeader>
          </div>
        </div>
      )}

      {/* Reassign Task Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reassign Task</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowReassignModal(false)}>
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input id="taskTitle" value={selectedTask.title} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Textarea id="taskDescription" value={selectedTask.description} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskType">Type</Label>
                <Select value={selectedTask.type} onValueChange={(value) => setTaskData({ ...taskData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member Service">Member Service</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskAssignedTo">Assigned To</Label>
                <Select value={taskData.assignedTo} onValueChange={(value) => setTaskData({ ...taskData, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDeadline">Deadline</Label>
                <Input id="taskDeadline" type="date" value={taskData.deadline} onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskFrequency">Frequency</Label>
                <Select value={taskData.frequency} onValueChange={(value) => setTaskData({ ...taskData, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle></CardTitle>
              <Button variant="primary" size="sm" onClick={() => handleReassignTask(taskData.assignedTo)}>
                Reassign Task
              </Button>
            </CardHeader>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Task Assignment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSuccessModal(false)}>
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="size-10 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{successMessage}</p>
              </div>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle></CardTitle>
              <Button variant="primary" size="sm" onClick={() => setShowSuccessModal(false)}>
                Close
              </Button>
            </CardHeader>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}