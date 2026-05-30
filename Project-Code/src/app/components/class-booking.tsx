import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { db, Class, ClassBooking } from '../services/database';
import { authService } from '../services/auth';
import { emailService } from '../services/email';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  UserCheck,
  Dumbbell
} from 'lucide-react';

export function ClassBookingSystem() {
  const currentUser = authService.getCurrentUser();
  const [classes, setClasses] = useState<Class[]>([]);
  const [myBookings, setMyBookings] = useState<ClassBooking[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ClassBooking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');

  useEffect(() => {
    loadClasses();
    loadMyBookings();
  }, []);

  const loadClasses = () => {
    const allClasses = db.getAllClasses().filter(c => c.status === 'Active');
    setClasses(allClasses);
  };

  const loadMyBookings = () => {
    if (currentUser) {
      const bookings = db.getUserBookings(currentUser.id);
      setMyBookings(bookings);
    }
  };

  const refreshData = () => {
    loadClasses();
    loadMyBookings();
  };

  const handleBookClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowBookModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedClass || !currentUser) return;

    setIsProcessing(true);

    try {
      // Check if already booked
      const existingBooking = myBookings.find(
        b => b.classId === selectedClass.id && b.status !== 'Cancelled'
      );

      if (existingBooking) {
        alert('You have already booked this class!');
        setIsProcessing(false);
        return;
      }

      // Determine booking status based on capacity
      const bookingStatus: ClassBooking['status'] =
        selectedClass.enrolled < selectedClass.capacity ? 'Confirmed' : 'Waitlisted';

      // Create booking
      db.createBooking({
        classId: selectedClass.id,
        userId: currentUser.id,
        userName: currentUser.name,
        status: bookingStatus
      });

      // Update class enrolled/waitlist count
      if (bookingStatus === 'Confirmed') {
        db.updateClass(selectedClass.id, {
          enrolled: selectedClass.enrolled + 1,
          status: selectedClass.enrolled + 1 >= selectedClass.capacity ? 'Full' : 'Active'
        });
      } else {
        db.updateClass(selectedClass.id, {
          waitlist: selectedClass.waitlist + 1
        });
      }

      // Send confirmation email
      await emailService.sendEmail({
        to: currentUser.email,
        subject: bookingStatus === 'Confirmed'
          ? `Class Booking Confirmed: ${selectedClass.name}`
          : `Added to Waitlist: ${selectedClass.name}`,
        body: `
          <h2>Booking ${bookingStatus === 'Confirmed' ? 'Confirmed' : 'Waitlisted'}! 🎉</h2>
          <p>Hi ${currentUser.name},</p>
          <p>Your booking for <strong>${selectedClass.name}</strong> has been ${bookingStatus === 'Confirmed' ? 'confirmed' : 'added to the waitlist'}.</p>

          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p><strong>Class:</strong> ${selectedClass.name}</p>
            <p><strong>Instructor:</strong> ${selectedClass.instructorName}</p>
            <p><strong>Date:</strong> ${selectedClass.day}</p>
            <p><strong>Time:</strong> ${selectedClass.time}</p>
            <p><strong>Duration:</strong> ${selectedClass.duration} minutes</p>
            ${selectedClass.location ? `<p><strong>Location:</strong> ${selectedClass.location}</p>` : ''}
            <p><strong>Status:</strong> ${bookingStatus}</p>
          </div>

          ${bookingStatus === 'Waitlisted' ? `
            <p style="color: #f59e0b;">
              <strong>Waitlist Notice:</strong> You are currently on the waitlist.
              We'll notify you if a spot becomes available.
            </p>
          ` : ''}

          <p>See you at the class! 💪</p>
        `,
        type: 'notification'
      });

      // Create in-app notification
      emailService.createNotification({
        userId: currentUser.id,
        title: bookingStatus === 'Confirmed' ? 'Class Booked!' : 'Added to Waitlist',
        message: `${selectedClass.name} - ${selectedClass.day} at ${selectedClass.time}`,
        type: bookingStatus === 'Confirmed' ? 'success' : 'warning',
        link: '/member#bookings'
      });

      refreshData();
      setShowBookModal(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error booking class:', error);
      alert('Failed to book class. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelClick = (booking: ClassBooking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBooking || !currentUser) return;

    setIsProcessing(true);

    try {
      // Cancel the booking
      db.cancelBooking(selectedBooking.id);

      // Get the class
      const classItem = db.findClassById(selectedBooking.classId);
      if (classItem) {
        // Update class counts
        if (selectedBooking.status === 'Confirmed') {
          db.updateClass(classItem.id, {
            enrolled: Math.max(0, classItem.enrolled - 1),
            status: classItem.enrolled - 1 < classItem.capacity ? 'Active' : classItem.status
          });

          // If there's a waitlist, promote first person
          if (classItem.waitlist > 0) {
            const allBookings = db.getClassBookings(classItem.id);
            const waitlistedBookings = allBookings.filter(b => b.status === 'Waitlisted');

            if (waitlistedBookings.length > 0) {
              // Promote first waitlisted booking
              const bookingsArray = db.getAllBookings();
              const bookingIndex = bookingsArray.findIndex(b => b.id === waitlistedBookings[0].id);
              if (bookingIndex !== -1) {
                bookingsArray[bookingIndex].status = 'Confirmed';
                db.saveBookings(bookingsArray);

                // Update class counts
                db.updateClass(classItem.id, {
                  waitlist: Math.max(0, classItem.waitlist - 1)
                });

                // Notify promoted user
                const promotedUser = db.findUserById(waitlistedBookings[0].userId);
                if (promotedUser) {
                  await emailService.sendEmail({
                    to: promotedUser.email,
                    subject: `Spot Available: ${classItem.name}`,
                    body: `
                      <h2>Great News! 🎉</h2>
                      <p>Hi ${promotedUser.name},</p>
                      <p>A spot has become available in <strong>${classItem.name}</strong>!</p>
                      <p>Your booking has been confirmed.</p>

                      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
                        <p><strong>Class:</strong> ${classItem.name}</p>
                        <p><strong>Date:</strong> ${classItem.day}</p>
                        <p><strong>Time:</strong> ${classItem.time}</p>
                      </div>
                    `,
                    type: 'notification'
                  });

                  emailService.createNotification({
                    userId: promotedUser.id,
                    title: 'Booking Confirmed!',
                    message: `You've been moved from waitlist to confirmed for ${classItem.name}`,
                    type: 'success'
                  });
                }
              }
            }
          }
        } else if (selectedBooking.status === 'Waitlisted') {
          db.updateClass(classItem.id, {
            waitlist: Math.max(0, classItem.waitlist - 1)
          });
        }

        // Send cancellation email
        await emailService.sendEmail({
          to: currentUser.email,
          subject: `Booking Cancelled: ${classItem.name}`,
          body: `
            <h2>Booking Cancelled</h2>
            <p>Hi ${currentUser.name},</p>
            <p>Your booking for <strong>${classItem.name}</strong> has been cancelled.</p>

            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
              <p><strong>Class:</strong> ${classItem.name}</p>
              <p><strong>Date:</strong> ${classItem.day}</p>
              <p><strong>Time:</strong> ${classItem.time}</p>
            </div>

            <p>You can book another class anytime from your dashboard.</p>
          `,
          type: 'notification'
        });
      }

      refreshData();
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isClassBooked = (classId: string) => {
    return myBookings.some(b => b.classId === classId && b.status !== 'Cancelled');
  };

  const getBookingForClass = (classId: string) => {
    return myBookings.find(b => b.classId === classId && b.status !== 'Cancelled');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Yoga': 'bg-purple-100 text-purple-800',
      'HIIT': 'bg-red-100 text-red-800',
      'Pilates': 'bg-pink-100 text-pink-800',
      'Cycling': 'bg-blue-100 text-blue-800',
      'Strength': 'bg-orange-100 text-orange-800',
      'Cardio': 'bg-green-100 text-green-800',
      'CrossFit': 'bg-yellow-100 text-yellow-800',
      'Boxing': 'bg-gray-100 text-gray-800',
      'Dance': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Filter classes
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || classItem.category === filterCategory;
    const matchesDay = filterDay === 'all' || classItem.day === filterDay;

    return matchesSearch && matchesCategory && matchesDay;
  });

  // Get classes by booking status
  const confirmedBookings = myBookings.filter(b => b.status === 'Confirmed');
  const waitlistedBookings = myBookings.filter(b => b.status === 'Waitlisted');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Classes</TabsTrigger>
          <TabsTrigger value="my-bookings">
            My Bookings
            {myBookings.filter(b => b.status !== 'Cancelled').length > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white">
                {myBookings.filter(b => b.status !== 'Cancelled').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      placeholder="Search classes or instructors..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="HIIT">HIIT</SelectItem>
                      <SelectItem value="Pilates">Pilates</SelectItem>
                      <SelectItem value="Cycling">Cycling</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="CrossFit">CrossFit</SelectItem>
                      <SelectItem value="Boxing">Boxing</SelectItem>
                      <SelectItem value="Dance">Dance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filterDay} onValueChange={setFilterDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class List */}
          {filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto">
                    <Dumbbell className="size-12 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium">No Classes Found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search term.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((classItem) => {
                const booking = getBookingForClass(classItem.id);
                const isBooked = !!booking;
                const isFull = classItem.enrolled >= classItem.capacity;

                return (
                  <Card key={classItem.id} className={isBooked ? 'border-blue-500 border-2' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{classItem.name}</CardTitle>
                          <Badge className={getCategoryColor(classItem.category)}>
                            {classItem.category}
                          </Badge>
                        </div>
                        {isBooked && (
                          <Badge className={booking?.status === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-600'}>
                            {booking?.status === 'Confirmed' ? 'Booked' : 'Waitlisted'}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {classItem.description && (
                        <p className="text-sm text-gray-600">{classItem.description}</p>
                      )}

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <UserCheck className="size-4 text-gray-400" />
                          {classItem.instructorName}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="size-4 text-gray-400" />
                          {classItem.day}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="size-4 text-gray-400" />
                          {classItem.time} ({classItem.duration} min)
                        </div>
                        {classItem.location && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="size-4 text-gray-400" />
                            {classItem.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-gray-400" />
                          <span className="text-gray-700">
                            {classItem.enrolled}/{classItem.capacity}
                          </span>
                          {classItem.waitlist > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{classItem.waitlist} waitlist
                            </Badge>
                          )}
                        </div>
                      </div>

                      {isBooked ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => booking && handleCancelClick(booking)}
                        >
                          <XCircle className="size-4 mr-2" />
                          Cancel Booking
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleBookClick(classItem)}
                        >
                          <CheckCircle className="size-4 mr-2" />
                          {isFull ? 'Join Waitlist' : 'Book Class'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-bookings" className="space-y-4">
          {myBookings.filter(b => b.status !== 'Cancelled').length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                    <Calendar className="size-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium">No Bookings Yet</h3>
                  <p className="text-gray-600">Browse classes and book your first session!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {confirmedBookings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-600" />
                    Confirmed Bookings ({confirmedBookings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {confirmedBookings.map((booking) => {
                      const classItem = db.findClassById(booking.classId);
                      if (!classItem) return null;

                      return (
                        <Card key={booking.id} className="border-green-500 border-2">
                          <CardHeader>
                            <CardTitle className="text-lg">{classItem.name}</CardTitle>
                            <Badge className="bg-green-600 w-fit">Confirmed</Badge>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <UserCheck className="size-4 text-gray-400" />
                                {classItem.instructorName}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-gray-400" />
                                {classItem.day}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="size-4 text-gray-400" />
                                {classItem.time} ({classItem.duration} min)
                              </div>
                              {classItem.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="size-4 text-gray-400" />
                                  {classItem.location}
                                </div>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => handleCancelClick(booking)}
                            >
                              <XCircle className="size-4 mr-2" />
                              Cancel Booking
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {waitlistedBookings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Clock className="size-5 text-yellow-600" />
                    Waitlisted ({waitlistedBookings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {waitlistedBookings.map((booking) => {
                      const classItem = db.findClassById(booking.classId);
                      if (!classItem) return null;

                      return (
                        <Card key={booking.id} className="border-yellow-500 border-2">
                          <CardHeader>
                            <CardTitle className="text-lg">{classItem.name}</CardTitle>
                            <Badge className="bg-yellow-600 w-fit">Waitlisted</Badge>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Alert>
                              <AlertCircle className="size-4" />
                              <AlertDescription className="text-xs">
                                You'll be notified if a spot becomes available
                              </AlertDescription>
                            </Alert>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-gray-400" />
                                {classItem.day}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="size-4 text-gray-400" />
                                {classItem.time}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => handleCancelClick(booking)}
                            >
                              <XCircle className="size-4 mr-2" />
                              Leave Waitlist
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Book Confirmation Modal */}
      <Dialog open={showBookModal} onOpenChange={setShowBookModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              {selectedClass && selectedClass.enrolled >= selectedClass.capacity
                ? 'This class is full. You will be added to the waitlist.'
                : 'Confirm your class booking'}
            </DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">{selectedClass.name}</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-4 text-gray-400" />
                    {selectedClass.instructorName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-gray-400" />
                    {selectedClass.day}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-400" />
                    {selectedClass.time} ({selectedClass.duration} min)
                  </div>
                  {selectedClass.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-gray-400" />
                      {selectedClass.location}
                    </div>
                  )}
                </div>
              </div>

              {selectedClass.enrolled >= selectedClass.capacity && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    This class is currently full. You will be added to the waitlist and notified if a spot becomes available.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBookModal(false);
                    setSelectedClass(null);
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmBooking}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking?
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">
                  {db.findClassById(selectedBooking.classId)?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: {selectedBooking.status}
                </p>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  This action cannot be undone. You will need to book again if you change your mind.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmCancellation}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4 mr-2" />
                      Cancel Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
