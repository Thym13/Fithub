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
  Star,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  User as UserIcon,
  Calendar,
  Award
} from 'lucide-react';
import { MockDatabase, Review } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function ReviewManagement() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const loadReviews = () => {
    let allReviews = db.getAllReviews();

    if (filterStatus !== 'All') {
      allReviews = db.getReviewsByStatus(filterStatus as 'Pending' | 'Approved' | 'Rejected');
    }

    // Sort by created date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setReviews(allReviews);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  const handleApproveReview = (reviewId: string) => {
    if (!user) return;

    db.approveReview(reviewId, user.name);
    loadReviews();

    if (selectedReview?.id === reviewId) {
      setIsViewModalOpen(false);
    }
  };

  const handleOpenRejectModal = (review: Review) => {
    setSelectedReview(review);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectReview = () => {
    if (!user || !selectedReview || !rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    db.rejectReview(selectedReview.id, user.name, rejectionReason);
    loadReviews();
    setIsRejectModalOpen(false);
    setIsViewModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Calculate statistics
  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    approved: reviews.filter(r => r.status === 'Approved').length,
    rejected: reviews.filter(r => r.status === 'Rejected').length,
  };

  const filteredReviews = filterStatus === 'All' ? reviews : reviews.filter(r => r.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <AlertCircle className="size-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="size-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Management</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-600" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Reviews</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No reviews found with the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{review.targetName}</h3>
                        <Badge variant="outline" className="text-xs">{review.targetType}</Badge>
                        {getStatusBadge(review.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <UserIcon className="size-3" />
                          {review.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="size-3" />
                          Instructor: {review.instructorName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Overall</p>
                      <div className="flex items-center gap-1">
                        {renderStars(review.overallRating)}
                        <span className="text-sm text-gray-600 ml-1">({review.overallRating}/5)</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Instructor</p>
                      <div className="flex items-center gap-1">
                        {renderStars(review.instructorRating)}
                        <span className="text-sm text-gray-600 ml-1">({review.instructorRating}/5)</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Facility</p>
                      <div className="flex items-center gap-1">
                        {renderStars(review.facilityRating)}
                        <span className="text-sm text-gray-600 ml-1">({review.facilityRating}/5)</span>
                      </div>
                    </div>
                  </div>

                  {review.comments && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">"{review.comments}"</p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReview(review)}
                    >
                      <Eye className="size-4 mr-1" />
                      View Details
                    </Button>

                    {review.status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveReview(review.id)}
                        >
                          <CheckCircle className="size-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenRejectModal(review)}
                        >
                          <XCircle className="size-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Review Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Status</h3>
                {getStatusBadge(selectedReview.status)}
              </div>

              {/* Target Info */}
              <div>
                <h3 className="font-medium mb-2">Reviewed Item</h3>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-medium">{selectedReview.targetName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedReview.targetType}</Badge>
                    <span className="text-sm text-gray-600">Instructor: {selectedReview.instructorName}</span>
                  </div>
                </div>
              </div>

              {/* Reviewer Info */}
              <div>
                <h3 className="font-medium mb-2">Reviewer</h3>
                <div className="text-sm text-gray-700">
                  <p><span className="text-gray-600">Name:</span> {selectedReview.userName}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedReview.userEmail}</p>
                  <p><span className="text-gray-600">Date:</span> {new Date(selectedReview.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="font-medium mb-3">Ratings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Experience</span>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedReview.overallRating)}
                      <span className="text-sm text-gray-600">({selectedReview.overallRating}/5)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Instructor</span>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedReview.instructorRating)}
                      <span className="text-sm text-gray-600">({selectedReview.instructorRating}/5)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Facility</span>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedReview.facilityRating)}
                      <span className="text-sm text-gray-600">({selectedReview.facilityRating}/5)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              {selectedReview.comments && (
                <div>
                  <h3 className="font-medium mb-2">Comments</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReview.comments}</p>
                </div>
              )}

              {/* Suggestions */}
              {selectedReview.suggestions && (
                <div>
                  <h3 className="font-medium mb-2">Suggestions</h3>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedReview.suggestions}</p>
                </div>
              )}

              {/* Moderation Info */}
              {selectedReview.status !== 'Pending' && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Moderation Info</h3>
                  <div className="text-sm text-gray-700">
                    <p><span className="text-gray-600">Moderated by:</span> {selectedReview.moderatedBy}</p>
                    <p><span className="text-gray-600">Moderated at:</span> {selectedReview.moderatedAt ? new Date(selectedReview.moderatedAt).toLocaleString() : 'N/A'}</p>
                    {selectedReview.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-50 rounded-lg">
                        <p className="text-red-800"><span className="font-medium">Rejection Reason:</span> {selectedReview.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedReview?.status === 'Pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => selectedReview && handleApproveReview(selectedReview.id)}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedReview && handleOpenRejectModal(selectedReview)}
                >
                  <XCircle className="size-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            {selectedReview?.status !== 'Pending' && (
              <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Review Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for rejecting this review. The reviewer will be notified with this reason.
            </p>

            <div>
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="e.g., Contains inappropriate language, violates community guidelines, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectReview}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="size-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
