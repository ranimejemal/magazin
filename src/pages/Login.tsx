import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthRateLimit, getGenericAuthError } from '@/hooks/useAuthRateLimit';
import { logError } from '@/lib/logger';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { checkRateLimit, recordAttempt, isLocked, lockoutRemaining } = useAuthRateLimit();

  const from = (location.state as { from?: string })?.from || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Update lockout timer
  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => {
      // Force re-render to update countdown
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Google sign-in failed',
          description: error.message || 'Unable to sign in with Google. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      logError('GoogleSignIn', error);
      toast({
        title: 'Google sign-in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit before attempting login
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      toast({
        title: 'Too many attempts',
        description: rateLimitCheck.message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        recordAttempt(false);
        // Use generic error message to prevent email enumeration
        toast({
          title: 'Login failed',
          description: getGenericAuthError(),
          variant: 'destructive',
        });
      } else {
        recordAttempt(true);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      logError('Login', error);
      recordAttempt(false);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">F</span>
            </div>
            <span className="font-display font-bold text-2xl">
              Fresh<span className="text-primary">Mart</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue shopping
          </p>

          {isLocked && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Too many failed attempts. Please try again in {lockoutRemaining} seconds.
              </AlertDescription>
            </Alert>
          )}

          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 mb-6 gap-3"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isLocked}
          >
            <GoogleIcon />
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-muted" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="fresh" className="w-full h-12" disabled={loading || isLocked}>
              {loading ? 'Signing in...' : isLocked ? `Wait ${lockoutRemaining}s` : 'Sign In'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=1600&fit=crop"
          alt="Fresh groceries"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="font-display text-4xl font-bold text-background mb-4">
            Fresh groceries,<br />delivered to you
          </h2>
          <p className="text-background/80 text-lg max-w-md">
            Shop from thousands of fresh products and get them delivered right to your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
