import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import {
  Dumbbell,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  X,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Award,
  Activity
} from 'lucide-react';
import { MockDatabase, TrainingProgram, Exercise } from '../services/database';
import { authService } from '../services/auth';

export function ClientTrainingPrograms() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [showProgramDetail, setShowProgramDetail] = useState(false);
  const [showExerciseLog, setShowExerciseLog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseLog, setExerciseLog] = useState({
    weight: '',
    actualSets: '',
    actualReps: '',
    notes: '',
    difficulty: 'Medium' as 'Low' | 'Medium' | 'High'
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = () => {
    setLoading(true);
    const user = authService.getCurrentUser();
    if (user) {
      const db = MockDatabase.getInstance();
      const clientPrograms = db.getProgramsByClient(user.id);
      setPrograms(clientPrograms);
    }
    setLoading(false);
  };

  const handleViewProgram = (program: TrainingProgram) => {
    setSelectedProgram(program);
    setShowProgramDetail(true);
  };

  const handleToggleExerciseCompletion = (exerciseId: string) => {
    if (!selectedProgram) return;

    const updatedExercises = selectedProgram.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    );

    const updatedProgram = { ...selectedProgram, exercises: updatedExercises };

    // Update in database
    const db = MockDatabase.getInstance();
    db.updateProgram(updatedProgram.id, updatedProgram);

    // Update local state
    setSelectedProgram(updatedProgram);
    setPrograms(programs.map(p => p.id === updatedProgram.id ? updatedProgram : p));
  };

  const handleLogExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseLog({
      weight: '',
      actualSets: exercise.sets?.toString() || '',
      actualReps: exercise.reps || '',
      notes: '',
      difficulty: 'Medium'
    });
    setShowExerciseLog(true);
  };

  const handleSaveLog = () => {
    // In a real app, this would save to database
    console.log('Exercise log saved:', {
      exercise: selectedExercise,
      log: exerciseLog,
      date: new Date().toISOString()
    });

    // Mark exercise as completed
    if (selectedExercise) {
      handleToggleExerciseCompletion(selectedExercise.id);
    }

    setShowExerciseLog(false);
    setSelectedExercise(null);
  };

  const handleSendFeedback = () => {
    if (!selectedProgram || !feedback.trim()) return;

    // In a real app, this would send to trainer
    console.log('Feedback sent to trainer:', {
      programId: selectedProgram.id,
      trainerId: selectedProgram.trainerId,
      feedback: feedback,
      date: new Date().toISOString()
    });

    // Show success message
    alert('Feedback sent to your trainer successfully!');
    setShowFeedback(false);
    setFeedback('');
  };

  const calculateProgramProgress = (program: TrainingProgram) => {
    if (program.exercises.length === 0) return 0;
    const completed = program.exercises.filter(ex => ex.completed).length;
    return Math.round((completed / program.exercises.length) * 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Cardio': 'bg-red-100 text-red-800',
      'Strength': 'bg-blue-100 text-blue-800',
      'Flexibility': 'bg-green-100 text-green-800',
      'Balance': 'bg-purple-100 text-purple-800',
      'HIIT': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  const getIntensityColor = (intensity?: string) => {
    if (!intensity) return 'bg-gray-100 text-gray-800';
    const colors: { [key: string]: string } = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[intensity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const groupExercisesByDay = (exercises: Exercise[]) => {
    const grouped: { [key: string]: Exercise[] } = {};
    exercises.forEach(ex => {
      if (!grouped[ex.day]) {
        grouped[ex.day] = [];
      }
      grouped[ex.day].push(ex);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading programs...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Active Programs</CardTitle>
              <Dumbbell className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{programs.filter(p => p.status === 'Active').length}</div>
              <p className="text-xs text-gray-500 mt-1">Training programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Exercises</CardTitle>
              <Activity className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {programs.reduce((sum, p) => sum + p.exercises.length, 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Across all programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Completed</CardTitle>
              <Award className="size-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {programs.reduce((sum, p) => sum + p.exercises.filter(ex => ex.completed).length, 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Exercises completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Programs List */}
        {programs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Dumbbell className="size-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Training Programs Yet</h3>
              <p className="text-gray-500 mb-4">
                You don't have any training programs assigned yet. Your trainer will create a personalized program for you.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {programs.map((program) => {
              const progress = calculateProgramProgress(program);
              const completedCount = program.exercises.filter(ex => ex.completed).length;

              return (
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{program.name}</h3>
                          <Badge className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Trainer and Goal */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Trainer</div>
                        <div className="font-medium">{program.trainerName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Goal</div>
                        <div className="font-medium">{program.goal}</div>
                      </div>
                    </div>

                    {/* Duration and Dates */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-medium">{program.duration} weeks</div>
                      </div>
                      <div>
                        <div className="text-gray-500">End Date</div>
                        <div className="font-medium">
                          {new Date(program.endDate).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {completedCount}/{program.exercises.length} exercises
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">{progress}% complete</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleViewProgram(program)}
                        className="flex-1"
                      >
                        View Program
                        <ChevronRight className="size-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {showProgramDetail && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>{selectedProgram.name}</CardTitle>
                  <Badge className={getStatusColor(selectedProgram.status)}>
                    {selectedProgram.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedProgram.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowProgramDetail(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Program Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Trainer</div>
                  <div className="font-medium">{selectedProgram.trainerName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Goal</div>
                  <div className="font-medium">{selectedProgram.goal}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">{selectedProgram.duration} weeks</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="font-medium">
                    {calculateProgramProgress(selectedProgram)}%
                  </div>
                </div>
              </div>

              {/* Program Notes */}
              {selectedProgram.notes && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="size-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Trainer Notes</div>
                      <p className="text-sm text-blue-800">{selectedProgram.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Exercises by Day */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Exercise Schedule</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedback(true)}
                  >
                    <MessageSquare className="size-4 mr-2" />
                    Send Feedback
                  </Button>
                </div>

                {Object.entries(groupExercisesByDay(selectedProgram.exercises)).map(([day, exercises]) => (
                  <div key={day} className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="size-4" />
                      {day}
                    </h4>
                    <div className="space-y-3">
                      {exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`p-4 border rounded-lg transition-all ${
                            exercise.completed
                              ? 'bg-green-50 border-green-300'
                              : 'bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <button
                                onClick={() => handleToggleExerciseCompletion(exercise.id)}
                                className={`mt-1 flex-shrink-0 size-6 rounded border-2 flex items-center justify-center transition-colors ${
                                  exercise.completed
                                    ? 'bg-green-600 border-green-600'
                                    : 'border-gray-300 hover:border-green-600'
                                }`}
                              >
                                {exercise.completed && (
                                  <CheckCircle className="size-4 text-white" />
                                )}
                              </button>
                              <div className="flex-1">
                                <div className="font-medium">{exercise.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className={getCategoryColor(exercise.category)}>
                                    {exercise.category}
                                  </Badge>
                                  {exercise.intensity && (
                                    <Badge variant="outline" className={getIntensityColor(exercise.intensity)}>
                                      {exercise.intensity}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Exercise Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                            {exercise.sets && (
                              <div>
                                <div className="text-gray-500">Sets</div>
                                <div className="font-medium">{exercise.sets}</div>
                              </div>
                            )}
                            {exercise.reps && (
                              <div>
                                <div className="text-gray-500">Reps</div>
                                <div className="font-medium">{exercise.reps}</div>
                              </div>
                            )}
                            {exercise.duration && (
                              <div>
                                <div className="text-gray-500">Duration</div>
                                <div className="font-medium">{exercise.duration}</div>
                              </div>
                            )}
                          </div>

                          {/* Instructions */}
                          {exercise.instructions && (
                            <p className="text-sm text-gray-600 mb-3">{exercise.instructions}</p>
                          )}

                          {/* Action Button */}
                          {!exercise.completed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLogExercise(exercise)}
                            >
                              <TrendingUp className="size-4 mr-2" />
                              Log Workout
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exercise Log Modal */}
      {showExerciseLog && selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Log Exercise</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowExerciseLog(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium mb-1">{selectedExercise.name}</div>
                <div className="text-sm text-gray-500">{selectedExercise.category}</div>
              </div>

              {selectedExercise.sets && selectedExercise.reps && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="font-medium mb-1">Target</div>
                  <div>{selectedExercise.sets} sets × {selectedExercise.reps} reps</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Actual Sets</Label>
                  <Input
                    type="number"
                    value={exerciseLog.actualSets}
                    onChange={(e) => setExerciseLog({ ...exerciseLog, actualSets: e.target.value })}
                    className="mt-2"
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <Label>Actual Reps</Label>
                  <Input
                    value={exerciseLog.actualReps}
                    onChange={(e) => setExerciseLog({ ...exerciseLog, actualReps: e.target.value })}
                    className="mt-2"
                    placeholder="e.g., 12"
                  />
                </div>
              </div>

              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  value={exerciseLog.weight}
                  onChange={(e) => setExerciseLog({ ...exerciseLog, weight: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <Label>How difficult was it?</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['Low', 'Medium', 'High'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setExerciseLog({ ...exerciseLog, difficulty: level })}
                      className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                        exerciseLog.difficulty === level
                          ? level === 'Low'
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : level === 'Medium'
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={exerciseLog.notes}
                  onChange={(e) => setExerciseLog({ ...exerciseLog, notes: e.target.value })}
                  className="mt-2"
                  placeholder="How did it feel? Any issues?"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowExerciseLog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveLog}
                  className="flex-1"
                >
                  <CheckCircle className="size-4 mr-2" />
                  Save & Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Send Feedback to Trainer</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-900">
                  <strong>Trainer:</strong> {selectedProgram.trainerName}
                </div>
                <div className="text-sm text-blue-900">
                  <strong>Program:</strong> {selectedProgram.name}
                </div>
              </div>

              <div>
                <Label>Your Feedback</Label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2"
                  placeholder="Share your thoughts, ask questions, or report any issues..."
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendFeedback}
                  disabled={!feedback.trim()}
                  className="flex-1"
                >
                  <MessageSquare className="size-4 mr-2" />
                  Send Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
