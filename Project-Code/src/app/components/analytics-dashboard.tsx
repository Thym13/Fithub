import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Award,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { MockDatabase } from '../services/database';

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newMembersThisMonth: 0,
    premiumMembers: 0,
    basicMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalClasses: 0,
    totalBookings: 0,
    totalPrograms: 0,
    activePrograms: 0,
    completedTasks: 0,
    pendingTasks: 0,
    campaignsSent: 0
  });

  const [classStats, setClassStats] = useState<Array<{
    name: string;
    category: string;
    enrolled: number;
    capacity: number;
    utilization: number;
  }>>([]);

  const [revenueByMonth, setRevenueByMonth] = useState<Array<{
    month: string;
    revenue: number;
  }>>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    const db = MockDatabase.getInstance();

    // Get all data
    const users = db.getAllUsers();
    const memberships = db.getAllMemberships();
    const transactions = db.getAllTransactions();
    const classes = db.getAllClasses();
    const bookings = db.getAllBookings();
    const programs = db.getAllPrograms();
    const tasks = db.getAllTasks();
    const campaigns = db.getAllCampaigns();

    // Calculate member statistics
    const members = users.filter(u => u.role === 'member');
    const activeMembers = members.filter(u => u.accountStatus === 'Active').length;

    // New members this month (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMembers = members.filter(m => {
      const createdDate = new Date(m.createdAt || Date.now());
      return createdDate > thirtyDaysAgo;
    }).length;

    // Membership types
    const premiumCount = memberships.filter(m => m.subscriptionType === 'Premium').length;
    const basicCount = memberships.filter(m => m.subscriptionType === 'Basic').length;

    // Revenue statistics
    const completedTransactions = transactions.filter(t => t.status === 'Completed');
    const totalRev = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Monthly revenue (last 30 days)
    const monthlyTrans = completedTransactions.filter(t => {
      const transDate = new Date(t.createdAt);
      return transDate > thirtyDaysAgo;
    });
    const monthlyRev = monthlyTrans.reduce((sum, t) => sum + t.amount, 0);

    // Class statistics
    const classUtilization = classes.map(cls => ({
      name: cls.name,
      category: cls.category,
      enrolled: cls.enrolled,
      capacity: cls.capacity,
      utilization: Math.round((cls.enrolled / cls.capacity) * 100)
    })).sort((a, b) => b.utilization - a.utilization);

    // Program statistics
    const activeProgs = programs.filter(p => p.status === 'Active').length;

    // Task statistics
    const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasksCount = tasks.filter(t => t.status === 'Pending').length;

    // Campaign statistics
    const sentCampaigns = campaigns.filter(c => c.status === 'Sent').length;

    // Revenue by month (simulate last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueData = months.map((month, index) => ({
      month,
      revenue: Math.round(totalRev / 6 + (Math.random() - 0.5) * 1000)
    }));

    setStats({
      totalMembers: members.length,
      activeMembers,
      newMembersThisMonth: newMembers,
      premiumMembers: premiumCount,
      basicMembers: basicCount,
      totalRevenue: totalRev,
      monthlyRevenue: monthlyRev,
      totalClasses: classes.length,
      totalBookings: bookings.length,
      totalPrograms: programs.length,
      activePrograms: activeProgs,
      completedTasks: completedTasksCount,
      pendingTasks: pendingTasksCount,
      campaignsSent: sentCampaigns
    });

    setClassStats(classUtilization);
    setRevenueByMonth(revenueData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Members</CardTitle>
              <Users className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeMembers} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">New This Month</CardTitle>
              <TrendingUp className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newMembersThisMonth}</div>
              <p className="text-xs text-gray-500 mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
              <DollarSign className="size-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Monthly Revenue</CardTitle>
              <Activity className="size-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Membership Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Membership Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Premium Members</CardTitle>
              <Award className="size-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumMembers}</div>
              <div className="mt-2">
                <Progress
                  value={stats.totalMembers > 0 ? (stats.premiumMembers / stats.totalMembers) * 100 : 0}
                  className="h-2"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalMembers > 0 ? Math.round((stats.premiumMembers / stats.totalMembers) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Basic Members</CardTitle>
              <Target className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.basicMembers}</div>
              <div className="mt-2">
                <Progress
                  value={stats.totalMembers > 0 ? (stats.basicMembers / stats.totalMembers) * 100 : 0}
                  className="h-2"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalMembers > 0 ? Math.round((stats.basicMembers / stats.totalMembers) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Active Members</CardTitle>
              <Activity className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMembers}</div>
              <div className="mt-2">
                <Progress
                  value={stats.totalMembers > 0 ? (stats.activeMembers / stats.totalMembers) * 100 : 0}
                  className="h-2"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Activity Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Classes</CardTitle>
              <Calendar className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-gray-500 mt-1">Available classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Class Bookings</CardTitle>
              <Calendar className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Total bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Training Programs</CardTitle>
              <Target className="size-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPrograms}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activePrograms} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Campaigns Sent</CardTitle>
              <Activity className="size-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.campaignsSent}</div>
              <p className="text-xs text-gray-500 mt-1">Marketing campaigns</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Class Utilization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Class Utilization</CardTitle>
            <BarChart3 className="size-5 text-gray-600" />
          </div>
        </CardHeader>
        <CardContent>
          {classStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No classes available
            </div>
          ) : (
            <div className="space-y-4">
              {classStats.slice(0, 10).map((cls) => (
                <div key={cls.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-sm text-gray-500">{cls.category}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {cls.enrolled}/{cls.capacity}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          cls.utilization >= 80 ? 'bg-green-100 text-green-800' :
                          cls.utilization >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {cls.utilization}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={cls.utilization} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
            <PieChart className="size-5 text-gray-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueByMonth.map((data) => {
              const maxRevenue = Math.max(...revenueByMonth.map(d => d.revenue));
              const percentage = (data.revenue / maxRevenue) * 100;

              return (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{data.month}</span>
                    <span className="text-sm font-bold">€{data.revenue.toLocaleString()}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task & Operations Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="font-bold text-green-600">{stats.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="font-bold text-yellow-600">{stats.pendingTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total</span>
                  <span className="font-bold">{stats.completedTasks + stats.pendingTasks}</span>
                </div>
                <Progress
                  value={
                    (stats.completedTasks + stats.pendingTasks) > 0
                      ? (stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100
                      : 0
                  }
                  className="h-2 mt-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(stats.completedTasks + stats.pendingTasks) > 0
                    ? Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100)
                    : 0}% completion rate
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Class Size</span>
                  <span className="font-bold">
                    {stats.totalClasses > 0
                      ? Math.round(classStats.reduce((sum, c) => sum + c.enrolled, 0) / stats.totalClasses)
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Class Utilization</span>
                  <span className="font-bold">
                    {classStats.length > 0
                      ? Math.round(classStats.reduce((sum, c) => sum + c.utilization, 0) / classStats.length)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Revenue/Member</span>
                  <span className="font-bold">
                    €{stats.totalMembers > 0
                      ? Math.round(stats.totalRevenue / stats.totalMembers)
                      : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
