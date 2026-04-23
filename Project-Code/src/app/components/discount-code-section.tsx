import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tag, CheckCircle, X, AlertCircle, Percent, Mail, CreditCard, Copy } from 'lucide-react';
import { campaigns } from '../utils/campaignsData';

export function DiscountCodeSection() {
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const basePrice = 99.99;

  const applyDiscountCode = () => {
    const code = discountCode.toUpperCase().trim();

    if (!code) {
      setDiscountError('Please enter a discount code.');
      return;
    }

    // Find campaign with matching promo code
    const campaign = campaigns.find(c => c.promoCode?.toUpperCase() === code);

    // Alternative Flow 1: Invalid Discount Code
    if (!campaign) {
      setDiscountError('The discount code is invalid. Please re-enter the correct code or contact the administrator if assistance is needed.');
      setDiscountApplied(false);
      setAppliedCode(null);
      return;
    }

    // Alternative Flow 2: Check if campaign is active and within date range
    const today = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    // Check if campaign has ended
    if (today > endDate) {
      setDiscountError('This code has expired. Please try another code or contact support for information regarding new available promo codes.');
      setDiscountApplied(false);
      setAppliedCode(null);
      return;
    }

    // Check if campaign hasn't started yet
    if (today < startDate && campaign.status === 'Scheduled') {
      setDiscountError(`This code is not yet active. It will be available starting ${startDate.toLocaleDateString('en-GB')}.`);
      setDiscountApplied(false);
      setAppliedCode(null);
      return;
    }

    // Check if campaign is completed but still within date range
    if (campaign.status === 'Completed') {
      setDiscountError('This campaign has been completed. Please contact support for information regarding new available promo codes.');
      setDiscountApplied(false);
      setAppliedCode(null);
      return;
    }

    // Basic Flow: Valid code - convert campaign to discount code format
    const validCode = {
      code: campaign.promoCode,
      discount: campaign.discountPercentage,
      type: 'percentage',
      status: 'active',
      expiryDate: campaign.endDate,
      description: campaign.description || `${campaign.discountPercentage}% off subscription`
    };

    setAppliedCode(validCode);
    setDiscountApplied(true);
    setDiscountError('');
    setShowSuccessModal(true);
  };

  const removeDiscount = () => {
    setDiscountApplied(false);
    setAppliedCode(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const calculateDiscount = () => {
    if (!appliedCode) return 0;
    
    if (appliedCode.type === 'percentage') {
      return (basePrice * appliedCode.discount) / 100;
    } else {
      return appliedCode.discount;
    }
  };

  const finalPrice = basePrice - calculateDiscount();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="size-5 text-blue-600" />
            <CardTitle>Apply Discount Code</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Have a discount code? Enter it below to receive special pricing on your subscription.
          </p>

          {!discountApplied ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="discountCode">Discount Code</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="discountCode"
                    placeholder="e.g., WELCOME20"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value.toUpperCase());
                      setDiscountError('');
                    }}
                    className="flex-1"
                  />
                  <Button onClick={applyDiscountCode}>
                    Apply Code
                  </Button>
                </div>
              </div>

              {discountError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">Error</div>
                      <div className="text-sm text-red-700 mt-1">{discountError}</div>
                      <div className="mt-3 space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-100"
                          onClick={() => {
                            setDiscountCode('');
                            setDiscountError('');
                          }}
                        >
                          Try Another Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="size-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Available Promo Codes:</strong> Try one of these active discount codes
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {campaigns
                    .filter(c => {
                      const today = new Date();
                      const startDate = new Date(c.startDate);
                      const endDate = new Date(c.endDate);
                      return c.status === 'Active' && today >= startDate && today <= endDate;
                    })
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        onClick={() => {
                          setDiscountCode(campaign.promoCode || '');
                          setDiscountError('');
                        }}
                        className="flex items-center gap-2 p-3 bg-white border-2 border-blue-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono font-bold text-sm">
                              {campaign.promoCode}
                            </Badge>
                            <Copy className="size-3 text-gray-400 group-hover:text-blue-600" />
                          </div>
                          <div className="text-xs text-gray-600 truncate">{campaign.description}</div>
                        </div>
                        <Badge className="ml-2 bg-green-600 text-white flex-shrink-0 px-2 py-1">
                          {campaign.discountPercentage}% OFF
                        </Badge>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">💡 Click on any code to auto-fill it in the field above</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <CheckCircle className="size-6 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Discount Code Applied!</div>
                      <div className="text-sm text-green-700 mt-1">
                        Code: <Badge variant="outline" className="ml-1">{appliedCode.code}</Badge>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        {appliedCode.description}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={removeDiscount}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Original Price</span>
                  <span className="font-medium line-through text-gray-400">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-green-600">
                  <span className="flex items-center gap-2">
                    <Percent className="size-4" />
                    Discount Applied
                  </span>
                  <span className="font-medium">-${calculateDiscount().toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-lg font-medium">Total Amount</span>
                  <span className="text-2xl font-medium text-green-600">${finalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" onClick={() => {
                alert(`Payment of $${finalPrice.toFixed(2)} processed successfully!`);
              }}>
                <CreditCard className="size-4 mr-2" />
                Proceed to Payment (${finalPrice.toFixed(2)})
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t">
            <p>💡 Discount codes are case-insensitive and must be entered exactly as provided.</p>
            <p className="mt-1">📧 You'll receive a confirmation email once the discount is applied.</p>
          </div>
        </CardContent>
      </Card>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Discount Applied Successfully!</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSuccessModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="size-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Discount Code Applied!</h3>
                <p className="text-gray-600 mb-4">
                  Your discount code <Badge variant="outline">{appliedCode?.code}</Badge> has been successfully applied to your subscription.
                </p>
                <div className="p-4 bg-gray-50 rounded-lg text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Original Price</span>
                    <span className="text-sm line-through text-gray-400">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-600">Discount</span>
                    <span className="text-sm text-green-600">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="font-medium">New Price</span>
                    <span className="text-lg font-medium text-green-600">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="size-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Confirmation sent!</strong> We've sent a confirmation email with your discount details and updated subscription amount.
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => setShowSuccessModal(false)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
