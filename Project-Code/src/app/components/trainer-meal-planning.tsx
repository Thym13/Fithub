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
  Edit,
  Trash2,
  Users,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Apple,
  Flame,
  ChevronRight,
  X,
  Save
} from 'lucide-react';
import { MockDatabase, MealPlan, Meal } from '../services/database';

export function TrainerMealPlanning() {
  const db = MockDatabase.getInstance();
  const [myMealPlans, setMyMealPlans] = useState<MealPlan[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMealLibrary, setShowMealLibrary] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');

  // Get current trainer (demo)
  const currentTrainer = db.findUserByEmail('trainer@fithub.com');

  // Form state for creating meal plan
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    goal: 'Weight Loss' as 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Performance',
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFats: 65,
    duration: 30,
    notes: ''
  });

  // Meal library (predefined meals)
  const mealLibrary: Meal[] = [
    {
      id: 'meal-1',
      name: 'Scrambled Eggs with Toast',
      type: 'Breakfast',
      description: 'Protein-rich breakfast',
      calories: 350,
      protein: 25,
      carbs: 30,
      fats: 15,
      ingredients: ['3 eggs', '2 slices whole wheat bread', '1 tbsp butter', 'Salt & pepper'],
      instructions: 'Scramble eggs in butter, serve with toasted bread'
    },
    {
      id: 'meal-2',
      name: 'Greek Yogurt with Berries',
      type: 'Breakfast',
      description: 'Light and nutritious',
      calories: 250,
      protein: 20,
      carbs: 35,
      fats: 5,
      ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '1 tbsp honey', 'Granola'],
      instructions: 'Mix yogurt with berries and honey, top with granola'
    },
    {
      id: 'meal-3',
      name: 'Grilled Chicken Salad',
      type: 'Lunch',
      description: 'High protein, low carb',
      calories: 400,
      protein: 45,
      carbs: 15,
      fats: 18,
      ingredients: ['6oz chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
      instructions: 'Grill chicken, serve over greens with vegetables and dressing'
    },
    {
      id: 'meal-4',
      name: 'Quinoa Buddha Bowl',
      type: 'Lunch',
      description: 'Balanced macros',
      calories: 450,
      protein: 20,
      carbs: 55,
      fats: 15,
      ingredients: ['1 cup quinoa', 'Chickpeas', 'Roasted vegetables', 'Avocado', 'Tahini dressing'],
      instructions: 'Cook quinoa, combine with roasted chickpeas and vegetables, top with avocado and tahini'
    },
    {
      id: 'meal-5',
      name: 'Baked Salmon with Sweet Potato',
      type: 'Dinner',
      description: 'Omega-3 rich',
      calories: 500,
      protein: 40,
      carbs: 45,
      fats: 18,
      ingredients: ['6oz salmon fillet', '1 medium sweet potato', 'Broccoli', 'Lemon', 'Herbs'],
      instructions: 'Bake salmon at 400°F for 15-20 min, roast sweet potato and broccoli'
    },
    {
      id: 'meal-6',
      name: 'Lean Beef Stir-Fry',
      type: 'Dinner',
      description: 'High protein dinner',
      calories: 550,
      protein: 50,
      carbs: 40,
      fats: 20,
      ingredients: ['6oz lean beef', 'Mixed vegetables', 'Brown rice', 'Soy sauce', 'Garlic & ginger'],
      instructions: 'Stir-fry beef with vegetables and aromatics, serve over brown rice'
    },
    {
      id: 'meal-7',
      name: 'Protein Smoothie',
      type: 'Snack',
      description: 'Post-workout recovery',
      calories: 300,
      protein: 30,
      carbs: 35,
      fats: 8,
      ingredients: ['1 scoop protein powder', '1 banana', '1 cup almond milk', 'Spinach', 'Ice'],
      instructions: 'Blend all ingredients until smooth'
    },
    {
      id: 'meal-8',
      name: 'Almonds and Apple',
      type: 'Snack',
      description: 'Healthy snack',
      calories: 200,
      protein: 6,
      carbs: 25,
      fats: 10,
      ingredients: ['1 medium apple', '20 almonds'],
      instructions: 'Slice apple, enjoy with almonds'
    },
    {
      id: 'meal-9',
      name: 'Oatmeal with Protein',
      type: 'Breakfast',
      description: 'Energy breakfast',
      calories: 400,
      protein: 25,
      carbs: 50,
      fats: 12,
      ingredients: ['1 cup oats', '1 scoop protein powder', 'Banana', 'Peanut butter', 'Cinnamon'],
      instructions: 'Cook oats, stir in protein powder, top with banana and peanut butter'
    },
    {
      id: 'meal-10',
      name: 'Turkey Wrap',
      type: 'Lunch',
      description: 'Quick and easy',
      calories: 380,
      protein: 35,
      carbs: 40,
      fats: 10,
      ingredients: ['Whole wheat tortilla', '4oz turkey breast', 'Lettuce', 'Tomato', 'Mustard'],
      instructions: 'Layer turkey and vegetables in tortilla, add mustard, wrap and slice'
    }
  ];

  useEffect(() => {
    loadMealPlans();
  }, [filterStatus]);

  const loadMealPlans = () => {
    if (!currentTrainer) return;

    let plans = db.getMealPlansByTrainer(currentTrainer.id);

    if (filterStatus !== 'All') {
      plans = plans.filter(plan => plan.status === filterStatus);
    }

    setMyMealPlans(plans);
  };

  const handleCreatePlan = () => {
    if (!currentTrainer || !formData.clientId || !formData.name) {
      alert('Please fill in required fields');
      return;
    }

    const client = db.findUserById(formData.clientId);
    if (!client) {
      alert('Client not found');
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    db.createMealPlan({
      name: formData.name,
      description: formData.description,
      trainerId: currentTrainer.id,
      trainerName: currentTrainer.name,
      clientId: formData.clientId,
      clientName: client.name,
      goal: formData.goal,
      dailyCalories: formData.dailyCalories,
      dailyProtein: formData.dailyProtein,
      dailyCarbs: formData.dailyCarbs,
      dailyFats: formData.dailyFats,
      duration: formData.duration,
      startDate,
      endDate,
      notes: formData.notes
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      clientId: '',
      goal: 'Weight Loss',
      dailyCalories: 2000,
      dailyProtein: 150,
      dailyCarbs: 200,
      dailyFats: 65,
      duration: 30,
      notes: ''
    });

    setShowCreateModal(false);
    loadMealPlans();
  };

  const handleAddMealToPlan = (meal: Meal) => {
    if (!selectedPlan) return;

    db.addMealToPlan(selectedPlan.id, selectedDay, meal);

    // Reload the selected plan
    const updatedPlan = db.getMealPlansByTrainer(currentTrainer?.id || '').find(p => p.id === selectedPlan.id);
    setSelectedPlan(updatedPlan || null);
    setShowMealLibrary(false);
    loadMealPlans();
  };

  const handleRemoveMeal = (mealId: string) => {
    if (!selectedPlan) return;

    db.removeMealFromPlan(selectedPlan.id, selectedDay, mealId);

    // Reload the selected plan
    const updatedPlan = db.getMealPlansByTrainer(currentTrainer?.id || '').find(p => p.id === selectedPlan.id);
    setSelectedPlan(updatedPlan || null);
    loadMealPlans();
  };

  const handleCompletePlan = (planId: string) => {
    db.completeMealPlan(planId);
    loadMealPlans();
    if (selectedPlan?.id === planId) {
      setSelectedPlan(null);
      setShowEditModal(false);
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this meal plan?')) {
      db.deleteMealPlan(planId);
      loadMealPlans();
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
        setShowEditModal(false);
      }
    }
  };

  // Get all clients
  const clients = db.getAllUsers().filter(u => u.role === 'Member');

  // Get stats
  const stats = {
    totalPlans: myMealPlans.length,
    activePlans: myMealPlans.filter(p => p.status === 'Active').length,
    completedPlans: myMealPlans.filter(p => p.status === 'Completed').length,
    totalClients: new Set(myMealPlans.map(p => p.clientId)).size
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Plans</CardTitle>
            <Apple className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalPlans}</div>
            <p className="text-xs text-gray-500 mt-1">All meal plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Plans</CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activePlans}</div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.completedPlans}</div>
            <p className="text-xs text-gray-500 mt-1">Finished plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Clients</CardTitle>
            <Users className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalClients}</div>
            <p className="text-xs text-gray-500 mt-1">With meal plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meal Plans</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Create and manage meal plans for your clients</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="size-4 mr-2" />
              Create Meal Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter */}
          <div className="mb-4 flex items-center gap-2">
            <Label>Filter:</Label>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Plans</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meal Plans List */}
          <div className="space-y-3">
            {myMealPlans.length === 0 ? (
              <div className="text-center py-12">
                <Apple className="size-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No meal plans yet</p>
                <p className="text-sm text-gray-400">Create your first meal plan to get started</p>
              </div>
            ) : (
              myMealPlans.map(plan => (
                <div key={plan.id} className="p-4 border rounded-lg hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{plan.name}</h3>
                        <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                        <Badge variant="outline">{plan.goal}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          {plan.clientName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {plan.startDate} to {plan.endDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="size-4" />
                          {plan.dailyCalories} cal/day
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit className="size-4 mr-1" />
                        Edit
                      </Button>
                      {plan.status === 'Active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompletePlan(plan.id)}
                        >
                          <CheckCircle className="size-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Meal Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Meal Plan</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Plan Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Weight Loss Program"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the meal plan..."
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Goal</Label>
                  <Select value={formData.goal} onValueChange={(value: any) => setFormData({ ...formData, goal: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                      <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Daily Calories</Label>
                  <Input
                    type="number"
                    value={formData.dailyCalories}
                    onChange={(e) => setFormData({ ...formData, dailyCalories: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={formData.dailyProtein}
                    onChange={(e) => setFormData({ ...formData, dailyProtein: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Carbs (g)</Label>
                  <Input
                    type="number"
                    value={formData.dailyCarbs}
                    onChange={(e) => setFormData({ ...formData, dailyCarbs: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Fats (g)</Label>
                  <Input
                    type="number"
                    value={formData.dailyFats}
                    onChange={(e) => setFormData({ ...formData, dailyFats: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or instructions..."
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreatePlan}>
                  <Save className="size-4 mr-2" />
                  Create Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Meal Plan Modal */}
      {showEditModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedPlan.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Client: {selectedPlan.clientName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Goal</div>
                  <div className="font-medium">{selectedPlan.goal}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">{selectedPlan.duration} days</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Daily Calories</div>
                  <div className="font-medium">{selectedPlan.dailyCalories} cal</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Macros</div>
                  <div className="font-medium">
                    P: {selectedPlan.dailyProtein}g | C: {selectedPlan.dailyCarbs}g | F: {selectedPlan.dailyFats}g
                  </div>
                </div>
              </div>

              {/* Weekly Meals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Weekly Meal Plan</h3>
                  <Button size="sm" onClick={() => setShowMealLibrary(true)}>
                    <Plus className="size-4 mr-2" />
                    Add Meal
                  </Button>
                </div>

                <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                  <TabsList className="grid grid-cols-7 w-full">
                    {daysOfWeek.map(day => (
                      <TabsTrigger key={day} value={day} className="text-xs">
                        {day.slice(0, 3)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {daysOfWeek.map(day => (
                    <TabsContent key={day} value={day} className="space-y-3 mt-4">
                      {selectedPlan.meals[day] && selectedPlan.meals[day].length > 0 ? (
                        selectedPlan.meals[day].map(meal => (
                          <div key={meal.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{meal.type}</Badge>
                                  <h4 className="font-medium">{meal.name}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{meal.calories} cal</span>
                                  <span>P: {meal.protein}g</span>
                                  <span>C: {meal.carbs}g</span>
                                  <span>F: {meal.fats}g</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMeal(meal.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Apple className="size-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No meals for {day}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => setShowMealLibrary(true)}
                          >
                            Add Meal
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Meal Library Modal */}
      {showMealLibrary && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meal Library</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Select meals to add to {selectedDay}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowMealLibrary(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mealLibrary.map(meal => (
                  <div key={meal.id} className="p-4 border rounded-lg hover:border-blue-400 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{meal.type}</Badge>
                          <h4 className="font-medium">{meal.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Flame className="size-4" />
                            {meal.calories} cal
                          </span>
                          <span>Protein: {meal.protein}g</span>
                          <span>Carbs: {meal.carbs}g</span>
                          <span>Fats: {meal.fats}g</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddMealToPlan(meal)}
                      >
                        <Plus className="size-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
