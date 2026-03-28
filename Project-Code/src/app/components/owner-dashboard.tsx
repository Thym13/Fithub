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
  Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockRevenueData, mockMembers, mockStaff, mockMembershipPlans } from '../utils/mockData';
import { useEffect, useState } from 'react';

const ownerTabs = [
  { id: 'analytics', label: 'Analytics', path: '#analytics' },
  { id: 'pricing', label: 'Pricing & Plans', path: '#pricing' },
  { id: 'staff', label: 'Staff Management', path: '#staff' },
  { id: 'tasks', label: 'Task Assignment', path: '#tasks' },
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
    console.log('Task created and notification sent to:', employee?.name);

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
    console.log('Task reassigned to:', employee?.name);
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
                  <div key={plan.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl mb-1">{plan.name}</h3>
                        <div className="text-3xl text-blue-600 mb-2">${plan.price}<span className="text-sm text-gray-500">/{plan.duration.toLowerCase()}</span></div>
                      </div>
                      <Badge variant="secondary">{plan.activeMembers} active members</Badge>
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
                onClick={() => console.log('Refreshing tasks...')}
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