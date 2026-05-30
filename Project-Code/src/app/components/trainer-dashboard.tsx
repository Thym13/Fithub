import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Users,
  Calendar,
  TrendingUp,
  Target,
  Plus,
  MessageSquare,
  Activity,
  Dumbbell,
  X,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Bell,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { mockTrainerClients, mockClasses } from '../utils/mockData';
import { ClientProgressTracking } from './client-progress-tracking';
import { TrainingProgramManagement } from './training-program-management';
import { TrainerMealPlanning } from './trainer-meal-planning';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MockDatabase } from '../services/database';
import { authService } from '../services/auth';

const trainerTabs = [
  { id: 'clients', label: 'My Clients', path: '#clients' },
  { id: 'programs', label: 'Training Programs', path: '#programs' },
  { id: 'meal-planning', label: 'Meal Planning', path: '#meal-planning' },
  { id: 'schedule', label: 'Schedule', path: '#schedule' },
  { id: 'progress', label: 'Progress Tracking', path: '#progress' },
  { id: 'contracts', label: 'Contracts', path: '#contracts' },
  { id: 'tasks', label: 'My Tasks', path: '#tasks' },
];

export function TrainerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clients');
  const myClients = mockTrainerClients;
  const myClasses = mockClasses.filter(c => c.instructor === 'Sarah Johnson');

  // Workout Plan Creation States
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [planType, setPlanType] = useState(''); // 'class' or 'workout'
  const [targetType, setTargetType] = useState(''); // 'group' or 'personal'
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data
  const [planData, setPlanData] = useState({
    name: '',
    goal: '',
    difficulty: '',
    exerciseType: '',
    sessionDuration: '',
    additionalInfo: '',
    // Group-specific
    days: [] as string[],
    time: '',
    capacity: '',
    // Personal-specific
    clientId: '',
    exercises: [] as any[],
    progressiveAdjustments: false
  });

  // Mock existing programs
  const [existingPrograms, setExistingPrograms] = useState([
    {
      id: '1',
      name: 'Muscle Building Program',
      type: 'Personal',
      clients: 3,
      duration: '12 weeks',
      difficulty: 'Advanced'
    },
    {
      id: '2',
      name: 'Weight Loss Bootcamp',
      type: 'Group',
      participants: 15,
      schedule: 'Mon, Wed, Fri - 6:00 PM',
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      name: 'Cardio Endurance',
      type: 'Personal',
      clients: 2,
      duration: '8 weeks',
      difficulty: 'Beginner'
    }
  ]);

  // Contract States
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contracts, setContracts] = useState([
    {
      id: '1',
      trainerName: 'Sarah Johnson',
      trainerEmail: 'sarah.johnson@example.com',
      position: 'Personal Trainer',
      salary: '2500',
      workingHours: '40',
      workDays: '5',
      services: ['Personal Training', 'Group Classes', 'Nutrition Consultation'],
      startDate: '2026-05-01',
      status: 'Pending',
      createdAt: '2026-04-14',
      sentBy: 'Manager - John Smith'
    },
    {
      id: '2',
      trainerName: 'Sarah Johnson',
      trainerEmail: 'sarah.johnson@example.com',
      position: 'Group Fitness Instructor',
      salary: '2200',
      workingHours: '35',
      workDays: '5',
      services: ['Group Classes', 'Fitness Assessment'],
      startDate: '2026-04-20',
      status: 'Accepted',
      createdAt: '2026-04-05',
      sentBy: 'Owner - Maria Papadopoulos',
      acceptedAt: '2026-04-06'
    }
  ]);

  // Task States
  const [showTaskAlert, setShowTaskAlert] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [myTasks, setMyTasks] = useState<any[]>([]);

  // Load tasks from database
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const db = MockDatabase.getInstance();
      const tasks = db.getTasksByAssignee(user.id);
      setMyTasks(tasks);
    }
  }, []);

  // Mock exercises list
  const exercisesList = [
    { id: '1', name: 'Squats', category: 'Legs' },
    { id: '2', name: 'Bench Press', category: 'Chest' },
    { id: '3', name: 'Deadlifts', category: 'Back' },
    { id: '4', name: 'Pull-ups', category: 'Back' },
    { id: '5', name: 'Push-ups', category: 'Chest' },
    { id: '6', name: 'Lunges', category: 'Legs' },
    { id: '7', name: 'Plank', category: 'Core' },
    { id: '8', name: 'Bicep Curls', category: 'Arms' }
  ];

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'clients';
    setActiveTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'clients';
      setActiveTab(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStartCreation = () => {
    setShowCreatePlan(true);
    setCreationStep(1);
    setPlanType('');
    setTargetType('');
    setPlanData({
      name: '',
      goal: '',
      difficulty: '',
      exerciseType: '',
      sessionDuration: '',
      additionalInfo: '',
      days: [],
      time: '',
      capacity: '',
      clientId: '',
      exercises: [],
      progressiveAdjustments: false
    });
  };

  const handleAddExercise = (exerciseId: string) => {
    const exercise = exercisesList.find(e => e.id === exerciseId);
    if (exercise && !planData.exercises.find(e => e.id === exerciseId)) {
      setPlanData({
        ...planData,
        exercises: [...planData.exercises, { ...exercise, sets: 3, reps: 10 }]
      });
    }
  };

  const handleUpdateExercise = (exerciseId: string, field: string, value: number) => {
    setPlanData({
      ...planData,
      exercises: planData.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setPlanData({
      ...planData,
      exercises: planData.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const handleDayToggle = (day: string) => {
    const days = planData.days.includes(day)
      ? planData.days.filter(d => d !== day)
      : [...planData.days, day];
    setPlanData({ ...planData, days });
  };

  const handleFinishCreation = () => {
    setShowCreatePlan(false);
    
    if (targetType === 'group') {
      setSuccessMessage(`Group class "${planData.name}" has been successfully created! All gym members have been notified and can now book this class.`);
    } else {
      const client = myClients.find(c => c.id === planData.clientId);
      setSuccessMessage(`Personalized workout plan "${planData.name}" has been created for ${client?.name}! They will receive a notification and can start tracking their progress.`);
    }
    
    setShowSuccessModal(true);
  };

  return (
    <DashboardLayout
      title="Training Dashboard"
      role="Trainer"
      tabs={trainerTabs}
      newTaskCount={myTasks.filter(t => t.isNew).length}
    >
      {/* Multi-Step Workout Plan Creation Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Create Workout Plan - Step {creationStep} of 5
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreatePlan(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Choose Type */}
              {creationStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Is this a class or a workout program?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setPlanType('class'); setCreationStep(2); }}
                      className={`p-6 border-2 rounded-lg text-center hover:border-blue-500 transition-colors ${planType === 'class' ? 'border-blue-500 bg-blue-50' : ''}`}
                    >
                      <Users className="size-12 mx-auto mb-3 text-blue-600" />
                      <h4 className="font-medium mb-1">Class</h4>
                      <p className="text-sm text-gray-600">Group fitness class with scheduled sessions</p>
                    </button>
                    <button
                      onClick={() => { setPlanType('workout'); setCreationStep(2); }}
                      className={`p-6 border-2 rounded-lg text-center hover:border-green-500 transition-colors ${planType === 'workout' ? 'border-green-500 bg-green-50' : ''}`}
                    >
                      <Dumbbell className="size-12 mx-auto mb-3 text-green-600" />
                      <h4 className="font-medium mb-1">Workout Program</h4>
                      <p className="text-sm text-gray-600">Personalized or group training program</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Program Details */}
              {creationStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Program Details</h3>
                  <div>
                    <Label>Program Name *</Label>
                    <Input 
                      placeholder="e.g., Advanced HIIT Training"
                      className="mt-2"
                      value={planData.name}
                      onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Program Goal *</Label>
                    <Select value={planData.goal} onValueChange={(val) => setPlanData({ ...planData, goal: val })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select goal..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_building">Muscle Building</SelectItem>
                        <SelectItem value="endurance">Endurance</SelectItem>
                        <SelectItem value="flexibility">Flexibility</SelectItem>
                        <SelectItem value="general_fitness">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Difficulty Level *</Label>
                      <Select value={planData.difficulty} onValueChange={(val) => setPlanData({ ...planData, difficulty: val })}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select level..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Session Duration *</Label>
                      <Select value={planData.sessionDuration} onValueChange={(val) => setPlanData({ ...planData, sessionDuration: val })}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select duration..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Exercise Type *</Label>
                    <Select value={planData.exerciseType} onValueChange={(val) => setPlanData({ ...planData, exerciseType: val })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Strength Training</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="hiit">HIIT</SelectItem>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="pilates">Pilates</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Additional Information</Label>
                    <Textarea 
                      placeholder="Any special instructions or notes..."
                      className="mt-2"
                      value={planData.additionalInfo}
                      onChange={(e) => setPlanData({ ...planData, additionalInfo: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCreationStep(1)}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCreationStep(3)}
                      disabled={!planData.name || !planData.goal || !planData.difficulty || !planData.sessionDuration || !planData.exerciseType}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Target Group Selection */}
              {creationStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Who is this program for?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setTargetType('group'); setCreationStep(4); }}
                      className={`p-6 border-2 rounded-lg text-center hover:border-purple-500 transition-colors ${targetType === 'group' ? 'border-purple-500 bg-purple-50' : ''}`}
                    >
                      <Users className="size-12 mx-auto mb-3 text-purple-600" />
                      <h4 className="font-medium mb-1">Group Program</h4>
                      <p className="text-sm text-gray-600">For multiple participants with scheduled sessions</p>
                    </button>
                    <button
                      onClick={() => { setTargetType('personal'); setCreationStep(4); }}
                      className={`p-6 border-2 rounded-lg text-center hover:border-orange-500 transition-colors ${targetType === 'personal' ? 'border-orange-500 bg-orange-50' : ''}`}
                    >
                      <Target className="size-12 mx-auto mb-3 text-orange-600" />
                      <h4 className="font-medium mb-1">Personal Program</h4>
                      <p className="text-sm text-gray-600">One-on-one personalized training plan</p>
                    </button>
                  </div>
                  <Button variant="outline" onClick={() => setCreationStep(2)}>
                    Back
                  </Button>
                </div>
              )}

              {/* Step 4a: Group Class Schedule (Alternative Flow 1) */}
              {creationStep === 4 && targetType === 'group' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Group Class Schedule</h3>
                  <div>
                    <Label>Select Days *</Label>
                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <button
                          key={day}
                          onClick={() => handleDayToggle(day)}
                          className={`p-3 border rounded-lg text-sm transition-colors ${
                            planData.days.includes(day) 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : 'hover:border-blue-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Class Time *</Label>
                      <Input 
                        type="time"
                        className="mt-2"
                        value={planData.time}
                        onChange={(e) => setPlanData({ ...planData, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Maximum Capacity *</Label>
                      <Input 
                        type="number"
                        placeholder="e.g., 20"
                        className="mt-2"
                        value={planData.capacity}
                        onChange={(e) => setPlanData({ ...planData, capacity: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Once created, all gym members will be notified about this new group class and can book their spots through the member portal.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCreationStep(3)}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCreationStep(5)}
                      disabled={planData.days.length === 0 || !planData.time || !planData.capacity}
                    >
                      Next: Add Exercises
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4b: Personal Client Selection (Alternative Flow 2) */}
              {creationStep === 4 && targetType === 'personal' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Select Client</h3>
                  <div>
                    <Label>Choose the client for this personalized program *</Label>
                    <Select value={planData.clientId} onValueChange={(val) => setPlanData({ ...planData, clientId: val })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select client..." />
                      </SelectTrigger>
                      <SelectContent>
                        {myClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {planData.clientId && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      {(() => {
                        const client = myClients.find(c => c.id === planData.clientId);
                        return client ? (
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <img src={client.avatar} alt={client.name} className="size-12 rounded-full" />
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-gray-600">{client.goals}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <div className="text-gray-500">Current Weight</div>
                                <div className="font-medium">{client.currentWeight} lbs</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Target Weight</div>
                                <div className="font-medium">{client.targetWeight} lbs</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Progress</div>
                                <div className="font-medium">{client.progress}%</div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  <div>
                    <Label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={planData.progressiveAdjustments}
                        onChange={(e) => setPlanData({ ...planData, progressiveAdjustments: e.target.checked })}
                        className="size-4"
                      />
                      Enable automatic progressive adjustments
                    </Label>
                    <p className="text-sm text-gray-500 mt-2">
                      The system will suggest progressive adjustments (increasing weight, changing reps) based on client progress.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCreationStep(3)}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCreationStep(5)}
                      disabled={!planData.clientId}
                    >
                      Next: Add Exercises
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Add Exercises */}
              {creationStep === 5 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Add Exercises to Program</h3>
                  
                  <div>
                    <Label>Select Exercise to Add</Label>
                    <Select onValueChange={handleAddExercise}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose an exercise..." />
                      </SelectTrigger>
                      <SelectContent>
                        {exercisesList.map((ex) => (
                          <SelectItem key={ex.id} value={ex.id}>
                            {ex.name} ({ex.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {planData.exercises.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">Selected Exercises</h4>
                      {planData.exercises.map((exercise) => (
                        <div key={exercise.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-gray-500">{exercise.category}</div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveExercise(exercise.id)}
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Sets</Label>
                              <Input 
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => handleUpdateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                                className="mt-1"
                                min="1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Reps</Label>
                              <Input 
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => handleUpdateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                                className="mt-1"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <Dumbbell className="size-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-500">No exercises added yet. Select exercises from the dropdown above.</p>
                    </div>
                  )}

                  {planData.progressiveAdjustments && planData.exercises.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="size-5 text-green-600 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <strong>Progressive Adjustments Enabled:</strong> The system will automatically suggest increasing weight/reps based on the client's performance and progress.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCreationStep(4)}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleFinishCreation}
                      disabled={planData.exercises.length === 0}
                    >
                      <CheckCircle className="size-4 mr-2" />
                      Create Program
                    </Button>
                  </div>
                </div>
              )}
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
              <h3 className="text-xl font-medium mb-2">Program Created Successfully!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <Button onClick={() => setShowSuccessModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="clients" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Clients</CardTitle>
                <Users className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{myClients.length}</div>
                <p className="text-xs text-gray-500 mt-1">Active training clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Sessions This Week</CardTitle>
                <Calendar className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">12</div>
                <p className="text-xs text-gray-500 mt-1">3 sessions today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Avg Client Progress</CardTitle>
                <TrendingUp className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">73%</div>
                <p className="text-xs text-gray-500 mt-1">Goal achievement rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Client List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Client List</CardTitle>
              <Button>
                <Plus className="size-4 mr-2" />
                Add Client
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                    onClick={() => navigate(`/trainer/client/${client.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={client.avatar} alt={client.name} className="size-12 rounded-full" />
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.program}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{client.progress}% Complete</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span>{client.progress}%</span>
                        </div>
                        <Progress value={client.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Start</div>
                          <div className="font-medium">{client.startWeight} lbs</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Current</div>
                          <div className="font-medium">{client.currentWeight} lbs</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Goal</div>
                          <div className="font-medium">{client.targetWeight} lbs</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="size-4" />
                        Next session: {client.nextSession}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <TrainingProgramManagement />
        </TabsContent>

        <TabsContent value="meal-planning" className="space-y-6">
          <TrainerMealPlanning />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myClasses.map((cls) => (
                  <div key={cls.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">{cls.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {cls.day}
                          </div>
                          <div>{cls.time}</div>
                          <div>{cls.duration}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{cls.category}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-600">Attendance: </span>
                        <span className="font-medium">{cls.enrolled}/{cls.capacity}</span>
                      </div>
                      <Button variant="outline" size="sm">View Roster</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Training Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={client.avatar} alt={client.name} className="size-10 rounded-full" />
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.nextSession}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <ClientProgressTracking />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Employment Contracts
                </CardTitle>
                <Badge variant="secondary">
                  {contracts.filter(c => c.status === 'Pending').length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{contract.position}</h3>
                          <Badge
                            variant={
                              contract.status === 'Pending' ? 'secondary' :
                              contract.status === 'Accepted' ? 'default' :
                              'destructive'
                            }
                            className={
                              contract.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                              contract.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                            }
                          >
                            {contract.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Monthly Salary: <strong>€{contract.salary}</strong></p>
                          <p>Working Hours: <strong>{contract.workingHours} hours/week</strong></p>
                          <p>Start Date: <strong>{new Date(contract.startDate).toLocaleDateString('en-GB')}</strong></p>
                          <p className="text-xs text-gray-500">Sent by: {contract.sentBy} on {new Date(contract.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowContractModal(true);
                          }}
                        >
                          <Eye className="size-4 sm:mr-2" />
                          <span className="hidden sm:inline">View Details</span>
                        </Button>
                        {contract.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                const updatedContracts = contracts.map(c =>
                                  c.id === contract.id ? { ...c, status: 'Accepted', acceptedAt: new Date().toISOString().split('T')[0] } : c
                                );
                                setContracts(updatedContracts);
                                setSuccessMessage('Contract accepted successfully!');
                                setShowSuccessModal(true);
                              }}
                            >
                              <ThumbsUp className="size-4 sm:mr-2" />
                              <span className="hidden sm:inline">Accept</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const updatedContracts = contracts.map(c =>
                                  c.id === contract.id ? { ...c, status: 'Rejected', rejectedAt: new Date().toISOString().split('T')[0] } : c
                                );
                                setContracts(updatedContracts);
                              }}
                            >
                              <ThumbsDown className="size-4 sm:mr-2" />
                              <span className="hidden sm:inline">Reject</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {contracts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="size-12 mx-auto mb-4 opacity-50" />
                    <p>No contracts yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contract Details Modal */}
          {showContractModal && selectedContract && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl">Contract Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowContractModal(false);
                        setSelectedContract(null);
                      }}
                      className="flex-shrink-0"
                    >
                      <X className="size-4" />
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
                            and <strong>{selectedContract.trainerName}</strong> (hereinafter "Employee"), email: {selectedContract.trainerEmail}.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">POSITION AND DUTIES</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            The Employee is hired as <strong>{selectedContract.position}</strong> and shall provide the following services:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {selectedContract.services.map((service: string, index: number) => (
                              <li key={index}>{service}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">COMPENSATION</h3>
                            <p className="text-sm text-gray-700">Monthly Salary: <strong>€{selectedContract.salary}</strong></p>
                            <p className="text-sm text-gray-500 mt-1">Payment made monthly on the last business day</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">WORKING HOURS</h3>
                            <p className="text-sm text-gray-700">Hours per Week: <strong>{selectedContract.workingHours} hours</strong></p>
                            <p className="text-sm text-gray-700">Work Days: <strong>{selectedContract.workDays} days per week</strong></p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">EMPLOYMENT PERIOD</h3>
                          <p className="text-sm text-gray-700">
                            Start Date: <strong>{new Date(selectedContract.startDate).toLocaleDateString('en-GB')}</strong>
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

                        {selectedContract.status === 'Accepted' && selectedContract.acceptedAt && (
                          <div className="border-t pt-4">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle className="size-5" />
                              <p className="text-sm font-medium">
                                Contract Accepted on {new Date(selectedContract.acceptedAt).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4 text-xs text-gray-500">
                        <p>This contract is governed by the laws of Greece and European Union employment regulations.</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowContractModal(false);
                          setSelectedContract(null);
                        }}
                        className="flex-1 w-full"
                      >
                        Close
                      </Button>
                      {selectedContract.status === 'Pending' && (
                        <>
                          <Button
                            onClick={() => {
                              const updatedContracts = contracts.map(c =>
                                c.id === selectedContract.id ? { ...c, status: 'Accepted', acceptedAt: new Date().toISOString().split('T')[0] } : c
                              );
                              setContracts(updatedContracts);
                              setShowContractModal(false);
                              setSelectedContract(null);
                              setSuccessMessage('Contract accepted successfully!');
                              setShowSuccessModal(true);
                            }}
                            className="flex-1 w-full bg-green-600 hover:bg-green-700"
                          >
                            <ThumbsUp className="size-4 mr-2" />
                            Accept Contract
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              const updatedContracts = contracts.map(c =>
                                c.id === selectedContract.id ? { ...c, status: 'Rejected', rejectedAt: new Date().toISOString().split('T')[0] } : c
                              );
                              setContracts(updatedContracts);
                              setShowContractModal(false);
                              setSelectedContract(null);
                            }}
                            className="flex-1 w-full"
                          >
                            <ThumbsDown className="size-4 mr-2" />
                            Reject Contract
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Task Notification Alert */}
          {showTaskAlert && myTasks.filter(t => t.isNew).length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                    <Bell className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">New Task Assigned!</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      You have {myTasks.filter(t => t.isNew).length} new task{myTasks.filter(t => t.isNew).length > 1 ? 's' : ''} from your manager
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTaskAlert(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="size-5" />
                  Assigned Tasks
                </CardTitle>
                <Badge variant="secondary">
                  {myTasks.filter(t => t.status === 'Pending').length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      task.isNew ? 'border-blue-300 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {task.isNew && (
                            <Badge className="bg-blue-600">New</Badge>
                          )}
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge
                            variant="outline"
                            className={
                              task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            <span>Due: {new Date(task.deadline).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{task.type}</Badge>
                          </div>
                          <div>Frequency: {task.frequency}</div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Assigned by {task.assignedByName} on {new Date(task.assignedAt).toLocaleString('en-GB')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowTaskDetails(true);
                          }}
                        >
                          <Eye className="size-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        {task.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const db = MockDatabase.getInstance();
                              db.updateTask(task.id, { status: 'In Progress', isNew: false });
                              const updatedTasks = myTasks.map(t =>
                                t.id === task.id ? { ...t, status: 'In Progress', isNew: false } : t
                              );
                              setMyTasks(updatedTasks);
                            }}
                          >
                            <Activity className="size-4 sm:mr-2" />
                            <span className="hidden sm:inline">Start</span>
                          </Button>
                        )}
                        {task.status === 'In Progress' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              const db = MockDatabase.getInstance();
                              db.updateTask(task.id, { status: 'Completed', completedAt: new Date().toISOString(), isNew: false });
                              const updatedTasks = myTasks.map(t =>
                                t.id === task.id ? { ...t, status: 'Completed', completedAt: new Date().toISOString(), isNew: false } : t
                              );
                              setMyTasks(updatedTasks);
                              setSuccessMessage('Task marked as completed!');
                              setShowSuccessModal(true);
                            }}
                          >
                            <CheckCircle className="size-4 sm:mr-2" />
                            <span className="hidden sm:inline">Complete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {myTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <ClipboardList className="size-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks assigned yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Task Details Modal */}
          {showTaskDetails && selectedTask && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-lg w-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">Task Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTaskDetails(false);
                        setSelectedTask(null);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">Task Title</Label>
                      <p className="font-medium">{selectedTask.title}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Description</Label>
                      <p className="text-sm text-gray-700">{selectedTask.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Type</Label>
                        <Badge variant="outline" className="mt-1">{selectedTask.type}</Badge>
                      </div>
                      <div>
                        <Label className="text-gray-500">Status</Label>
                        <Badge
                          className={`mt-1 ${
                            selectedTask.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            selectedTask.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {selectedTask.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Deadline</Label>
                        <p className="font-medium">{new Date(selectedTask.deadline).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Frequency</Label>
                        <p className="font-medium">{selectedTask.frequency}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-500">Assigned By</Label>
                      <p className="font-medium">{selectedTask.assignedByName}</p>
                      <p className="text-xs text-gray-500 mt-1">on {new Date(selectedTask.assignedAt).toLocaleString('en-GB')}</p>
                    </div>
                    {selectedTask.completedAt && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✓ Completed on {selectedTask.completedAt}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowTaskDetails(false);
                          setSelectedTask(null);
                        }}
                      >
                        Close
                      </Button>
                      {selectedTask.status !== 'Completed' && (
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            const db = MockDatabase.getInstance();
                            db.updateTask(selectedTask.id, { status: 'Completed', completedAt: new Date().toISOString(), isNew: false });
                            const updatedTasks = myTasks.map(t =>
                              t.id === selectedTask.id ? { ...t, status: 'Completed', completedAt: new Date().toISOString(), isNew: false } : t
                            );
                            setMyTasks(updatedTasks);
                            setShowTaskDetails(false);
                            setSelectedTask(null);
                            setSuccessMessage('Task marked as completed!');
                            setShowSuccessModal(true);
                          }}
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}