import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockClasses } from '../utils/mockData';
import { DiscountCodeSection } from './discount-code-section';
import { GymEvaluation } from './gym-evaluation';
import { CustomerSupport } from './customer-support';
import { useEffect, useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent } from './ui/tabs';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Users, 
  X, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  TrendingUp,
  Target,
  Dumbbell,
  MessageSquare,
  Award
} from 'lucide-react';

export function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [showWaitlistConfirmation, setShowWaitlistConfirmation] = useState(false);
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [waitlistPosition, setWaitlistPosition] = useState(0);
  const [hasValidSubscription, setHasValidSubscription] = useState(true); // Toggle for testing
  
  // Listen for hash changes to sync with hamburger menu navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['overview', 'classes', 'progress', 'schedule', 'membership'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    
    // Set initial tab from hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Simulated member data
  const memberData = {
    name: 'John Smith',
    membershipType: 'Premium',
    memberSince: 'Jan 2024',
    expiryDate: '2026-01-15',
    trainer: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  };

  const progressData = [
    { week: 'Week 1', weight: 180 },
    { week: 'Week 2', weight: 179 },
    { week: 'Week 3', weight: 178 },
    { week: 'Week 4', weight: 177 },
    { week: 'Week 5', weight: 176 },
    { week: 'Week 6', weight: 175 }
  ];

  const myBookings = [
    { id: '1', class: 'Morning Yoga', day: 'Monday', time: '07:00 AM', instructor: 'Sarah Johnson' },
    { id: '2', class: 'HIIT Training', day: 'Wednesday', time: '06:00 PM', instructor: 'Mike Chen' }
  ];

  const upcomingSessions = [
    { id: '1', type: 'Personal Training', date: '2026-03-21', time: '10:00 AM', trainer: 'Sarah Johnson' },
    { id: '2', type: 'Personal Training', date: '2026-03-25', time: '10:00 AM', trainer: 'Sarah Johnson' }
  ];

  const memberTabs = [
    { id: 'overview', label: 'Overview', path: '#overview' },
    { id: 'classes', label: 'Book Classes', path: '#classes' },
    { id: 'progress', label: 'My Progress', path: '#progress' },
    { id: 'schedule', label: 'My Schedule', path: '#schedule' },
    { id: 'membership', label: 'Membership', path: '#membership' }
  ];

  // Booking handlers
  const handleClassClick = (cls: any) => {
    setSelectedClass(cls);
    setShowClassDetail(true);
  };

  const handleBookClass = () => {
    if (!selectedClass) return;

    // Check subscription status (Alternative Flow 2)
    if (!hasValidSubscription) {
      setShowClassDetail(false);
      setShowSubscriptionWarning(true);
      return;
    }

    const spotsLeft = selectedClass.capacity - selectedClass.enrolled;
    
    // Check availability (Alternative Flow 1)
    if (spotsLeft <= 0) {
      setShowClassDetail(false);
      setWaitlistPosition(Math.floor(Math.random() * 5) + 1);
      setShowWaitlistConfirmation(true);
      return;
    }

    // Basic Flow - Book normally
    setShowClassDetail(false);
    setBookingMessage(`Your booking for "${selectedClass.name}" on ${selectedClass.day} at ${selectedClass.time} has been confirmed!`);
    setShowBookingConfirmation(true);
    
    // Simulate notification to secretary and instructor
    console.log('Notification sent to Secretary and Instructor:', selectedClass);
  };

  const handleJoinWaitlist = () => {
    setShowWaitlistConfirmation(false);
    setBookingMessage(`You have been added to the waitlist for "${selectedClass?.name}". Your position: #${waitlistPosition}. We'll notify you if a spot opens up!`);
    setShowBookingConfirmation(true);
    
    // Simulate notification
    console.log('Waitlist notification sent to Secretary and Instructor:', selectedClass);
  };

  const handlePayment = (paymentType: string) => {
    // Process payment
    setShowPaymentModal(false);
    setHasValidSubscription(true); // Update subscription status
    
    if (paymentType === 'subscription') {
      setBookingMessage(`Your ${memberData.membershipType} subscription has been renewed! Proceeding with class booking...`);
    } else {
      setBookingMessage('Single session payment processed! Proceeding with class booking...');
    }
    
    setShowBookingConfirmation(true);
    
    // Auto-book after payment
    setTimeout(() => {
      setShowBookingConfirmation(false);
      handleBookClass();
    }, 2000);
  };

  return (
    <DashboardLayout title="My Fitness Journey" role="Member" tabs={memberTabs}>
      {/* Class Detail Modal */}
      {showClassDetail && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedClass.name}</CardTitle>
                <p className="text-gray-500 mt-1">{selectedClass.instructor}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowClassDetail(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-4">{selectedClass.category}</Badge>
                <p className="text-gray-700">
                  This class is designed to help you achieve your fitness goals through structured training and expert guidance. 
                  Perfect for all skill levels, our instructor will guide you through every step of the way.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Day</div>
                    <div className="font-medium">{selectedClass.day}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium">{selectedClass.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="size-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{selectedClass.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-500">Availability</div>
                    <div className="font-medium">{selectedClass.capacity - selectedClass.enrolled}/{selectedClass.capacity} spots</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Class Details</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Professional instruction from certified trainers</li>
                  <li>✓ All equipment provided</li>
                  <li>✓ Suitable for all fitness levels</li>
                  <li>✓ Free cancellation up to 2 hours before class</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowClassDetail(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleBookClass}>
                  {selectedClass.capacity - selectedClass.enrolled <= 0 ? 'Join Waitlist' : 'Book Course'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">{bookingMessage}</p>
              <Button onClick={() => setShowBookingConfirmation(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Waitlist Confirmation Modal */}
      {showWaitlistConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-6 text-yellow-600" />
                Class Full - Join Waitlist?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                This class is currently full. Would you like to join the waitlist? You'll be notified if a spot opens up.
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Your waitlist position</div>
                <div className="text-2xl font-medium text-blue-600">#{waitlistPosition}</div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowWaitlistConfirmation(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleJoinWaitlist}>
                  Join Waitlist
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Note: Waitlist registrations are removed 30 minutes before class time if no spots open up.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Warning Modal */}
      {showSubscriptionWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-6 text-red-600" />
                Subscription Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You don't have a valid subscription to attend this class. Please renew your subscription or pay for a single session.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setShowSubscriptionWarning(false);
                    setShowPaymentModal(true);
                  }}
                >
                  <CreditCard className="size-4 mr-2" />
                  Renew Subscription ($99.99/month)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowSubscriptionWarning(false);
                    handlePayment('single');
                  }}
                >
                  Pay for Single Session ($15)
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setShowSubscriptionWarning(false)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Renew Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">{memberData.membershipType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-2xl font-medium">$99.99</span>
                </div>
              </div>

              <div>
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select payment method..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => handlePayment('subscription')}>
                  Complete Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="overview" className="space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={memberData.avatar} alt={memberData.name} className="size-16 rounded-full" />
                  <div>
                    <h2 className="text-2xl">Welcome back, {memberData.name}! 💪</h2>
                    <p className="text-gray-500">Keep up the great work!</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {memberData.membershipType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">This Week</CardTitle>
                <Activity className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">5 Workouts</div>
                <p className="text-xs text-gray-500 mt-1">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Weight Progress</CardTitle>
                <TrendingUp className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">-5 lbs</div>
                <p className="text-xs text-gray-500 mt-1">Since joining</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Visits</CardTitle>
                <Calendar className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">145</div>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Goal Progress</CardTitle>
                <Target className="size-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">75%</div>
                <p className="text-xs text-gray-500 mt-1">On track!</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 text-white rounded-full">
                      <Dumbbell className="size-5" />
                    </div>
                    <div>
                      <div className="font-medium">Personal Training Session</div>
                      <div className="text-sm text-gray-600">with Sarah Johnson</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">10:00 AM</div>
                    <div className="text-sm text-gray-500">60 min</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Trainer */}
          <Card>
            <CardHeader>
              <CardTitle>My Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ" 
                    alt="Sarah Johnson" 
                    className="size-12 rounded-full" 
                  />
                  <div>
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Yoga & Pilates Specialist</div>
                  </div>
                </div>
                <Button variant="outline">
                  <MessageSquare className="size-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Classes This Week</CardTitle>
              <p className="text-sm text-gray-500">Click on a class to view details and book</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClasses.map((cls) => {
                  const spotsLeft = cls.capacity - cls.enrolled;
                  return (
                    <div 
                      key={cls.id} 
                      className="p-4 border rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => handleClassClick(cls)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{cls.name}</h3>
                          <p className="text-sm text-gray-500">{cls.instructor}</p>
                        </div>
                        <Badge variant="outline">{cls.category}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="size-4" />
                          {cls.day}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="size-4" />
                          {cls.time} ({cls.duration})
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className={`text-sm ${spotsLeft === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {spotsLeft === 0 ? 'Full - Waitlist available' : `${spotsLeft} spots left`}
                          </span>
                          <Button size="sm">
                            {spotsLeft === 0 ? 'View Details' : 'Book Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{booking.class}</div>
                      <div className="text-sm text-gray-500">
                        {booking.day} at {booking.time} • {booking.instructor}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[170, 185]} />
                  <Tooltip />
                  <Line key="weight-progress" type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} name="Weight (lbs)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Starting Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">180 lbs</div>
                <p className="text-xs text-gray-500 mt-1">Jan 15, 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-blue-600">175 lbs</div>
                <p className="text-xs text-green-600 mt-1">↓ 5 lbs lost</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Target Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-green-600">170 lbs</div>
                <p className="text-xs text-gray-500 mt-1">5 lbs to go</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Weight Loss Goal</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Workout Frequency (5/week)</span>
                  <span className="font-medium">100%</span>
                </div>
                <Progress value={100} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Monthly Target (20 visits)</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Award className="size-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-sm">100 Visits</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Award className="size-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm">First 5 lbs</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Award className="size-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm">1 Month Streak</div>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <Award className="size-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm">10 lbs Goal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Dumbbell className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{booking.class}</div>
                          <div className="text-sm text-gray-500">
                            {booking.day} at {booking.time} • {booking.instructor}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Training Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Target className="size-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{session.type}</div>
                          <div className="text-sm text-gray-500">
                            {session.date} at {session.time} • {session.trainer}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Membership Type</div>
                  <div className="text-xl font-medium mt-1">{memberData.membershipType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="text-xl font-medium mt-1">{memberData.memberSince}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Expiry Date</div>
                  <div className="text-xl font-medium mt-1">{memberData.expiryDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Monthly Fee</div>
                  <div className="text-xl font-medium mt-1">$99.99</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">✓ Unlimited Gym Access</li>
                <li className="flex items-center gap-2">✓ All Group Classes</li>
                <li className="flex items-center gap-2">✓ 2 Personal Training Sessions/month</li>
                <li className="flex items-center gap-2">✓ Nutrition Consultation</li>
                <li className="flex items-center gap-2">✓ Access to All Facilities</li>
                <li className="flex items-center gap-2">✓ Guest Passes (2/month)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">March 2026</div>
                    <div className="text-sm text-gray-500">Paid on Mar 1, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$99.99</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">Paid</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">February 2026</div>
                    <div className="text-sm text-gray-500">Paid on Feb 1, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$99.99</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">Paid</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <CreditCard className="size-4 mr-2" />
                View All Payments
              </Button>
            </CardContent>
          </Card>

          {/* Discount Code Section - Use Case 7 */}
          <DiscountCodeSection />

          <Card>
            <CardHeader>
              <CardTitle>Upgrade Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                You're currently on the Premium plan. Contact us to explore other options or make changes.
              </p>
              <Button variant="outline">Contact Support</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Use Case 9: Gym and Customer Experience Evaluation */}
      <GymEvaluation />

      {/* Use Case 10: Customer Support */}
      <CustomerSupport />
    </DashboardLayout>
  );
}