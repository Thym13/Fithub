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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  LogIn,
  LogOut,
  Users,
  Clock,
  Activity,
  Calendar,
  UserCheck,
  Search,
  QrCode,
  CreditCard,
  UserCog,
  TrendingUp,
} from 'lucide-react';
import { MockDatabase, CheckIn, User } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function CheckInManagement() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [activeCheckIns, setActiveCheckIns] = useState<CheckIn[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([]);
  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [checkInMethod, setCheckInMethod] = useState<'QR Code' | 'Manual' | 'Card Scan'>('Manual');
  const [checkInNotes, setCheckInNotes] = useState('');
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    currentlyInGym: 0,
    todayTotal: 0,
    todayCompleted: 0,
    averageDuration: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Get active check-ins
    const active = db.getActiveCheckIns();
    setActiveCheckIns(active);

    // Get today's check-ins
    const today = db.getTodaysCheckIns();
    setTodayCheckIns(today);

    // Get all active members
    const users = db.getAllUsers();
    const members = users.filter(u => u.role === 'member' && u.accountStatus === 'Active');
    setAllMembers(members);

    // Calculate stats
    const todayStats = db.getCheckInStats(
      new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      new Date().toISOString()
    );

    setStats({
      currentlyInGym: active.length,
      todayTotal: today.length,
      todayCompleted: today.filter(c => c.status === 'Completed').length,
      averageDuration: todayStats.averageDuration,
    });
  };

  const handleCheckIn = () => {
    if (!selectedMember || !user) return;

    try {
      db.createCheckIn({
        userId: selectedMember,
        method: checkInMethod,
        receptionistId: user.id,
        receptionistName: user.name,
        notes: checkInNotes.trim() || undefined,
      });

      setIsCheckInModalOpen(false);
      setSelectedMember('');
      setCheckInMethod('Manual');
      setCheckInNotes('');
      loadData();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleCheckOut = () => {
    if (!selectedCheckIn) return;

    try {
      db.checkOutMember(selectedCheckIn.id);
      setIsCheckOutModalOpen(false);
      setSelectedCheckIn(null);
      loadData();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleQuickCheckOut = (checkIn: CheckIn) => {
    setSelectedCheckIn(checkIn);
    setIsCheckOutModalOpen(true);
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

  const getCurrentDuration = (checkInTime: string): string => {
    const now = Date.now();
    const start = new Date(checkInTime).getTime();
    const durationMs = now - start;
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    return formatDuration(durationMinutes);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'QR Code':
        return <QrCode className="size-4" />;
      case 'Card Scan':
        return <CreditCard className="size-4" />;
      case 'Manual':
        return <UserCog className="size-4" />;
      default:
        return null;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'QR Code':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><QrCode className="size-3" />QR Code</Badge>;
      case 'Card Scan':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CreditCard className="size-3" />Card Scan</Badge>;
      case 'Manual':
        return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1"><UserCog className="size-3" />Manual</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const filteredMembers = allMembers.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Currently in Gym</p>
                <p className="text-2xl font-bold">{stats.currentlyInGym}</p>
              </div>
              <Users className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Check-Ins</p>
                <p className="text-2xl font-bold">{stats.todayTotal}</p>
              </div>
              <Calendar className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">{stats.todayCompleted}</p>
              </div>
              <UserCheck className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold">{formatDuration(stats.averageDuration)}</p>
              </div>
              <Clock className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
            <Button onClick={() => setIsCheckInModalOpen(true)}>
              <LogIn className="size-4 mr-2" />
              Check In Member
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Active Check-Ins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-green-600" />
            Currently in Gym ({activeCheckIns.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCheckIns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No members currently checked in.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="border border-green-500 bg-green-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{checkIn.userName}</h3>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                        {getMethodBadge(checkIn.method)}
                        <Badge variant="outline">{checkIn.membershipType}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Checked in at {formatTime(checkIn.checkInTime)}</p>
                        <p className="text-gray-500">{checkIn.userEmail}</p>
                        {checkIn.notes && <p className="italic mt-1">Note: {checkIn.notes}</p>}
                        {checkIn.receptionistName && (
                          <p className="mt-1">Checked in by: {checkIn.receptionistName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-2">Duration</div>
                      <div className="text-lg font-bold text-green-600 mb-3">
                        {getCurrentDuration(checkIn.checkInTime)}
                      </div>
                      <Button size="sm" onClick={() => handleQuickCheckOut(checkIn)}>
                        <LogOut className="size-4 mr-1" />
                        Check Out
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Check-Ins */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Check-Ins ({todayCheckIns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {todayCheckIns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No check-ins today yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayCheckIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className={`border rounded-lg p-4 ${
                    checkIn.status === 'Active' ? 'border-green-500 bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{checkIn.userName}</h3>
                        {checkIn.status === 'Active' ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : (
                          <Badge variant="outline">Completed</Badge>
                        )}
                        {getMethodBadge(checkIn.method)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Check-in: {formatTime(checkIn.checkInTime)}</p>
                        {checkIn.checkOutTime && (
                          <p>Check-out: {formatTime(checkIn.checkOutTime)}</p>
                        )}
                        {checkIn.notes && <p className="italic mt-1">Note: {checkIn.notes}</p>}
                      </div>
                    </div>
                    {checkIn.duration !== undefined && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatDuration(checkIn.duration)}
                        </div>
                      </div>
                    )}
                    {checkIn.status === 'Active' && (
                      <div className="text-right ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleQuickCheckOut(checkIn)}>
                          <LogOut className="size-4 mr-1" />
                          Check Out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check-In Modal */}
      <Dialog open={isCheckInModalOpen} onOpenChange={setIsCheckInModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Check In Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Search Member</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 size-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Select Member</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a member..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredMembers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No members found
                    </SelectItem>
                  ) : (
                    filteredMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Check-In Method</Label>
              <Select value={checkInMethod} onValueChange={(value: any) => setCheckInMethod(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QR Code">QR Code</SelectItem>
                  <SelectItem value="Card Scan">Card Scan</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about this check-in..."
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                rows={2}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn} disabled={!selectedMember}>
              <LogIn className="size-4 mr-2" />
              Check In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-Out Modal */}
      <Dialog open={isCheckOutModalOpen} onOpenChange={setIsCheckOutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out Member</DialogTitle>
          </DialogHeader>

          {selectedCheckIn && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">{selectedCheckIn.userName}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Checked in at: {formatTime(selectedCheckIn.checkInTime)}</p>
                  <p>Duration: {getCurrentDuration(selectedCheckIn.checkInTime)}</p>
                  <p>Method: {selectedCheckIn.method}</p>
                  {selectedCheckIn.notes && <p className="italic">Note: {selectedCheckIn.notes}</p>}
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Are you sure you want to check out this member?
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckOutModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckOut}>
              <LogOut className="size-4 mr-2" />
              Confirm Check Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
