import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ArrowLeft, KeyRound, CheckCircle2, ShieldCheck, Mail, Lock } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const { updateAgentCredentials } = useApp();
  const [step, setStep] = useState<'REQUEST' | 'OTP' | 'SUCCESS'>('REQUEST');
  const [identifier, setIdentifier] = useState('9825412390');
  const [otp, setOtp] = useState('482190');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 700);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    updateAgentCredentials(identifier, { password: newPassword });
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 text-white font-extrabold text-sm shadow-md mb-3">
            MEPL
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
            {COMPANY_INFO.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Credentials Recovery System</p>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-700 sm:px-10">
          {step === 'REQUEST' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-10 h-10 bg-slate-700/60 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-400">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white">Reset Account Password</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered Agent Mobile Number or Email ID to receive a verification OTP.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registered Mobile / Email
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9825412390 or agent@domain.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-[11px] text-slate-300">
                A 6-digit verification security OTP will be dispatched to your registered mobile number for identity verification.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP SMS...' : 'Send Verification OTP'}
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-10 h-10 bg-emerald-900/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white">Enter OTP & New Password</h2>
                <p className="text-xs text-slate-400 mt-1">
                  6-digit code dispatched to <span className="font-mono text-emerald-400 font-bold">{identifier}</span>
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  One Time Password (OTP)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-center tracking-widest font-mono text-base text-emerald-400 focus:outline-hidden focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors"
              >
                {loading ? 'Updating Password...' : 'Reset Password & Proceed'}
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Password Reset Successfully</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Your credentials for Mannat Enterprise terminal have been securely updated. You can now login with your new password.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/login')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Return to Login
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-700/80 text-center">
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
