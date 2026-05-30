import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Plus,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
  Target,
  Calendar,
  X,
  Save,
  Edit,
  Trash2
} from 'lucide-react';
import { MockDatabase, BodyCompositionEntry } from '../services/database';

interface BodyCompositionTrackingProps {
  userId?: string;
  userRole?: 'member' | 'trainer';
}

export function BodyCompositionTracking({ userId, userRole = 'member' }: BodyCompositionTrackingProps) {
  const db = MockDatabase.getInstance();
  const [entries, setEntries] = useState<BodyCompositionEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BodyCompositionEntry | null>(null);
  const [timeRange, setTimeRange] = useState<30 | 60 | 90 | 180>(90);

  // Get current user
  const currentUser = userId ? db.findUserById(userId) : db.findUserByEmail('member@fithub.com');

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    bodyFatPercentage: 0,
    muscleMass: 0,
    boneMass: 0,
    waterPercentage: 0,
    visceralFat: 0,
    bmr: 0,
    bmi: 0,
    neck: 0,
    shoulders: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    leftBicep: 0,
    rightBicep: 0,
    leftForearm: 0,
    rightForearm: 0,
    leftThigh: 0,
    rightThigh: 0,
    leftCalf: 0,
    rightCalf: 0,
    notes: '',
    mood: 'Good' as 'Excellent' | 'Good' | 'Neutral' | 'Tired' | 'Poor',
    energyLevel: 7,
    sleepHours: 7
  });

  useEffect(() => {
    loadEntries();
  }, [timeRange]);

  const loadEntries = () => {
    if (!currentUser) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const allEntries = db.getBodyCompositionEntriesByUser(currentUser.id)
      .filter(e => e.date >= cutoffStr);

    setEntries(allEntries);
  };

  const progress = currentUser ? db.getBodyCompositionProgress(currentUser.id, timeRange) : null;

  const handleAddEntry = () => {
    if (!currentUser || formData.weight === 0) {
      alert('Please enter at least weight');
      return;
    }

    const trainer = db.findUserByEmail('trainer@fithub.com');

    db.createBodyCompositionEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      trainerId: trainer?.id,
      trainerName: trainer?.name,
      date: formData.date,
      weight: formData.weight || undefined as any,
      bodyFatPercentage: formData.bodyFatPercentage || undefined,
      muscleMass: formData.muscleMass || undefined,
      boneMass: formData.boneMass || undefined,
      waterPercentage: formData.waterPercentage || undefined,
      visceralFat: formData.visceralFat || undefined,
      bmr: formData.bmr || undefined,
      bmi: formData.bmi || undefined,
      neck: formData.neck || undefined,
      shoulders: formData.shoulders || undefined,
      chest: formData.chest || undefined,
      waist: formData.waist || undefined,
      hips: formData.hips || undefined,
      leftBicep: formData.leftBicep || undefined,
      rightBicep: formData.rightBicep || undefined,
      leftForearm: formData.leftForearm || undefined,
      rightForearm: formData.rightForearm || undefined,
      leftThigh: formData.leftThigh || undefined,
      rightThigh: formData.rightThigh || undefined,
      leftCalf: formData.leftCalf || undefined,
      rightCalf: formData.rightCalf || undefined,
      notes: formData.notes || undefined,
      mood: formData.mood,
      energyLevel: formData.energyLevel || undefined,
      sleepHours: formData.sleepHours || undefined
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      bodyFatPercentage: 0,
      muscleMass: 0,
      boneMass: 0,
      waterPercentage: 0,
      visceralFat: 0,
      bmr: 0,
      bmi: 0,
      neck: 0,
      shoulders: 0,
      chest: 0,
      waist: 0,
      hips: 0,
      leftBicep: 0,
      rightBicep: 0,
      leftForearm: 0,
      rightForearm: 0,
      leftThigh: 0,
      rightThigh: 0,
      leftCalf: 0,
      rightCalf: 0,
      notes: '',
      mood: 'Good',
      energyLevel: 7,
      sleepHours: 7
    });

    setShowAddModal(false);
    loadEntries();
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      db.deleteBodyCompositionEntry(id);
      loadEntries();
    }
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    if (trend === 'increasing') return <TrendingUp className="size-4 text-red-600" />;
    if (trend === 'decreasing') return <TrendingDown className="size-4 text-green-600" />;
    return <Minus className="size-4 text-gray-600" />;
  };

  const getTrendColor = (trend: 'increasing' | 'decreasing' | 'stable', positive: 'increasing' | 'decreasing') => {
    if (trend === positive) return 'text-green-600';
    if (trend === 'stable') return 'text-gray-600';
    return 'text-red-600';
  };

  // Prepare chart data
  const chartData = progress?.measurements.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: progress.measurements.weights[index],
    bodyFat: progress.measurements.bodyFats[index] || null,
    muscleMass: progress.measurements.muscleMasses[index] || null
  })) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Weight Change</CardTitle>
            {progress?.trends.weight && getTrendIcon(progress.trends.weight)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${getTrendColor(progress?.trends.weight || 'stable', 'decreasing')}`}>
              {progress?.weightChange !== undefined ? (
                <>
                  {progress.weightChange > 0 ? '+' : ''}
                  {progress.weightChange.toFixed(1)} kg
                </>
              ) : (
                'N/A'
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Last {timeRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Body Fat %</CardTitle>
            {progress?.trends.bodyFat && getTrendIcon(progress.trends.bodyFat)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${getTrendColor(progress?.trends.bodyFat || 'stable', 'decreasing')}`}>
              {progress?.bodyFatChange !== undefined ? (
                <>
                  {progress.bodyFatChange > 0 ? '+' : ''}
                  {progress.bodyFatChange.toFixed(1)}%
                </>
              ) : (
                'N/A'
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Muscle Mass</CardTitle>
            {progress?.trends.muscleMass && getTrendIcon(progress.trends.muscleMass)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${getTrendColor(progress?.trends.muscleMass || 'stable', 'increasing')}`}>
              {progress?.muscleMassChange !== undefined ? (
                <>
                  {progress.muscleMassChange > 0 ? '+' : ''}
                  {progress.muscleMassChange.toFixed(1)} kg
                </>
              ) : (
                'N/A'
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Entries</CardTitle>
            <Activity className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{progress?.totalEntries || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Measurements</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progress Charts</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Track your body composition over time</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(parseInt(value) as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="size-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-8">
              {/* Weight Chart */}
              <div>
                <h3 className="text-sm font-medium mb-4">Weight (kg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} name="Weight" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Body Fat & Muscle Mass Chart */}
              {chartData.some(d => d.bodyFat || d.muscleMass) && (
                <div>
                  <h3 className="text-sm font-medium mb-4">Body Composition</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="bodyFat" stroke="#ef4444" strokeWidth={2} name="Body Fat %" />
                      <Line type="monotone" dataKey="muscleMass" stroke="#10b981" strokeWidth={2} name="Muscle Mass (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="size-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No entries yet</p>
              <p className="text-sm text-gray-400">Add your first measurement to track progress</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Measurements */}
      {progress?.latestEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Measurements</CardTitle>
            <p className="text-sm text-gray-500">
              Recorded on {new Date(progress.latestEntry.date).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Weight</div>
                <div className="text-lg font-medium">{progress.latestEntry.weight} kg</div>
              </div>
              {progress.latestEntry.bodyFatPercentage && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Body Fat</div>
                  <div className="text-lg font-medium">{progress.latestEntry.bodyFatPercentage}%</div>
                </div>
              )}
              {progress.latestEntry.muscleMass && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Muscle Mass</div>
                  <div className="text-lg font-medium">{progress.latestEntry.muscleMass} kg</div>
                </div>
              )}
              {progress.latestEntry.bmi && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">BMI</div>
                  <div className="text-lg font-medium">{progress.latestEntry.bmi}</div>
                </div>
              )}
              {progress.latestEntry.waist && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Waist</div>
                  <div className="text-lg font-medium">{progress.latestEntry.waist} cm</div>
                </div>
              )}
              {progress.latestEntry.chest && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Chest</div>
                  <div className="text-lg font-medium">{progress.latestEntry.chest} cm</div>
                </div>
              )}
              {progress.latestEntry.hips && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Hips</div>
                  <div className="text-lg font-medium">{progress.latestEntry.hips} cm</div>
                </div>
              )}
              {progress.latestEntry.visceralFat && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Visceral Fat</div>
                  <div className="text-lg font-medium">Level {progress.latestEntry.visceralFat}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entry History */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No entries for the selected time range</p>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        {entry.mood && (
                          <div className="text-sm text-gray-500">Mood: {entry.mood}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Weight:</span> <span className="font-medium">{entry.weight} kg</span>
                    </div>
                    {entry.bodyFatPercentage && (
                      <div>
                        <span className="text-gray-600">Body Fat:</span> <span className="font-medium">{entry.bodyFatPercentage}%</span>
                      </div>
                    )}
                    {entry.muscleMass && (
                      <div>
                        <span className="text-gray-600">Muscle:</span> <span className="font-medium">{entry.muscleMass} kg</span>
                      </div>
                    )}
                    {entry.waist && (
                      <div>
                        <span className="text-gray-600">Waist:</span> <span className="font-medium">{entry.waist} cm</span>
                      </div>
                    )}
                  </div>
                  {entry.notes && (
                    <div className="mt-2 text-sm text-gray-600 italic">"{entry.notes}"</div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Body Composition Entry</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Weight & Body Composition */}
              <div>
                <h3 className="font-medium mb-3">Weight & Body Composition</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Weight (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Body Fat %</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.bodyFatPercentage || ''}
                      onChange={(e) => setFormData({ ...formData, bodyFatPercentage: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Muscle Mass (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.muscleMass || ''}
                      onChange={(e) => setFormData({ ...formData, muscleMass: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>BMI</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.bmi || ''}
                      onChange={(e) => setFormData({ ...formData, bmi: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Body Measurements */}
              <div>
                <h3 className="font-medium mb-3">Body Measurements (cm)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Neck</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.neck || ''}
                      onChange={(e) => setFormData({ ...formData, neck: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Shoulders</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.shoulders || ''}
                      onChange={(e) => setFormData({ ...formData, shoulders: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Chest</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.chest || ''}
                      onChange={(e) => setFormData({ ...formData, chest: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Waist</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.waist || ''}
                      onChange={(e) => setFormData({ ...formData, waist: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Hips</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.hips || ''}
                      onChange={(e) => setFormData({ ...formData, hips: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Left Bicep</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.leftBicep || ''}
                      onChange={(e) => setFormData({ ...formData, leftBicep: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Right Bicep</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.rightBicep || ''}
                      onChange={(e) => setFormData({ ...formData, rightBicep: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Left Thigh</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.leftThigh || ''}
                      onChange={(e) => setFormData({ ...formData, leftThigh: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Wellness Metrics */}
              <div>
                <h3 className="font-medium mb-3">Wellness Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Mood</Label>
                    <Select value={formData.mood} onValueChange={(value: any) => setFormData({ ...formData, mood: value })}>
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
                    <Label>Energy Level (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.energyLevel}
                      onChange={(e) => setFormData({ ...formData, energyLevel: parseInt(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Sleep Hours</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formData.sleepHours}
                      onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How are you feeling? Any observations?"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddEntry}>
                  <Save className="size-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
