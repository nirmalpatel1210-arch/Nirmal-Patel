import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/mockData';
import {
  Bell,
  Wallet,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Menu,
  ChevronDown,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, activePath, onNavigate }) => {
  const {
    currentUser,
    role,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Strict RBAC: Agent sees ONLY his own notifications; Admin sees Admin notifications
  const relevantNotifications =
    role === 'admin'
      ? notifications.filter((n) => n.userId === 'admin' || n.title.includes('Request'))
      : notifications.filter((n) => n.userId === currentUser?.agentId || n.userId === currentUser?.id);

  const unreadCount = relevantNotifications.filter((n) => !n.read).length;
  const hasApprovedUnread = relevantNotifications.some(
    (n) => !n.read && n.type === 'SUCCESS' && n.title.toLowerCase().includes('approved')
  );

  const totalWallet = currentUser?.walletBalance || 0;
  const reservedWallet = currentUser?.reservedBalance || 0;
  const availableWallet = Math.max(0, totalWallet - reservedWallet);

  const todayStr = '28 Sept 2026';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      {/* Top Announcement Bar (matching video) */}
      {showAnnouncement && (
        <div className="bg-slate-100 border-b border-slate-200 text-slate-800 px-4 py-1.5 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              Notice
            </span>
            <span className="truncate text-slate-700 text-[11px]">
              {COMPANY_INFO.name} — BBPS Utilities, Domestic Money Transfer & Credit Card bill payments are fully active. Support Desk: {COMPANY_INFO.email}
            </span>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="text-slate-500 hover:text-slate-800 font-bold ml-2 text-sm leading-none"
            title="Dismiss announcement"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Console Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                role === 'admin' ? 'text-indigo-600' : 'text-emerald-600'
              }`}>
                {role === 'admin' ? 'Super Admin HQ Console' : 'Agent Business Terminal'}
              </span>
              <span className="text-slate-300">/</span>
              <h1 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
                {role === 'admin' ? 'HQ Administration & Governance Panel' : 'Live Service Terminal'}
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Balances, Date, Status Badge, Notification, Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Date display (matching video) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{todayStr}</span>
          </div>

          {/* Wallet Balance Widget */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 px-3 py-1.5 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <span className="text-emerald-700 font-medium">Available: </span>
                  <span className="font-mono font-bold tabular-nums text-emerald-900 text-sm">
                    ₹{availableWallet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {role === 'agent' && reservedWallet > 0 && (
                <>
                  <span className="text-emerald-300">|</span>
                  <div
                    title="Reserved for Pending Credit Card Requests"
                    className="flex items-center gap-1 text-[11px] font-semibold bg-amber-100/90 text-amber-900 border border-amber-300/80 px-2 py-0.5 rounded"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Hold: </span>
                    <span className="font-mono font-bold">
                      ₹{reservedWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}

              {role === 'agent' && (
                <button
                  onClick={() => onNavigate('/wallet/qr-load')}
                  className="ml-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded shadow-xs border border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  + Load
                </button>
              )}
            </div>
          )}

          {/* Role Status Badge (Final Production Mode) */}
          {role === 'admin' ? (
            <div
              title="HQ Master Administration Console · Authorized Access Only"
              className="flex items-center gap-1.5 bg-indigo-50 text-indigo-900 border border-indigo-300 px-3 py-1.5 rounded-lg text-xs font-black tracking-wide shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span className="hidden sm:inline">HQ ADMIN CONSOLE</span>
              <span className="sm:hidden">ADMIN</span>
            </div>
          ) : (
            <div
              title="Active Production Retail Terminal"
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-black tracking-wide shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">AGENT TERMINAL</span>
              <span className="sm:hidden">TERMINAL</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  className={`absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs ${
                    hasApprovedUnread
                      ? 'bg-emerald-600 ring-2 ring-emerald-300 animate-bounce'
                      : 'bg-rose-500'
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        hasApprovedUnread ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {relevantNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    relevantNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) {
                            onNavigate(n.link);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read
                            ? n.type === 'SUCCESS'
                              ? 'bg-emerald-50/70 border-l-4 border-l-emerald-500'
                              : 'bg-emerald-50/40'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {n.type === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {n.timestamp.split(',')[1] || n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                        {n.link && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <span>View Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {currentUser?.agentId}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="mt-1.5 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {role === 'admin' ? 'Super Administrator' : 'Authorized Agent'}
                  </span>
                </div>

                <div className="py-1 text-xs text-slate-700">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('/profile');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile & KYC</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('/profile/change-password');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Security & Credentials</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      onNavigate('/login');
                    }}
                    className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
