import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { PromotionAnalytics } from './promotion-analytics';
import { 
  Users, 
  Calendar, 
  Settings, 
  Clock,
  Search,
  Edit,
  Eye,
  Plus,
  CheckCircle,
  X,
  AlertCircle,
  ClipboardList,
  RefreshCw
} from 'lucide-react';
import { mockMembers, mockStaff, mockClasses } from '../utils/mockData';
import { useEffect, useState } from 'react';

const managerTabs = [
  { id: 'members', label: 'Member Profiles', path: '#members' },
  { id: 'schedules', label: 'Employee Schedules', path: '#schedules' },
  { id: 'classes', label: 'Class Management', path: '#classes' },
  { id: 'tasks', label: 'Task Assignment', path: '#tasks' },
  { id: 'promotions', label: 'Promotions & Campaigns', path: '#promotions' },
  { id: 'settings', label: 'System Settings', path: '#settings' },
];

export function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('members');

  // Task Assignment States
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
    const hash = window.location.hash.slice(1) || 'members';
    setActiveTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'members';
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

    // Reset form
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
    <DashboardLayout title="Operations Management" role="Manager" tabs={managerTabs}>
      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Task</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateTask(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Task Title *</Label>
                <Input 
                  placeholder="e.g., Greet Members at Entrance"
                  className="mt-2"
                  value={taskData.title} 
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea 
                  placeholder="Describe the task in detail..."
                  className="mt-2"
                  value={taskData.description} 
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Task Type *</Label>
                  <Select value={taskData.type} onValueChange={(val) => setTaskData({ ...taskData, type: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member Service">Member Service</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Frequency *</Label>
                  <Select value={taskData.frequency} onValueChange={(val) => setTaskData({ ...taskData, frequency: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select frequency..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assign To Employee *</Label>
                  <Select value={taskData.assignedTo} onValueChange={(val) => setTaskData({ ...taskData, assignedTo: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} - {staff.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Deadline *</Label>
                  <Input 
                    type="date"
                    className="mt-2"
                    value={taskData.deadline} 
                    onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The employee will receive a notification about this task assignment.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTask}
                  disabled={!taskData.title || !taskData.description || !taskData.type || !taskData.assignedTo || !taskData.deadline || !taskData.frequency}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Assign Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reassign Task Modal */}
      {showReassignModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reassign Task</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowReassignModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm text-gray-600">Current Task</Label>
                <div className="font-medium mt-1">{selectedTask.title}</div>
                <div className="text-sm text-gray-600 mt-1">Currently assigned to: {selectedTask.assignedTo}</div>
              </div>
              <div>
                <Label>Reassign To *</Label>
                <Select onValueChange={handleReassignTask}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select new employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaff.filter(s => s.id !== selectedTask.assignedToId).map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> The new employee will receive a notification. The previous assignee will be notified of the change.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <Button onClick={() => setShowSuccessModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Member Management</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input placeholder="Search members..." className="pl-9 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="size-10 rounded-full" />
                          <div>
                            <div>{member.name}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.membershipType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.expiryDate}</TableCell>
                      <TableCell>{member.trainer}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStaff.filter(s => s.role === 'Trainer').map((staff) => (
                  <div key={staff.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={staff.avatar} alt={staff.name} className="size-12 rounded-full" />
                        <div>
                          <div>{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.specialization}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Calendar className="size-4 mr-2" />
                        Edit Schedule
                      </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-center">
                          <div className="text-xs text-gray-500 mb-1">{day}</div>
                          <div className="p-2 bg-blue-50 rounded text-xs">
                            9-5
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Class Schedule</CardTitle>
              <Button>
                <Calendar className="size-4 mr-2" />
                Add Class
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <div>
                          <div>{cls.name}</div>
                          <Badge variant="outline" className="mt-1">{cls.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{cls.instructor}</TableCell>
                      <TableCell>{cls.day}</TableCell>
                      <TableCell>{cls.time}</TableCell>
                      <TableCell>{cls.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{cls.enrolled}/{cls.capacity}</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600" 
                              style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="size-4" />
                        </Button>
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
                    {/* Task Header with Avatar */}
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

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gym Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Weekday Hours</Label>
                  <div className="flex gap-2 mt-2">
                    <Input type="time" defaultValue="05:00" />
                    <span className="flex items-center">to</span>
                    <Input type="time" defaultValue="22:00" />
                  </div>
                </div>
                <div>
                  <Label>Weekend Hours</Label>
                  <div className="flex gap-2 mt-2">
                    <Input type="time" defaultValue="07:00" />
                    <span className="flex items-center">to</span>
                    <Input type="time" defaultValue="20:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Membership Renewal Reminders</Label>
                  <p className="text-sm text-gray-500">Send email reminders 7 days before expiry</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Class Booking Notifications</Label>
                  <p className="text-sm text-gray-500">Notify members when they book a class</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trainer Assignment Notifications</Label>
                  <p className="text-sm text-gray-500">Notify trainers of new client assignments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Payment Reminders</Label>
                  <p className="text-sm text-gray-500">Send payment reminders for pending invoices</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">💳</div>
                  <div>
                    <div>Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded">🏦</div>
                  <div>
                    <div>Bank Transfer</div>
                    <div className="text-sm text-gray-500">Direct bank transfers</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded">💰</div>
                  <div>
                    <div>Cash</div>
                    <div className="text-sm text-gray-500">In-person cash payments</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}