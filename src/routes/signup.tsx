import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Loader2,
  Lock,
} from 'lucide-react';

import { useState } from 'react';
import {
  signUpWithEmail,
  signInWithGoogle,
} from '../firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})


function RouteComponent() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill out all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signUpWithEmail(email, password, firstName, lastName);
      // TODO: navigate to /onboarding
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      console.error('Auth failed', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center min-h-screen w-full bg-background text-foreground font-sans selection:bg-blue-500/20">
      {/* Auth Form */}
      <div className="flex w-full flex-col justify-center bg-background p-6 lg:w-[480px] lg:p-12">
        <div className="mx-auto w-full max-w-sm space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg" />
            <span className="text-2xl font-bold">Tradespace</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">
              Create an account
            </h2>
            <p className="text-muted-foreground">
              Enter your details to get started
            </p>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 font-medium">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign Up
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-border bg-background px-4 transition-all hover:border-blue-500 hover:bg-blue-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="size-5 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium">Sign up with Google</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 w-fit mx-auto">
            <Lock className="size-3" />
            <span>Secured by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
