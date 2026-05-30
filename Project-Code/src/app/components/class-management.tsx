import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { db, Class } from '../services/database';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Dumbbell,
  X
} from 'lucide-react';

interface ClassManagementProps {
  onRefresh?: () => void;
}

export function ClassManagement({ onRefresh }: ClassManagementProps) {
  const [classes, setClasses] = useState<Class[]>(() => db.getAllClasses());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as Class['category'] | '',
    instructorName: '',
    day: '' as Class['day'] | '',
    time: '',
    duration: '',
    capacity: '',
    location: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      instructorName: '',
      day: '',
      time: '',
      duration: '',
      capacity: '',
      location: ''
    });
    setError('');
  };

  const refreshClasses = () => {
    setClasses(db.getAllClasses());
    onRefresh?.();
  };

  const handleCreate = async () => {
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Class name is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.instructorName.trim()) {
      setError('Instructor name is required');
      return;
    }
    if (!formData.day) {
      setError('Day is required');
      return;
    }
    if (!formData.time) {
      setError('Time is required');
      return;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Valid duration is required');
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      setError('Valid capacity is required');
      return;
    }

    setIsProcessing(true);

    try {
      db.createClass({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        instructorId: `trainer-${Date.now()}`, // Generate instructor ID
        instructorName: formData.instructorName.trim(),
        day: formData.day,
        time: formData.time,
        duration: parseInt(formData.duration),
        capacity: parseInt(formData.capacity),
        status: 'Active',
        location: formData.location.trim()
      });

      refreshClasses();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating class:', error);
      setError('Failed to create class. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description,
      category: classItem.category,
      instructorName: classItem.instructorName,
      day: classItem.day,
      time: classItem.time,
      duration: classItem.duration.toString(),
      capacity: classItem.capacity.toString(),
      location: classItem.location || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedClass) return;

    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Class name is required');
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      setError('Valid capacity is required');
      return;
    }

    setIsProcessing(true);

    try {
      db.updateClass(selectedClass.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category as Class['category'],
        instructorName: formData.instructorName.trim(),
        day: formData.day as Class['day'],
        time: formData.time,
        duration: parseInt(formData.duration),
        capacity: parseInt(formData.capacity),
        location: formData.location.trim()
      });

      refreshClasses();
      setShowEditModal(false);
      setSelectedClass(null);
      resetForm();
    } catch (error) {
      console.error('Error updating class:', error);
      setError('Failed to update class. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedClass) return;

    setIsProcessing(true);

    try {
      db.deleteClass(selectedClass.id);
      refreshClasses();
      setShowDeleteModal(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Yoga': 'bg-purple-100 text-purple-800',
      'HIIT': 'bg-red-100 text-red-800',
      'Pilates': 'bg-pink-100 text-pink-800',
      'Cycling': 'bg-blue-100 text-blue-800',
      'Strength': 'bg-orange-100 text-orange-800',
      'Cardio': 'bg-green-100 text-green-800',
      'CrossFit': 'bg-yellow-100 text-yellow-800',
      'Boxing': 'bg-gray-100 text-gray-800',
      'Dance': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Full':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (classes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Class Management</h2>
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="size-4 mr-2" />
            Create Class
          </Button>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                <Dumbbell className="size-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">No Classes Yet</h3>
              <p className="text-gray-600">Create your first fitness class to get started.</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 mt-4">
                <Plus className="size-4 mr-2" />
                Create Your First Class
              </Button>
            </div>
          </CardContent>
        </Card>

        {renderCreateModal()}
      </div>
    );
  }

  const renderCreateModal = () => (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Add a new fitness class to the schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Morning Yoga Flow"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the class..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as Class['category'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Pilates">Pilates</SelectItem>
                  <SelectItem value="Cycling">Cycling</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                  <SelectItem value="Boxing">Boxing</SelectItem>
                  <SelectItem value="Dance">Dance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                placeholder="e.g., John Smith"
                value={formData.instructorName}
                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="day">Day *</Label>
              <Select value={formData.day} onValueChange={(val) => setFormData({ ...formData, day: val as Class['day'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Studio A"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Clock className="size-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Create Class
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderEditModal = () => (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Update class information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="edit-name">Class Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as Class['category'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Pilates">Pilates</SelectItem>
                  <SelectItem value="Cycling">Cycling</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                  <SelectItem value="Boxing">Boxing</SelectItem>
                  <SelectItem value="Dance">Dance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-instructor">Instructor Name *</Label>
              <Input
                id="edit-instructor"
                value={formData.instructorName}
                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-day">Day *</Label>
              <Select value={formData.day} onValueChange={(val) => setFormData({ ...formData, day: val as Class['day'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-time">Time *</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-duration">Duration (minutes) *</Label>
              <Input
                id="edit-duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="edit-capacity">Capacity *</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setSelectedClass(null);
                resetForm();
              }}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Clock className="size-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Update Class
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteModal = () => (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this class?
          </DialogDescription>
        </DialogHeader>

        {selectedClass && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <strong>Class:</strong> {selectedClass.name}
              </div>
              <div className="flex items-center gap-2">
                <strong>Instructor:</strong> {selectedClass.instructorName}
              </div>
              <div className="flex items-center gap-2">
                <strong>Schedule:</strong> {selectedClass.day} at {selectedClass.time}
              </div>
            </div>

            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                This action cannot be undone. All bookings for this class will also be cancelled.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedClass(null);
                }}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Clock className="size-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-2" />
                    Delete Class
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">Class Management</h2>
          <p className="text-sm text-gray-600 mt-1">{classes.length} total classes</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Create Class
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{classItem.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCategoryColor(classItem.category)}>
                          {classItem.category}
                        </Badge>
                        {classItem.location && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="size-3" />
                            {classItem.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{classItem.instructorName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3 text-gray-400" />
                        {classItem.day}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="size-3 text-gray-400" />
                        {classItem.time} ({classItem.duration} min)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-gray-400" />
                      <span>{classItem.enrolled}/{classItem.capacity}</span>
                      {classItem.waitlist > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{classItem.waitlist} waitlist
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(classItem.status)}>
                      {classItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(classItem)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(classItem)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {renderCreateModal()}
      {renderEditModal()}
      {renderDeleteModal()}
    </div>
  );
}
