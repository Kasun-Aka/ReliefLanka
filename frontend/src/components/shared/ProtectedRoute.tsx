import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children, role, redirectTo = '/login' }: { children: React.ReactNode; role?: 'coordinator'; redirectTo?: string }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
