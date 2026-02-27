// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const success = await login(email, password);
//       if (success) navigate('/');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6">
//       <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 max-w-md w-full mx-auto relative overflow-hidden">
        
//         {/* Subtle Background Accent */}
//         <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-slate-900 pointer-events-none">
//           <ShieldCheck size={120} />
//         </div>

//         <div className="relative z-10">
//           <div className="mb-8">
//             <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
//             <p className="text-slate-500 text-sm mt-1">Continue your spiritual journey</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email Field */}
//             <div className="space-y-2">
//               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Mail size={18} />
//                 </div>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.com"
//                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300 transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2">
//               <div className="flex justify-between items-center px-1">
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                   Password
//                 </label>
//                 <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
//                   Forgot?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   <Lock size={18} />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300 transition-all"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-50 mt-4"
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <LogIn size={20} />
//                   <span>Sign In</span>
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className="text-slate-500 text-sm">
//               Don't have an account?{' '}
//               <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
//                 Join now
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
























import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Key, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'key'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithKey } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let success;
      if (loginMethod === 'email') {
        success = await login(email, password);
      } else {
        success = await loginWithKey(loginKey);
      }
      if (success) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 max-w-md w-full mx-auto relative overflow-hidden">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-slate-900 pointer-events-none">
          <ShieldCheck size={120} />
        </div>

        <div className="relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Continue your spiritual journey</p>
            
            {/* Toggle buttons */}
            <div className="flex gap-2 mt-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`pb-2 px-4 font-semibold text-sm ${
                  loginMethod === 'email'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('key')}
                className={`pb-2 px-4 font-semibold text-sm ${
                  loginMethod === 'key'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Login Key
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
              <>
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Login Key Field
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Login Key
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Key size={18} />
                  </div>
                  <input
                    type="text"
                    value={loginKey}
                    onChange={(e) => setLoginKey(e.target.value)}
                    placeholder="e.g., aB3dEfGh"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 placeholder:text-slate-300 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                Join now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}