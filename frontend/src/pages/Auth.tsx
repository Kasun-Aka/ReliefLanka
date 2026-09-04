import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogInIcon, ShieldCheckIcon, UserPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/shared/Button';
import { useAuth } from '../contexts/AuthContext';

export function Auth({ admin = false, initialSignup = false }: { admin?: boolean; initialSignup?: boolean }) {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(initialSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (isSignup) await signup(email, password, admin ? adminCode : undefined);
      else await login(email, password, admin);
      toast.success(admin ? 'Admin access granted.' : isSignup ? 'Account created.' : 'Welcome back.');
      navigate(admin ? '/admin/volunteers' : '/');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center justify-center px-4 py-10">
      <section className="w-full border border-line bg-surface p-7 shadow-sm">
        <div className="mb-7 flex items-center gap-3">
          {admin ? <ShieldCheckIcon className="h-7 w-7 text-brand-700" /> : isSignup ? <UserPlusIcon className="h-7 w-7 text-brand-700" /> : <LogInIcon className="h-7 w-7 text-brand-700" />}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">ReliefLanka</p>
            <h1 className="text-xl font-semibold text-ink">{admin ? 'Admin access' : isSignup ? 'Create your account' : 'Sign in'}</h1>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-ink">Email<input className="mt-1.5 block w-full rounded border border-line-strong px-3 py-2.5" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="block text-sm font-medium text-ink">Password<input className="mt-1.5 block w-full rounded border border-line-strong px-3 py-2.5" type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {admin && isSignup && <label className="block text-sm font-medium text-ink">Admin signup code<input className="mt-1.5 block w-full rounded border border-line-strong px-3 py-2.5" type="password" value={adminCode} onChange={(event) => setAdminCode(event.target.value)} required /></label>}
          <Button variant="primary" className="w-full justify-center" type="submit" disabled={busy}>{busy ? 'Please wait...' : admin ? (isSignup ? 'Create admin account' : 'Enter admin area') : (isSignup ? 'Create account' : 'Sign in')}</Button>
        </form>
        <div className="mt-6 flex justify-between text-sm text-ink-muted">
          <button type="button" className="text-brand-700 hover:underline" onClick={() => setIsSignup((value) => !value)}>{isSignup ? 'Already have an account?' : 'Create an account'}</button>
          {admin ? <Link className="text-brand-700 hover:underline" to="/login">Public login</Link> : <Link className="text-brand-700 hover:underline" to="/admin">Admin area</Link>}
        </div>
        {location.pathname === '/admin' && <p className="mt-5 border-t border-line pt-4 text-xs text-ink-faint">Coordinator credentials are required for this area.</p>}
      </section>
    </main>
  );
}
