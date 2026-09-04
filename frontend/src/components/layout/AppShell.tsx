import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BoxesIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MenuIcon,
  PackageIcon,
  ShieldCheckIcon,
  UsersIcon,
  XIcon } from
'lucide-react';
import { useReliefData } from '../../contexts/ReliefDataContext';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
{ to: '/', label: 'Overview', icon: LayoutDashboardIcon, end: true },
{ to: '/requests', label: 'Relief requests', icon: LifeBuoyIcon, end: false },
{ to: '/centers', label: 'Drop-off centers', icon: PackageIcon, end: false },
{ to: '/volunteers', label: 'Volunteers', icon: UsersIcon, end: false },
{ to: '/inventory', label: 'Inventory', icon: BoxesIcon, end: false }];


function navClasses(isActive: boolean): string {
  return `inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
  isActive ?
  'bg-brand-50 text-brand-700' :
  'text-ink-muted hover:bg-subtle hover:text-ink'}`;

}

export function AppShell({ children }: {children: React.ReactNode;}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { requests } = useReliefData();
  const { user, logout } = useAuth();
  const navigation = NAV.map((item) =>
    user?.role === 'coordinator' && item.to === '/requests' ?
    { ...item, to: '/admin/requests' } :
    user?.role === 'coordinator' && item.to === '/centers' ?
    { ...item, to: '/admin/centers' } :
    user?.role === 'coordinator' && item.to === '/volunteers' ?
    { ...item, to: '/admin/volunteers' } :
    user?.role === 'coordinator' && item.to === '/inventory' ?
    { ...item, to: '/admin/inventory' } :
    item
  );
  const highPending = requests.items.filter(
    (r) => r.status === 'Pending' && r.urgency === 'High'
  ).length;

  return (
    <div className="flex min-h-full w-full flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-sm focus:text-white">
        
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-6 px-5 lg:px-8">
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

          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
            {navigation.map(({ to, label, icon: Icon, end }) =>
            <NavLink key={to} to={to} end={end} className={({ isActive }) => navClasses(isActive)}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            )}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {highPending > 0 &&
            <span className="inline-flex items-center gap-2 rounded border border-signal-200 bg-signal-50 px-2.5 py-1 text-xs font-medium text-signal-600">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-600" aria-hidden="true" />
                {highPending} high-urgency pending
              </span>
            }
            <span className="text-xs text-ink-faint">National Coordination Desk</span>
            {user ?
            <button type="button" className="text-xs font-medium text-brand-700 hover:underline" onClick={logout}>
              Sign out
            </button> :
            <>
              <NavLink to="/login" className="text-xs font-medium text-brand-700 hover:underline">Sign in</NavLink>
              <NavLink to="/signup" className="text-xs font-medium text-brand-700 hover:underline">Create account</NavLink>
              <NavLink to="/admin" className="inline-flex items-center gap-1.5 rounded border border-line-strong px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-subtle">
                <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Admin
              </NavLink>
            </>}
          </div>

          <button
            type="button"
            className="ml-auto rounded border border-line-strong p-2 text-ink-muted lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((open) => !open)}>
            
            {mobileOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>

        {mobileOpen &&
        <nav aria-label="Mobile" className="border-t border-line bg-surface px-5 py-3 lg:hidden">
            <ul className="flex flex-col gap-1">
              {navigation.map(({ to, label, icon: Icon, end }) =>
            <li key={to}>
                  <NavLink
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => navClasses(isActive)}>
                
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
            )}
              <li className="mt-2 border-t border-line pt-2">
                {user ?
                <button type="button" className={navClasses(false)} onClick={() => { logout(); setMobileOpen(false); }}>
                  Sign out
                </button> :
                <div className="flex flex-col gap-1">
                  <NavLink to="/login" onClick={() => setMobileOpen(false)} className={({ isActive }) => navClasses(isActive)}>Sign in</NavLink>
                  <NavLink to="/signup" onClick={() => setMobileOpen(false)} className={({ isActive }) => navClasses(isActive)}>Create account</NavLink>
                  <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => navClasses(isActive)}><ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />Admin</NavLink>
                </div>}
              </li>
            </ul>
          </nav>
        }
      </header>

      <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            ReliefLanka — coordination platform for district-level flood and disaster
            response.
          </p>
          <p>Emergency hotline 117 · Data refreshed continuously during active events</p>
        </div>
      </footer>
    </div>);

}