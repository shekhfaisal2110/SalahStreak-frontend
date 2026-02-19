import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Mail, Send, ChevronLeft, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/forgot-password', { email });
      if (data.success) {
        toast.success('OTP sent to your email');
        navigate('/verify-otp', { state: { email, type: 'reset' } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6">
      {/* Back Button */}
      <div className="max-w-md mx-auto w-full mb-4">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Login
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 max-w-md w-full mx-auto relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-slate-900 pointer-events-none">
          <ShieldCheck size={120} />
        </div>

        <div className="relative z-10">
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
            <Mail size={32} />
          </div>

          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
            Reset Password
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Enter your email address and we'll send you an <span className="font-bold text-slate-700">OTP code</span> to reset your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Help Footer */}
      <p className="text-center mt-8 text-slate-400 text-xs">
        Didn't receive a code? <button className="font-bold text-emerald-600 hover:underline">Contact Support</button>
      </p>
    </div>
  );
};

export default ForgotPassword;