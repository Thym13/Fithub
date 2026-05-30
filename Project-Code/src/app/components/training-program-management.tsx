import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { db, TrainingProgram, Exercise } from '../services/database';
import { authService } from '../services/auth';
import { emailService } from '../services/email';
import {
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  Target,
  Dumbbell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Clock,
  ListTodo,
  X
} from 'lucide-react';

export function TrainingProgramManagement() {
  const currentUser = authService.getCurrentUser();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    clientName: '',
    goal: '',
    duration: '',
    startDate: '',
    notes: ''
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: '',
    name: '',
    category: 'Strength' as Exercise['category'],
    sets: 3,
    reps: '10',
    duration: '',
    intensity: 'Medium' as Exercise['intensity'],
    instructions: '',
    day: 'Monday',
    completed: false
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = () => {
    if (currentUser) {
      const trainerPrograms = db.getProgramsByTrainer(currentUser.id);
      setPrograms(trainerPrograms);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      clientId: '',
      clientName: '',
      goal: '',
      duration: '',
      startDate: '',
      notes: ''
    });
    setExercises([]);
    setError('');
  };

  const resetExerciseForm = () => {
    setCurrentExercise({
      id: '',
      name: '',
      category: 'Strength',
      sets: 3,
      reps: '10',
      duration: '',
      intensity: 'Medium',
      instructions: '',
      day: 'Monday',
      completed: false
    });
  };

  const handleAddExercise = () => {
    if (!currentExercise.name.trim()) {
      setError('Exercise name is required');
      return;
    }

    const newExercise: Exercise = {
      ...currentExercise,
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setExercises([...exercises, newExercise]);
    resetExerciseForm();
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleCreateProgram = async () => {
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Program name is required');
      return;
    }
    if (!formData.clientName.trim()) {
      setError('Client name is required');
      return;
    }
    if (!formData.goal.trim()) {
      setError('Goal is required');
      return;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Valid duration is required');
      return;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }
    if (exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    setIsProcessing(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (parseInt(formData.duration) * 7));

      const program = db.createProgram({
        name: formData.name.trim(),
        description: formData.description.trim(),
        trainerId: currentUser!.id,
        trainerName: currentUser!.name,
        clientId: formData.clientId || `client-${Date.now()}`,
        clientName: formData.clientName.trim(),
        goal: formData.goal.trim(),
        duration: parseInt(formData.duration),
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0],
        status: 'Active',
        exercises: exercises,
        notes: formData.notes.trim()
      });

      // Send notification email to client (simulated)
      await emailService.sendEmail({
        to: `${formData.clientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        subject: `New Training Program: ${formData.name}`,
        body: `
          <h2>New Training Program Assigned! 💪</h2>
          <p>Hi ${formData.clientName},</p>
          <p>Your trainer <strong>${currentUser!.name}</strong> has created a new training program for you.</p>

          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p><strong>Program:</strong> ${formData.name}</p>
            <p><strong>Goal:</strong> ${formData.goal}</p>
            <p><strong>Duration:</strong> ${formData.duration} weeks</p>
            <p><strong>Start Date:</strong> ${new Date(formData.startDate).toLocaleDateString()}</p>
            <p><strong>Total Exercises:</strong> ${exercises.length}</p>
          </div>

          <p>Login to your dashboard to view the full program details and start your training!</p>
          <p>Good luck with your fitness journey! 🎯</p>
        `,
        type: 'notification'
      });

      loadPrograms();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating program:', error);
      setError('Failed to create program. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (program: TrainingProgram) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      clientId: program.clientId,
      clientName: program.clientName,
      goal: program.goal,
      duration: program.duration.toString(),
      startDate: program.startDate,
      notes: program.notes || ''
    });
    setExercises([...program.exercises]);
    setShowEditModal(true);
  };

  const handleUpdateProgram = async () => {
    if (!selectedProgram) return;

    setError('');

    if (!formData.name.trim()) {
      setError('Program name is required');
      return;
    }
    if (exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    setIsProcessing(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (parseInt(formData.duration) * 7));

      db.updateProgram(selectedProgram.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        clientName: formData.clientName.trim(),
        goal: formData.goal.trim(),
        duration: parseInt(formData.duration),
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0],
        exercises: exercises,
        notes: formData.notes.trim()
      });

      loadPrograms();
      setShowEditModal(false);
      setSelectedProgram(null);
      resetForm();
    } catch (error) {
      console.error('Error updating program:', error);
      setError('Failed to update program. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (program: TrainingProgram) => {
    setSelectedProgram(program);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedProgram) return;

    setIsProcessing(true);

    try {
      db.deleteProgram(selectedProgram.id);
      loadPrograms();
      setShowDeleteModal(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Cardio': 'bg-red-100 text-red-800',
      'Strength': 'bg-orange-100 text-orange-800',
      'Flexibility': 'bg-purple-100 text-purple-800',
      'Balance': 'bg-blue-100 text-blue-800',
      'HIIT': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (programs.length === 0 && !showCreateModal) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Training Programs</h2>
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="size-4 mr-2" />
            Create Program
          </Button>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                <Dumbbell className="size-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">No Training Programs Yet</h3>
              <p className="text-gray-600">Create your first training program for your clients.</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 mt-4">
                <Plus className="size-4 mr-2" />
                Create Your First Program
              </Button>
            </div>
          </CardContent>
        </Card>

        {renderCreateModal()}
      </div>
    );
  }

  const renderExerciseModal = () => (
    <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Add an exercise to the training program
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="ex-name">Exercise Name *</Label>
              <Input
                id="ex-name"
                placeholder="e.g., Push-ups, Running, Yoga"
                value={currentExercise.name}
                onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ex-category">Category *</Label>
              <Select value={currentExercise.category} onValueChange={(val) => setCurrentExercise({ ...currentExercise, category: val as Exercise['category'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                  <SelectItem value="Balance">Balance</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ex-day">Day *</Label>
              <Select value={currentExercise.day} onValueChange={(val) => setCurrentExercise({ ...currentExercise, day: val })}>
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
              <Label htmlFor="ex-sets">Sets</Label>
              <Input
                id="ex-sets"
                type="number"
                value={currentExercise.sets}
                onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="ex-reps">Reps</Label>
              <Input
                id="ex-reps"
                placeholder="e.g., 10, 12-15"
                value={currentExercise.reps}
                onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ex-duration">Duration</Label>
              <Input
                id="ex-duration"
                placeholder="e.g., 30 minutes, 5 km"
                value={currentExercise.duration}
                onChange={(e) => setCurrentExercise({ ...currentExercise, duration: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ex-intensity">Intensity</Label>
              <Select value={currentExercise.intensity} onValueChange={(val) => setCurrentExercise({ ...currentExercise, intensity: val as Exercise['intensity'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="ex-instructions">Instructions</Label>
              <Textarea
                id="ex-instructions"
                placeholder="Detailed instructions for the exercise..."
                value={currentExercise.instructions}
                onChange={(e) => setCurrentExercise({ ...currentExercise, instructions: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowExerciseModal(false);
                resetExerciseForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddExercise}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="size-4 mr-2" />
              Add Exercise
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderCreateModal = () => (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Training Program</DialogTitle>
          <DialogDescription>
            Design a personalized training program for your client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Program Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Program Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Program Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., 8-Week Weight Loss Program"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the program..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Client's full name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="goal">Goal *</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Lose 10 lbs, Build muscle"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (weeks) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="8"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for the client..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Exercises ({exercises.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExerciseModal(true)}
              >
                <Plus className="size-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-gray-500">No exercises added yet. Click "Add Exercise" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{exercise.name}</span>
                        <Badge className={getCategoryColor(exercise.category)} variant="secondary">
                          {exercise.category}
                        </Badge>
                        <Badge variant="outline">{exercise.day}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {exercise.sets && exercise.reps && `${exercise.sets} sets × ${exercise.reps} reps`}
                        {exercise.duration && ` • ${exercise.duration}`}
                        {exercise.intensity && (
                          <Badge className={`ml-2 ${getIntensityColor(exercise.intensity)}`} variant="secondary">
                            {exercise.intensity}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExercise(exercise.id)}
                    >
                      <X className="size-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              onClick={handleCreateProgram}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Create Program
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Training Program</DialogTitle>
          <DialogDescription>
            Update the training program details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Same form as create */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Program Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="edit-name">Program Name *</Label>
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
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="edit-clientName">Client Name *</Label>
                <Input
                  id="edit-clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-goal">Goal *</Label>
                <Input
                  id="edit-goal"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-duration">Duration (weeks) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Exercises ({exercises.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExerciseModal(true)}
              >
                <Plus className="size-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-gray-500">No exercises added yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{exercise.name}</span>
                        <Badge className={getCategoryColor(exercise.category)}>
                          {exercise.category}
                        </Badge>
                        <Badge variant="outline">{exercise.day}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {exercise.sets && exercise.reps && `${exercise.sets} sets × ${exercise.reps} reps`}
                        {exercise.duration && ` • ${exercise.duration}`}
                        {exercise.intensity && (
                          <Badge className={`ml-2 ${getIntensityColor(exercise.intensity)}`}>
                            {exercise.intensity}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExercise(exercise.id)}
                    >
                      <X className="size-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setSelectedProgram(null);
                resetForm();
              }}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProgram}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Update Program
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
          <DialogTitle>Delete Program</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this training program?
          </DialogDescription>
        </DialogHeader>

        {selectedProgram && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div><strong>Program:</strong> {selectedProgram.name}</div>
              <div><strong>Client:</strong> {selectedProgram.clientName}</div>
              <div><strong>Duration:</strong> {selectedProgram.duration} weeks</div>
            </div>

            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                This action cannot be undone. The training program and all its exercises will be permanently deleted.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProgram(null);
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
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-2" />
                    Delete Program
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
          <h2 className="text-xl font-medium">Training Programs</h2>
          <p className="text-sm text-gray-600 mt-1">{programs.length} total programs</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Create Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {program.description && (
                <p className="text-sm text-gray-600">{program.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-gray-400" />
                  <span className="text-gray-700">{program.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-gray-400" />
                  <span className="text-gray-700">{program.goal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-gray-700">
                    {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-gray-400" />
                  <span className="text-gray-700">{program.duration} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <ListTodo className="size-4 text-gray-400" />
                  <span className="text-gray-700">{program.exercises.length} exercises</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(program)}
                  className="flex-1"
                >
                  <Edit className="size-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(program)}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {renderCreateModal()}
      {renderEditModal()}
      {renderDeleteModal()}
      {renderExerciseModal()}
    </div>
  );
}
