import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from './utils/axios';
import { Toaster } from 'react-hot-toast';

// Lazy load all page components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PrayerBook = lazy(() => import('./components/PrayerBook'));
const PrayerBookSummary = lazy(() => import('./components/PrayerBookSummary'));
const TasbeehList = lazy(() => import('./components/TasbeehList'));
const TasbeehCounter = lazy(() => import('./components/TasbeehCounter'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const TasbeehDailySummaryPage = lazy(() => import('./components/TasbeehDailySummary'));
const QuranTracker = lazy(() => import('./pages/QuranTracker'));
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskCalendar = lazy(() => import('./pages/TaskCalendar'));
const TaskLog = lazy(() => import('./pages/TaskLog'));
const TaskOverview = lazy(() => import('./pages/TaskOverview'));
const Analytics = lazy(() => import('./pages/Analytics'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-700 font-medium text-lg">Sabar...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

// Inner component to use location and auth hooks
function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios.post('/analytics/pageview', { route: location.pathname })
        .catch(err => console.error('Analytics error:', err));
    }
  }, [location, user]);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-700 font-medium text-lg">Sabar...</p>
      </div>
    }>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/prayerbook" element={<ProtectedRoute><PrayerBook /></ProtectedRoute>} />
        <Route path="/prayerbook/summary" element={<ProtectedRoute><PrayerBookSummary /></ProtectedRoute>} />
        <Route path="/tasbeeh" element={<ProtectedRoute><TasbeehList /></ProtectedRoute>} />
        <Route path="/tasbeeh/new" element={<ProtectedRoute><TasbeehCounter /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/tasbeeh/summary" element={<ProtectedRoute><TasbeehDailySummaryPage /></ProtectedRoute>} />
        <Route path="/quran" element={<ProtectedRoute><QuranTracker /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/tasks/:taskId" element={<ProtectedRoute><TaskCalendar /></ProtectedRoute>} />
        <Route path="/tasks/log" element={<ProtectedRoute><TaskLog /></ProtectedRoute>} />
        <Route path="/tasks/overview" element={<ProtectedRoute><TaskOverview /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;