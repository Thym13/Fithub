import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PendingRegistrations } from './pending-registrations';
import {
  UserCheck,
  Calendar,
  CreditCard,
  MessageSquare,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  X,
  UserPlus,
  Bell,
  ClipboardList,
  Activity
} from 'lucide-react';
import { mockMembers, mockCheckIns, mockClasses, mockPayments } from '../utils/mockData';
import { useEffect, useState } from 'react';

const receptionistTabs = [
  { id: 'registrations', label: 'Pending Registrations', path: '#registrations' },
  { id: 'checkin', label: 'Check-Ins', path: '#checkin' },
  { id: 'booking', label: 'Class Bookings', path: '#booking' },
  { id: 'payments', label: 'Payments', path: '#payments' },
  { id: 'applications', label: 'Trainer Applications', path: '#applications' },
  { id: 'communication', label: 'Member Communication', path: '#communication' },
  { id: 'tasks', label: 'My Tasks', path: '#tasks' },
];

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState('registrations');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const [trainerApplications, setTrainerApplications] = useState([
    {
      id: '1',
      name: 'Maria Papadopoulos',
      email: 'maria.p@example.com',
      phone: '+30 698 123 4567',
      dateOfBirth: '1995-06-15',
      specialty: 'Yoga, Pilates, Personal Training',
      appliedDate: '2026-04-10',
      resumeUrl: '#',
      certificationsUrl: '#',
      status: 'Pending'
    },
    {
      id: '2',
      name: 'Nikos Dimitriou',
      email: 'nikos.d@example.com',
      phone: '+30 697 987 6543',
      dateOfBirth: '1992-03-22',
      specialty: 'HIIT, Strength Training, Boxing',
      appliedDate: '2026-04-12',
      resumeUrl: '#',
      certificationsUrl: '#',
      status: 'Pending'
    },
    {
      id: '3',
      name: 'Elena Georgiou',
      email: 'elena.g@example.com',
      phone: '+30 699 456 7890',
      dateOfBirth: '1998-11-08',
      specialty: 'Nutrition Consultation, Weight Loss Programs',
      appliedDate: '2026-04-08',
      resumeUrl: '#',
      certificationsUrl: '#',
      status: 'Under Review'
    }
  ]);

  // Task States
  const [showTaskAlert, setShowTaskAlert] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [myTasks, setMyTasks] = useState([
    {
      id: '1',
      title: 'Greet Members at Entrance',
      description: 'Welcome members as they arrive and assist with check-ins',
      type: 'Member Service',
      assignedBy: 'Manager - John Smith',
      deadline: '2026-04-23',
      frequency: 'Daily',
      status: 'Pending',
      assignedAt: '2026-04-22 08:00 AM',
      isNew: true
    },
    {
      id: '2',
      title: 'Clean Locker Rooms',
      description: 'Deep clean and sanitize all locker room facilities',
      type: 'Cleaning',
      assignedBy: 'Manager - John Smith',
      deadline: '2026-04-22',
      frequency: 'Daily',
      status: 'Completed',
      assignedAt: '2026-04-22 07:00 AM',
      completedAt: '2026-04-22 09:30 AM',
      isNew: false
    }
  ]);

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'registrations';
    setActiveTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'registrations';
      setActiveTab(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <DashboardLayout
      title="Front Desk Operations"
      role="Receptionist"
      tabs={receptionistTabs}
      newTaskCount={myTasks.filter(t => t.isNew).length}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="registrations" className="space-y-6">
          <PendingRegistrations onRefresh={() => {}} />
        </TabsContent>

        <TabsContent value="checkin" className="space-y-6">
          {/* Quick Check-In */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Member Check-In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Search Member</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input placeholder="Name, email, or member ID..." className="pl-9" />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserCheck className="size-4 mr-2" />
                    Check In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Check-Ins */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Check-Ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCheckIns.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="size-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{checkIn.memberName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="size-3" />
                          {checkIn.time}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {checkIn.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card>
            <CardHeader>
              <CardTitle>Member Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Last Check-In</TableHead>
                    <TableHead>Total Visits</TableHead>
                    <TableHead>Membership Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMembers.slice(0, 5).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="size-10 rounded-full" />
                          <div>
                            <div>{member.name}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.lastCheckIn}</TableCell>
                      <TableCell>{member.totalVisits}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <UserCheck className="size-4 mr-2" />
                          Check In
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Select Member</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Date</Label>
                  <Input type="date" className="mt-2" defaultValue="2026-03-21" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClasses.map((cls) => (
                  <div key={cls.id} className="p-4 border rounded-lg">
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
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {cls.enrolled}/{cls.capacity} spots filled
                        </span>
                        <Button size="sm">
                          Book Spot
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Process Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Member</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Type</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membership">Membership Renewal</SelectItem>
                      <SelectItem value="class">Class Package</SelectItem>
                      <SelectItem value="training">Personal Training</SelectItem>
                      <SelectItem value="other">Other Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input type="number" placeholder="0.00" className="mt-2" />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select method..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-4 w-full md:w-auto">
                <CreditCard className="size-4 mr-2" />
                Process Payment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.memberName}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className="font-medium">${payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="size-5" />
                  Trainer Applications
                </CardTitle>
                <Badge variant="secondary">{trainerApplications.filter(app => app.status === 'Pending').length} Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainerApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="font-medium">{application.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{application.email}</div>
                          <div className="text-gray-500">{application.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs">{application.specialty}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{new Date(application.appliedDate).toLocaleDateString('en-GB')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.status === 'Pending' ? 'secondary' :
                            application.status === 'Under Review' ? 'default' :
                            'secondary'
                          }
                          className={
                            application.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : ''
                          }
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowApplicationModal(true);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Application Details Modal */}
          {showApplicationModal && selectedApplication && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl">Trainer Application Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowApplicationModal(false);
                        setSelectedApplication(null);
                      }}
                      className="flex-shrink-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">Full Name</Label>
                          <p className="font-medium break-words">{selectedApplication.name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Email</Label>
                          <p className="font-medium break-all text-sm">{selectedApplication.email}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Phone</Label>
                          <p className="font-medium">{selectedApplication.phone}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Date of Birth</Label>
                          <p className="font-medium">{new Date(selectedApplication.dateOfBirth).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Professional Information</h3>
                      <div>
                        <Label className="text-gray-500">Specialty</Label>
                        <p className="font-medium">{selectedApplication.specialty}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Application Date</Label>
                        <p className="font-medium">{new Date(selectedApplication.appliedDate).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Submitted Documents</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-blue-100 rounded flex-shrink-0">
                              <FileText className="size-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Resume / CV</div>
                              <div className="text-sm text-gray-500 truncate">{selectedApplication.name}_Resume.pdf</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto flex-shrink-0">
                            <Download className="size-4 sm:mr-2" />
                            <span className="sm:inline">Download</span>
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-green-100 rounded flex-shrink-0">
                              <FileText className="size-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Certifications</div>
                              <div className="text-sm text-gray-500 truncate">{selectedApplication.name}_Certifications.pdf</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto flex-shrink-0">
                            <Download className="size-4 sm:mr-2" />
                            <span className="sm:inline">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg border-b pb-2">Update Status</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Current Status</Label>
                          <Badge className="ml-2">{selectedApplication.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          <Label>Change Status</Label>
                          <Select
                            defaultValue={selectedApplication.status}
                            onValueChange={(value) => {
                              const updatedApplications = trainerApplications.map(app =>
                                app.id === selectedApplication.id ? { ...app, status: value } : app
                              );
                              setTrainerApplications(updatedApplications);
                              setSelectedApplication({ ...selectedApplication, status: value });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Under Review">Under Review</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowApplicationModal(false);
                          setSelectedApplication(null);
                        }}
                        className="flex-1 w-full"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          setShowApplicationModal(false);
                          setSelectedApplication(null);
                        }}
                        className="flex-1 w-full"
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Message to Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Member</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Message</Label>
                  <textarea 
                    className="w-full mt-2 p-3 border rounded-lg resize-none" 
                    rows={4}
                    placeholder="Type your message here..."
                  />
                </div>
                <Button>
                  <MessageSquare className="size-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Renewals Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockMembers.filter(m => m.status === 'Expiring Soon').map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="size-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">Expires: {member.expiryDate}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="size-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Task Notification Alert */}
          {showTaskAlert && myTasks.filter(t => t.isNew).length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                    <Bell className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">New Task Assigned!</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      You have {myTasks.filter(t => t.isNew).length} new task{myTasks.filter(t => t.isNew).length > 1 ? 's' : ''} from your manager
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTaskAlert(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="size-5" />
                  Assigned Tasks
                </CardTitle>
                <Badge variant="secondary">
                  {myTasks.filter(t => t.status === 'Pending').length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      task.isNew ? 'border-blue-300 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {task.isNew && (
                            <Badge className="bg-blue-600">New</Badge>
                          )}
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge
                            variant="outline"
                            className={
                              task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            <span>Due: {new Date(task.deadline).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{task.type}</Badge>
                          </div>
                          <div>Frequency: {task.frequency}</div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Assigned by {task.assignedBy} on {task.assignedAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowTaskDetails(true);
                          }}
                        >
                          <Eye className="size-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        {task.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const updatedTasks = myTasks.map(t =>
                                t.id === task.id ? { ...t, status: 'In Progress', isNew: false } : t
                              );
                              setMyTasks(updatedTasks);
                            }}
                          >
                            <Activity className="size-4 sm:mr-2" />
                            <span className="hidden sm:inline">Start</span>
                          </Button>
                        )}
                        {task.status === 'In Progress' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              const updatedTasks = myTasks.map(t =>
                                t.id === task.id ? { ...t, status: 'Completed', completedAt: new Date().toLocaleString(), isNew: false } : t
                              );
                              setMyTasks(updatedTasks);
                              setSuccessMessage('Task marked as completed!');
                              setShowSuccessModal(true);
                            }}
                          >
                            <CheckCircle className="size-4 sm:mr-2" />
                            <span className="hidden sm:inline">Complete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {myTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <ClipboardList className="size-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks assigned yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Task Details Modal */}
          {showTaskDetails && selectedTask && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-lg w-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">Task Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTaskDetails(false);
                        setSelectedTask(null);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">Task Title</Label>
                      <p className="font-medium">{selectedTask.title}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Description</Label>
                      <p className="text-sm text-gray-700">{selectedTask.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Type</Label>
                        <Badge variant="outline" className="mt-1">{selectedTask.type}</Badge>
                      </div>
                      <div>
                        <Label className="text-gray-500">Status</Label>
                        <Badge
                          className={`mt-1 ${
                            selectedTask.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            selectedTask.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {selectedTask.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Deadline</Label>
                        <p className="font-medium">{new Date(selectedTask.deadline).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Frequency</Label>
                        <p className="font-medium">{selectedTask.frequency}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-500">Assigned By</Label>
                      <p className="font-medium">{selectedTask.assignedBy}</p>
                      <p className="text-xs text-gray-500 mt-1">on {selectedTask.assignedAt}</p>
                    </div>
                    {selectedTask.completedAt && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✓ Completed on {selectedTask.completedAt}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowTaskDetails(false);
                          setSelectedTask(null);
                        }}
                      >
                        Close
                      </Button>
                      {selectedTask.status !== 'Completed' && (
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            const updatedTasks = myTasks.map(t =>
                              t.id === selectedTask.id ? { ...t, status: 'Completed', completedAt: new Date().toLocaleString(), isNew: false } : t
                            );
                            setMyTasks(updatedTasks);
                            setShowTaskDetails(false);
                            setSelectedTask(null);
                            setSuccessMessage('Task marked as completed!');
                            setShowSuccessModal(true);
                          }}
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-green-100 rounded-full">
                      <CheckCircle className="size-12 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Success!</h3>
                  <p className="text-gray-600 mb-6">{successMessage}</p>
                  <Button onClick={() => setShowSuccessModal(false)} className="w-full">
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}