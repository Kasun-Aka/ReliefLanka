import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ReliefDataProvider } from './contexts/ReliefDataContext';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { Requests } from './pages/Requests';
import { Centers } from './pages/Centers';
import { Volunteers } from './pages/Volunteers';
import { VolunteerRegistration } from './pages/VolunteerRegistration';
import { Inventory } from './pages/Inventory';
import { Auth } from './pages/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ReliefDataProvider>
        <AppShell>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth initialSignup />} />
            <Route path="/admin" element={<Auth admin />} />
            <Route path="/" element={<PublicHome />} />
            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/centers" element={<ProtectedRoute><Centers /></ProtectedRoute>} />
            <Route path="/volunteers" element={<ProtectedRoute><VolunteerRegistration /></ProtectedRoute>} />
            <Route path="/admin/volunteers" element={<ProtectedRoute role="coordinator" redirectTo="/admin"><Volunteers /></ProtectedRoute>} />
            <Route path="/admin/centers" element={<ProtectedRoute role="coordinator" redirectTo="/admin"><Centers /></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute role="coordinator" redirectTo="/admin"><Requests /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute role="coordinator" redirectTo="/admin"><Inventory /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AppShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '6px',
              border: '1px solid #e2e7ec',
              fontSize: '13px'
            }
          }} />
        
      </ReliefDataProvider>
      </AuthProvider>
    </BrowserRouter>);

}

function PublicHome() {
  const { user } = useAuth();
  return user ? <Home /> : <Auth />;
}