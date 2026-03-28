import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Target, 
  CheckCircle, 
  X, 
  Plus,
  Save,
  AlertCircle,
  Mail,
  Bell,
  Edit,
  LineChart as LineChartIcon,
  Dumbbell,
  Heart,
  Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockTrainerClients } from '../utils/mockData';

// Mock client progress data with history
const mockClientProgressData = {
  '1': {
    hasHistory: true,
    weightHistory: [
      { date: '2026-01-20', weight: 84, bodyFat: 22, muscleMass: 64 },
      { date: '2026-02-05', weight: 83, bodyFat: 21, muscleMass: 64 },
      { date: '2026-02-20', weight: 82, bodyFat: 20, muscleMass: 65 },
      { date: '2026-03-05', weight: 81, bodyFat: 19, muscleMass: 65 },
      { date: '2026-03-20', weight: 79, bodyFat: 18, muscleMass: 66 }
    ],
    exercises: [
      { name: 'Bench Press', maxWeight: 84, sets: 4, reps: 10, lastUpdated: '2026-03-18' },
      { name: 'Squats', maxWeight: 102, sets: 4, reps: 8, lastUpdated: '2026-03-18' },
      { name: 'Deadlift', maxWeight: 125, sets: 3, reps: 6, lastUpdated: '2026-03-15' },
      { name: 'Pull-ups', maxWeight: 0, sets: 3, reps: 12, lastUpdated: '2026-03-18' }
    ],
    enduranceHistory: [
      { date: '2026-01-20', cardio: 20, distance: 4.0 },
      { date: '2026-02-05', cardio: 25, distance: 4.8 },
      { date: '2026-02-20', cardio: 30, distance: 5.6 },
      { date: '2026-03-05', cardio: 35, distance: 6.4 },
      { date: '2026-03-20', cardio: 40, distance: 7.2 }
    ],
    program: 'Muscle Building Program',
    notes: [
      { date: '2026-03-15', note: 'Great progress on deadlifts! Increased weight by 5 kg.' },
      { date: '2026-03-10', note: 'Client showing excellent form improvements.' }
    ],
    goals: [
      { id: 1, goal: 'Reach 77 kg body weight', status: 'In Progress', deadline: '2026-04-30' },
      { id: 2, goal: 'Bench press 90 kg', status: 'In Progress', deadline: '2026-05-15' }
    ]
  },
  '2': {
    hasHistory: true,
    weightHistory: [
      { date: '2026-01-20', weight: 75, bodyFat: 28, muscleMass: 50 },
      { date: '2026-02-05', weight: 73, bodyFat: 27, muscleMass: 50 },
      { date: '2026-02-20', weight: 73, bodyFat: 26, muscleMass: 51 },
      { date: '2026-03-05', weight: 72, bodyFat: 25, muscleMass: 51 },
      { date: '2026-03-20', weight: 70, bodyFat: 24, muscleMass: 52 }
    ],
    exercises: [
      { name: 'Treadmill Run', maxWeight: 0, sets: 1, reps: 0, lastUpdated: '2026-03-18' },
      { name: 'Leg Press', maxWeight: 68, sets: 3, reps: 15, lastUpdated: '2026-03-18' },
      { name: 'Dumbbell Curls', maxWeight: 11, sets: 3, reps: 12, lastUpdated: '2026-03-15' }
    ],
    enduranceHistory: [
      { date: '2026-01-20', cardio: 15, distance: 2.4 },
      { date: '2026-02-05', cardio: 20, distance: 3.2 },
      { date: '2026-02-20', cardio: 25, distance: 4.0 },
      { date: '2026-03-05', cardio: 30, distance: 4.8 },
      { date: '2026-03-20', cardio: 35, distance: 5.6 }
    ],
    program: 'Weight Loss Program',
    notes: [
      { date: '2026-03-18', note: 'Excellent cardio improvement! Stamina increasing.' }
    ],
    goals: [
      { id: 1, goal: 'Reach 68 kg body weight', status: 'In Progress', deadline: '2026-05-30' }
    ]
  },
  '3': {
    hasHistory: false,
    weightHistory: [],
    exercises: [],
    enduranceHistory: [],
    program: 'Not Assigned',
    notes: [],
    goals: []
  }
};

export function ClientProgressTracking() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  // New measurement form
  const [newMeasurement, setNewMeasurement] = useState({
    date: '2026-03-20',
    weight: '',
    bodyFat: '',
    muscleMass: '',
    cardio: '',
    distance: '',
    notes: ''
  });

  // New goal form
  const [newGoal, setNewGoal] = useState({
    goal: '',
    deadline: ''
  });

  // Edit exercise
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [exerciseData, setExerciseData] = useState({
    maxWeight: '',
    sets: '',
    reps: ''
  });

  const selectedClient = mockTrainerClients.find(c => c.id === selectedClientId);
  const clientProgress = selectedClientId ? mockClientProgressData[selectedClientId as keyof typeof mockClientProgressData] : null;

  const handleSaveMeasurement = () => {
    // Simulate random error for Alternative Flow 2
    const hasError = Math.random() < 0.15; // 15% chance of error
    
    if (hasError) {
      setSaveError(true);
      setShowErrorModal(true);
      return;
    }

    // Success
    console.log('Saving measurement:', newMeasurement);
    console.log('Sending notification to client:', selectedClient?.name);
    console.log('Sending email confirmation...');
    
    setShowAddMeasurement(false);
    setShowSuccessModal(true);
    setNewMeasurement({
      date: '2026-03-20',
      weight: '',
      bodyFat: '',
      muscleMass: '',
      cardio: '',
      distance: '',
      notes: ''
    });
  };

  const handleSaveGoal = () => {
    console.log('Saving goal:', newGoal);
    console.log('Notifying client about new goal...');
    
    setShowAddGoal(false);
    setShowSuccessModal(true);
    setNewGoal({ goal: '', deadline: '' });
  };

  const handleSaveExercise = () => {
    console.log('Updating exercise:', editingExercise, exerciseData);
    setEditingExercise(null);
    setShowSuccessModal(true);
  };

  const handleAddBasicMeasurements = () => {
    // Alternative Flow 1: Add basic measurements for client without history
    setShowAddMeasurement(true);
  };

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Client Progress Tracking</CardTitle>
          <p className="text-sm text-gray-500">Select a client to view and update their training progress</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTrainerClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                  selectedClientId === client.id ? 'border-blue-600 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={client.avatar} alt={client.name} className="size-12 rounded-full" />
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.goals}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Progress Details */}
      {selectedClient && clientProgress && (
        <>
          {/* Alternative Flow 1: No History Available */}
          {!clientProgress.hasHistory && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-yellow-100 rounded-full">
                      <AlertCircle className="size-12 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Training History Available</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedClient.name} does not have sufficient data to track their progress. 
                    Start by recording some basic measurements and exercises.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleAddBasicMeasurements}>
                      <Plus className="size-4 mr-2" />
                      Add Initial Measurements
                    </Button>
                    <Button variant="outline">
                      Assign Workout Program
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Progress View */}
          {clientProgress.hasHistory && (
            <>
              {/* Client Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <img src={selectedClient.avatar} alt={selectedClient.name} className="size-12 rounded-full" />
                      <div className="flex-1">
                        <CardTitle>{selectedClient.name}'s Progress</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Current Program: <Badge variant="outline">{clientProgress.program}</Badge>
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setShowAddMeasurement(true)} className="w-full sm:w-auto sm:self-end">
                      <Plus className="size-4 mr-2" />
                      Add Measurement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Weight Stats */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="size-5 text-blue-600" />
                        <span className="font-medium">Weight Progress</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Starting</span>
                          <span className="font-medium">{clientProgress.weightHistory[0]?.weight} kg</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Current</span>
                          <span className="font-medium text-blue-600">
                            {clientProgress.weightHistory[clientProgress.weightHistory.length - 1]?.weight} kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Change</span>
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <TrendingDown className="size-4" />
                            {clientProgress.weightHistory[0]?.weight - clientProgress.weightHistory[clientProgress.weightHistory.length - 1]?.weight} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Body Composition */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="size-5 text-green-600" />
                        <span className="font-medium">Body Composition</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Body Fat</span>
                          <span className="font-medium">
                            {clientProgress.weightHistory[clientProgress.weightHistory.length - 1]?.bodyFat}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Muscle Mass</span>
                          <span className="font-medium text-green-600">
                            {clientProgress.weightHistory[clientProgress.weightHistory.length - 1]?.muscleMass} kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Muscle Gain</span>
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <TrendingUp className="size-4" />
                            {clientProgress.weightHistory[clientProgress.weightHistory.length - 1]?.muscleMass - clientProgress.weightHistory[0]?.muscleMass} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Endurance */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="size-5 text-red-600" />
                        <span className="font-medium">Endurance</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Cardio Time</span>
                          <span className="font-medium">
                            {clientProgress.enduranceHistory[clientProgress.enduranceHistory.length - 1]?.cardio} min
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Distance</span>
                          <span className="font-medium">
                            {clientProgress.enduranceHistory[clientProgress.enduranceHistory.length - 1]?.distance} km
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Improvement</span>
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <TrendingUp className="size-4" />
                            +{clientProgress.enduranceHistory[clientProgress.enduranceHistory.length - 1]?.cardio - clientProgress.enduranceHistory[0]?.cardio} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weight Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="size-5 text-blue-600" />
                    Weight & Body Composition Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={clientProgress.weightHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        key="weight-line"
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        name="Weight (kg)" 
                      />
                      <Line 
                        key="bodyfat-line"
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        name="Body Fat %"  
                      />
                      <Line 
                        key="muscle-line"
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="muscleMass" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        name="Muscle Mass (kg)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Endurance Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="size-5 text-yellow-600" />
                    Endurance Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={clientProgress.enduranceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        key="cardio-bar"
                        dataKey="cardio" 
                        fill="#8b5cf6" 
                        name="Cardio (min)" 
                      />
                      <Bar 
                        key="distance-bar"
                        dataKey="distance" 
                        fill="#f59e0b" 
                        name="Distance (km)" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Exercise Performance */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="size-5 text-purple-600" />
                      Exercise Performance
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="size-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clientProgress.exercises.map((exercise, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-gray-500">Last updated: {exercise.lastUpdated}</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingExercise(exercise);
                              setExerciseData({
                                maxWeight: exercise.maxWeight.toString(),
                                sets: exercise.sets.toString(),
                                reps: exercise.reps.toString()
                              });
                            }}
                          >
                            <Edit className="size-4 mr-2" />
                            Update
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-gray-600">Max Weight</div>
                            <div className="text-lg font-medium">{exercise.maxWeight || 'N/A'} {exercise.maxWeight ? 'kg' : ''}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-gray-600">Sets</div>
                            <div className="text-lg font-medium">{exercise.sets}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded text-center">
                            <div className="text-gray-600">Reps</div>
                            <div className="text-lg font-medium">{exercise.reps}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goals & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Goals */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="size-5 text-orange-600" />
                        Current Goals
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setShowAddGoal(true)}>
                        <Plus className="size-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clientProgress.goals.map((goal) => (
                        <div key={goal.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium">{goal.goal}</div>
                            <Badge variant="outline">{goal.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-500">Deadline: {goal.deadline}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Session Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clientProgress.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">{note.date}</div>
                          <div className="text-sm">{note.note}</div>
                        </div>
                      ))}
                      <Textarea 
                        placeholder="Add a new note about this client's progress..."
                        rows={3}
                      />
                      <Button size="sm" className="w-full">
                        <Save className="size-4 mr-2" />
                        Save Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}

      {/* Add Measurement Modal */}
      {showAddMeasurement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Measurement</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddMeasurement(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={newMeasurement.date}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, date: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Weight (kg)</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newMeasurement.weight}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, weight: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Body Fat %</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newMeasurement.bodyFat}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, bodyFat: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Muscle Mass (kg)</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newMeasurement.muscleMass}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, muscleMass: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cardio Time (min)</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newMeasurement.cardio}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, cardio: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Distance (km)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="0.0"
                    value={newMeasurement.distance}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, distance: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Session Notes</Label>
                <Textarea 
                  placeholder="Notes about today's session..."
                  rows={3}
                  value={newMeasurement.notes}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, notes: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddMeasurement(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveMeasurement}>
                  <Save className="size-4 mr-2" />
                  Save Measurement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Goal</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddGoal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Goal Description</Label>
                <Input 
                  placeholder="e.g., Reach 170 lbs body weight"
                  value={newGoal.goal}
                  onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Target Deadline</Label>
                <Input 
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveGoal}>
                  <Save className="size-4 mr-2" />
                  Save Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {editingExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Update Exercise - {editingExercise.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingExercise(null)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Max Weight (kg)</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  value={exerciseData.maxWeight}
                  onChange={(e) => setExerciseData({ ...exerciseData, maxWeight: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sets</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={exerciseData.sets}
                    onChange={(e) => setExerciseData({ ...exerciseData, sets: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Reps</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={exerciseData.reps}
                    onChange={(e) => setExerciseData({ ...exerciseData, reps: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setEditingExercise(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveExercise}>
                  <Save className="size-4 mr-2" />
                  Update Exercise
                </Button>
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
              <h3 className="text-xl font-medium mb-2">Progress Updated Successfully!</h3>
              <p className="text-gray-600 mb-4">
                The client's progress has been saved and they will be notified.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bell className="size-4" />
                  <span>In-app notification sent</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="size-4" />
                  <span>Email sent</span>
                </div>
              </div>
              <Button onClick={() => setShowSuccessModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Modal - Alternative Flow 2 */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertCircle className="size-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Error Saving Data</h3>
              <p className="text-gray-600 mb-6">
                We encountered a technical error while saving the client's progress. Please try again later.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setShowErrorModal(false);
                    setSaveError(false);
                    handleSaveMeasurement();
                  }} 
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowErrorModal(false);
                    setSaveError(false);
                  }} 
                  className="w-full"
                >
                  Close
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                💡 Tip: Try restarting the app if the problem persists
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}