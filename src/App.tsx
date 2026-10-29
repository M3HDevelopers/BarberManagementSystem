import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import PublicLayout from './components/PublicLayout';
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import BarbersPage from './pages/public/Barbers';
import Booking from './pages/public/Booking';
import Contact from './pages/public/Contact';
import Login from './pages/Login';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/barbers" element={<PublicLayout><BarbersPage /></PublicLayout>} />
          <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/appointments" element={<ProtectedRoute><DashboardLayout><Appointments /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/customers" element={<ProtectedRoute><DashboardLayout><Customers /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/barbers" element={<ProtectedRoute><DashboardLayout><Barbers /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/pos" element={<ProtectedRoute><DashboardLayout><POS /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/queue" element={<ProtectedRoute><DashboardLayout><Queue /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/inventory" element={<ProtectedRoute><DashboardLayout><Inventory /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
