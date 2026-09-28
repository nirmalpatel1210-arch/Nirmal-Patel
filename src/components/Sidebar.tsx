import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/mockData';
import {
  LayoutDashboard,
  QrCode,
  CreditCard,
  History,
  Send,
  FileText,
  ArrowUpRight,
  Shield,
  KeyRound,
  Lock,
  Zap,
  Smartphone,
  Flame,
  Droplets,
  Tv,
  Car,
  ShieldAlert,
  Users,
  UserPlus,
  Sliders,
  CheckSquare,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
  Building2,
  WalletCards,
  Receipt,
  Scale,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activePath, onNavigate }) => {
  const { currentUser, role, logout, ccRequests } = useApp();
  const [securityExpanded, setSecurityExpanded] = useState(true);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  const pendingCCRequestsCount = ccRequests.filter(
    (r) => r.status === 'REQUESTED' || r.status === 'PROCESSING' || r.status === 'PAYMENT DONE'
  ).length;

  const handleNav = (path: string) => {
    onNavigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (path: string) => activePath === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d1627] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Company Header / Logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base tracking-tighter">SSE</span>
            </div>
            <div>
              <div className="font-extrabold text-white text-sm tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">
                SHREE SHYAM
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/90 leading-tight">
                ENTERPRISE
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs font-medium scrollbar-thin scrollbar-thumb-slate-700">
          {/* Main Primary Navigation (matches reference screenshot) */}
          <div className="space-y-1">
            <button
              onClick={() => handleNav(role === 'admin' ? '/admin/dashboard' : '/dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(role === 'admin' ? '/admin/dashboard' : '/dashboard')
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            {role === 'agent' && (
              <>
                <button
                  onClick={() => handleNav('/wallet/qr-load')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/wallet/qr-load')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>QR Load Wallet</span>
                  </div>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-bold uppercase">
                    Active UPI
                  </span>
                </button>

                <button
                  onClick={() => handleNav('/agent/credit-card-history')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/agent/credit-card-history') || isActive('/services/cc-history')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-violet-400" />
                  <span>CC Bill History</span>
                </button>

                <button
                  onClick={() => handleNav('/services/live-bill-history')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/services/live-bill-history')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Live Bill History</span>
                </button>

                <button
                  onClick={() => handleNav('/services/money-transfer')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/services/money-transfer')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Bank Payout / DMT</span>
                </button>

                <button
                  onClick={() => handleNav('/wallet')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/wallet')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Account Statement</span>
                </button>

                <button
                  onClick={() => handleNav('/wallet/settlement')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/wallet/settlement')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span>Pay Withdrawal</span>
                </button>
              </>
            )}
          </div>

          {/* Security sub-menu (from video) */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              onClick={() => setSecurityExpanded(!securityExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white uppercase font-bold text-[10px] tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Security</span>
              </div>
              {securityExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {securityExpanded && (
              <div className="mt-1 pl-4 space-y-1">
                <button
                  onClick={() => handleNav('/profile/change-password')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                    isActive('/profile/change-password')
                      ? 'text-emerald-400 font-semibold bg-slate-800/50'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Change Password</span>
                </button>

                <button
                  onClick={() => handleNav('/profile/change-mpin')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                    isActive('/profile/change-mpin')
                      ? 'text-emerald-400 font-semibold bg-slate-800/50'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Change MPIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Payment Hub / BBPS Services */}
          {role === 'agent' && (
            <div className="pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white uppercase font-bold text-[10px] tracking-wider"
              >
                <span>All Services & Utilities</span>
                {servicesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {servicesExpanded && (
                <div className="mt-1 pl-2 space-y-1">
                  <button
                    onClick={() => handleNav('/services/bbps')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/bbps') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BBPS Central Hub</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/credit-card')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/credit-card') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                    <span>Credit Card Pay</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/mobile-recharge')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/mobile-recharge') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    <span>Mobile Recharge</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/dth')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/dth') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5 text-rose-400" />
                    <span>DTH Recharge</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/electricity')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/electricity') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Electricity Bill</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/gas')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/gas') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Piped Gas</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/water')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/water') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <span>Water Utility</span>
                  </button>

                  <button
                    onClick={() => handleNav('/services/fastag')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                      isActive('/services/fastag') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-indigo-400" />
                    <span>FASTag Toll</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reports Section */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              onClick={() => setReportsExpanded(!reportsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white uppercase font-bold text-[10px] tracking-wider"
            >
              <span>Reports & Analytics</span>
              {reportsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {reportsExpanded && (
              <div className="mt-1 pl-2 space-y-1">
                <button
                  onClick={() => handleNav('/reports/transactions')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                    isActive('/reports/transactions') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Transaction Report</span>
                </button>

                <button
                  onClick={() => handleNav('/reports/commission')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                    isActive('/reports/commission') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Commission Report</span>
                </button>

                <button
                  onClick={() => handleNav('/reports/wallet')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                    isActive('/reports/wallet') ? 'text-emerald-400 bg-slate-800' : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <WalletCards className="w-3.5 h-3.5 text-sky-400" />
                  <span>Wallet Ledger Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Management Section (when role === admin) */}
          {role === 'admin' && (
            <div className="pt-2 border-t border-slate-800/60 space-y-1">
              <div className="px-3 py-1.5 text-emerald-400 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Admin Governance</span>
              </div>

              <button
                onClick={() => handleNav('/admin/agents')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/agents') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Agent Management</span>
              </button>

              <button
                onClick={() => handleNav('/admin/cc-requests')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/cc-requests') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-violet-400" />
                  <span>Credit Card Requests</span>
                </div>
                {pendingCCRequestsCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shadow-xs">
                    {pendingCCRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('/admin/agents/create')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/agents/create') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>Onboard New Agent</span>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                  Wizard
                </span>
              </button>

              <button
                onClick={() => handleNav('/admin/wallet')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/wallet') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <WalletCards className="w-4 h-4 text-amber-400" />
                <span>Wallet Adjustments</span>
              </button>

              <button
                onClick={() => handleNav('/admin/commission')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/commission') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Sliders className="w-4 h-4 text-violet-400" />
                <span>Commission Slabs</span>
              </button>

              <button
                onClick={() => handleNav('/admin/fund-requests')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/fund-requests') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                <span>Fund Requests Review</span>
              </button>

              <button
                onClick={() => handleNav('/admin/qr-management')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/qr-management') || isActive('/admin/qr-codes') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Live QR Management</span>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                  Routing
                </span>
              </button>

              <button
                onClick={() => handleNav('/admin/settlements')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/settlements') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                <span>Settlements Queue</span>
              </button>

              <button
                onClick={() => handleNav('/admin/audit-logs')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/audit-logs') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span>Audit & Security Logs</span>
              </button>
            </div>
          )}

          {/* Support Desk */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              onClick={() => handleNav('/support')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/support') ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Helpdesk & Support</span>
            </button>
          </div>
        </div>

        {/* Bottom Profile Footer (matching video) */}
        <div className="p-3 border-t border-slate-800 bg-[#0a1120]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate leading-tight">
                  {currentUser?.agentId}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                handleNav('/login');
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-md transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
