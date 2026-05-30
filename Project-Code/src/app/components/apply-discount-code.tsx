import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
  Percent,
  Euro
} from 'lucide-react';
import { MockDatabase, Membership, DiscountCode } from '../services/database';
import { useAuth } from '../hooks/useAuth';

export function ApplyDiscountCode() {
  const { user } = useAuth();
  const db = MockDatabase.getInstance();

  const [membership, setMembership] = useState<Membership | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountCalculation, setDiscountCalculation] = useState<{
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Premium' | 'Elite'>('Basic');

  // Membership pricing
  const membershipPricing = {
    Basic: 49,
    Premium: 79,
    Elite: 99
  };

  useEffect(() => {
    if (user) {
      loadMembership();
    }
  }, [user]);

  const loadMembership = () => {
    if (!user) return;

    const memberships = db.getAllMemberships();
    const userMembership = memberships.find(m => m.userId === user.id);
    setMembership(userMembership || null);

    if (userMembership) {
      setSelectedPlan(userMembership.type);
    }
  };

  const handleValidateCode = async () => {
    if (!discountCode.trim()) {
      setValidationMessage('Please enter a discount code');
      setValidationStatus('error');
      return;
    }

    if (!user) return;

    setLoading(true);
    setValidationMessage('');
    setValidationStatus(null);
    setAppliedDiscount(null);
    setDiscountCalculation(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const amount = membershipPricing[selectedPlan];
    const validation = db.validateDiscountCode(discountCode.trim(), user.id, selectedPlan, amount);

    if (validation.valid && validation.discountCode) {
      const calculation = db.calculateDiscount(validation.discountCode, amount);

      setAppliedDiscount(validation.discountCode);
      setDiscountCalculation(calculation);
      setValidationMessage('Discount code applied successfully!');
      setValidationStatus('success');
    } else {
      setValidationMessage(validation.message);
      setValidationStatus('error');
      setAppliedDiscount(null);
      setDiscountCalculation(null);
    }

    setLoading(false);
  };

  const handleRemoveCode = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountCalculation(null);
    setValidationMessage('');
    setValidationStatus(null);
  };

  const handleApplyPayment = () => {
    if (!user || !appliedDiscount || !discountCalculation) return;

    // Create discount code usage record
    const membershipId = membership?.id || 'new-membership-' + Date.now();

    db.createDiscountCodeUsage({
      discountCodeId: appliedDiscount.id,
      discountCode: appliedDiscount.code,
      userId: user.id,
      userName: user.name,
      membershipId: membershipId,
      originalAmount: discountCalculation.originalAmount,
      discountAmount: discountCalculation.discountAmount,
      finalAmount: discountCalculation.finalAmount
    });

    // Show success message
    alert(`Discount applied! You saved €${discountCalculation.discountAmount.toFixed(2)}. \n\nProceed to payment with final amount: €${discountCalculation.finalAmount.toFixed(2)}`);

    // Reset form
    handleRemoveCode();
  };

  return (
    <div className="space-y-6">
      {/* Current Membership */}
      {membership && (
        <Card>
          <CardHeader>
            <CardTitle>Current Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-2">{membership.type}</Badge>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{membership.status}</span>
                </p>
                {membership.endDate && (
                  <p className="text-sm text-gray-600">
                    Expires: <span className="font-medium">{new Date(membership.endDate).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">€{membership.monthlyCost}</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Membership Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Membership Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Basic', 'Premium', 'Elite'] as const).map((plan) => (
              <div
                key={plan}
                onClick={() => {
                  setSelectedPlan(plan);
                  handleRemoveCode(); // Reset discount when changing plan
                }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === plan
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <h3 className="font-medium text-lg mb-2">{plan}</h3>
                  <p className="text-3xl font-bold mb-2">€{membershipPricing[plan]}</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apply Discount Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="size-5" />
            Apply Discount Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Enter Discount Code</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="e.g., WELCOME20"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                disabled={!!appliedDiscount}
                className="font-mono"
              />
              {appliedDiscount ? (
                <Button variant="outline" onClick={handleRemoveCode}>
                  Remove
                </Button>
              ) : (
                <Button onClick={handleValidateCode} disabled={loading || !discountCode.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Validating
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Validation Message */}
          {validationMessage && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              validationStatus === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {validationStatus === 'success' ? (
                <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                validationStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationMessage}
              </p>
            </div>
          )}

          {/* Applied Discount Details */}
          {appliedDiscount && discountCalculation && (
            <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-green-900">Discount Applied!</h3>
                <Badge className="bg-green-100 text-green-800">
                  {appliedDiscount.code}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Original Amount:</span>
                  <span className="font-medium">€{discountCalculation.originalAmount.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-green-700">
                  <span className="flex items-center gap-1">
                    {appliedDiscount.discountType === 'Percentage' ? (
                      <Percent className="size-4" />
                    ) : (
                      <Euro className="size-4" />
                    )}
                    Discount ({appliedDiscount.discountType === 'Percentage'
                      ? `${appliedDiscount.discountValue}%`
                      : `€${appliedDiscount.discountValue}`}):
                  </span>
                  <span className="font-medium">-€{discountCalculation.discountAmount.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900">Final Amount:</span>
                    <span className="text-2xl font-bold text-green-900">
                      €{discountCalculation.finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-green-800 mt-3">
                <strong>You save €{discountCalculation.discountAmount.toFixed(2)}!</strong> Click "Proceed to Payment" to complete your purchase with this discount.
              </p>
            </div>
          )}

          {/* Proceed to Payment */}
          {appliedDiscount && discountCalculation && (
            <Button onClick={handleApplyPayment} className="w-full" size="lg">
              <CheckCircle className="size-4 mr-2" />
              Proceed to Payment (€{discountCalculation.finalAmount.toFixed(2)})
            </Button>
          )}

          {/* Available Codes Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Available Discount Codes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <code className="font-mono font-medium">WELCOME20</code> - 20% off for new members</li>
              <li>• <code className="font-mono font-medium">PREMIUM20</code> - 20% off Premium membership</li>
              <li>• <code className="font-mono font-medium">SUMMER50</code> - €50 off any membership (min €100)</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              * Codes are subject to terms and conditions. Some codes may have usage limits or expiration dates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
