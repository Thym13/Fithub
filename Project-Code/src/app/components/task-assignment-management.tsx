import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Eye
} from 'lucide-react';
import { MockDatabase, Task, User as UserType } from '../services/database';
import { authService } from '../services/auth';
import { emailService } from '../services/email';

export function TaskAssignmentManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterAssignee, setFilterAssignee] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Administrative' as Task['type'],
    assignedTo: '',
    deadline: '',
    priority: 'Medium' as Task['priority'],
    frequency: 'One-time' as Task['frequency'],
    status: 'Pending' as Task['status'],
    notes: ''
  });

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = () => {
    setLoading(true);
    const db = MockDatabase.getInstance();
    const allTasks = db.getAllTasks();
    setTasks(allTasks);
    setLoading(false);
  };

  const loadUsers = () => {
    const db = MockDatabase.getInstance();
    const allUsers = db.getAllUsers();
    // Filter to show only staff (trainers, secretaries, managers)
    const staffUsers = allUsers.filter(u =>
      ['trainer', 'secretary', 'manager'].includes(u.role)
    );
    setUsers(staffUsers);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Administrative',
      assignedTo: '',
      deadline: '',
      priority: 'Medium',
      frequency: 'One-time',
      status: 'Pending',
      notes: ''
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.description || !formData.assignedTo || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const assignedUser = users.find(u => u.id === formData.assignedTo);
    if (!assignedUser) return;

    const db = MockDatabase.getInstance();
    const newTask = db.createTask({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      assignedTo: formData.assignedTo,
      assignedToName: assignedUser.name,
      assignedBy: currentUser.id,
      assignedByName: currentUser.name,
      deadline: formData.deadline,
      priority: formData.priority,
      frequency: formData.frequency,
      status: formData.status,
      notes: formData.notes
    });

    // Send notification email
    emailService.sendEmail({
      to: assignedUser.email,
      subject: 'New Task Assigned',
      body: `
        <h2>New Task Assigned</h2>
        <p>Hello ${assignedUser.name},</p>
        <p>You have been assigned a new task:</p>
        <ul>
          <li><strong>Title:</strong> ${formData.title}</li>
          <li><strong>Type:</strong> ${formData.type}</li>
          <li><strong>Priority:</strong> ${formData.priority}</li>
          <li><strong>Deadline:</strong> ${new Date(formData.deadline).toLocaleDateString('en-GB')}</li>
        </ul>
        <p><strong>Description:</strong></p>
        <p>${formData.description}</p>
        ${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ''}
        <p>Assigned by: ${currentUser.name}</p>
      `
    });

    loadTasks();
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedTask) return;
    if (!formData.title || !formData.description || !formData.assignedTo || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const assignedUser = users.find(u => u.id === formData.assignedTo);
    if (!assignedUser) return;

    const db = MockDatabase.getInstance();
    db.updateTask(selectedTask.id, {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      assignedTo: formData.assignedTo,
      assignedToName: assignedUser.name,
      deadline: formData.deadline,
      priority: formData.priority,
      frequency: formData.frequency,
      status: formData.status,
      notes: formData.notes
    });

    loadTasks();
    setShowEditModal(false);
    setSelectedTask(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedTask) return;

    const db = MockDatabase.getInstance();
    db.deleteTask(selectedTask.id);

    loadTasks();
    setShowDeleteModal(false);
    setSelectedTask(null);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      assignedTo: task.assignedTo,
      deadline: task.deadline,
      priority: task.priority,
      frequency: task.frequency,
      status: task.status,
      notes: task.notes || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (task: Task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Administrative': 'bg-purple-100 text-purple-800',
      'Maintenance': 'bg-orange-100 text-orange-800',
      'Training': 'bg-green-100 text-green-800',
      'Customer Service': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    if (filterAssignee !== 'All' && task.assignedTo !== filterAssignee) return false;
    return true;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    highPriority: tasks.filter(t => t.priority === 'High').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Tasks</CardTitle>
              <ClipboardList className="size-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{taskStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
              <Clock className="size-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{taskStats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">In Progress</CardTitle>
              <Activity className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{taskStats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Completed</CardTitle>
              <CheckCircle className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{taskStats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">High Priority</CardTitle>
              <AlertCircle className="size-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{taskStats.highPriority}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Create Button */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Task Management</CardTitle>
              <Button onClick={() => { resetForm(); setShowCreateModal(true); }}>
                <Plus className="size-4 mr-2" />
                Assign New Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label>Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Filter by Assignee</Label>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Assignees</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="size-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Tasks Found</h3>
                <p className="text-gray-500 mb-4">
                  {filterStatus !== 'All' || filterAssignee !== 'All'
                    ? 'No tasks match your filters. Try adjusting the filters above.'
                    : 'Get started by creating your first task assignment.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium">{task.title}</h3>
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge variant="outline" className={getTypeColor(task.type)}>
                                {task.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500">Assigned To</div>
                            <div className="font-medium">{task.assignedToName}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Deadline</div>
                            <div className="font-medium">
                              {new Date(task.deadline).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Frequency</div>
                            <div className="font-medium">{task.frequency}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Assigned By</div>
                            <div className="font-medium">{task.assignedByName}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewModal(task)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(task)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteModal(task)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assign New Task</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Task Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Update class schedule board"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the task..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Task Type *</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as Task['type'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Assign To *</Label>
                  <Select value={formData.assignedTo} onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select staff member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val as Task['priority'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(val) => setFormData({ ...formData, frequency: val as Task['frequency'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Deadline *</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as Task['status'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="flex-1">
                  <CheckCircle className="size-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Task</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Task Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Task Type *</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as Task['type'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Assign To *</Label>
                  <Select value={formData.assignedTo} onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val as Task['priority'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(val) => setFormData({ ...formData, frequency: val as Task['frequency'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Deadline *</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as Task['status'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEdit} className="flex-1">
                  <CheckCircle className="size-4 mr-2" />
                  Update Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Task Modal */}
      {showViewModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Task Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-500">Title</Label>
                <p className="font-medium">{selectedTask.title}</p>
              </div>

              <div>
                <Label className="text-gray-500">Description</Label>
                <p className="text-sm text-gray-700">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Type</Label>
                  <Badge variant="outline" className={getTypeColor(selectedTask.type) + ' mt-1'}>
                    {selectedTask.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge variant="outline" className={getStatusColor(selectedTask.status) + ' mt-1'}>
                    {selectedTask.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Priority</Label>
                  <Badge variant="outline" className={getPriorityColor(selectedTask.priority) + ' mt-1'}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">Frequency</Label>
                  <p className="font-medium">{selectedTask.frequency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Assigned To</Label>
                  <p className="font-medium">{selectedTask.assignedToName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Assigned By</Label>
                  <p className="font-medium">{selectedTask.assignedByName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Deadline</Label>
                  <p className="font-medium">{new Date(selectedTask.deadline).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Assigned On</Label>
                  <p className="font-medium">{new Date(selectedTask.assignedAt).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {selectedTask.notes && (
                <div>
                  <Label className="text-gray-500">Notes</Label>
                  <p className="text-sm text-gray-700">{selectedTask.notes}</p>
                </div>
              )}

              {selectedTask.completedAt && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Completed on {new Date(selectedTask.completedAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              )}

              <Button onClick={() => setShowViewModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete this task?</p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedTask.title}</p>
                <p className="text-sm text-gray-600 mt-1">Assigned to: {selectedTask.assignedToName}</p>
              </div>
              <p className="text-sm text-red-600">This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="flex-1">
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
