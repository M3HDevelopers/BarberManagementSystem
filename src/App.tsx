import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import PublicLayout from './components/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import BarbersPage from './pages/public/Barbers';
import Booking from './pages/public/Booking';
import Contact from './pages/public/Contact';

// Auth
import Login from './pages/Login';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Appointments from './pages/dashboard/Appointments';
import Customers from './pages/dashboard/Customers';
import Barbers from './pages/dashboard/Barbers';
import POS from './pages/dashboard/POS';
import Queue from './pages/dashboard/Queue';
import Inventory from './pages/dashboard/Inventory';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicPageWrapper({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicPageWrapper><Home /></PublicPageWrapper>} />
          <Route path="/services" element={<PublicPageWrapper><Services /></PublicPageWrapper>} />
          <Route path="/barbers" element={<PublicPageWrapper><BarbersPage /></PublicPageWrapper>} />
          <Route path="/booking" element={<PublicPageWrapper><Booking /></PublicPageWrapper>} />
          <Route path="/contact" element={<PublicPageWrapper><Contact /></PublicPageWrapper>} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardWrapper><Dashboard /></DashboardWrapper>} />
          <Route path="/dashboard/appointments" element={<DashboardWrapper><Appointments /></DashboardWrapper>} />
          <Route path="/dashboard/customers" element={<DashboardWrapper><Customers /></DashboardWrapper>} />
          <Route path="/dashboard/barbers" element={<DashboardWrapper><Barbers /></DashboardWrapper>} />
          <Route path="/dashboard/pos" element={<DashboardWrapper><POS /></DashboardWrapper>} />
          <Route path="/dashboard/queue" element={<DashboardWrapper><Queue /></DashboardWrapper>} />
          <Route path="/dashboard/inventory" element={<DashboardWrapper><Inventory /></DashboardWrapper>} />
          <Route path="/dashboard/reports" element={<DashboardWrapper><Reports /></DashboardWrapper>} />
          <Route path="/dashboard/settings" element={<DashboardWrapper><Settings /></DashboardWrapper>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
