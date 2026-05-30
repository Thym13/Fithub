import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Activity,
  Dumbbell,
  Star,
  MessageSquare,
  Edit,
  CheckCircle,
  Lock,
  TrendingUp
} from 'lucide-react';
import { MockDatabase } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function MemberProfile() {
  const { user, refresh } = useAuth();
  const db = MockDatabase.getInstance();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Edit profile form
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState('');

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Data
  const [membership, setMembership] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [progressRecords, setProgressRecords] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadProfileData();
      setEditName(user.name);
      setEditPhone(user.phone);
      setEditDateOfBirth(user.dateOfBirth);
    }
  }, [user]);

  const loadProfileData = () => {
    if (!user) return;

    // Load membership
    const memberships = db.getAllMemberships();
    const userMembership = memberships.find(m => m.userId === user.id);
    setMembership(userMembership);

    // Load transactions
    const allTransactions = db.getAllTransactions();
    const userTransactions = allTransactions.filter(t => t.userId === user.id);
    setTransactions(userTransactions.slice(0, 10)); // Last 10 transactions

    // Load bookings
    const allBookings = db.getAllBookings();
    const userBookings = allBookings.filter(b => b.userId === user.id);
    setBookings(userBookings);

    // Load programs
    const allPrograms = db.getAllPrograms();
    const userPrograms = allPrograms.filter(p => p.clientId === user.id);
    setPrograms(userPrograms);

    // Load progress records
    const allProgress = db.getAllClientProgress();
    const userProgress = allProgress.filter(p => p.clientId === user.id);
    setProgressRecords(userProgress);

    // Load reviews
    const allReviews = db.getAllReviews();
    const userReviews = allReviews.filter(r => r.userId === user.id);
    setReviews(userReviews);
  };

  const handleSaveProfile = () => {
    if (!user || !editName.trim() || !editPhone.trim() || !editDateOfBirth) {
      alert('Please fill in all fields');
      return;
    }

    const users = db.getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name: editName.trim(),
        phone: editPhone.trim(),
        dateOfBirth: editDateOfBirth,
        updatedAt: new Date().toISOString(),
      };

      db.saveUsers(users);
      refresh(); // Refresh auth context
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    }
  };

  const handleChangePassword = () => {
    if (!user) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (currentPassword !== user.password) {
      alert('Current password is incorrect');
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    const users = db.getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString(),
      };

      db.saveUsers(users);
      refresh();
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully!');
    }
  };

  const getProfileCompletion = (): number => {
    if (!user) return 0;

    let completed = 0;
    const total = 8;

    if (user.name) completed++;
    if (user.email) completed++;
    if (user.phone) completed++;
    if (user.dateOfBirth) completed++;
    if (user.emailVerified) completed++;
    if (membership) completed++;
    if (programs.length > 0) completed++;
    if (bookings.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.accountStatus === 'Active' ? 'default' : 'outline'}>
                    {user.accountStatus}
                  </Badge>
                  {user.emailVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="size-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="size-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Completion */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-gray-600">{getProfileCompletion()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${getProfileCompletion()}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Classes Booked</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Activity className="size-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Training Programs</p>
                    <p className="text-2xl font-bold">{programs.length}</p>
                  </div>
                  <Dumbbell className="size-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Progress Records</p>
                    <p className="text-2xl font-bold">{progressRecords.length}</p>
                  </div>
                  <TrendingUp className="size-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reviews Submitted</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                  <Star className="size-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Membership Tab */}
        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Membership</CardTitle>
            </CardHeader>
            <CardContent>
              {membership ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">{membership.type}</Badge>
                      <p className="text-sm text-gray-600">Status: <span className="font-medium">{membership.status}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">€{membership.monthlyCost}</p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                  </div>
                  {membership.startDate && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">{new Date(membership.startDate).toLocaleDateString()}</p>
                      </div>
                      {membership.endDate && (
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium">{new Date(membership.endDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No active membership</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          {/* Class Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Class Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-2">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Class Booking</p>
                        <p className="text-sm text-gray-600">Booked on {new Date(booking.bookedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={booking.status === 'Confirmed' ? 'default' : 'outline'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No class bookings yet</p>
              )}
            </CardContent>
          </Card>

          {/* Training Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              {programs.length > 0 ? (
                <div className="space-y-2">
                  {programs.map((program) => (
                    <div key={program.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{program.name}</p>
                        <Badge variant={program.status === 'Active' ? 'default' : 'outline'}>
                          {program.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Trainer: {program.trainerName}</p>
                      <p className="text-sm text-gray-600">Duration: {program.duration} weeks</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No training programs yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="size-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">€{transaction.amount.toFixed(2)}</p>
                        <Badge variant={transaction.status === 'Completed' ? 'default' : 'outline'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No transactions yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="size-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-600">Last updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-gray-600">
                      {user.emailVerified ? 'Email verified' : 'Email not verified'}
                    </p>
                  </div>
                </div>
                {user.emailVerified ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="size-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button variant="outline">Verify Email</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={editDateOfBirth}
                onChange={(e) => setEditDateOfBirth(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Email address cannot be changed. Contact support if you need to update your email.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <CheckCircle className="size-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              <Lock className="size-4 mr-2" />
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
