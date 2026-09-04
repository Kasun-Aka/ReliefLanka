import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, LifeBuoyIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    default:
      return 'Registration failed. Please try again.';
  }
}

export function Register() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password || !confirm) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      toast.success('Account created! Welcome to ReliefLanka.');
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Too short', color: 'bg-signal-600', width: 'w-1/4' };
    if (password.length < 10) return { label: 'Fair', color: 'bg-caution-600', width: 'w-2/4' };
    return { label: 'Strong', color: 'bg-ok-600', width: 'w-full' };
  })();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-canvas px-4 py-12">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-brand-900/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 shadow-lg">
            <LifeBuoyIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">ReliefLanka</h1>
            <p className="mt-1 text-sm text-ink-muted">Disaster &amp; flood assistance tracker</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-line bg-surface p-8 shadow-raised">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink">Create an account</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-300 transition-colors hover:text-brand-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form id="register-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Display name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="block text-sm font-medium text-ink">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Kasun Perera"
                  className="w-full rounded-md border border-line bg-canvas py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-sm font-medium text-ink">
                Email address
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-line bg-canvas py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-md border border-line bg-canvas py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
                >
                  {showPw ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {passwordStrength && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-subtle">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                    />
                  </div>
                  <p className="text-xs text-ink-faint">{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="register-confirm" className="block text-sm font-medium text-ink">
                Confirm password
              </label>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-md border bg-canvas py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 transition-colors ${
                    confirm && confirm !== password
                      ? 'border-signal-600 focus:border-signal-600 focus:ring-signal-600'
                      : 'border-line focus:border-brand-400 focus:ring-brand-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
                >
                  {showConfirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-xs text-signal-400">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          ReliefLanka — National Coordination Desk · Emergency hotline 117
        </p>
      </div>
    </div>
  );
}
