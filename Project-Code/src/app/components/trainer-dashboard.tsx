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
  Trash2
} from 'lucide-react';
import { mockTrainerClients, mockClasses } from '../utils/mockData';
import { ClientProgressTracking } from './client-progress-tracking';
import { useEffect, useState } from 'react';

const trainerTabs = [
  { id: 'clients', label: 'My Clients', path: '#clients' },
  { id: 'programs', label: 'Workout Plans', path: '#programs' },
  { id: 'schedule', label: 'Schedule', path: '#schedule' },
  { id: 'progress', label: 'Progress Tracking', path: '#progress' },
];

export function TrainerDashboard() {
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
    console.log('Program created:', planData);
    console.log('Notifications sent to:', targetType === 'group' ? 'All members' : `Client ${planData.clientId}`);
  };

  return (
    <DashboardLayout title="Training Dashboard" role="Trainer" tabs={trainerTabs}>
      {/* Multi-Step Workout Plan Creation Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Create Workout Plan - Step {creationStep} of {planType === 'class' ? (targetType === 'group' ? 4 : 5) : (targetType === 'personal' ? 5 : 4)}
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
                  <div key={client.id} className="p-4 border rounded-lg">
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

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Activity className="size-4 mr-2" />
                          View Progress
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="size-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Workout Plans</CardTitle>
              <Button onClick={handleStartCreation}>
                <Plus className="size-4 mr-2" />
                Create Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Muscle Building Program */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="size-5 text-blue-600" />
                      <h3 className="font-medium">Muscle Building Program</h3>
                    </div>
                    <Badge variant="outline">1 active client</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    12-week progressive overload program focused on hypertrophy
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>12 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sessions/week:</span>
                      <span>4-5 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Focus:</span>
                      <span>Strength & Hypertrophy</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit Program</Button>
                    <Button variant="outline" size="sm">Assign to Client</Button>
                  </div>
                </div>

                {/* Weight Loss Program */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="size-5 text-green-600" />
                      <h3 className="font-medium">Weight Loss Program</h3>
                    </div>
                    <Badge variant="outline">1 active client</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    8-week cardio and strength training for fat loss
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>8 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sessions/week:</span>
                      <span>5-6 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Focus:</span>
                      <span>Cardio & Fat Loss</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit Program</Button>
                    <Button variant="outline" size="sm">Assign to Client</Button>
                  </div>
                </div>

                {/* Athletic Performance */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="size-5 text-purple-600" />
                      <h3 className="font-medium">Athletic Performance</h3>
                    </div>
                    <Badge variant="outline">1 active client</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Performance-focused training for speed, power, and endurance
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>10 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sessions/week:</span>
                      <span>4-6 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Focus:</span>
                      <span>Speed & Power</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit Program</Button>
                    <Button variant="outline" size="sm">Assign to Client</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
      </Tabs>
    </DashboardLayout>
  );
}