import React, { useEffect, useState, useCallback } from 'react';
import { authAPI, User } from '../api/auth';
import { env } from '../config/env';

declare global {
  interface Window {
    google: any;
  }
}

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleResponse = useCallback(async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authAPI.googleLogin(response.credential);
      onLogin(result.user, result.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [onLogin]);

  useEffect(() => {
    // Check if Google Client ID is configured
    if (!env.google.clientId) {
      setError('Google Client ID is not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file.');
      return;
    }

    // Initialize Google Identity Services
    const initializeGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: env.google.clientId,
            callback: handleGoogleResponse,
            ux_mode: 'popup',
            auto_select: false,
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
            }
          );
        } catch (err: any) {
          console.error('Google Sign-In initialization error:', err);
          setError(`Failed to initialize Google Sign-In: ${err.message}`);
        }
      }
    };

    // Load Google Identity Services script if not loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [handleGoogleResponse]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h1>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Signing in...</span>
              </div>
            ) : (
              <div id="google-signin-button" className="flex justify-center"></div>
            )}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or sign up through email</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled
              />
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              disabled
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;