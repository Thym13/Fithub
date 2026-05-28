import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface PaymentCardProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cardType?: string;
  showDetails?: boolean;
}

export function PaymentCard({
  cardNumber,
  cardHolder,
  expiryDate,
  cardType,
  showDetails = false
}: PaymentCardProps) {
  const formatCardNumber = (number: string) => {
    if (!number) return '•••• •••• •••• ••••';
    const cleaned = number.replace(/\s+/g, '');
    if (showDetails) {
      return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    }
    const lastFour = cleaned.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  const getCardTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'visa':
        return 'from-blue-500 to-blue-700';
      case 'mastercard':
        return 'from-red-500 to-orange-600';
      case 'american express':
      case 'amex':
        return 'from-green-600 to-teal-600';
      case 'discover':
        return 'from-orange-500 to-yellow-600';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div
      className={`relative w-full max-w-sm aspect-[1.586/1] rounded-xl bg-gradient-to-br ${getCardTypeColor(
        cardType
      )} text-white p-6 shadow-lg`}
    >
      {/* Card Chip */}
      <div className="absolute top-6 left-6">
        <div className="w-12 h-9 bg-yellow-400 rounded-md opacity-80"></div>
      </div>

      {/* Card Type Logo */}
      <div className="absolute top-6 right-6">
        <CreditCard className="size-8 opacity-80" />
      </div>

      {/* Card Number */}
      <div className="absolute bottom-20 left-6 right-6">
        <p className="text-lg md:text-xl font-mono tracking-wider">
          {formatCardNumber(cardNumber || '')}
        </p>
      </div>

      {/* Card Holder and Expiry */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div>
          <p className="text-xs opacity-70 mb-1">CARD HOLDER</p>
          <p className="text-sm font-medium uppercase">
            {cardHolder || 'NAME ON CARD'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70 mb-1">EXPIRES</p>
          <p className="text-sm font-medium">{expiryDate || 'MM/YY'}</p>
        </div>
      </div>

      {/* Card Type Badge */}
      {cardType && (
        <div className="absolute bottom-6 right-6">
          <p className="text-xs font-bold uppercase opacity-90">{cardType}</p>
        </div>
      )}
    </div>
  );
}

interface TransactionSummaryProps {
  transactionId: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  date: string;
  description?: string;
}

export function TransactionSummary({
  transactionId,
  amount,
  status,
  date,
  description
}: TransactionSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Transaction Details</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Transaction ID</span>
          <span className="text-sm font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Amount</span>
          <span className="text-lg font-bold">€{amount.toFixed(2)}</span>
        </div>
        {description && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Description</span>
            <span className="text-sm text-right">{description}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Date</span>
          <span className="text-sm">{new Date(date).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Payment Method</span>
          <span className="text-sm flex items-center gap-1">
            <CreditCard className="size-4" />
            Credit Card
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
