/**
 * Authentication Service for FitHub
 * Handles login, logout, and session management
 */

import { db, User } from './database';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

class AuthService {
  private SESSION_KEY = 'fithub_session';
  private SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by email
      const user = db.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Check password
      if (user.password !== password) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return {
          success: false,
          error: 'Please verify your email address before logging in. Check your inbox for the verification link.'
        };
      }

      // Check account status
      if (user.accountStatus === 'Pending') {
        return {
          success: false,
          error: 'Your account is pending approval. You will receive an email once your account is approved.'
        };
      }

      if (user.accountStatus === 'Rejected') {
        return {
          success: false,
          error: 'Your account registration was not approved. Please contact support for more information.'
        };
      }

      if (user.accountStatus === 'Suspended') {
        return {
          success: false,
          error: 'Your account has been suspended. Please contact support.'
        };
      }

      // Create session
      const session: AuthSession = {
        user,
        token: this.generateToken(),
        expiresAt: new Date(Date.now() + this.SESSION_DURATION).toISOString()
      };

      // Save session
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

      console.log('✅ Login successful:', user.email, 'Role:', user.role);

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login. Please try again.'
      };
    }
  }

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    console.log('✅ Logout successful');
  }

  /**
   * Get current session
   */
  getSession(): AuthSession | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);

    if (!sessionData) {
      return null;
    }

    try {
      const session: AuthSession = JSON.parse(sessionData);

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    const session = this.getSession();
    return session?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Check if current user has a specific role
   */
  hasRole(role: 'member' | 'trainer' | 'secretary' | 'manager'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: Array<'member' | 'trainer' | 'secretary' | 'manager'>): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Generate random session token
   */
  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Refresh session (extend expiration)
   */
  refreshSession(): void {
    const session = this.getSession();
    if (session) {
      session.expiresAt = new Date(Date.now() + this.SESSION_DURATION).toISOString();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  /**
   * Clear all sessions (for testing)
   */
  clearAllSessions(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}

export const authService = new AuthService();
