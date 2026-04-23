import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Tag,
  CheckCircle,
  X,
  AlertCircle,
  Percent,
  Mail,
  CreditCard,
  Copy,
  Sparkles,
  TrendingDown,
  Calendar,
  Info
} from 'lucide-react';
import { campaigns } from '../utils/campaignsData';

export function DiscountCodeSectionImproved() {
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCodesList, setShowCodesList] = useState(true);

  const basePrice = 99.99;

  // Get active campaigns
  const getActiveCampaigns = () => {
    const today = new Date();
    return campaigns.filter(c => {
      const startDate = new Date(c.startDate);
      const endDate = new Date(c.endDate);
      return c.status === 'Active' && today >= startDate && today <= endDate;
    });
  };

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
      description: campaign.description || `${campaign.discountPercentage}% off subscription`,
      campaignName: campaign.name
    };

    setAppliedCode(validCode);
    setDiscountApplied(true);
    setDiscountError('');
    setShowSuccessModal(true);
    setShowCodesList(false);
  };

  const removeDiscount = () => {
    setDiscountApplied(false);
    setAppliedCode(null);
    setDiscountCode('');
    setDiscountError('');
    setShowCodesList(true);
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
  const activeCampaigns = getActiveCampaigns();

  return (
    <>
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Tag className="size-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Apply Discount Code
                {activeCampaigns.length > 0 && (
                  <Badge className="bg-green-600">
                    {activeCampaigns.length} Active Offers
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1 font-normal">
                Save on your subscription with our special offers
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {!discountApplied ? (
            <>
              {/* Code Input Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="discountCode" className="text-base font-medium">
                    Enter Your Promo Code
                  </Label>
                  <div className="flex gap-2 mt-3">
                    <Input
                      id="discountCode"
                      placeholder="e.g., SPRING2026"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        setDiscountError('');
                      }}
                      className="flex-1 text-lg font-mono"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          applyDiscountCode();
                        }
                      }}
                    />
                    <Button
                      onClick={applyDiscountCode}
                      className="bg-blue-600 hover:bg-blue-700 px-6"
                      size="lg"
                    >
                      Apply Code
                    </Button>
                  </div>
                </div>

                {/* Error Message */}
                {discountError && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-in">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-6 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-red-900 text-base">Invalid Code</div>
                        <div className="text-sm text-red-700 mt-1">{discountError}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
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
                )}

                {/* Available Promo Codes */}
                {showCodesList && activeCampaigns.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-5 text-yellow-500" />
                        <h3 className="font-medium text-base">Available Promo Codes</h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Click to apply
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeCampaigns.slice(0, 6).map((campaign) => (
                        <div
                          key={campaign.id}
                          onClick={() => {
                            setDiscountCode(campaign.promoCode || '');
                            setDiscountError('');
                          }}
                          className="relative p-4 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-xl cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-600 text-white font-mono text-sm px-3 py-1">
                                {campaign.promoCode}
                              </Badge>
                              <Copy className="size-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              <TrendingDown className="size-4" />
                              {campaign.discountPercentage}%
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 font-medium mb-1">{campaign.name}</p>
                          <p className="text-xs text-gray-600">{campaign.description}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Calendar className="size-3" />
                            Valid until {new Date(campaign.endDate).toLocaleDateString('en-GB')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {activeCampaigns.length > 6 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {/* Could show more codes */}}
                      >
                        View All {activeCampaigns.length} Active Codes
                      </Button>
                    )}
                  </div>
                )}

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>Need help?</strong> Click any promo code above to auto-fill it, or contact our support team for personalized offers.
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Applied Discount Section */}
              <div className="space-y-4">
                {/* Success Banner */}
                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <CheckCircle className="size-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-green-900 text-lg">Discount Applied Successfully!</div>
                        <div className="text-sm text-green-700 mt-1">
                          <strong>{appliedCode.campaignName}</strong>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-green-600 font-mono">
                            {appliedCode.code}
                          </Badge>
                          <span className="text-sm text-green-700">{appliedCode.description}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeDiscount}
                      className="hover:bg-green-100"
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-gray-50 to-white space-y-4">
                  <h4 className="font-medium text-base mb-4">Your Subscription Summary</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-gray-600">Original Monthly Price</span>
                      <span className="font-medium line-through text-gray-400 text-lg">
                        €{basePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <Percent className="size-5" />
                        Discount Applied ({appliedCode.discount}%)
                      </span>
                      <span className="font-medium text-green-600 text-lg">
                        -€{calculateDiscount().toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <span className="text-xl font-medium">Total Monthly Payment</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">
                          €{finalPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          You save €{calculateDiscount().toFixed(2)}/month
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="size-4 text-yellow-600 mt-0.5" />
                      <p className="text-xs text-yellow-800">
                        This discount will be applied to your subscription starting from the next billing cycle.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                  onClick={() => {
                    alert(`Payment of €${finalPrice.toFixed(2)} processed successfully!`);
                  }}
                >
                  <CreditCard className="size-5 mr-2" />
                  Proceed to Payment (€{finalPrice.toFixed(2)})
                </Button>
              </div>
            </>
          )}

          {/* Footer Info */}
          <div className="text-xs text-gray-500 pt-4 border-t space-y-1">
            <p className="flex items-center gap-2">
              💡 <span>Discount codes are case-insensitive and automatically applied</span>
            </p>
            <p className="flex items-center gap-2">
              📧 <span>You'll receive a confirmation email once the discount is applied</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg animate-in">
            <CardHeader className="flex flex-row items-start justify-between bg-gradient-to-r from-green-50 to-emerald-50">
              <div>
                <CardTitle className="text-2xl">🎉 Discount Applied!</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSuccessModal(false)}>
                <X className="size-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="text-center py-4">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="size-16 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">Your Code is Active!</h3>
                <p className="text-gray-600 mb-4">
                  Promo code <Badge className="bg-green-600 font-mono mx-1">{appliedCode?.code}</Badge>
                  has been successfully applied to your subscription.
                </p>

                {/* Savings Highlight */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">You're saving</div>
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    €{calculateDiscount().toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">every month!</div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 bg-gray-50 rounded-lg text-left mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Original Price</span>
                    <span className="text-sm line-through text-gray-400">€{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-600">Your Discount</span>
                    <span className="text-sm text-green-600 font-medium">-€{calculateDiscount().toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="font-medium">New Monthly Price</span>
                    <span className="text-xl font-bold text-green-600">€{finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Confirmation Info */}
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Mail className="size-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Confirmation Email Sent!</strong> Check your inbox for discount details and updated subscription information.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Calendar className="size-5 text-purple-600 mt-0.5" />
                    <div className="text-sm text-purple-800">
                      <strong>Valid Until:</strong> {new Date(appliedCode?.expiryDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 py-6" onClick={() => setShowSuccessModal(false)}>
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
