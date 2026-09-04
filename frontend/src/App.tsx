import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ReliefDataProvider } from './contexts/ReliefDataContext';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { Requests } from './pages/Requests';
import { Centers } from './pages/Centers';
import { Volunteers } from './pages/Volunteers';
import { Inventory } from './pages/Inventory';

export function App() {
  return (
    <BrowserRouter>
      <ReliefDataProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/centers" element={<Centers />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/inventory" element={<Inventory />} />
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
    </BrowserRouter>);

}