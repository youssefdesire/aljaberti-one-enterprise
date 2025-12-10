
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Lock, Mail, ArrowRight, Loader2, Shield, Bell, Info, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: UserRole, name: string) => void;
  onBack?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock Authentication Logic
      if (email.includes('admin')) {
        onLogin(UserRole.ADMIN, 'Ahmed Al-Mansouri');
      } else if (email.includes('manager')) {
        onLogin(UserRole.MANAGER, 'Sarah Jones');
      } else if (email.includes('user')) {
        onLogin(UserRole.USER, 'Rajesh Kumar');
      } else if (email.includes('viewer')) {
        onLogin(UserRole.VIEWER, 'John Smith');
      } else {
        setError('Invalid credentials. Please contact your system administrator.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-stretch overflow-hidden">
      
      {/* Left Panel - Announcements & Branding (Desktop Only) */}
      <div className="hidden lg:flex flex-col w-1/3 bg-slate-800 border-r border-slate-700 relative p-8">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-brand-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px]"></div>
         </div>

         <div className="z-10 relative h-full flex flex-col">
             {onBack && (
                 <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors text-sm font-medium w-fit">
                     <ArrowLeft className="w-4 h-4" /> Back to Website
                 </button>
             )}
             
             <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">A1</div>
                <div>
                   <h1 className="text-xl font-bold text-white tracking-tight">Aljaberti ONE</h1>
                   <p className="text-xs text-brand-300 font-semibold uppercase tracking-wider">Enterprise Portal</p>
                </div>
             </div>

             <div className="flex-1 space-y-6">
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Bell className="w-4 h-4" /> System Updates
                 </h2>

                 {/* Announcement Cards */}
                 <div className="bg-slate-700/50 backdrop-blur-md border border-slate-600 p-5 rounded-2xl">
                     <div className="flex justify-between items-start mb-2">
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">Maintenance</span>
                        <span className="text-xs text-slate-400">May 28</span>
                     </div>
                     <h3 className="text-white font-bold mb-1">Scheduled Downtime</h3>
                     <p className="text-sm text-slate-300 leading-relaxed">
                        The system will be offline for 30 minutes on Friday, May 28th at 02:00 AM GST for database optimization.
                     </p>
                 </div>

                 <div className="bg-slate-700/50 backdrop-blur-md border border-slate-600 p-5 rounded-2xl">
                     <div className="flex justify-between items-start mb-2">
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">New Feature</span>
                        <span className="text-xs text-slate-400">Yesterday</span>
                     </div>
                     <h3 className="text-white font-bold mb-1">WPS Payroll Integration</h3>
                     <p className="text-sm text-slate-300 leading-relaxed">
                        You can now generate .SIF files directly from the HR Module. Compliant with UAE Central Bank standards.
                     </p>
                 </div>

                 <div className="bg-slate-700/50 backdrop-blur-md border border-slate-600 p-5 rounded-2xl">
                     <div className="flex items-center gap-3 text-brand-300 mb-2">
                         <Info className="w-4 h-4" />
                         <span className="text-xs font-bold uppercase">Did you know?</span>
                     </div>
                     <p className="text-sm text-slate-300 leading-relaxed italic">
                        "Use <span className="text-white font-mono bg-slate-600 px-1 rounded">Ctrl+K</span> anywhere to open the global search bar."
                     </p>
                 </div>
             </div>

             <div className="mt-auto pt-6 text-xs text-slate-500">
                &copy; 2024 Aljaberti Group. All rights reserved. <br/>
                <a href="#" className="hover:text-brand-400 underline">Privacy Policy</a> • <a href="#" className="hover:text-brand-400 underline">Support</a>
             </div>
         </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
         {onBack && (
             <button onClick={onBack} className="absolute top-6 left-6 lg:hidden text-slate-400 hover:text-white flex items-center gap-2">
                 <ArrowLeft className="w-5 h-5" /> Back
             </button>
         )}

         <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-500 relative overflow-hidden">
            {/* Security Banner */}
            <div className="absolute top-0 left-0 w-full bg-rose-50 border-b border-rose-100 p-2 text-center">
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3" /> Authorized Personnel Only
                </p>
            </div>

            <div className="text-center mb-8 mt-4 lg:text-left">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Welcome Back</h1>
              <p className="text-slate-500">Secure access for Aljaberti ONE team.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 animate-in shake">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-slate-700"
                    placeholder="name@aljaberti.ae"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300" />
                        <span className="text-xs text-slate-500 font-medium">Keep me signed in</span>
                    </label>
                    <button type="button" onClick={() => alert("Please contact your IT Administrator to reset your password.")} className="text-xs text-brand-600 font-bold hover:underline">
                        Forgot Password?
                    </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2">Restricted Access System</p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                        Registration is invite-only. Unauthorized access attempts are logged and reported to Aljaberti Security Operations.
                    </p>
                </div>
               
               <p className="text-xs text-center text-slate-400 mt-6 mb-4 font-medium uppercase tracking-wider">Quick Login (Demo)</p>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => {setEmail('admin@aljaberti.ae'); setPassword('123');}} className="text-xs bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg text-slate-600 font-bold border border-slate-200 transition">
                     Super Admin
                  </button>
                  <button onClick={() => {setEmail('manager@aljaberti.ae'); setPassword('123');}} className="text-xs bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg text-slate-600 font-bold border border-slate-200 transition">
                     HR Manager
                  </button>
                  <button onClick={() => {setEmail('user@aljaberti.ae'); setPassword('123');}} className="text-xs bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg text-slate-600 font-bold border border-slate-200 transition">
                     Regular User
                  </button>
                  <button onClick={() => {setEmail('viewer@aljaberti.ae'); setPassword('123');}} className="text-xs bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg text-slate-600 font-bold border border-slate-200 transition">
                     Viewer
                  </button>
               </div>
            </div>

            <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-slate-400 bg-slate-50 py-2 rounded-full">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>256-bit SSL Encrypted Connection</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LoginView;
