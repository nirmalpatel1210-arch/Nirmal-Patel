import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/mockData';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  AlertCircle,
  KeyRound,
  Shield,
  HelpCircle,
  CheckCircle2,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  isAdmin?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, isAdmin = false }) => {
  const { login } = useApp();
  const [activePortal, setActivePortal] = useState<'agent' | 'admin'>(isAdmin ? 'admin' : 'agent');
  const [identifier, setIdentifier] = useState(isAdmin ? 'nirmalpatel1210@gmail.com' : 'MEPL-AG-88219');
  const [password, setPassword] = useState(isAdmin ? 'admin@mannat2026' : 'agent@mannat2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showAccessGuide, setShowAccessGuide] = useState(false);

  const handlePortalSwitch = (portal: 'agent' | 'admin') => {
    setActivePortal(portal);
    setErrorMsg('');
    if (portal === 'admin') {
      setIdentifier('nirmalpatel1210@gmail.com');
      setPassword('admin@mannat2026');
    } else {
      setIdentifier('MEPL-AG-88219');
      setPassword('agent@mannat2026');
    }
  };

  const handleQuickLogin = (portal: 'agent' | 'admin') => {
    setActivePortal(portal);
    setErrorMsg('');
    const id = portal === 'admin' ? 'nirmalpatel1210@gmail.com' : 'MEPL-AG-88219';
    const pass = portal === 'admin' ? 'admin@mannat2026' : 'agent@mannat2026';
    setIdentifier(id);
    setPassword(pass);
    setLoading(true);

    setTimeout(() => {
      const res = login(id, pass, portal === 'admin');
      setLoading(false);
      if (res.success) {
        onNavigate(portal === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify credentials.');
      }
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const isCurrentAdmin = activePortal === 'admin';

    setTimeout(() => {
      const res = login(identifier, password, isCurrentAdmin);
      setLoading(false);
      if (res.success) {
        onNavigate(isCurrentAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        setErrorMsg(res.message || 'Invalid login credentials. Please check your ID and password.');
      }
    }, 350);
  };

  const isCurrentAdmin = activePortal === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background radial highlight based on active portal */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isCurrentAdmin ? 'bg-indigo-600/10' : 'bg-emerald-500/10'
        }`}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Lockup */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white font-extrabold text-base shadow-md transition-all duration-300 mb-3 border ${
              isCurrentAdmin
                ? 'bg-slate-900 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-900 border-emerald-500/40 text-emerald-300'
            }`}
          >
            MEPL
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
            {COMPANY_INFO.name}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Commercial Credit Card Payment & Liquidity Settlement Network
          </p>
        </div>

        {/* 1-Click Quick Demo Login Bars */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('agent')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition-all shadow-xs cursor-pointer group"
          >
            <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="leading-tight">1-Click Agent Login</div>
              <div className="text-[10px] text-emerald-400/80 font-normal">MEPL-AG-88219</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold transition-all shadow-xs cursor-pointer group"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="leading-tight">1-Click Admin Login</div>
              <div className="text-[10px] text-indigo-400/80 font-normal">Nirmal Patel (HQ)</div>
            </div>
          </button>
        </div>

        {/* Portal Mode Switcher (Segregated Panels) */}
        <div className="mt-3 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => handlePortalSwitch('agent')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isCurrentAdmin
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Agent Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('admin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCurrentAdmin
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>HQ Admin Portal</span>
          </button>
        </div>

        {/* Main Authentication Card */}
        <div className="mt-3 bg-slate-900/90 backdrop-blur-md py-6 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-8">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                {isCurrentAdmin ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>HQ Admin Authentication</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Agent Terminal Sign-In</span>
                  </>
                )}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isCurrentAdmin
                  ? 'Authorized Super Administrators & Management'
                  : 'Authorized Retail Operators & CSC Seva Kendras'}
              </p>
            </div>

            <div
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isCurrentAdmin
                  ? 'text-indigo-300 bg-indigo-950/80 border-indigo-700/60'
                  : 'text-emerald-300 bg-emerald-950/80 border-emerald-700/60'
              }`}
            >
              {isCurrentAdmin ? 'RESTRICTED HQ' : 'SECURE TERMINAL'}
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin(activePortal)}
                className="self-start text-[11px] text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
              >
                Click here to auto-fill working credentials & sign in
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isCurrentAdmin ? 'Admin Email / Username' : 'Agent ID / Registered Mobile Number'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isCurrentAdmin ? 'nirmalpatel1210@gmail.com' : 'e.g. MEPL-AG-88219 or 9825412390'}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
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
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                  placeholder="Enter your security password"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>

              <span className="text-[10px] text-slate-500 font-mono">
                TLS 1.3 256-Bit
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-extrabold text-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer ${
                isCurrentAdmin
                  ? 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-900/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-900/40'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{isCurrentAdmin ? 'Authenticate HQ Admin Console' : 'Sign In to Agent Terminal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credentials Info Box */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
            <div className="font-sans font-bold text-slate-300 mb-1 text-[10px] uppercase tracking-wider">
              Quick Reference Credentials:
            </div>
            <div className="flex justify-between items-center text-emerald-300/90">
              <span>Agent ID: <strong className="text-white">MEPL-AG-88219</strong></span>
              <span>Pass: <strong className="text-white">agent@mannat2026</strong></span>
            </div>
            <div className="flex justify-between items-center text-indigo-300/90">
              <span>Admin: <strong className="text-white">nirmalpatel1210@gmail.com</strong></span>
              <span>Pass: <strong className="text-white">admin@mannat2026</strong></span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HOW AGENTS GET ACCESS GUIDE (एजेंट को एक्सेस कैसे मिलेगी?)
           ========================================================================= */}
        {!isCurrentAdmin && (
          <div className="mt-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-md text-xs space-y-3">
            <button
              type="button"
              onClick={() => setShowAccessGuide(!showAccessGuide)}
              className="w-full flex items-center justify-between text-left font-bold text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs">How do Agents get Access? (एजेंट को एक्सेस कैसे मिलेगी?)</span>
              </div>
              {showAccessGuide ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showAccessGuide && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5 text-[11px] text-slate-400 leading-relaxed animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-200 font-semibold">HQ Onboarding:</strong> Mannat Enterprise Super Admin onboards the agent via the 5-step Onboarding Wizard or Quick Add in the Admin Console.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-200 font-semibold">Credentials Issued:</strong> The agent is assigned a unique <strong className="text-emerald-400 font-mono">Agent ID</strong> (e.g. <span className="font-mono text-white">MEPL-AG-88220</span>) and temporary password dispatched in their Welcome Pack / WhatsApp.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-200 font-semibold">Sign In to Terminal:</strong> Enter your Agent ID or registered 10-digit mobile number and assigned password in the form above.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-slate-200 font-semibold">Security Update:</strong> On first login, go to <em>Terminal Security</em> to update your password and set your 6-digit transaction MPIN.
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Support Desk: {COMPANY_INFO.email}</span>
                  <span>Ahmedabad, Gujarat</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>{COMPANY_INFO.name} · {COMPANY_INFO.address}</p>
          <p className="mt-1">Support Desk: {COMPANY_INFO.email}</p>
        </div>
      </div>
    </div>
  );
};


