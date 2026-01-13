import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api, getDraftToken } from '../lib/utils';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AuthVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    async function verify() {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setError('Invalid magic link');
        return;
      }

      try {
        const draftToken = getDraftToken();
        const result = await api('/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ token, email, draftToken }),
        });

        // Store auth token
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userEmail', result.email);

        setStatus('success');

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Verification failed');
      }
    }

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900">Verifying...</h1>
            <p className="text-gray-500 mt-2">Please wait while we verify your login</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900">Login Successful!</h1>
            <p className="text-gray-500 mt-2">Redirecting you to the builder...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900">Verification Failed</h1>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
