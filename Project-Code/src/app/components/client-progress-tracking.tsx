import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Eye,
  Calendar,
  Weight,
  Activity,
  Target,
  Mail,
  BarChart3,
  User
} from 'lucide-react';
import { MockDatabase, ClientProgress, User as DbUser } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ClientProgressTracking() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [clients, setClients] = useState<DbUser[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [progressRecords, setProgressRecords] = useState<ClientProgress[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<ClientProgress | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    goals: '',
    notes: '',
    exercisePerformance: [] as {
      exerciseName: string;
      sets: number;
      reps: string;
      weight: number;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      notes?: string;
    }[]
  });

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  useEffect(() => {
    if (selectedClientId) {
      loadProgress();
    }
  }, [selectedClientId]);

  const loadClients = () => {
    if (!user) return;
    const trainerClients = db.getTrainerClients(user.id);
    setClients(trainerClients);

    if (trainerClients.length > 0 && !selectedClientId) {
      setSelectedClientId(trainerClients[0].id);
    }
  };

  const loadProgress = () => {
    if (!selectedClientId) return;
    const records = db.getClientProgressByClient(selectedClientId);
    setProgressRecords(records);
  };

  const resetForm = () => {
    setFormData({
      weight: '',
      bodyFat: '',
      muscleMass: '',
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: '',
      goals: '',
      notes: '',
      exercisePerformance: []
    });
  };

  const handleAddProgress = () => {
    if (!user || !selectedClientId) return;

    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (!selectedClient) return;

    const newProgress: Omit<ClientProgress, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: selectedClientId,
      clientName: selectedClient.name,
      trainerId: user.id,
      trainerName: user.name,
      date: new Date().toISOString(),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
      measurements: {
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
      },
      exercisePerformance: formData.exercisePerformance.length > 0 ? formData.exercisePerformance : undefined,
      goals: formData.goals || undefined,
      notes: formData.notes || undefined,
    };

    db.createClientProgress(newProgress);

    // Send email notification to client
    db.sendEmail({
      to: selectedClient.email,
      subject: 'Progress Update Recorded',
      body: `Hi ${selectedClient.name},\n\nYour trainer ${user.name} has recorded your latest progress update.\n\nDate: ${new Date().toLocaleDateString()}\n${formData.weight ? `Weight: ${formData.weight} kg\n` : ''}${formData.bodyFat ? `Body Fat: ${formData.bodyFat}%\n` : ''}${formData.muscleMass ? `Muscle Mass: ${formData.muscleMass} kg\n` : ''}\n${formData.notes ? `Notes: ${formData.notes}\n` : ''}\nKeep up the great work!\n\nBest regards,\nFitHub Team`
    });

    loadProgress();
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercisePerformance: [
        ...formData.exercisePerformance,
        {
          exerciseName: '',
          sets: 1,
          reps: '',
          weight: 0,
          difficulty: 'Medium',
          notes: ''
        }
      ]
    });
  };

  const handleRemoveExercise = (index: number) => {
    const updated = [...formData.exercisePerformance];
    updated.splice(index, 1);
    setFormData({ ...formData, exercisePerformance: updated });
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updated = [...formData.exercisePerformance];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, exercisePerformance: updated });
  };

  const getLatestMetric = (metric: 'weight' | 'bodyFat' | 'muscleMass'): number | null => {
    const sortedRecords = [...progressRecords].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const record of sortedRecords) {
      if (record[metric] !== undefined) {
        return record[metric]!;
      }
    }
    return null;
  };

  const getTrend = (metric: 'weight' | 'bodyFat' | 'muscleMass'): { value: number; direction: 'up' | 'down' | 'stable' } | null => {
    const sortedRecords = [...progressRecords].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const recordsWithMetric = sortedRecords.filter(r => r[metric] !== undefined);

    if (recordsWithMetric.length < 2) return null;

    const latest = recordsWithMetric[0][metric]!;
    const previous = recordsWithMetric[1][metric]!;
    const diff = latest - previous;

    if (Math.abs(diff) < 0.1) return { value: 0, direction: 'stable' };
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'up' : 'down'
    };
  };

  const getChartData = () => {
    return progressRecords
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        weight: record.weight,
        bodyFat: record.bodyFat,
        muscleMass: record.muscleMass,
      }));
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Select Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClient && (
        <>
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-2xl font-bold">
                      {getLatestMetric('weight') !== null ? `${getLatestMetric('weight')} kg` : 'N/A'}
                    </p>
                    {getTrend('weight') && (
                      <div className="flex items-center gap-1 mt-1">
                        {getTrend('weight')!.direction === 'down' && (
                          <>
                            <TrendingDown className="size-4 text-green-600" />
                            <span className="text-sm text-green-600">-{getTrend('weight')!.value.toFixed(1)} kg</span>
                          </>
                        )}
                        {getTrend('weight')!.direction === 'up' && (
                          <>
                            <TrendingUp className="size-4 text-red-600" />
                            <span className="text-sm text-red-600">+{getTrend('weight')!.value.toFixed(1)} kg</span>
                          </>
                        )}
                        {getTrend('weight')!.direction === 'stable' && (
                          <>
                            <Minus className="size-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Stable</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Weight className="size-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Body Fat</p>
                    <p className="text-2xl font-bold">
                      {getLatestMetric('bodyFat') !== null ? `${getLatestMetric('bodyFat')}%` : 'N/A'}
                    </p>
                    {getTrend('bodyFat') && (
                      <div className="flex items-center gap-1 mt-1">
                        {getTrend('bodyFat')!.direction === 'down' && (
                          <>
                            <TrendingDown className="size-4 text-green-600" />
                            <span className="text-sm text-green-600">-{getTrend('bodyFat')!.value.toFixed(1)}%</span>
                          </>
                        )}
                        {getTrend('bodyFat')!.direction === 'up' && (
                          <>
                            <TrendingUp className="size-4 text-red-600" />
                            <span className="text-sm text-red-600">+{getTrend('bodyFat')!.value.toFixed(1)}%</span>
                          </>
                        )}
                        {getTrend('bodyFat')!.direction === 'stable' && (
                          <>
                            <Minus className="size-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Stable</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Activity className="size-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Muscle Mass</p>
                    <p className="text-2xl font-bold">
                      {getLatestMetric('muscleMass') !== null ? `${getLatestMetric('muscleMass')} kg` : 'N/A'}
                    </p>
                    {getTrend('muscleMass') && (
                      <div className="flex items-center gap-1 mt-1">
                        {getTrend('muscleMass')!.direction === 'up' && (
                          <>
                            <TrendingUp className="size-4 text-green-600" />
                            <span className="text-sm text-green-600">+{getTrend('muscleMass')!.value.toFixed(1)} kg</span>
                          </>
                        )}
                        {getTrend('muscleMass')!.direction === 'down' && (
                          <>
                            <TrendingDown className="size-4 text-red-600" />
                            <span className="text-sm text-red-600">-{getTrend('muscleMass')!.value.toFixed(1)} kg</span>
                          </>
                        )}
                        {getTrend('muscleMass')!.direction === 'stable' && (
                          <>
                            <Minus className="size-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Stable</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Target className="size-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold">{progressRecords.length}</p>
                    <p className="text-sm text-gray-600 mt-1">progress entries</p>
                  </div>
                  <BarChart3 className="size-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Charts */}
          {progressRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Weight (kg)" />
                    <Line type="monotone" dataKey="bodyFat" stroke="#f97316" name="Body Fat (%)" />
                    <Line type="monotone" dataKey="muscleMass" stroke="#22c55e" name="Muscle Mass (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Add Progress Button */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" onClick={resetForm}>
                <Plus className="size-4 mr-2" />
                Add Progress Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Progress Record for {selectedClient.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Body Metrics */}
                <div>
                  <h3 className="font-medium mb-3">Body Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 75.5"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Body Fat (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 18.5"
                        value={formData.bodyFat}
                        onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Muscle Mass (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 35.2"
                        value={formData.muscleMass}
                        onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Body Measurements */}
                <div>
                  <h3 className="font-medium mb-3">Body Measurements (cm)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Chest</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 95"
                        value={formData.chest}
                        onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Waist</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 80"
                        value={formData.waist}
                        onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Hips</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 95"
                        value={formData.hips}
                        onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Biceps</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 32"
                        value={formData.biceps}
                        onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Thighs</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 55"
                        value={formData.thighs}
                        onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Exercise Performance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Exercise Performance</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddExercise}>
                      <Plus className="size-4 mr-1" />
                      Add Exercise
                    </Button>
                  </div>

                  {formData.exercisePerformance.length === 0 ? (
                    <p className="text-sm text-gray-600">No exercises added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {formData.exercisePerformance.map((exercise, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Exercise {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveExercise(index)}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label>Exercise Name</Label>
                              <Input
                                placeholder="e.g., Bench Press"
                                value={exercise.exerciseName}
                                onChange={(e) => handleExerciseChange(index, 'exerciseName', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Difficulty</Label>
                              <Select
                                value={exercise.difficulty}
                                onValueChange={(value) => handleExerciseChange(index, 'difficulty', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Easy">Easy</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Sets</Label>
                              <Input
                                type="number"
                                min="1"
                                value={exercise.sets}
                                onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div>
                              <Label>Reps</Label>
                              <Input
                                placeholder="e.g., 8-10"
                                value={exercise.reps}
                                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Weight (kg)</Label>
                              <Input
                                type="number"
                                step="0.5"
                                placeholder="e.g., 60"
                                value={exercise.weight}
                                onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <Input
                                placeholder="Optional notes"
                                value={exercise.notes || ''}
                                onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goals */}
                <div>
                  <Label>Goals</Label>
                  <Textarea
                    placeholder="e.g., Lose 5kg in 2 months, increase bench press to 80kg"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label>Trainer Notes</Label>
                  <Textarea
                    placeholder="Additional observations, recommendations, or feedback"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProgress}>
                  <Mail className="size-4 mr-2" />
                  Save & Notify Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Progress History */}
          <Card>
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
            </CardHeader>
            <CardContent>
              {progressRecords.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No progress records yet. Add the first one!</p>
              ) : (
                <div className="space-y-3">
                  {progressRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <div
                        key={record.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedProgress(record);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="size-4 text-gray-600" />
                              <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              {record.weight && (
                                <div className="flex items-center gap-1">
                                  <Weight className="size-4 text-blue-600" />
                                  <span>{record.weight} kg</span>
                                </div>
                              )}
                              {record.bodyFat && (
                                <div className="flex items-center gap-1">
                                  <Activity className="size-4 text-orange-600" />
                                  <span>{record.bodyFat}% body fat</span>
                                </div>
                              )}
                              {record.muscleMass && (
                                <div className="flex items-center gap-1">
                                  <Target className="size-4 text-green-600" />
                                  <span>{record.muscleMass} kg muscle</span>
                                </div>
                              )}
                            </div>

                            {record.exercisePerformance && record.exercisePerformance.length > 0 && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {record.exercisePerformance.length} exercises logged
                                </Badge>
                              </div>
                            )}
                          </div>

                          <Button variant="ghost" size="sm">
                            <Eye className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Progress Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Progress Details</DialogTitle>
              </DialogHeader>

              {selectedProgress && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Date</h3>
                    <p className="text-gray-700">{new Date(selectedProgress.date).toLocaleDateString()}</p>
                  </div>

                  {(selectedProgress.weight || selectedProgress.bodyFat || selectedProgress.muscleMass) && (
                    <div>
                      <h3 className="font-medium mb-2">Body Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedProgress.weight && (
                          <div className="border rounded-lg p-3">
                            <p className="text-sm text-gray-600">Weight</p>
                            <p className="text-xl font-bold">{selectedProgress.weight} kg</p>
                          </div>
                        )}
                        {selectedProgress.bodyFat && (
                          <div className="border rounded-lg p-3">
                            <p className="text-sm text-gray-600">Body Fat</p>
                            <p className="text-xl font-bold">{selectedProgress.bodyFat}%</p>
                          </div>
                        )}
                        {selectedProgress.muscleMass && (
                          <div className="border rounded-lg p-3">
                            <p className="text-sm text-gray-600">Muscle Mass</p>
                            <p className="text-xl font-bold">{selectedProgress.muscleMass} kg</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedProgress.measurements && Object.values(selectedProgress.measurements).some(v => v !== undefined) && (
                    <div>
                      <h3 className="font-medium mb-2">Body Measurements (cm)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {selectedProgress.measurements.chest && (
                          <div className="border rounded-lg p-2">
                            <p className="text-xs text-gray-600">Chest</p>
                            <p className="font-medium">{selectedProgress.measurements.chest} cm</p>
                          </div>
                        )}
                        {selectedProgress.measurements.waist && (
                          <div className="border rounded-lg p-2">
                            <p className="text-xs text-gray-600">Waist</p>
                            <p className="font-medium">{selectedProgress.measurements.waist} cm</p>
                          </div>
                        )}
                        {selectedProgress.measurements.hips && (
                          <div className="border rounded-lg p-2">
                            <p className="text-xs text-gray-600">Hips</p>
                            <p className="font-medium">{selectedProgress.measurements.hips} cm</p>
                          </div>
                        )}
                        {selectedProgress.measurements.biceps && (
                          <div className="border rounded-lg p-2">
                            <p className="text-xs text-gray-600">Biceps</p>
                            <p className="font-medium">{selectedProgress.measurements.biceps} cm</p>
                          </div>
                        )}
                        {selectedProgress.measurements.thighs && (
                          <div className="border rounded-lg p-2">
                            <p className="text-xs text-gray-600">Thighs</p>
                            <p className="font-medium">{selectedProgress.measurements.thighs} cm</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedProgress.exercisePerformance && selectedProgress.exercisePerformance.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Exercise Performance</h3>
                      <div className="space-y-3">
                        {selectedProgress.exercisePerformance.map((exercise, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{exercise.exerciseName}</h4>
                              <Badge variant={
                                exercise.difficulty === 'Easy' ? 'outline' :
                                exercise.difficulty === 'Medium' ? 'secondary' :
                                'destructive'
                              }>
                                {exercise.difficulty}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Sets</p>
                                <p className="font-medium">{exercise.sets}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Reps</p>
                                <p className="font-medium">{exercise.reps}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Weight</p>
                                <p className="font-medium">{exercise.weight} kg</p>
                              </div>
                            </div>
                            {exercise.notes && (
                              <p className="text-sm text-gray-600 mt-2">Notes: {exercise.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProgress.goals && (
                    <div>
                      <h3 className="font-medium mb-2">Goals</h3>
                      <p className="text-gray-700">{selectedProgress.goals}</p>
                    </div>
                  )}

                  {selectedProgress.notes && (
                    <div>
                      <h3 className="font-medium mb-2">Trainer Notes</h3>
                      <p className="text-gray-700">{selectedProgress.notes}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-4 border-t">
                    <p>Recorded by: {selectedProgress.trainerName}</p>
                    <p>Created: {new Date(selectedProgress.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

    </div>
  );
}