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
            onClick={() => handleNav(role === 'admin' ? '/admin/dashboard' : '/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md border ${
              role === 'admin'
                ? 'bg-slate-800 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-emerald-500/40 text-emerald-300'
            }`}>
              <span className="font-extrabold text-sm tracking-wider">MEPL</span>
            </div>
            <div>
              <div className="font-extrabold text-white text-xs tracking-wide leading-tight group-hover:text-slate-200 transition-colors uppercase">
                MANNAT ENTERPRISE
              </div>
              <div className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                PVT LTD · {role === 'admin' ? 'HQ GOVERNANCE' : 'AGENT TERMINAL'}
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
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-xs font-medium scrollbar-thin scrollbar-thumb-slate-700">
          {/* =========================================================
              PANEL 1: ADMIN GOVERNANCE CONSOLE (ROLE === 'ADMIN')
             ========================================================= */}
          {role === 'admin' && (
            <>
              {/* Executive Overview */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  HQ Governance & Executive
                </div>

                <button
                  onClick={() => handleNav('/admin/dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/agents')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/agents')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Agent Management & Roster</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/agents/create')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/agents/create') || isActive('/admin/agents/onboard')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Onboard New Agent</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                    5-Step Wizard
                  </span>
                </button>
              </div>

              {/* Operations & Queue Approvals */}
              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Operations & Approvals
                </div>

                <button
                  onClick={() => handleNav('/admin/cc-requests')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/cc-requests')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span>Credit Card Verification</span>
                  </div>
                  {pendingCCRequestsCount > 0 && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shadow-xs">
                      {pendingCCRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNav('/admin/fund-requests')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/fund-requests')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span>Fund Top-up Review</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/settlements')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/settlements')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span>Settlements Processing</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/qr-management')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/qr-management') || isActive('/admin/qr-codes')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
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
              </div>

              {/* Finance & Margins */}
              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Finance & Margin Control
                </div>

                <button
                  onClick={() => handleNav('/admin/wallet')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/wallet')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <WalletCards className="w-4 h-4 text-amber-400" />
                  <span>Wallet Adjustments</span>
                </button>

                <button
                  onClick={() => handleNav('/admin/commission')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/commission')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-violet-400" />
                  <span>Commission Slabs & Fees</span>
                </button>
              </div>

              {/* Compliance & Logs */}
              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Compliance & Security
                </div>

                <button
                  onClick={() => handleNav('/admin/audit-logs')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/admin/audit-logs')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  <span>Audit & Security Logs</span>
                </button>

                <button
                  onClick={() => handleNav('/support')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/support')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>Support Tickets Desk</span>
                </button>

                <button
                  onClick={() => handleNav('/profile/change-password')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/profile/change-password')
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <span>Master Password</span>
                </button>
              </div>
            </>
          )}

          {/* =========================================================
              PANEL 2: AGENT SERVICE TERMINAL (ROLE === 'AGENT')
             ========================================================= */}
          {role === 'agent' && (
            <>
              {/* Primary Retail Terminal Services */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Terminal Operations
                </div>

                <button
                  onClick={() => handleNav('/dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive('/dashboard')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleNav('/services/credit-card')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive('/services/credit-card')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span className="font-semibold text-white">Credit Card Pay</span>
                  </div>
                  <span className="text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                    50+ Banks
                  </span>
                </button>

                <button
                  onClick={() => handleNav('/agent/credit-card-history')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive('/agent/credit-card-history') || isActive('/services/cc-history')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-emerald-400" />
                    <span>CC Requests History</span>
                  </div>
                  {pendingCCRequestsCount > 0 && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                      {pendingCCRequestsCount} Pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNav('/wallet/qr-load')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive('/wallet/qr-load')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>QR Load Wallet</span>
                  </div>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-bold uppercase">
                    Active UPI
                  </span>
                </button>

                <button
                  onClick={() => handleNav('/services/money-transfer')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive('/wallet/settlement')
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span>Pay Withdrawal</span>
                </button>
              </div>

              {/* Terminal Security */}
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => setSecurityExpanded(!securityExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white uppercase font-bold text-[10px] tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terminal Security</span>
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                        isActive('/profile/change-mpin')
                          ? 'text-emerald-400 font-semibold bg-slate-800/50'
                          : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Change MPIN / TPIN</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-mono">
                        PIN
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reports & Ledgers */}
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => setReportsExpanded(!reportsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white uppercase font-bold text-[10px] tracking-wider"
                >
                  <span>Reports & Ledgers</span>
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

              {/* Helpdesk & Support */}
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
            </>
          )}
        </div>

        {/* Bottom Profile Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0a1120]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-700'
              }`}>
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
                  {currentUser?.name}
                </p>
                <p className={`text-[10px] font-mono truncate leading-tight ${
                  role === 'admin' ? 'text-indigo-400' : 'text-emerald-400'
                }`}>
                  {role === 'admin' ? 'Super Administrator' : currentUser?.agentId}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                handleNav(role === 'admin' ? '/admin/login' : '/login');
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
