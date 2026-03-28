import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Demo Credentials for Testing:
  // Admin: admin@test.com / 1234
  // Manager: manager@test.com / 1234
  // Secretary: secretary@test.com / 1234
  // Trainer: trainer@test.com / 1234
  // Member: member@test.com / 1234

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check credentials
    if (password !== '1234') {
      setError('Invalid email or password');
      return;
    }

    // Route based on email
    switch (email.toLowerCase()) {
      case 'admin@test.com':
        navigate('/owner');
        break;
      case 'manager@test.com':
        navigate('/manager');
        break;
      case 'secretary@test.com':
        navigate('/receptionist');
        break;
      case 'trainer@test.com':
        navigate('/trainer');
        break;
      case 'member@test.com':
        navigate('/member');
        break;
      default:
        setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-3">🏋️ FitHub</h1>
          <p className="text-gray-600">Gym Management CRM System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Register here
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div><strong>Admin:</strong> admin@test.com / 1234</div>
                <div><strong>Manager:</strong> manager@test.com / 1234</div>
                <div><strong>Secretary:</strong> secretary@test.com / 1234</div>
                <div><strong>Trainer:</strong> trainer@test.com / 1234</div>
                <div><strong>Member:</strong> member@test.com / 1234</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}