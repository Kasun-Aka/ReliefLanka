import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BoxesIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useReliefData } from '../../contexts/ReliefDataContext';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboardIcon, end: true },
  { to: '/requests', label: 'Relief requests', icon: LifeBuoyIcon, end: false },
  { to: '/centers', label: 'Drop-off centers', icon: PackageIcon, end: false },
  { to: '/volunteers', label: 'Volunteers', icon: UsersIcon, end: false },
  { to: '/inventory', label: 'Inventory', icon: BoxesIcon, end: false },
];

function navClasses(isActive: boolean): string {
  return `inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-ink-muted hover:bg-subtle hover:text-ink'
  }`;
}

/** Returns initials from a display name, e.g. "Kasun Perera" → "KP" */
function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { requests } = useReliefData();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const highPending = requests.items.filter(
    (r) => r.status === 'Pending' && r.urgency === 'High'
  ).length;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-6 px-5 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-700 text-sm font-bold text-white">
              RL
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-ink">ReliefLanka</span>
              <span className="text-[11px] text-ink-faint">
                Disaster &amp; flood assistance tracker
              </span>
            </span>
          </NavLink>

          {/* Desktop nav — only shown when logged in */}
          {user && (
            <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => navClasses(isActive)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                {/* High urgency badge */}
                {highPending > 0 && (
                  <span className="inline-flex items-center gap-2 rounded border border-signal-200 bg-signal-50 px-2.5 py-1 text-xs font-medium text-signal-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal-600" aria-hidden="true" />
                    {highPending} high-urgency pending
                  </span>
                )}

                {/* User avatar + name */}
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                    {initials(user.displayName)}
                  </div>
                  <span className="max-w-[140px] truncate text-xs font-medium text-ink">
                    {user.displayName ?? user.email}
                  </span>
                </div>

                {/* Sign out */}
                <button
                  id="header-signout-btn"
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded border border-line px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-signal-600 hover:bg-signal-50 hover:text-signal-400"
                >
                  <LogOutIcon className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Not logged in — show login / register */}
                <Link
                  id="header-login-btn"
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand-400 hover:text-ink"
                >
                  <LogInIcon className="h-3.5 w-3.5" />
                  Sign in
                </Link>
                <Link
                  id="header-register-btn"
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-400"
                >
                  <UserPlusIcon className="h-3.5 w-3.5" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="ml-auto rounded border border-line-strong p-2 text-ink-muted lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav aria-label="Mobile" className="border-t border-line bg-surface px-5 py-3 lg:hidden">
            <ul className="flex flex-col gap-1">
              {user ? (
                <>
                  {NAV.map(({ to, label, icon: Icon, end }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => navClasses(isActive)}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </NavLink>
                    </li>
                  ))}
                  <li className="mt-2 border-t border-line pt-2">
                    <div className="mb-2 flex items-center gap-2 px-3 py-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                        {initials(user.displayName)}
                      </div>
                      <span className="text-xs font-medium text-ink">
                        {user.displayName ?? user.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setMobileOpen(false); handleSignOut(); }}
                      className="inline-flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium text-signal-400 transition-colors hover:bg-signal-50"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
                    >
                      <LogInIcon className="h-4 w-4" />
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex w-full items-center gap-2 rounded bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            ReliefLanka — coordination platform for district-level flood and disaster response.
          </p>
          <p>Emergency hotline 117 · Data refreshed continuously during active events</p>
        </div>
      </footer>
    </div>
  );
}