import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Calendar,
  User as UserIcon,
  Award
} from 'lucide-react';
import { MockDatabase, Class, TrainingProgram } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function SubmitReview() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [availableItems, setAvailableItems] = useState<Array<{ type: 'Class' | 'Training Program'; id: string; name: string; instructorId: string; instructorName: string }>>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Rating states
  const [instructorRating, setInstructorRating] = useState(0);
  const [facilityRating, setFacilityRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');

  useEffect(() => {
    if (user) {
      loadAvailableItems();
    }
  }, [user]);

  const loadAvailableItems = () => {
    if (!user) return;

    const items: Array<{ type: 'Class' | 'Training Program'; id: string; name: string; instructorId: string; instructorName: string }> = [];

    // Get classes user has booked
    const bookings = db.getAllBookings().filter(b => b.userId === user.id && b.status === 'Confirmed');
    const classes = db.getAllClasses();

    bookings.forEach(booking => {
      const classItem = classes.find(c => c.id === booking.classId);
      if (classItem) {
        items.push({
          type: 'Class',
          id: classItem.id,
          name: classItem.name,
          instructorId: classItem.instructorId,
          instructorName: classItem.instructorName,
        });
      }
    });

    // Get training programs assigned to user
    const programs = db.getAllPrograms().filter(p => p.clientId === user.id);
    programs.forEach(program => {
      items.push({
        type: 'Training Program',
        id: program.id,
        name: program.name,
        instructorId: program.trainerId,
        instructorName: program.trainerName,
      });
    });

    setAvailableItems(items);
  };

  const handleSubmit = () => {
    if (!user || !selectedItem) return;

    const item = availableItems.find(i => i.id === selectedItem);
    if (!item) return;

    // Validate ratings
    if (instructorRating === 0 || facilityRating === 0 || overallRating === 0) {
      alert('Please provide all ratings before submitting.');
      return;
    }

    db.createReview({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      targetType: item.type,
      targetId: item.id,
      targetName: item.name,
      instructorId: item.instructorId,
      instructorName: item.instructorName,
      instructorRating,
      facilityRating,
      overallRating,
      comments: comments || undefined,
      suggestions: suggestions || undefined,
      status: 'Pending',
    });

    setIsSubmitModalOpen(false);
    setShowSuccessModal(true);
    resetForm();
  };

  const resetForm = () => {
    setSelectedItem('');
    setInstructorRating(0);
    setFacilityRating(0);
    setOverallRating(0);
    setComments('');
    setSuggestions('');
  };

  const renderStars = (rating: number, setRating: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`size-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const selectedItemDetails = availableItems.find(i => i.id === selectedItem);

  return (
    <div className="space-y-6">
      {/* Submit Review Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            Submit a Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Class or Training Program</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a class or program to review" />
              </SelectTrigger>
              <SelectContent>
                {availableItems.length === 0 && (
                  <div className="p-2 text-sm text-gray-500">No classes or programs available to review</div>
                )}
                {availableItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <span>{item.name}</span>
                      <span className="text-gray-500 text-xs">({item.instructorName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && selectedItemDetails && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Selected for Review:</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Type:</span> <Badge variant="outline">{selectedItemDetails.type}</Badge></p>
                <p><span className="text-gray-600">Name:</span> {selectedItemDetails.name}</p>
                <p><span className="text-gray-600">Instructor:</span> {selectedItemDetails.instructorName}</p>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={() => setIsSubmitModalOpen(true)}
            disabled={!selectedItem}
          >
            <Star className="size-4 mr-2" />
            Start Review
          </Button>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on your experience and observations</li>
              <li>• Avoid inappropriate language or personal attacks</li>
              <li>• Reviews are moderated before being published</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Submit Review Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Your Review</DialogTitle>
          </DialogHeader>

          {selectedItemDetails && (
            <div className="space-y-6">
              {/* Item Details */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Award className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">{selectedItemDetails.name}</p>
                    <p className="text-sm text-gray-600">Instructor: {selectedItemDetails.instructorName}</p>
                    <Badge variant="outline" className="mt-1">{selectedItemDetails.type}</Badge>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <UserIcon className="size-4" />
                    Instructor Rating
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    {renderStars(instructorRating, setInstructorRating)}
                    {instructorRating > 0 && (
                      <span className="text-sm text-gray-600">({instructorRating}/5)</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Calendar className="size-4" />
                    Facility Rating
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    {renderStars(facilityRating, setFacilityRating)}
                    {facilityRating > 0 && (
                      <span className="text-sm text-gray-600">({facilityRating}/5)</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Star className="size-4" />
                    Overall Experience
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    {renderStars(overallRating, setOverallRating)}
                    {overallRating > 0 && (
                      <span className="text-sm text-gray-600">({overallRating}/5)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div>
                <Label>Comments (Optional)</Label>
                <Textarea
                  placeholder="Share your experience with this class or program..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Suggestions */}
              <div>
                <Label>Suggestions for Improvement (Optional)</Label>
                <Textarea
                  placeholder="Any suggestions to make this even better?"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="size-4 inline mr-1" />
                  Your review will be moderated before being published to ensure it meets our community guidelines.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <CheckCircle className="size-4 mr-2" />
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <div className="text-center py-6">
            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="size-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">Review Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your review has been submitted and is pending moderation. You will be notified once it's approved.
            </p>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
