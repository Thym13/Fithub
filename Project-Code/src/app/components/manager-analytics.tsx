import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Clock,
  Award,
  Download,
  Filter,
} from 'lucide-react';
import { MockDatabase } from '../services/database';

export function ManagerAnalytics() {
  const db = MockDatabase.getInstance();
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | '365'>('30');
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    suspendedMembers: 0,
    memberGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    totalClasses: 0,
    averageAttendance: 0,
    totalCheckIns: 0,
    averageSessionTime: 0,
    peakHour: '00:00',
    peakDay: 'Monday',
    topClass: 'N/A',
    membershipDistribution: [] as any[],
    revenueByMonth: [] as any[],
    checkInsByDay: [] as any[],
    checkInsByHour: [] as any[],
    classPopularity: [] as any[],
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Member Analytics
    const allUsers = db.getAllUsers();
    const members = allUsers.filter(u => u.role === 'member');
    const activeMembers = members.filter(u => u.accountStatus === 'Active').length;
    const pendingMembers = members.filter(u => u.accountStatus === 'Pending').length;
    const suspendedMembers = members.filter(u => u.accountStatus === 'Suspended').length;

    // Calculate member growth (compare with previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(timeRange));
    const newMembers = members.filter(m => {
      const created = new Date(m.createdAt);
      return created >= startDate && created <= endDate;
    }).length;
    const previousNewMembers = members.filter(m => {
      const created = new Date(m.createdAt);
      return created >= previousPeriodStart && created < startDate;
    }).length;
    const memberGrowth = previousNewMembers > 0
      ? Math.round(((newMembers - previousNewMembers) / previousNewMembers) * 100)
      : 0;

    // Revenue Analytics
    const allTransactions = db.getAllTransactions();
    const completedTransactions = allTransactions.filter(t =>
      t.status === 'Completed' &&
      new Date(t.createdAt) >= startDate &&
      new Date(t.createdAt) <= endDate
    );
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

    const previousTransactions = allTransactions.filter(t =>
      t.status === 'Completed' &&
      new Date(t.createdAt) >= previousPeriodStart &&
      new Date(t.createdAt) < startDate
    );
    const previousRevenue = previousTransactions.reduce((sum, t) => sum + t.amount, 0);
    const revenueGrowth = previousRevenue > 0
      ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100)
      : 0;

    // Class Analytics
    const allClasses = db.getAllClasses();
    const activeClasses = allClasses.filter(c => c.status === 'Active');
    const totalEnrolled = activeClasses.reduce((sum, c) => sum + c.enrolled, 0);
    const totalCapacity = activeClasses.reduce((sum, c) => sum + c.capacity, 0);
    const averageAttendance = totalCapacity > 0
      ? Math.round((totalEnrolled / totalCapacity) * 100)
      : 0;

    // Check-In Analytics
    const checkInStats = db.getCheckInStats(startDate.toISOString(), endDate.toISOString());

    // Membership Distribution
    const memberships = db.getAllMemberships();
    const activeMemberships = memberships.filter(m => m.status === 'Active');
    const membershipTypes = ['Basic', 'Premium', 'Elite'];
    const membershipDistribution = membershipTypes.map(type => ({
      name: type,
      value: activeMemberships.filter(m => m.type === type).length,
      color: type === 'Basic' ? '#3b82f6' : type === 'Premium' ? '#8b5cf6' : '#f59e0b',
    }));

    // Revenue by Month (last 6 months)
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthTransactions = allTransactions.filter(t => {
        const tDate = new Date(t.createdAt);
        return t.status === 'Completed' && tDate >= monthStart && tDate <= monthEnd;
      });

      const monthRevenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

      revenueByMonth.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue,
      });
    }

    // Check-Ins by Day
    const checkInsByDay = Object.entries(checkInStats.byDay).map(([day, count]) => ({
      day,
      checkIns: count,
    }));

    // Check-Ins by Hour
    const checkInsByHour = Object.entries(checkInStats.byHour)
      .map(([hour, count]) => ({
        hour,
        checkIns: count,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // Class Popularity (top 5 by enrollment)
    const classPopularity = activeClasses
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 5)
      .map(c => ({
        name: c.name,
        enrolled: c.enrolled,
        capacity: c.capacity,
        percentage: Math.round((c.enrolled / c.capacity) * 100),
      }));

    const topClass = classPopularity.length > 0 ? classPopularity[0].name : 'N/A';

    setAnalytics({
      totalMembers: members.length,
      activeMembers,
      pendingMembers,
      suspendedMembers,
      memberGrowth,
      totalRevenue,
      revenueGrowth,
      totalClasses: activeClasses.length,
      averageAttendance,
      totalCheckIns: checkInStats.total,
      averageSessionTime: checkInStats.averageDuration,
      peakHour: checkInStats.peakHour,
      peakDay: checkInStats.peakDay,
      topClass,
      membershipDistribution,
      revenueByMonth,
      checkInsByDay,
      checkInsByHour,
      classPopularity,
    });
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleExportReport = () => {
    alert('Export functionality would generate a PDF/Excel report with all analytics data');
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive business insights and reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-600" />
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExportReport}>
            <Download className="size-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold">{analytics.totalMembers}</p>
                <div className="flex items-center gap-1 mt-1">
                  {analytics.memberGrowth >= 0 ? (
                    <TrendingUp className="size-4 text-green-600" />
                  ) : (
                    <TrendingDown className="size-4 text-red-600" />
                  )}
                  <span className={`text-sm ${analytics.memberGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(analytics.memberGrowth)}%
                  </span>
                </div>
              </div>
              <Users className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {analytics.revenueGrowth >= 0 ? (
                    <TrendingUp className="size-4 text-green-600" />
                  ) : (
                    <TrendingDown className="size-4 text-red-600" />
                  )}
                  <span className={`text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(analytics.revenueGrowth)}%
                  </span>
                </div>
              </div>
              <DollarSign className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold">{analytics.totalClasses}</p>
                <p className="text-sm text-gray-600 mt-1">{analytics.averageAttendance}% avg. attendance</p>
              </div>
              <Calendar className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Check-Ins</p>
                <p className="text-2xl font-bold">{analytics.totalCheckIns}</p>
                <p className="text-sm text-gray-600 mt-1">{formatDuration(analytics.averageSessionTime)} avg.</p>
              </div>
              <Activity className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Active Members</p>
              <p className="text-3xl font-bold text-green-600">{analytics.activeMembers}</p>
              <p className="text-sm text-gray-500 mt-1">
                {analytics.totalMembers > 0
                  ? Math.round((analytics.activeMembers / analytics.totalMembers) * 100)
                  : 0}% of total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600">{analytics.pendingMembers}</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Suspended</p>
              <p className="text-3xl font-bold text-red-600">{analytics.suspendedMembers}</p>
              <p className="text-sm text-gray-500 mt-1">Need attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (€)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Membership Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.membershipDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.membershipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-Ins by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Check-Ins by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.checkInsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="checkIns" fill="#3b82f6" name="Check-Ins" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Peak Day: <span className="font-bold text-blue-600">{analytics.peakDay}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Check-Ins by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Check-Ins by Hour of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.checkInsByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="checkIns" stroke="#8b5cf6" strokeWidth={2} name="Check-Ins" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Peak Hour: <span className="font-bold text-purple-600">{analytics.peakHour}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Popularity */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Most Popular Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.classPopularity.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Award className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No class data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.classPopularity.map((cls, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${index === 0 ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{cls.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {cls.enrolled}/{cls.capacity} ({cls.percentage}%)
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        index === 0 ? 'bg-yellow-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${cls.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="size-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900">Peak Usage Time</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Most members check in on <strong>{analytics.peakDay}</strong> at <strong>{analytics.peakHour}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="size-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-green-900">Revenue Growth</h3>
                  <p className="text-sm text-green-700 mt-1">
                    {analytics.revenueGrowth >= 0 ? 'Up' : 'Down'} <strong>{Math.abs(analytics.revenueGrowth)}%</strong> compared to previous period
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Award className="size-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-purple-900">Most Popular Class</h3>
                  <p className="text-sm text-purple-700 mt-1">
                    <strong>{analytics.topClass}</strong> has the highest enrollment
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Activity className="size-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-900">Average Session</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Members spend an average of <strong>{formatDuration(analytics.averageSessionTime)}</strong> per visit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
