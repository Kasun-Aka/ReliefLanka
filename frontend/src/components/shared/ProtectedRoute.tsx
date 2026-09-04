import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'coordinator' }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
