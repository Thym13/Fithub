import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { db, User } from '../services/database';
import { emailService } from '../services/email';
import { paymentService } from '../services/payment';
import {
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  AlertCircle,
  Eye,
  Dumbbell,
  UserCog
} from 'lucide-react';

interface PendingRegistrationsProps {
  onRefresh?: () => void;
}

export function PendingRegistrations({ onRefresh }: PendingRegistrationsProps) {
  const [pendingUsers, setPendingUsers] = useState<User[]>(() => {
    return db.getAllUsers().filter(u => u.accountStatus === 'Pending');
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const refreshPendingUsers = () => {
    const users = db.getAllUsers().filter(u => u.accountStatus === 'Pending');
    setPendingUsers(users);
    onRefresh?.();
  };

  const handleApprove = async (user: User) => {
    setSelectedUser(user);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      // Update user status to Active
      db.updateUser(selectedUser.id, { accountStatus: 'Active' });

      // Update membership if exists
      const membership = db.getMembershipByUserId(selectedUser.id);
      if (membership && membership.status === 'Pending') {
        const memberships = db.getAllMemberships().map(m =>
          m.id === membership.id ? { ...m, status: 'Active' as const } : m
        );
        db.saveMemberships(memberships);
      }

      // Send welcome email
      await emailService.sendWelcomeEmail(
        selectedUser.email,
        selectedUser.name,
        selectedUser.role
      );

      // Send approval email
      await emailService.sendApprovalEmail(
        selectedUser.email,
        selectedUser.name,
        selectedUser.role
      );

      // Create notification
      emailService.createNotification({
        userId: selectedUser.id,
        title: 'Account Approved! 🎉',
        message: `Your ${selectedUser.role} account has been approved. Welcome to FitHub!`,
        type: 'success',
        link: `/${selectedUser.role}`
      });

      // Refresh list
      refreshPendingUsers();
      setShowApproveModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (user: User) => {
    setSelectedUser(user);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      // Update user status to Rejected
      db.updateUser(selectedUser.id, { accountStatus: 'Rejected' });

      // Update membership if exists
      const membership = db.getMembershipByUserId(selectedUser.id);
      if (membership) {
        const memberships = db.getAllMemberships().map(m =>
          m.id === membership.id ? { ...m, status: 'Cancelled' as const } : m
        );
        db.saveMemberships(memberships);
      }

      // Send rejection email
      await emailService.sendRejectionEmail(
        selectedUser.email,
        selectedUser.name,
        rejectionReason
      );

      // Create notification
      emailService.createNotification({
        userId: selectedUser.id,
        title: 'Registration Update',
        message: `Your registration was not approved. Reason: ${rejectionReason}`,
        type: 'error'
      });

      // Refresh list
      refreshPendingUsers();
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getUserMembership = (userId: string) => {
    return db.getMembershipByUserId(userId);
  };

  const getUserTransactions = (userId: string) => {
    return paymentService.getUserTransactions(userId);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'member':
        return <UserPlus className="size-5 text-blue-600" />;
      case 'trainer':
        return <Dumbbell className="size-5 text-green-600" />;
      case 'secretary':
        return <UserCog className="size-5 text-purple-600" />;
      default:
        return <UserPlus className="size-5" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'member':
        return 'bg-blue-100 text-blue-800';
      case 'trainer':
        return 'bg-green-100 text-green-800';
      case 'secretary':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (pendingUsers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-3">
            <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
              <CheckCircle className="size-12 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">All Clear! ✅</h3>
            <p className="text-gray-600">No pending registrations at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>{pendingUsers.length} registration{pendingUsers.length !== 1 ? 's' : ''}</strong> waiting for approval.
            Review and approve/reject each application.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {pendingUsers.map((user) => {
            const membership = getUserMembership(user.id);
            const transactions = getUserTransactions(user.id);
            const lastTransaction = transactions[transactions.length - 1];

            return (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Clock className="size-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(user)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="size-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(user)}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="size-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-gray-400" />
                          <span>{user.email}</span>
                          {user.emailVerified && (
                            <CheckCircle className="size-4 text-green-600" title="Email Verified" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="size-4 text-gray-400" />
                          <span>DOB: {new Date(user.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Registration Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-500">Registration Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="size-4 text-gray-400" />
                          <span>Registered: {new Date(user.createdAt).toLocaleString()}</span>
                        </div>
                        {membership && (
                          <div className="flex items-center gap-2 text-sm">
                            <UserPlus className="size-4 text-gray-400" />
                            <span>Plan: {membership.type} (€{membership.monthlyCost}/mo)</span>
                          </div>
                        )}
                        {lastTransaction && lastTransaction.status === 'Completed' && (
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="size-4 text-gray-400" />
                            <span className="text-green-600 font-medium">
                              Payment: €{lastTransaction.amount.toFixed(2)} ✓
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info for Trainers */}
                  {user.role === 'trainer' && (
                    <div className="mt-4 pt-4 border-t">
                      <Alert>
                        <Dumbbell className="size-4" />
                        <AlertDescription>
                          <strong>Trainer Application</strong>
                          <p className="text-sm mt-1">
                            Documents and certifications have been uploaded. Please review before approval.
                          </p>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this registration?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <strong>Name:</strong> {selectedUser.name}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Role:</strong>
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <Alert>
                <CheckCircle className="size-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Upon approval:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Account status will be set to "Active"</li>
                    <li>Membership will be activated (if applicable)</li>
                    <li>Welcome email will be sent</li>
                    <li>User will gain access to the platform</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={confirmApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="size-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4 mr-2" />
                      Confirm Approval
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowApproveModal(false)}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this registration. The user will receive an email with this reason.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <strong>Name:</strong> {selectedUser.name}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="e.g., Incomplete documentation, Invalid payment information, etc."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500">
                  This message will be sent to the applicant via email.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={confirmReject}
                  variant="destructive"
                  className="flex-1"
                  disabled={isProcessing || !rejectionReason.trim()}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="size-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowRejectModal(false)}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
