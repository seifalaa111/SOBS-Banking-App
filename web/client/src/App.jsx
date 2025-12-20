import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Transfer from './pages/transfers/Transfer';
import Bills from './pages/bills/Bills';
import Profile from './pages/profile/Profile';
import SavingsGoals from './pages/savings/SavingsGoals';
import Beneficiaries from './pages/beneficiaries/Beneficiaries';
import Analytics from './pages/analytics/Analytics';
import QRPayments from './pages/qr/QRPayments';
import CardControls from './pages/cards/CardControls';
import Notifications from './pages/notifications/Notifications';
import ScheduledPayments from './pages/scheduled/ScheduledPayments';
import Support from './pages/support/Support';
import TransactionHistory from './pages/transactions/TransactionHistory';
import DashboardLayout from './layouts/DashboardLayout';

// Redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const ProtectedRoute = () => {
  const token = localStorage.getItem('sessionToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><PageWrapper><Login /></PageWrapper></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><PageWrapper><Register /></PageWrapper></PublicRoute>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/transfer" element={<PageWrapper><Transfer /></PageWrapper>} />
          <Route path="/bills" element={<PageWrapper><Bills /></PageWrapper>} />
          <Route path="/transactions" element={<PageWrapper><TransactionHistory /></PageWrapper>} />
          <Route path="/savings" element={<PageWrapper><SavingsGoals /></PageWrapper>} />
          <Route path="/beneficiaries" element={<PageWrapper><Beneficiaries /></PageWrapper>} />
          <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
          <Route path="/qr" element={<PageWrapper><QRPayments /></PageWrapper>} />
          <Route path="/cards" element={<PageWrapper><CardControls /></PageWrapper>} />
          <Route path="/notifications" element={<PageWrapper><Notifications /></PageWrapper>} />
          <Route path="/scheduled" element={<PageWrapper><ScheduledPayments /></PageWrapper>} />
          <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
