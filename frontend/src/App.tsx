import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ReliefDataProvider } from './contexts/ReliefDataContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { Home } from './pages/Home';
import { Requests } from './pages/Requests';
import { Centers } from './pages/Centers';
import { Volunteers } from './pages/Volunteers';
import { Inventory } from './pages/Inventory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes — no AppShell */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App routes — wrapped in AppShell, inner routes protected as needed */}
          <Route
            path="/*"
            element={
              <ReliefDataProvider>
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                    <Route path="/centers" element={<ProtectedRoute><Centers /></ProtectedRoute>} />
                    <Route path="/volunteers" element={<ProtectedRoute><Volunteers /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </AppShell>
              </ReliefDataProvider>
            }
          />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '6px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '13px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}