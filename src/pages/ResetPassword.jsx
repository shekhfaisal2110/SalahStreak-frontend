import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if email or OTP is missing (e.g., direct access)
  if (!email || !otp) {
    navigate('/forgot-password');
    return null;
  }

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        toast.success('Password reset successfully');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 max-w-md w-full mx-auto relative overflow-hidden">
        
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-slate-900 pointer-events-none">
          <KeyRound size={120} />
        </div>

        <div className="relative z-10">
          <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
            <Lock size={32} />
          </div>

          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
            Secure Your Account
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Almost there! Create a strong password to finish resetting your access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tighter animate-in fade-in slide-in-from-right-2">
                    <CheckCircle2 size={12} /> Match
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 font-medium text-slate-700 transition-all ${
                    confirmPassword && !passwordsMatch ? 'focus:ring-red-400' : 'focus:ring-emerald-500'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-50 disabled:grayscale mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound size={20} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
        <ShieldAlert size={14} />
        <p className="text-[10px] font-bold uppercase tracking-widest">
          Secure End-to-End Encryption
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;