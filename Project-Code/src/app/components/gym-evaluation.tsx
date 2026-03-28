import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Star, X, CheckCircle, AlertCircle, MessageSquare, Send } from 'lucide-react';

// Mock recent classes/workouts attended by the member
const recentActivities = [
  { 
    id: '1', 
    type: 'class',
    name: 'Morning Yoga', 
    instructor: 'Sarah Johnson', 
    date: '2026-03-18',
    time: '07:00 AM',
    category: 'Yoga'
  },
  { 
    id: '2', 
    type: 'class',
    name: 'HIIT Training', 
    instructor: 'Mike Chen', 
    date: '2026-03-17',
    time: '06:00 PM',
    category: 'Cardio'
  },
  { 
    id: '3', 
    type: 'workout',
    name: 'Personal Training Session', 
    instructor: 'Sarah Johnson', 
    date: '2026-03-16',
    time: '10:00 AM',
    category: 'Personal Training'
  },
  { 
    id: '4', 
    type: 'class',
    name: 'Spin Class', 
    instructor: 'Alex Rivera', 
    date: '2026-03-15',
    time: '05:30 PM',
    category: 'Cardio'
  },
];

interface GymEvaluationProps {
  onClose?: () => void;
}

export function GymEvaluation({ onClose }: GymEvaluationProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRejection, setShowRejection] = useState(false);

  // Rating state
  const [ratings, setRatings] = useState({
    instructor: 0,
    facilities: 0,
    equipment: 0,
    cleanliness: 0,
    overall: 0
  });
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // Simulate occasional prompt (on component mount for demo purposes)
  useEffect(() => {
    // Simulate random prompt after a delay (like Coursera)
    const timer = setTimeout(() => {
      const shouldPrompt = Math.random() < 0.7; // 70% chance to show prompt for demo
      if (shouldPrompt) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectActivity = (activity: any) => {
    setSelectedActivity(activity);
    setShowPrompt(false);
    setShowReviewForm(true);
  };

  const handleRatingClick = (category: string, value: number) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleSubmitReview = () => {
    // Simulate policy violation check (15% chance for demo)
    const violatesPolicy = Math.random() < 0.15;
    
    if (violatesPolicy) {
      // Alternative Flow 1: Review rejected
      setShowReviewForm(false);
      setShowRejection(true);
    } else {
      // Basic Flow: Success
      console.log('Review submitted:', {
        activity: selectedActivity,
        ratings,
        comments,
        suggestions
      });
      console.log('Notifying trainer and administrator...');
      
      setShowReviewForm(false);
      setShowConfirmation(true);
    }

    // Reset form
    setRatings({
      instructor: 0,
      facilities: 0,
      equipment: 0,
      cleanliness: 0,
      overall: 0
    });
    setComments('');
    setSuggestions('');
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => (
    <div className="space-y-2">
      <div className="font-medium text-sm">{label}</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`size-8 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Review Prompt Modal - Basic Flow Step 1 */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="size-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Share Your Experience</CardTitle>
                  <p className="text-sm text-gray-500 font-normal mt-1">
                    Help us improve by rating your recent activities
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPrompt(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                We'd love to hear about your recent classes and workouts! Your feedback helps us maintain quality and improve our services.
              </p>
              
              {/* Basic Flow Step 2: Display recent classes/workouts */}
              <div className="space-y-2">
                <div className="font-medium text-sm mb-3">Select an activity to review:</div>
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleSelectActivity(activity)}
                    className="p-3 border rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-gray-500">
                          {activity.instructor} • {activity.date} • {activity.time}
                        </div>
                      </div>
                      <Badge variant="outline">{activity.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPrompt(false)}>
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Form Modal - Basic Flow Steps 3-8 */}
      {showReviewForm && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rate Your Experience</CardTitle>
                <p className="text-sm text-gray-500 font-normal mt-1">
                  {selectedActivity.name} • {selectedActivity.date}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowReviewForm(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Flow Step 4: Display class/workout details */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Instructor:</span>{' '}
                    <span className="font-medium">{selectedActivity.instructor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>{' '}
                    <span className="font-medium">{selectedActivity.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>{' '}
                    <span className="font-medium">{selectedActivity.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>{' '}
                    <span className="font-medium">{selectedActivity.time}</span>
                  </div>
                </div>
              </div>

              {/* Basic Flow Steps 5-6: Rate experience in various areas */}
              <div className="space-y-4">
                <div className="font-medium">Rate Your Experience</div>
                
                <StarRating
                  label="Instructor Performance"
                  value={ratings.instructor}
                  onChange={(val) => handleRatingClick('instructor', val)}
                />

                <StarRating
                  label="Gym Facilities"
                  value={ratings.facilities}
                  onChange={(val) => handleRatingClick('facilities', val)}
                />

                <StarRating
                  label="Equipment Quality"
                  value={ratings.equipment}
                  onChange={(val) => handleRatingClick('equipment', val)}
                />

                <StarRating
                  label="Cleanliness"
                  value={ratings.cleanliness}
                  onChange={(val) => handleRatingClick('cleanliness', val)}
                />

                <StarRating
                  label="Overall Experience"
                  value={ratings.overall}
                  onChange={(val) => handleRatingClick('overall', val)}
                />
              </div>

              {/* Basic Flow Step 7: Comments and suggestions */}
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm mb-2 block">
                    Comments (Optional)
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about this session..."
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-medium text-sm mb-2 block">
                    Suggestions for Improvement (Optional)
                  </label>
                  <Textarea
                    placeholder="How can we make your experience better?"
                    rows={3}
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                  />
                </div>
              </div>

              {/* Basic Flow Step 8: Submit evaluation */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmitReview}
                  disabled={ratings.overall === 0}
                >
                  <Send className="size-4 mr-2" />
                  Submit Evaluation
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By submitting this review, you agree to our community guidelines and gym policy.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Confirmation Modal - Basic Flow Step 10 */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Evaluation Submitted Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your evaluation has been successfully submitted. Thank you for helping us improve our services!
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  ✓ Trainer has been notified<br />
                  ✓ Administrator has been notified
                </p>
              </div>
              <Button 
                onClick={() => {
                  setShowConfirmation(false);
                  if (onClose) onClose();
                }} 
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rejection Modal - Alternative Flow 1 */}
      {showRejection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertCircle className="size-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Review Rejected</h3>
              <p className="text-gray-600 mb-4">
                Your review has been rejected due to the gym's policy.
              </p>
              <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Common reasons for rejection:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Inappropriate language or content</li>
                  <li>Personal attacks or harassment</li>
                  <li>False or misleading information</li>
                  <li>Violation of community guidelines</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Please review our community guidelines and feel free to submit a revised evaluation.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowRejection(false);
                    if (onClose) onClose();
                  }} 
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setShowRejection(false);
                    setShowPrompt(true);
                  }} 
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
