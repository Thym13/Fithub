import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Clock,
  Calendar,
  TrendingUp,
  Activity,
  LogIn,
  LogOut,
} from 'lucide-react';
import { MockDatabase, CheckIn } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function MemberCheckInHistory() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<CheckIn | null>(null);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalTime: 0,
    averageTime: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    if (user) {
      loadCheckInData();
    }
  }, [user]);

  const loadCheckInData = () => {
    if (!user) return;

    // Get all check-ins for this member
    const allCheckIns = db.getMemberCheckInHistory(user.id);
    setCheckIns(allCheckIns.slice(0, 10)); // Show last 10 check-ins

    // Get active check-in
    const active = allCheckIns.find(c => c.status === 'Active');
    setActiveCheckIn(active || null);

    // Calculate stats
    const totalVisits = db.getMemberCheckInCount(user.id);
    const totalTime = db.getMemberTotalGymTime(user.id);
    const completedCheckIns = allCheckIns.filter(c => c.duration);
    const averageTime = completedCheckIns.length > 0
      ? Math.floor(totalTime / completedCheckIns.length)
      : 0;

    // This week check-ins
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = allCheckIns.filter(c => new Date(c.checkInTime) >= oneWeekAgo).length;

    // This month check-ins
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const thisMonth = allCheckIns.filter(c => new Date(c.checkInTime) >= oneMonthAgo).length;

    setStats({
      totalVisits,
      totalTime,
      averageTime,
      thisWeek,
      thisMonth,
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'QR Code':
        return <Badge className="bg-blue-100 text-blue-800">QR Code</Badge>;
      case 'Card Scan':
        return <Badge className="bg-green-100 text-green-800">Card Scan</Badge>;
      case 'Manual':
        return <Badge className="bg-purple-100 text-purple-800">Manual</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Check-In Alert */}
      {activeCheckIn && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-500 text-white rounded-full">
                <Activity className="size-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-900 mb-1">You're Currently Checked In!</h3>
                <p className="text-sm text-green-700">
                  Checked in at {formatTime(activeCheckIn.checkInTime)} via {activeCheckIn.method}
                </p>
                {activeCheckIn.notes && (
                  <p className="text-sm text-green-600 mt-1 italic">Note: {activeCheckIn.notes}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">Duration</div>
                <div className="text-lg font-bold text-green-900">
                  {formatDuration(Math.floor((Date.now() - new Date(activeCheckIn.checkInTime).getTime()) / (1000 * 60)))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold">{stats.totalVisits}</p>
              </div>
              <Calendar className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{formatDuration(stats.totalTime)}</p>
              </div>
              <Clock className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold">{formatDuration(stats.averageTime)}</p>
              </div>
              <TrendingUp className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
              </div>
              <Activity className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-In History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-Ins</CardTitle>
        </CardHeader>
        <CardContent>
          {checkIns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No check-in history yet.</p>
              <p className="text-sm mt-1">Check in at the reception to start tracking your gym visits!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className={`border rounded-lg p-4 ${
                    checkIn.status === 'Active' ? 'border-green-500 bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{formatDate(checkIn.checkInTime)}</h3>
                        {checkIn.status === 'Active' && (
                          <Badge className="bg-green-500 text-white">Currently Active</Badge>
                        )}
                        {getMethodBadge(checkIn.method)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <LogIn className="size-3" />
                          Check-in: {formatTime(checkIn.checkInTime)}
                        </span>
                        {checkIn.checkOutTime && (
                          <span className="flex items-center gap-1">
                            <LogOut className="size-3" />
                            Check-out: {formatTime(checkIn.checkOutTime)}
                          </span>
                        )}
                      </div>
                      {checkIn.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">Note: {checkIn.notes}</p>
                      )}
                      {checkIn.receptionistName && (
                        <p className="text-sm text-gray-500 mt-1">
                          Checked in by: {checkIn.receptionistName}
                        </p>
                      )}
                    </div>
                    {checkIn.duration !== undefined && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatDuration(checkIn.duration)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Month's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
              <div className="text-sm text-gray-600">Gym Visits</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((stats.thisMonth / 30) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Daily Average</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatDuration(stats.averageTime)}</div>
              <div className="text-sm text-gray-600">Avg. Session Length</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
