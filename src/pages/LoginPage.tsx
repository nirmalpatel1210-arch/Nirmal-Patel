import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO, INITIAL_AGENT, INITIAL_ADMIN } from '../data/mockData';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  isAdmin?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, isAdmin = false }) => {
  const { login, role } = useApp();
  const [identifier, setIdentifier] = useState(isAdmin ? 'ccshyam945@gmail.com' : 'SSE-AG-88219');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = login(identifier, password, isAdmin);
      setLoading(false);
      if (res.success) {
        onNavigate(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please verify your Agent ID and password.');
      }
    }, 600);
  };

  const handleQuickFill = (roleType: 'agent' | 'admin') => {
    if (roleType === 'agent') {
      setIdentifier(INITIAL_AGENT.agentId);
      setPassword('agent@shyam2026');
      setErrorMsg('');
    } else {
      setIdentifier(INITIAL_ADMIN.email);
      setPassword('admin@shyam2026');
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Lockup */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-extrabold text-2xl shadow-xl shadow-emerald-500/20 mb-4">
            SSE
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            {COMPANY_INFO.name}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {isAdmin ? 'Super Admin Portal Access' : 'Agent & Operator Console'}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-700 sm:px-10">
          <div className="flex items-center justify-between pb-5 border-b border-slate-700/80 mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isAdmin ? 'Admin Authentication' : 'Agent Sign In'}</span>
            </h2>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              SECURE BBPS GATEWAY
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAdmin ? 'Admin Email / Username' : 'Agent ID / Registered Email / Mobile'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isAdmin ? 'ccshyam945@gmail.com' : 'e.g. SSE-AG-88219 or 9825412390'}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Remember this terminal</span>
              </label>

              <span className="text-[11px] text-slate-500">
                TLS 1.3 256-bit Encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Instant Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('agent')}
                className="p-2 text-left bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg text-xs transition-colors"
              >
                <div className="font-semibold text-emerald-400">Agent Login</div>
                <div className="text-[10px] text-slate-400 truncate">SSE-AG-88219</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 text-left bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg text-xs transition-colors"
              >
                <div className="font-semibold text-cyan-400">Admin Login</div>
                <div className="text-[10px] text-slate-400 truncate">Super Administrator</div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Return to Agent Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('/admin/login')}
                className="text-xs text-slate-400 hover:text-emerald-400"
              >
                Are you an SSE Administrator? Login here →
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>{COMPANY_INFO.name} · {COMPANY_INFO.address}</p>
          <p className="mt-1">Support: +91 {COMPANY_INFO.mobile} · {COMPANY_INFO.email}</p>
        </div>
      </div>
    </div>
  );
};
