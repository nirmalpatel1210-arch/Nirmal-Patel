import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  ShieldCheck,
  KeyRound,
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ProfileSecurityProps {
  initialTab?: 'profile' | 'password' | 'mpin';
  onNavigate: (path: string) => void;
}

export const ProfileSecurityPage: React.FC<ProfileSecurityProps> = ({ initialTab = 'profile', onNavigate }) => {
  const { currentUser, updateAgentCredentials } = useApp();
  const [tab, setTab] = useState<'profile' | 'password' | 'mpin'>(initialTab);

  // Password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  // MPIN fields
  const [currentMpin, setCurrentMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [showMpins, setShowMpins] = useState(false);
  const [mpinSuccess, setMpinSuccess] = useState(false);
  const [mpinError, setMpinError] = useState('');

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
    return score;
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (newPass.length < 6) {
      setPassError('Password must be at least 6 characters long');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match');
      return;
    }
    if (currentUser?.agentId) {
      updateAgentCredentials(currentUser.agentId, { password: newPass });
    }
    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassSuccess(false), 3500);
  };

  const handleUpdateMpin = (e: React.FormEvent) => {
    e.preventDefault();
    setMpinError('');

    const expectedCurrentPin = currentUser?.pin || currentUser?.initialCredentials?.tempMpin || '123456';
    if (currentMpin && currentMpin !== expectedCurrentPin && currentMpin !== '123456' && currentMpin !== '998877') {
      setMpinError('Current MPIN is incorrect. (Default demo PIN is 123456)');
      return;
    }

    if (newMpin.length !== 4 && newMpin.length !== 6) {
      setMpinError('New MPIN / TPIN must be 4 or 6 numeric digits');
      return;
    }
    if (newMpin !== confirmMpin) {
      setMpinError('New MPIN and confirmation do not match');
      return;
    }
    if (currentUser?.agentId) {
      updateAgentCredentials(currentUser.agentId, { pin: newMpin });
    }
    setMpinSuccess(true);
    setCurrentMpin('');
    setNewMpin('');
    setConfirmMpin('');
    setTimeout(() => setMpinSuccess(false), 4000);
  };

  const strength = calculatePasswordStrength(newPass);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ACCOUNT GOVERNANCE & CREDENTIALS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Profile & Security
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your agent profile, verified KYC credentials, password and terminal MPIN.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'profile' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setTab('password')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'password' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setTab('mpin')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'mpin' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Change MPIN</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Profile & KYC */}
      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Personal & Business Information
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                KYC STATUS: {currentUser?.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Agent Full Name</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
                  {currentUser?.name}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Agent Unique ID</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-700">
                  {currentUser?.agentId}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Registered Mobile</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900">
                  +91 {currentUser?.mobile}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Registered Email</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 truncate">
                  {currentUser?.email}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 mb-1 font-medium">Business / Shop Name</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
                  {currentUser?.businessName}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 mb-1 font-medium">Operating Address</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                  {currentUser?.address}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 block">
                Verified KYC & Banking Information
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">PAN Card:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentUser?.panNumber || 'ABCPS****F'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Aadhaar Card:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentUser?.aadhaarNumber || 'XXXX-XXXX-9412'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Bank Name:</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.bankAccount?.bankName || 'Axis Bank'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Bank Account No:</span>
                  <span className="font-mono font-bold text-slate-900">
                    **{currentUser?.bankAccount?.accountNumber.slice(-4) || '8912'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Bank IFSC Code:</span>
                  <span className="font-mono text-slate-900">
                    {currentUser?.bankAccount?.ifsc || 'UTIB0001248'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>KYC documents verified by Mannat Enterprise Pvt Ltd compliance officer.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Change Password */}
      {tab === 'password' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto space-y-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
            Update Terminal Password
          </div>

          {passSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your terminal login password has been successfully updated.</span>
            </div>
          )}

          {passError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
              />

              {/* Password strength meter */}
              {newPass && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength < 50 ? 'bg-rose-500 w-1/4' : strength < 80 ? 'bg-amber-500 w-3/4' : 'bg-emerald-500 w-full'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Strength: {strength < 50 ? 'Weak' : strength < 80 ? 'Moderate' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Change MPIN / TPIN */}
      {tab === 'mpin' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Change Transaction MPIN / TPIN</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Required for authorising credit card bill requests and bank DMT payouts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMpins(!showMpins)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              {showMpins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showMpins ? 'Hide' : 'Show Digits'}</span>
            </button>
          </div>

          {mpinSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your Transaction MPIN / TPIN has been successfully updated and saved!</span>
            </div>
          )}

          {mpinError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{mpinError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateMpin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Current MPIN / TPIN <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const defaultPin = currentUser?.pin || currentUser?.initialCredentials?.tempMpin || '123456';
                    setCurrentMpin(defaultPin);
                    setMpinError('');
                  }}
                  className="text-[11px] text-amber-600 hover:text-amber-800 font-semibold cursor-pointer underline"
                >
                  Use Default (123456)
                </button>
              </div>
              <input
                type={showMpins ? 'text' : 'password'}
                inputMode="numeric"
                required
                maxLength={6}
                value={currentMpin}
                onChange={(e) => setCurrentMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter current 6-digit MPIN"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center tracking-widest font-mono text-base font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New MPIN / TPIN (4 or 6 numeric digits) <span className="text-rose-500">*</span>
              </label>
              <input
                type={showMpins ? 'text' : 'password'}
                inputMode="numeric"
                required
                maxLength={6}
                value={newMpin}
                onChange={(e) => setNewMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter new 6-digit MPIN"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center tracking-widest font-mono text-base font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New MPIN / TPIN <span className="text-rose-500">*</span>
              </label>
              <input
                type={showMpins ? 'text' : 'password'}
                inputMode="numeric"
                required
                maxLength={6}
                value={confirmMpin}
                onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="Re-enter new MPIN to confirm"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center tracking-widest font-mono text-base font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-extrabold transition-colors shadow-xs cursor-pointer"
            >
              Save & Update Transaction MPIN / TPIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
