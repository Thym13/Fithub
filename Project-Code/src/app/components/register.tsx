import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';
import { format } from 'date-fns';
import { 
  User, 
  Dumbbell, 
  UserCog, 
  ArrowLeft, 
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  FileText,
  CreditCard,
  Clock
} from 'lucide-react';

type UserRole = 'member' | 'trainer' | 'secretary' | null;
type RegistrationStep = 'role-selection' | 'personal-info' | 'subscription' | 'email-verification' | 'payment' | 'preferences' | 'pending-approval' | 'documents' | 'interview-scheduling' | 'contract' | 'success';

export function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('role-selection');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    specialty: '',
    subscriptionPlan: '',
    fitnessGoals: '',
    paymentMethod: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ resume?: File; certifications?: File }>({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('personal-info');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (type: 'resume' | 'certifications', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles({ ...uploadedFiles, [type]: file });
    }
  };

  const handlePersonalInfoSubmit = () => {
    if (selectedRole === 'member') {
      setCurrentStep('subscription');
    } else if (selectedRole === 'trainer') {
      setCurrentStep('documents');
    } else if (selectedRole === 'secretary') {
      setCurrentStep('contract');
    }
  };

  const handleSubscriptionSubmit = () => {
    setCurrentStep('email-verification');
  };

  const handleEmailVerification = () => {
    // Simulate email verification
    setIsEmailVerified(true);
    setTimeout(() => {
      setCurrentStep('preferences');
    }, 1500);
  };

  const handlePreferencesSubmit = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    setCurrentStep('pending-approval');
  };

  const handleDocumentsSubmit = () => {
    setCurrentStep('pending-approval');
  };

  const handleContractSign = () => {
    setCurrentStep('success');
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl mb-2">Join FitHub</h2>
        <p className="text-gray-600">Select your role to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleRoleSelection('member')}
          className="p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
        >
          <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200">
            <User className="size-8 text-blue-600" />
          </div>
          <h3 className="text-lg mb-2">Member</h3>
          <p className="text-sm text-gray-600">Join our gym and start your fitness journey</p>
        </button>

        <button
          onClick={() => handleRoleSelection('trainer')}
          className="p-6 border-2 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center group"
        >
          <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200">
            <Dumbbell className="size-8 text-green-600" />
          </div>
          <h3 className="text-lg mb-2">Trainer</h3>
          <p className="text-sm text-gray-600">Apply to become a certified trainer</p>
        </button>

        <button
          onClick={() => handleRoleSelection('secretary')}
          className="p-6 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center group"
        >
          <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200">
            <UserCog className="size-8 text-purple-600" />
          </div>
          <h3 className="text-lg mb-2">Secretary</h3>
          <p className="text-sm text-gray-600">Join our administrative team</p>
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/')} 
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep('role-selection')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Badge>{selectedRole}</Badge>
      </div>

      <div>
        <h2 className="text-2xl mb-2">Personal Information</h2>
        <p className="text-gray-600">Enter your basic details</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    handleInputChange('dateOfBirth', format(date, 'yyyy-MM-dd'));
                  }
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {(selectedRole === 'trainer' || selectedRole === 'secretary') && (
          <div className="space-y-2">
            <Label htmlFor="specialty">Professional Specialty *</Label>
            <Input
              id="specialty"
              placeholder={selectedRole === 'trainer' ? 'e.g., Yoga, HIIT, Personal Training' : 'e.g., Office Management, Customer Service'}
              value={formData.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              required
            />
          </div>
        )}

        <Button onClick={handlePersonalInfoSubmit} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );

  const renderSubscriptionSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep('personal-info')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Badge>Step 2 of 6</Badge>
      </div>

      <div>
        <h2 className="text-2xl mb-2">Choose Your Subscription Plan</h2>
        <p className="text-gray-600">Select the plan that works best for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => {
            handleInputChange('subscriptionPlan', 'Basic');
            handleSubscriptionSubmit();
          }}
          className="p-6 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
        >
          <h3 className="text-lg mb-2">Basic</h3>
          <div className="text-3xl mb-4">$49<span className="text-lg text-gray-500">/mo</span></div>
          <ul className="space-y-2 text-sm">
            <li>✓ Gym Access (6am-10pm)</li>
            <li>✓ Group Classes</li>
            <li>✓ Locker Access</li>
          </ul>
        </button>

        <button
          onClick={() => {
            handleInputChange('subscriptionPlan', 'Premium');
            handleSubscriptionSubmit();
          }}
          className="p-6 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all text-left relative"
        >
          <Badge className="absolute top-4 right-4 bg-blue-600">Popular</Badge>
          <h3 className="text-lg mb-2">Premium</h3>
          <div className="text-3xl mb-4">$99<span className="text-lg text-gray-500">/mo</span></div>
          <ul className="space-y-2 text-sm">
            <li>✓ 24/7 Gym Access</li>
            <li>✓ All Group Classes</li>
            <li>✓ 2 PT Sessions/month</li>
            <li>✓ Nutrition Consultation</li>
          </ul>
        </button>

        <button
          onClick={() => {
            handleInputChange('subscriptionPlan', 'Elite');
            handleSubscriptionSubmit();
          }}
          className="p-6 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
        >
          <h3 className="text-lg mb-2">Elite</h3>
          <div className="text-3xl mb-4">$149<span className="text-lg text-gray-500">/mo</span></div>
          <ul className="space-y-2 text-sm">
            <li>✓ All Premium Benefits</li>
            <li>✓ 4 PT Sessions/month</li>
            <li>✓ Custom Meal Plans</li>
            <li>✓ Spa & Sauna Access</li>
            <li>✓ 4 Guest Passes/month</li>
          </ul>
        </button>
      </div>
    </div>
  );

  const renderEmailVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        {!isEmailVerified ? (
          <>
            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="size-12 text-blue-600" />
            </div>
            <h2 className="text-2xl mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <Button onClick={handleEmailVerification}>
              Simulate Email Verification
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              (In production, user would click link in their email)
            </p>
          </>
        ) : (
          <>
            <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="size-12 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2">Email Verified!</h2>
            <p className="text-gray-600">Redirecting you to complete your profile...</p>
          </>
        )}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge>Step 4 of 6</Badge>
      </div>

      <div>
        <h2 className="text-2xl mb-2">Set Your Preferences</h2>
        <p className="text-gray-600">Tell us about your fitness goals</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goals">Fitness Goals</Label>
          <Textarea
            id="goals"
            placeholder="E.g., Lose weight, build muscle, improve endurance..."
            value={formData.fitnessGoals}
            onChange={(e) => handleInputChange('fitnessGoals', e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handlePreferencesSubmit} className="w-full">
          Continue to Payment
        </Button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep('preferences')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Badge>Step 5 of 6</Badge>
      </div>

      <div>
        <h2 className="text-2xl mb-2">Payment Information</h2>
        <p className="text-gray-600">Complete payment for your {formData.subscriptionPlan} membership</p>
      </div>

      <Alert>
        <CreditCard className="size-4" />
        <AlertDescription>
          First month: {formData.subscriptionPlan === 'Basic' ? '$49' : formData.subscriptionPlan === 'Premium' ? '$99' : '$149'}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="4242 4242 4242 4242"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              required
            />
          </div>
        </div>

        <Button onClick={handlePaymentSubmit} className="w-full">
          Complete Payment
        </Button>
        <p className="text-xs text-gray-500 text-center">
          (Mock payment - no real charge will be made)
        </p>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep('personal-info')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Badge>Trainer Application</Badge>
      </div>

      <div>
        <h2 className="text-2xl mb-2">Upload Your Documents</h2>
        <p className="text-gray-600">Submit your resume and certifications for review</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume">Resume / CV *</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="resume"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload('resume', e)}
            />
            <label htmlFor="resume" className="cursor-pointer">
              <Upload className="size-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploadedFiles.resume ? uploadedFiles.resume.name : 'Click to upload your resume'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications (Optional)</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="certifications"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('certifications', e)}
            />
            <label htmlFor="certifications" className="cursor-pointer">
              <Upload className="size-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploadedFiles.certifications ? uploadedFiles.certifications.name : 'Click to upload certifications'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
            </label>
          </div>
        </div>

        <Button 
          onClick={handleDocumentsSubmit} 
          className="w-full"
          disabled={!uploadedFiles.resume}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );

  const renderContract = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge>Secretary Employment</Badge>
      </div>

      <div>
        <h2 className="text-2xl mb-2">Employment Contract</h2>
        <p className="text-gray-600">Review and sign your employment agreement</p>
      </div>

      <Alert>
        <FileText className="size-4" />
        <AlertDescription>
          Your employment terms have been pre-agreed with management
        </AlertDescription>
      </Alert>

      <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
        <h3 className="font-medium">Contract Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Position</p>
            <p className="font-medium">Secretary</p>
          </div>
          <div>
            <p className="text-gray-500">Salary</p>
            <p className="font-medium">$3,500/month</p>
          </div>
          <div>
            <p className="text-gray-500">Working Hours</p>
            <p className="font-medium">Mon-Fri, 9AM-5PM</p>
          </div>
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">April 1, 2026</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <input type="checkbox" id="agree" className="mt-1" required />
          <label htmlFor="agree" className="text-sm text-gray-600">
            I have read and agree to the terms and conditions of this employment contract. 
            I understand my duties, working hours, and compensation as outlined above.
          </label>
        </div>
      </div>

      <Button onClick={handleContractSign} className="w-full">
        Sign Contract Electronically
      </Button>
    </div>
  );

  const renderPendingApproval = () => (
    <div className="space-y-6 text-center">
      <div className="p-4 bg-yellow-100 rounded-full w-fit mx-auto">
        <Clock className="size-12 text-yellow-600" />
      </div>
      
      <div>
        <h2 className="text-2xl mb-2">Application Submitted</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {selectedRole === 'member' 
            ? 'Thank you for registering! Our team is reviewing your membership application and payment. You will receive a confirmation email shortly.'
            : selectedRole === 'trainer'
            ? 'Thank you for applying! Our team is reviewing your application and documents. If your application is accepted, we will schedule an interview and send you possible dates via Doodle poll.'
            : 'Thank you! Your registration has been submitted for review.'}
        </p>
      </div>

      {selectedRole === 'trainer' && (
        <Alert>
          <CalendarIcon className="size-4" />
          <AlertDescription>
            <strong>Next Steps:</strong> If approved, you'll receive an interview invitation. 
            After a successful interview, we'll discuss terms and generate your employment contract.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-500">We've sent a confirmation to:</p>
        <p className="font-medium">{formData.email}</p>
      </div>

      <Button onClick={() => navigate('/')} variant="outline">
        Return to Login
      </Button>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
        <CheckCircle className="size-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl mb-2">Welcome to FitHub! 🎉</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your account has been successfully created. Check your email for a welcome guide 
          with tips on how to get started with FitHub.
        </p>
      </div>

      <Alert>
        <AlertDescription>
          Your contract has been submitted to the administrator for final review and processing.
        </AlertDescription>
      </Alert>

      <Button onClick={() => navigate('/')} className="w-full">
        Go to Login
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        {currentStep === 'role-selection' && (
          <div className="text-center mb-8">
            <h1 className="text-5xl mb-3">🏋️ FitHub</h1>
            <p className="text-gray-600">Gym Management CRM System</p>
          </div>
        )}

        <Card>
          <CardHeader>
            {currentStep !== 'role-selection' && (
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  {selectedRole === 'member' && <User className="size-5 text-blue-600" />}
                  {selectedRole === 'trainer' && <Dumbbell className="size-5 text-green-600" />}
                  {selectedRole === 'secretary' && <UserCog className="size-5 text-purple-600" />}
                </div>
                <div>
                  <CardTitle>
                    {selectedRole === 'member' && 'Member Registration'}
                    {selectedRole === 'trainer' && 'Trainer Application'}
                    {selectedRole === 'secretary' && 'Secretary Registration'}
                  </CardTitle>
                  <CardDescription>
                    {formData.name && `Welcome, ${formData.name}!`}
                  </CardDescription>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {currentStep === 'role-selection' && renderRoleSelection()}
            {currentStep === 'personal-info' && renderPersonalInfo()}
            {currentStep === 'subscription' && renderSubscriptionSelection()}
            {currentStep === 'email-verification' && renderEmailVerification()}
            {currentStep === 'preferences' && renderPreferences()}
            {currentStep === 'payment' && renderPayment()}
            {currentStep === 'documents' && renderDocuments()}
            {currentStep === 'contract' && renderContract()}
            {currentStep === 'pending-approval' && renderPendingApproval()}
            {currentStep === 'success' && renderSuccess()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}