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
  DialogFooter,
} from './ui/dialog';
import { Progress } from './ui/progress';
import {
  Apple,
  TrendingUp,
  Calendar,
  Droplet,
  Plus,
  Eye,
  Target,
  Utensils,
} from 'lucide-react';
import { MockDatabase, MealPlan, NutritionLog } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function MemberNutrition() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [todayLog, setTodayLog] = useState<NutritionLog | null>(null);
  const [nutritionStats, setNutritionStats] = useState({
    averageCalories: 0,
    averageProtein: 0,
    averageCarbs: 0,
    averageFats: 0,
    averageWater: 0,
    totalLogs: 0,
    adherenceRate: 0,
  });
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      loadNutritionData();
    }
  }, [user]);

  const loadNutritionData = () => {
    if (!user) return;

    // Get active meal plan
    const activePlan = db.getActiveMealPlanForClient(user.id);
    setMealPlan(activePlan);

    // Get today's nutrition log
    const today = new Date().toISOString().split('T')[0];
    const log = db.getNutritionLogByDate(user.id, today);
    setTodayLog(log);
    if (log) {
      setWaterIntake(log.waterIntake);
      setNotes(log.notes || '');
    }

    // Get nutrition stats
    const stats = db.getNutritionStats(user.id, 7);
    setNutritionStats(stats);
  };

  const handleLogMeal = () => {
    if (!user || !mealPlan) return;

    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMeals = mealPlan.meals[dayOfWeek] || [];

    // Create or update nutrition log
    const meals = todayMeals.map(m => ({
      mealId: m.id,
      name: m.name,
      type: m.type,
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs,
      fats: m.fats,
    }));

    if (todayLog) {
      // Update existing log
      db.updateNutritionLog(todayLog.id, {
        meals,
        waterIntake,
        notes: notes.trim() || undefined,
      });
    } else {
      // Create new log
      db.createNutritionLog({
        userId: user.id,
        userName: user.name,
        mealPlanId: mealPlan.id,
        date: today,
        meals,
        waterIntake,
        notes: notes.trim() || undefined,
      });
    }

    setIsLogModalOpen(false);
    loadNutritionData();
  };

  const getMacroPercentage = (current: number, target: number): number => {
    return target > 0 ? Math.round((current / target) * 100) : 0;
  };

  const getDaysOfWeek = () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getDayMeals = (day: string) => {
    if (!mealPlan || !mealPlan.meals[day]) return [];
    return mealPlan.meals[day];
  };

  const getDayTotals = (day: string) => {
    const meals = getDayMeals(day);
    return {
      calories: meals.reduce((sum, m) => sum + m.calories, 0),
      protein: meals.reduce((sum, m) => sum + m.protein, 0),
      carbs: meals.reduce((sum, m) => sum + m.carbs, 0),
      fats: meals.reduce((sum, m) => sum + m.fats, 0),
    };
  };

  const getMealTypeBadge = (type: string) => {
    switch (type) {
      case 'Breakfast':
        return <Badge className="bg-yellow-100 text-yellow-800">Breakfast</Badge>;
      case 'Lunch':
        return <Badge className="bg-blue-100 text-blue-800">Lunch</Badge>;
      case 'Dinner':
        return <Badge className="bg-purple-100 text-purple-800">Dinner</Badge>;
      case 'Snack':
        return <Badge className="bg-green-100 text-green-800">Snack</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (!mealPlan) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center text-gray-500">
              <Apple className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No active meal plan</p>
              <p className="text-sm mt-2">Contact your trainer to create a personalized nutrition plan!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayDayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayTotals = todayLog ? {
    calories: todayLog.totalCalories,
    protein: todayLog.totalProtein,
    carbs: todayLog.totalCarbs,
    fats: todayLog.totalFats,
  } : getDayTotals(todayDayOfWeek);

  return (
    <div className="space-y-6">
      {/* Meal Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{mealPlan.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{mealPlan.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white">{mealPlan.goal}</Badge>
              <Badge variant="outline">
                {mealPlan.duration} weeks
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Daily Calories</p>
              <p className="text-2xl font-bold text-blue-600">{mealPlan.dailyCalories}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-2xl font-bold text-green-600">{mealPlan.dailyProtein}g</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-2xl font-bold text-purple-600">{mealPlan.dailyCarbs}g</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Fats</p>
              <p className="text-2xl font-bold text-orange-600">{mealPlan.dailyFats}g</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Trainer:</span> {mealPlan.trainerName}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Duration:</span> {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
            </p>
            {mealPlan.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">
                <span className="font-medium">Notes:</span> {mealPlan.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Nutrition</CardTitle>
            <Button onClick={() => setIsLogModalOpen(true)}>
              <Plus className="size-4 mr-2" />
              Log Today's Meals
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Calories</span>
                <span className="text-sm font-medium">
                  {todayTotals.calories} / {mealPlan.dailyCalories} kcal
                </span>
              </div>
              <Progress
                value={getMacroPercentage(todayTotals.calories, mealPlan.dailyCalories)}
                className="h-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Protein</span>
                <span className="text-sm font-medium">
                  {todayTotals.protein}g / {mealPlan.dailyProtein}g
                </span>
              </div>
              <Progress
                value={getMacroPercentage(todayTotals.protein, mealPlan.dailyProtein)}
                className="h-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Carbs</span>
                <span className="text-sm font-medium">
                  {todayTotals.carbs}g / {mealPlan.dailyCarbs}g
                </span>
              </div>
              <Progress
                value={getMacroPercentage(todayTotals.carbs, mealPlan.dailyCarbs)}
                className="h-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Fats</span>
                <span className="text-sm font-medium">
                  {todayTotals.fats}g / {mealPlan.dailyFats}g
                </span>
              </div>
              <Progress
                value={getMacroPercentage(todayTotals.fats, mealPlan.dailyFats)}
                className="h-3"
              />
            </div>

            {todayLog && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <Droplet className="size-5 text-blue-600" />
                <span className="text-sm text-gray-600">Water Intake:</span>
                <span className="text-sm font-medium">{todayLog.waterIntake}ml</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Avg. Calories</p>
              <p className="text-xl font-bold">{nutritionStats.averageCalories}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Avg. Protein</p>
              <p className="text-xl font-bold">{nutritionStats.averageProtein}g</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Avg. Water</p>
              <p className="text-xl font-bold">{nutritionStats.averageWater}ml</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Adherence</p>
              <p className="text-xl font-bold">{nutritionStats.adherenceRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Meal Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {getDaysOfWeek().map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDay(day)}
                className={day === todayDayOfWeek ? 'border-blue-500' : ''}
              >
                {day}
                {day === todayDayOfWeek && <span className="ml-1 text-xs">(Today)</span>}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {getDayMeals(selectedDay).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Utensils className="size-8 mx-auto mb-2 text-gray-400" />
                <p>No meals planned for {selectedDay}</p>
              </div>
            ) : (
              getDayMeals(selectedDay).map((meal) => (
                <div key={meal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{meal.name}</h3>
                        {getMealTypeBadge(meal.type)}
                      </div>
                      <p className="text-sm text-gray-600">{meal.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-3 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Calories</p>
                      <p className="font-bold">{meal.calories}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Protein</p>
                      <p className="font-bold">{meal.protein}g</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Carbs</p>
                      <p className="font-bold">{meal.carbs}g</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Fats</p>
                      <p className="font-bold">{meal.fats}g</p>
                    </div>
                  </div>

                  {meal.ingredients && meal.ingredients.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Ingredients:</p>
                      <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                        {meal.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {meal.instructions && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Instructions:</p>
                      <p className="text-sm text-gray-600 mt-1">{meal.instructions}</p>
                    </div>
                  )}
                </div>
              ))
            )}

            {getDayMeals(selectedDay).length > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-gray-600">Total Calories</p>
                    <p className="font-bold text-blue-600">{getDayTotals(selectedDay).calories}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-gray-600">Total Protein</p>
                    <p className="font-bold text-green-600">{getDayTotals(selectedDay).protein}g</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-gray-600">Total Carbs</p>
                    <p className="font-bold text-purple-600">{getDayTotals(selectedDay).carbs}g</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <p className="text-gray-600">Total Fats</p>
                    <p className="font-bold text-orange-600">{getDayTotals(selectedDay).fats}g</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Meal Modal */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Today's Nutrition</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Log your meals for today based on your meal plan. This will track your adherence and progress.
            </p>

            <div>
              <Label>Water Intake (ml)</Label>
              <Input
                type="number"
                value={waterIntake}
                onChange={(e) => setWaterIntake(parseInt(e.target.value) || 0)}
                placeholder="2000"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 2000-3000ml per day</p>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel today? Any observations..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogMeal}>
              Log Meals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
