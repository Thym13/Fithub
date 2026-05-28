import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { db } from '../services/database';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    // Verify the email using the token
    const verifiedUser = db.verifyEmail(token);

    if (verifiedUser) {
      setStatus('success');
      setMessage(`Email verified successfully! Welcome to FitHub, ${verifiedUser.name}!`);

      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setStatus('error');
      setMessage('Invalid or expired verification token. Please request a new verification email.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-3">🏋️ FitHub</h1>
          <p className="text-gray-600">Email Verification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              {status === 'loading' && (
                <>
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                    <Loader2 className="size-12 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-xl mb-2">Verifying your email...</h2>
                    <p className="text-gray-600">Please wait while we verify your email address.</p>
                  </div>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="size-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl mb-2">Email Verified! ✅</h2>
                    <p className="text-gray-600">{message}</p>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Redirecting you to login page in 3 seconds...
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => navigate('/')} className="w-full">
                    Go to Login Now
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
                    <XCircle className="size-12 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl mb-2">Verification Failed</h2>
                    <p className="text-gray-600">{message}</p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
                      Create New Account
                    </Button>
                    <Button onClick={() => navigate('/')} className="w-full">
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
