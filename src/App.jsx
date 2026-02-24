import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import PrayerBook from './components/PrayerBook';
import PrayerBookSummary from './components/PrayerBookSummary';
import TasbeehList from './components/TasbeehList';
import TasbeehCounter from './components/TasbeehCounter';
import Dashboard from './pages/Dashboard'; // <-- import Dashboard
import { Toaster } from 'react-hot-toast';
import Leaderboard from './pages/Leaderboard';
import TasbeehDailySummaryPage from './components/TasbeehDailySummary';
import QuranTracker from './pages/QuranTracker';
import Tasks from './pages/Tasks';
import TaskCalendar from './pages/TaskCalendar';
import TaskLog from './pages/TaskLog';
import TaskOverview from './pages/TaskOverview';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
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

          {/* Root path now goes to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/tasbeeh/summary" element={<ProtectedRoute><TasbeehDailySummaryPage /></ProtectedRoute>} />
          <Route path="/quran" element={<ProtectedRoute><QuranTracker /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/tasks/:taskId" element={<ProtectedRoute><TaskCalendar /></ProtectedRoute>} />
          <Route path="/tasks/log" element={<ProtectedRoute><TaskLog /></ProtectedRoute>} />
          <Route path="/tasks/overview" element={<ProtectedRoute><TaskOverview /></ProtectedRoute>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;