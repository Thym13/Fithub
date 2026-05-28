/**
 * Payment Service for FitHub
 * Simulates payment processing operations
 */

import { db, Transaction } from './database';
import { emailService } from './email';

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  message: string;
}

export interface CardValidationResult {
  isValid: boolean;
  error?: string;
}

class PaymentService {
  /**
   * Validate credit card number using Luhn algorithm
   */
  validateCardNumber(cardNumber: string): CardValidationResult {
    const cleaned = cardNumber.replace(/\s+/g, '');

    if (!/^\d+$/.test(cleaned)) {
      return { isValid: false, error: 'Card number must contain only digits' };
    }

    if (cleaned.length < 13 || cleaned.length > 19) {
      return { isValid: false, error: 'Card number must be between 13 and 19 digits' };
    }

    // Luhn Algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return { isValid: false, error: 'Invalid card number (failed Luhn check)' };
    }

    return { isValid: true };
  }

  /**
   * Validate CVV
   */
  validateCVV(cvv: string): CardValidationResult {
    const cleaned = cvv.trim();

    if (!/^\d{3,4}$/.test(cleaned)) {
      return { isValid: false, error: 'CVV must be 3 or 4 digits' };
    }

    return { isValid: true };
  }

  /**
   * Validate expiry date
   */
  validateExpiry(month: string, year: string): CardValidationResult {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: 'Invalid expiry month' };
    }

    const currentYear = new Date().getFullYear() % 100; // Last 2 digits
    const currentMonth = new Date().getMonth() + 1;

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return { isValid: false, error: 'Card has expired' };
    }

    return { isValid: true };
  }

  /**
   * Validate card holder name
   */
  validateCardHolder(name: string): CardValidationResult {
    const cleaned = name.trim();

    if (cleaned.length < 3) {
      return { isValid: false, error: 'Card holder name is too short' };
    }

    if (!/^[a-zA-Z\s]+$/.test(cleaned)) {
      return { isValid: false, error: 'Card holder name must contain only letters' };
    }

    return { isValid: true };
  }

  /**
   * Get card type from card number
   */
  getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '');

    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';

    return 'Unknown';
  }

  /**
   * Process payment (simulated)
   */
  async processPayment(
    userId: string,
    amount: number,
    paymentDetails: PaymentDetails,
    description: string
  ): Promise<PaymentResult> {
    try {
      // Validate payment details
      const cardValidation = this.validateCardNumber(paymentDetails.cardNumber);
      if (!cardValidation.isValid) {
        return {
          success: false,
          error: cardValidation.error,
          message: cardValidation.error!
        };
      }

      const cvvValidation = this.validateCVV(paymentDetails.cvv);
      if (!cvvValidation.isValid) {
        return {
          success: false,
          error: cvvValidation.error,
          message: cvvValidation.error!
        };
      }

      const expiryValidation = this.validateExpiry(
        paymentDetails.expiryMonth,
        paymentDetails.expiryYear
      );
      if (!expiryValidation.isValid) {
        return {
          success: false,
          error: expiryValidation.error,
          message: expiryValidation.error!
        };
      }

      const holderValidation = this.validateCardHolder(paymentDetails.cardHolder);
      if (!holderValidation.isValid) {
        return {
          success: false,
          error: holderValidation.error,
          message: holderValidation.error!
        };
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment failure for testing (card ending in 0002)
      const lastFourDigits = paymentDetails.cardNumber.replace(/\s+/g, '').slice(-4);
      if (lastFourDigits === '0002') {
        const transaction = db.createTransaction({
          userId,
          amount,
          status: 'Failed',
          paymentMethod: 'Card',
          description: `${description} - Payment Failed`
        });

        return {
          success: false,
          error: 'Payment declined by bank',
          message: 'Your card was declined. Please check your card details and try again.',
          transactionId: transaction.id
        };
      }

      // Create successful transaction
      const transaction = db.createTransaction({
        userId,
        amount,
        status: 'Completed',
        paymentMethod: 'Card',
        description
      });

      // Send payment confirmation email
      const user = db.findUserById(userId);
      if (user) {
        await this.sendPaymentConfirmation(
          user.email,
          user.name,
          amount,
          transaction.id,
          description
        );
      }

      return {
        success: true,
        transactionId: transaction.id,
        message: `Payment of €${amount.toFixed(2)} processed successfully!`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: 'Payment processing failed. Please try again.'
      };
    }
  }

  /**
   * Send payment confirmation email
   */
  private async sendPaymentConfirmation(
    email: string,
    userName: string,
    amount: number,
    transactionId: string,
    description: string
  ): Promise<void> {
    await emailService.sendEmail({
      to: email,
      subject: 'FitHub - Payment Confirmation',
      body: `
        <h2>Payment Successful! ✅</h2>
        <p>Dear ${userName},</p>
        <p>Your payment has been processed successfully.</p>

        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <h3 style="margin-top: 0;">Transaction Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
              <td style="padding: 8px 0;">${transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0;">€${amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Description:</strong></td>
              <td style="padding: 8px 0;">${description}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
              <td style="padding: 8px 0;">Credit Card</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; color: #10b981;"><strong>Completed</strong></td>
            </tr>
          </table>
        </div>

        <p>Your membership is now active! You can start using all FitHub facilities.</p>

        <p><a href="${window.location.origin}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Go to Dashboard
        </a></p>

        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
          If you have any questions about this transaction, please contact us at billing@fithub.gr
        </p>

        <p style="color: #6b7280; font-size: 14px;">
          Thank you for choosing FitHub! 🏋️
        </p>
      `,
      type: 'notification'
    });
  }

  /**
   * Refund payment (simulated)
   */
  async refundPayment(transactionId: string, reason: string): Promise<PaymentResult> {
    const transactions = db.getAllTransactions();
    const transaction = transactions.find(t => t.id === transactionId);

    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
        message: 'Transaction not found'
      };
    }

    if (transaction.status === 'Refunded') {
      return {
        success: false,
        error: 'Already refunded',
        message: 'This transaction has already been refunded'
      };
    }

    if (transaction.status !== 'Completed') {
      return {
        success: false,
        error: 'Cannot refund',
        message: 'Only completed transactions can be refunded'
      };
    }

    // Simulate refund processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create refund transaction
    const refundTransaction = db.createTransaction({
      userId: transaction.userId,
      amount: -transaction.amount,
      status: 'Refunded',
      paymentMethod: transaction.paymentMethod,
      description: `Refund: ${transaction.description} - ${reason}`
    });

    // Update original transaction status
    // Note: In real implementation, you'd update the transaction in the database

    const user = db.findUserById(transaction.userId);
    if (user) {
      await this.sendRefundConfirmation(
        user.email,
        user.name,
        transaction.amount,
        refundTransaction.id,
        reason
      );
    }

    return {
      success: true,
      transactionId: refundTransaction.id,
      message: `Refund of €${transaction.amount.toFixed(2)} processed successfully`
    };
  }

  /**
   * Send refund confirmation email
   */
  private async sendRefundConfirmation(
    email: string,
    userName: string,
    amount: number,
    transactionId: string,
    reason: string
  ): Promise<void> {
    await emailService.sendEmail({
      to: email,
      subject: 'FitHub - Refund Processed',
      body: `
        <h2>Refund Processed</h2>
        <p>Dear ${userName},</p>
        <p>Your refund has been processed successfully.</p>

        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p><strong>Refund Amount:</strong> €${amount.toFixed(2)}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>The refund will appear in your account within 5-10 business days.</p>
      `,
      type: 'notification'
    });
  }

  /**
   * Get test card numbers
   */
  getTestCards(): { [key: string]: string } {
    return {
      success: '4111 1111 1111 1111', // Visa - Success
      declined: '4000 0000 0000 0002', // Visa - Declined
      mastercard: '5555 5555 5555 4444', // Mastercard - Success
      amex: '3782 822463 10005', // American Express - Success
    };
  }

  /**
   * Format card number for display (mask middle digits)
   */
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '');
    const lastFour = cleaned.slice(-4);
    return `**** **** **** ${lastFour}`;
  }

  /**
   * Get all transactions for a user
   */
  getUserTransactions(userId: string): Transaction[] {
    return db.getAllTransactions().filter(t => t.userId === userId);
  }

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): Transaction | null {
    return db.getAllTransactions().find(t => t.id === transactionId) || null;
  }
}

export const paymentService = new PaymentService();
