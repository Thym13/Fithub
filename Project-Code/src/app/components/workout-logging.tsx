import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Plus,
  X,
  Save,
  Trash2,
  Dumbbell,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Flame
} from 'lucide-react';
import { MockDatabase, WorkoutSession, WorkoutExercise, Exercise } from '../services/database';

export function WorkoutLogging() {
  const db = MockDatabase.getInstance();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [activeTab, setActiveTab] = useState('workouts');

  // Get current user
  const currentUser = db.findUserByEmail('member@fithub.com');

  // Workout form state
  const [workoutForm, setWorkoutForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    workoutType: 'Strength' as WorkoutSession['workoutType'],
    startTime: '',
    endTime: '',
    location: 'FitHub Gym',
    notes: '',
    mood: 'Good' as 'Excellent' | 'Good' | 'Neutral' | 'Tired' | 'Poor',
    energyLevel: 7,
    difficultyRating: 5
  });

  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    loadWorkouts();
    loadExercises();
  }, [timeRange]);

  const loadWorkouts = () => {
    if (!currentUser) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const allWorkouts = db.getWorkoutSessionsByUser(currentUser.id)
      .filter(w => w.date >= cutoffStr);

    setWorkouts(allWorkouts);
  };

  const loadExercises = () => {
    setExercises(db.getAllExercises());
  };

  const stats = currentUser ? db.getWorkoutStats(currentUser.id, timeRange) : null;

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: [
        { setNumber: 1, reps: 0, weight: 0, completed: false }
      ]
    };

    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    const currentSets = updated[exerciseIndex].sets;
    const newSetNumber = currentSets.length + 1;

    updated[exerciseIndex].sets.push({
      setNumber: newSetNumber,
      reps: 0,
      weight: 0,
      completed: false
    });

    setSelectedExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);

    // Renumber sets
    updated[exerciseIndex].sets.forEach((set, idx) => {
      set.setNumber = idx + 1;
    });

    setSelectedExercises(updated);
  };

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    const updated = [...selectedExercises];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value
    };
    setSelectedExercises(updated);
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    updated.splice(exerciseIndex, 1);
    setSelectedExercises(updated);
  };

  const handleSaveWorkout = () => {
    if (!currentUser || !workoutForm.title || selectedExercises.length === 0) {
      alert('Please fill in title and add at least one exercise');
      return;
    }

    // Calculate duration
    let duration: number | undefined;
    if (workoutForm.startTime && workoutForm.endTime) {
      const [startHours, startMinutes] = workoutForm.startTime.split(':').map(Number);
      const [endHours, endMinutes] = workoutForm.endTime.split(':').map(Number);
      duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    }

    const trainer = db.findUserByEmail('trainer@fithub.com');

    // Check if all exercises have at least one completed set
    const allCompleted = selectedExercises.every(ex => ex.sets.some(set => set.completed));

    db.createWorkoutSession({
      userId: currentUser.id,
      userName: currentUser.name,
      trainerId: trainer?.id,
      trainerName: trainer?.name,
      date: workoutForm.date,
      startTime: workoutForm.startTime || undefined,
      endTime: workoutForm.endTime || undefined,
      duration,
      workoutType: workoutForm.workoutType,
      title: workoutForm.title,
      exercises: selectedExercises,
      mood: workoutForm.mood,
      energyLevel: workoutForm.energyLevel || undefined,
      difficultyRating: workoutForm.difficultyRating || undefined,
      notes: workoutForm.notes || undefined,
      location: workoutForm.location || undefined,
      completed: allCompleted
    });

    // Reset form
    setWorkoutForm({
      date: new Date().toISOString().split('T')[0],
      title: '',
      workoutType: 'Strength',
      startTime: '',
      endTime: '',
      location: 'FitHub Gym',
      notes: '',
      mood: 'Good',
      energyLevel: 7,
      difficultyRating: 5
    });
    setSelectedExercises([]);
    setShowAddWorkout(false);
    loadWorkouts();
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      db.deleteWorkoutSession(id);
      loadWorkouts();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workouts">Workout Log</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Workouts</CardTitle>
                <Dumbbell className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats?.totalWorkouts || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Last {timeRange} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Volume</CardTitle>
                <TrendingUp className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{Math.round(stats?.totalVolume || 0).toLocaleString()} kg</div>
                <p className="text-xs text-gray-500 mt-1">Weight lifted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Avg Duration</CardTitle>
                <Clock className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{Math.round(stats?.avgDuration || 0)} min</div>
                <p className="text-xs text-gray-500 mt-1">Per workout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Completion Rate</CardTitle>
                <CheckCircle className="size-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{Math.round(stats?.completionRate || 0)}%</div>
                <p className="text-xs text-gray-500 mt-1">Finished workouts</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workout History</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Track your training sessions</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(parseInt(value) as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowAddWorkout(true)}>
                    <Plus className="size-4 mr-2" />
                    Log Workout
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workouts.length === 0 ? (
                  <div className="text-center py-12">
                    <Dumbbell className="size-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No workouts logged yet</p>
                    <p className="text-sm text-gray-400">Start logging your workouts to track progress</p>
                  </div>
                ) : (
                  workouts.map(workout => (
                    <div key={workout.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-lg">{workout.title}</h3>
                            <Badge variant="outline">{workout.workoutType}</Badge>
                            {workout.completed && (
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              {new Date(workout.date).toLocaleDateString()}
                            </div>
                            {workout.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="size-4" />
                                {workout.duration} min
                              </div>
                            )}
                            {workout.totalVolume && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="size-4" />
                                {Math.round(workout.totalVolume)} kg
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteWorkout(workout.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      {/* Exercise List */}
                      <div className="space-y-2">
                        {workout.exercises.map((exercise, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-gray-200">
                            <div className="font-medium text-sm">{exercise.exerciseName}</div>
                            <div className="text-xs text-gray-600">
                              {exercise.sets.map((set, setIdx) => (
                                <span key={setIdx}>
                                  {set.reps && set.weight ? `${set.reps} × ${set.weight}kg` :
                                   set.duration ? `${set.duration}s` :
                                   set.distance ? `${set.distance}km` : 'N/A'}
                                  {setIdx < exercise.sets.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {workout.notes && (
                        <div className="mt-3 text-sm text-gray-600 italic">"{workout.notes}"</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Most Used Exercises */}
          {stats && stats.mostUsedExercises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Most Used Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.mostUsedExercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{exercise.exerciseName}</span>
                      <Badge variant="outline">{exercise.count} times</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{exercises.length} exercises available</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercises.map(exercise => (
                  <div key={exercise.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{exercise.category}</Badge>
                          <Badge variant="outline" className="text-xs">{exercise.equipment}</Badge>
                          <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{exercise.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Workout Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Log Workout</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddWorkout(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Workout Details */}
              <div>
                <h3 className="font-medium mb-3">Workout Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={workoutForm.date}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Workout Type</Label>
                    <Select value={workoutForm.workoutType} onValueChange={(value: any) => setWorkoutForm({ ...workoutForm, workoutType: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={workoutForm.title}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })}
                      placeholder="e.g., Chest & Triceps"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={workoutForm.startTime}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, startTime: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={workoutForm.endTime}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, endTime: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Exercises</h3>
                  <Select onValueChange={(value) => {
                    const exercise = exercises.find(e => e.id === value);
                    if (exercise) handleAddExercise(exercise);
                  }}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Add exercise..." />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map(ex => (
                        <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {selectedExercises.map((exercise, exIdx) => (
                    <div key={exIdx} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{exercise.exerciseName}</h4>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(exIdx)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {exercise.sets.map((set, setIdx) => (
                          <div key={setIdx} className="grid grid-cols-5 gap-2 items-center">
                            <div className="text-sm font-medium">Set {set.setNumber}</div>
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={set.reps || ''}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', parseInt(e.target.value))}
                            />
                            <Input
                              type="number"
                              placeholder="Weight (kg)"
                              value={set.weight || ''}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value))}
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={set.completed}
                                onChange={(e) => handleUpdateSet(exIdx, setIdx, 'completed', e.target.checked)}
                                className="size-4"
                              />
                              <span className="text-xs text-gray-600">Done</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveSet(exIdx, setIdx)}>
                              <X className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" size="sm" className="mt-2" onClick={() => handleAddSet(exIdx)}>
                        <Plus className="size-4 mr-1" />
                        Add Set
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wellness & Notes */}
              <div>
                <h3 className="font-medium mb-3">Workout Feedback</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Mood</Label>
                    <Select value={workoutForm.mood} onValueChange={(value: any) => setWorkoutForm({ ...workoutForm, mood: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Tired">Tired</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Energy (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={workoutForm.energyLevel}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, energyLevel: parseInt(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Difficulty (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={workoutForm.difficultyRating}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, difficultyRating: parseInt(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={workoutForm.notes}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                    placeholder="How was the workout? Any PRs or observations?"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddWorkout(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveWorkout}>
                  <Save className="size-4 mr-2" />
                  Save Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
