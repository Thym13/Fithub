/**
 * Email Service for FitHub
 * Simulates email sending operations
 */

import { db } from './database';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  type: 'verification' | 'welcome' | 'notification' | 'approval' | 'rejection';
}

export interface NotificationOptions {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

class EmailService {
  private SENT_EMAILS_KEY = 'fithub_sent_emails';
  private NOTIFICATIONS_KEY = 'fithub_notifications';

  /**
   * Send verification email with token
   */
  async sendVerificationEmail(email: string, token: string, userName: string): Promise<boolean> {
    const verificationLink = `${window.location.origin}/verify-email?token=${token}`;

    const emailContent: EmailOptions = {
      to: email,
      subject: 'FitHub - Verify Your Email Address',
      body: `
        <h2>Welcome to FitHub, ${userName}! 🏋️</h2>
        <p>Thank you for registering with FitHub. Please verify your email address to continue.</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email Address
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${verificationLink}</p>
        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
          If you didn't create an account with FitHub, you can safely ignore this email.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          This verification link will expire in 24 hours.
        </p>
      `,
      type: 'verification'
    };

    return this.sendEmail(emailContent);
  }

  /**
   * Send welcome email with platform guide
   */
  async sendWelcomeEmail(email: string, userName: string, role: string): Promise<boolean> {
    const emailContent: EmailOptions = {
      to: email,
      subject: 'Welcome to FitHub - Your Fitness Journey Starts Now! 🎉',
      body: `
        <h2>Welcome to FitHub, ${userName}! 🎉</h2>
        <p>We're excited to have you join our fitness community!</p>

        <h3>Quick Start Guide:</h3>
        ${role === 'member' ? `
          <ul>
            <li><strong>Browse Classes:</strong> Check out our group fitness classes and schedule</li>
            <li><strong>Book Sessions:</strong> Reserve your spot in upcoming classes</li>
            <li><strong>Track Progress:</strong> Monitor your fitness journey and achievements</li>
            <li><strong>Set Goals:</strong> Define and track your fitness objectives</li>
          </ul>
        ` : role === 'trainer' ? `
          <ul>
            <li><strong>Manage Clients:</strong> View and track your assigned clients</li>
            <li><strong>Create Programs:</strong> Design custom training programs</li>
            <li><strong>Schedule Sessions:</strong> Set up training sessions with clients</li>
            <li><strong>Track Progress:</strong> Monitor client achievements and metrics</li>
          </ul>
        ` : `
          <ul>
            <li><strong>Manage Members:</strong> Review and approve new registrations</li>
            <li><strong>Handle Bookings:</strong> Oversee class reservations and schedules</li>
            <li><strong>Customer Support:</strong> Assist members with inquiries</li>
            <li><strong>Reports:</strong> Access gym statistics and performance metrics</li>
          </ul>
        `}

        <p>If you have any questions, our support team is here to help!</p>
        <p><a href="${window.location.origin}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Go to FitHub Dashboard
        </a></p>

        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
          Need help? Contact us at support@fithub.gr
        </p>
      `,
      type: 'welcome'
    };

    return this.sendEmail(emailContent);
  }

  /**
   * Send notification to secretary/manager about new registration
   */
  async notifyAdminNewRegistration(
    adminEmail: string,
    userName: string,
    userEmail: string,
    role: 'member' | 'trainer' | 'secretary'
  ): Promise<boolean> {
    const emailContent: EmailOptions = {
      to: adminEmail,
      subject: `New ${role.charAt(0).toUpperCase() + role.slice(1)} Registration - Action Required`,
      body: `
        <h2>New Registration Pending Approval</h2>
        <p>A new user has registered and is awaiting approval:</p>

        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>Please review and approve/reject this registration in the admin dashboard.</p>
        <p><a href="${window.location.origin}/manager" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Go to Admin Dashboard
        </a></p>
      `,
      type: 'notification'
    };

    return this.sendEmail(emailContent);
  }

  /**
   * Send approval email
   */
  async sendApprovalEmail(email: string, userName: string, role: string): Promise<boolean> {
    const emailContent: EmailOptions = {
      to: email,
      subject: 'FitHub - Your Account Has Been Approved! ✅',
      body: `
        <h2>Congratulations, ${userName}! 🎉</h2>
        <p>Your ${role} account has been approved and activated.</p>
        <p>You can now access all FitHub features!</p>
        <p><a href="${window.location.origin}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Login to FitHub
        </a></p>
      `,
      type: 'approval'
    };

    return this.sendEmail(emailContent);
  }

  /**
   * Send rejection email
   */
  async sendRejectionEmail(email: string, userName: string, reason: string): Promise<boolean> {
    const emailContent: EmailOptions = {
      to: email,
      subject: 'FitHub - Registration Update',
      body: `
        <h2>Hello ${userName},</h2>
        <p>Thank you for your interest in FitHub.</p>
        <p>Unfortunately, we are unable to approve your registration at this time.</p>
        <div style="background-color: #fef2f2; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>If you have any questions or would like to discuss this further, please contact us at support@fithub.gr</p>
      `,
      type: 'rejection'
    };

    return this.sendEmail(emailContent);
  }

  /**
   * Core email sending function (simulated)
   */
  async sendEmail(emailOptions: EmailOptions): Promise<boolean> {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store sent email in localStorage for demo purposes
      const sentEmails = this.getSentEmails();
      sentEmails.push({
        ...emailOptions,
        sentAt: new Date().toISOString(),
        id: db.generateId()
      });
      localStorage.setItem(this.SENT_EMAILS_KEY, JSON.stringify(sentEmails));

      console.log('📧 Email sent:', emailOptions.subject, 'to', emailOptions.to);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Get all sent emails (for demo/debugging)
   */
  getSentEmails(): any[] {
    const emails = localStorage.getItem(this.SENT_EMAILS_KEY);
    return emails ? JSON.parse(emails) : [];
  }

  /**
   * Get verification link for display purposes
   */
  getVerificationLink(token: string): string {
    return `${window.location.origin}/verify-email?token=${token}`;
  }

  /**
   * Create in-app notification
   */
  createNotification(options: NotificationOptions): void {
    const notifications = this.getNotifications();
    notifications.push({
      ...options,
      id: db.generateId(),
      read: false,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }

  /**
   * Get notifications for a user
   */
  getNotifications(userId?: string): any[] {
    const notifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
    const allNotifications = notifications ? JSON.parse(notifications) : [];

    if (userId) {
      return allNotifications.filter((n: any) => n.userId === userId);
    }

    return allNotifications;
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const index = notifications.findIndex((n: any) => n.id === notificationId);
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }

  /**
   * Clear all emails (for testing)
   */
  clearSentEmails(): void {
    localStorage.removeItem(this.SENT_EMAILS_KEY);
  }

  /**
   * Clear all notifications (for testing)
   */
  clearNotifications(): void {
    localStorage.removeItem(this.NOTIFICATIONS_KEY);
  }
}

export const emailService = new EmailService();
