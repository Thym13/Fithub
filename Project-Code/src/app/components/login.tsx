import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { authService } from '../services/auth';
import { LogIn, Mail, Lock, AlertCircle, Loader2, Dumbbell } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // User is already logged in, redirect to their dashboard
      switch (currentUser.role) {
        case 'member':
          navigate('/member', { replace: true });
          break;
        case 'trainer':
          navigate('/trainer', { replace: true });
          break;
        case 'secretary':
          navigate('/receptionist', { replace: true });
          break;
        case 'manager':
          navigate('/manager', { replace: true });
          break;
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login(formData.email, formData.password);

      if (result.success && result.user) {
        // Redirect based on role
        switch (result.user.role) {
          case 'member':
            navigate('/member');
            break;
          case 'trainer':
            navigate('/trainer');
            break;
          case 'secretary':
            navigate('/receptionist');
            break;
          case 'manager':
            navigate('/manager');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);
    setFormData({ email, password });

    try {
      const result = await authService.login(email, password);

      if (result.success && result.user) {
        switch (result.user.role) {
          case 'member':
            navigate('/member');
            break;
          case 'trainer':
            navigate('/trainer');
            break;
          case 'secretary':
            navigate('/receptionist');
            break;
          case 'manager':
            navigate('/manager');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-600 rounded-full">
              <Dumbbell className="size-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to FitHub</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts (For Testing)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin('manager@fithub.gr', 'Manager123!')}
                disabled={isLoading}
                className="justify-start"
              >
                <span className="mr-2">👔</span>
                <span className="text-left flex-1">Manager</span>
                <span className="text-xs text-gray-500">manager@fithub.gr</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin('secretary@fithub.gr', 'Admin123!')}
                disabled={isLoading}
                className="justify-start"
              >
                <span className="mr-2">📋</span>
                <span className="text-left flex-1">Secretary</span>
                <span className="text-xs text-gray-500">secretary@fithub.gr</span>
              </Button>
            </div>

            <p className="text-xs text-gray-600 text-center mt-3">
              Click to auto-login with demo accounts
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}