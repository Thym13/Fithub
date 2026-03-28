import { DashboardLayout } from './dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  UserCheck, 
  Calendar, 
  CreditCard, 
  MessageSquare,
  Search,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockMembers, mockCheckIns, mockClasses, mockPayments } from '../utils/mockData';
import { useEffect, useState } from 'react';

const receptionistTabs = [
  { id: 'checkin', label: 'Check-Ins', path: '#checkin' },
  { id: 'booking', label: 'Class Bookings', path: '#booking' },
  { id: 'payments', label: 'Payments', path: '#payments' },
  { id: 'communication', label: 'Member Communication', path: '#communication' },
];

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState('checkin');

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'checkin';
    setActiveTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'checkin';
      setActiveTab(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <DashboardLayout title="Front Desk Operations" role="Receptionist" tabs={receptionistTabs}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
      </Tabs>
    </DashboardLayout>
  );
}