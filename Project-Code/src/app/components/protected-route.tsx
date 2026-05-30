/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */

import { Navigate } from 'react-router';
import { authService } from '../services/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'member' | 'trainer' | 'secretary' | 'manager'>;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = currentUser && allowedRoles.includes(currentUser.role);

    if (!hasRequiredRole) {
      console.log('🚫 Insufficient permissions, redirecting to login');
      return <Navigate to={redirectTo} replace />;
    }
  }

  // User is authenticated and has required role
  return <>{children}</>;
}
