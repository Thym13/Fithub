/**
 * useAuth Hook
 * Provides easy access to authentication state and user info
 */

import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { User } from '../services/database';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(currentUser !== null);
    setIsLoading(false);
  };

  const hasRole = (role: 'member' | 'trainer' | 'secretary' | 'manager') => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: Array<'member' | 'trainer' | 'secretary' | 'manager'>) => {
    return authService.hasAnyRole(roles);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    logout,
    refresh: checkAuth
  };
}
