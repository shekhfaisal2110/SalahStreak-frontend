import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, type } = location.state || {};
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if email is missing (direct access)
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto‑focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      toast.error('Please enter the full 6‑digit code');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/auth/verify-otp', { email, otp: otpString, type });
      if (data.success) {
        toast.success('Identity Verified');
        if (type === 'verify') {
          navigate('/login');
        } else {
          navigate('/reset-password', { state: { email, otp: otpString } });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 max-w-md w-full mx-auto relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-slate-900 pointer-events-none">
          <ShieldCheck size={120} />
        </div>

        <div className="relative z-10 text-center">
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 mx-auto">
            <KeyRound size={32} />
          </div>

          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Check Your Email</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4">
            We’ve sent a 6‑digit code to <br />
            <span className="font-bold text-slate-800">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-black bg-slate-50 text-emerald-600 border-2 border-transparent rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all outline-none"
                />
              ))}
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
                  <span>Verify Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <button className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;