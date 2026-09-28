import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/mockData';
import {
  Wallet,
  CreditCard,
  History,
  Clock,
  Calendar,
  Filter,
  Search,
  ArrowUpRight,
  Zap,
  Smartphone,
  Flame,
  Droplets,
  Tv,
  Car,
  ShieldCheck,
  Send,
  Eye,
  Printer,
  ChevronRight,
  QrCode,
  FileText,
  TrendingUp,
  Receipt,
  RefreshCw,
  CheckCircle2,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Transaction } from '../types';
import { useCCRequestPolling } from '../hooks/useCCRequestPolling';

interface AgentDashboardProps {
  onNavigate: (path: string) => void;
}

export const AgentDashboardPage: React.FC<AgentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, transactions, setActiveReceiptTxn, ccRequests, setActiveCCReceiptRequest } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Hook to poll for credit card request status updates every 10 seconds
  const {
    secondsRemaining,
    latestChange,
    dismissAlert,
    pollNow,
  } = useCCRequestPolling({
    intervalMs: 10000,
  });

  // Strict RBAC: Filter requests for current agent
  const myCCRequests = ccRequests.filter(
    (r) => r.agentId === currentUser?.agentId || r.agentId === currentUser?.id
  );

  // Requirement #12: Dashboard Counters
  const pendingCCCount = myCCRequests.filter(
    (r) => r.status === 'REQUESTED' || r.status === 'PROCESSING' || r.status === 'PAYMENT DONE'
  ).length;
  const approvedTodayCount = myCCRequests.filter((r) => r.status === 'APPROVED').length;
  const failedTodayCount = myCCRequests.filter((r) => r.status === 'FAILED' || r.status === 'REJECTED').length;
  const processingCount = myCCRequests.filter((r) => r.status === 'PROCESSING').length;

  // Calculate dynamic metrics
  const totalWallet = currentUser?.walletBalance || 0;
  const reservedWallet = currentUser?.reservedBalance || 0;
  const availableWallet = Math.max(0, totalWallet - reservedWallet);
  
  // CC Bill metrics
  const ccTxns = transactions.filter((t) => t.service === 'CREDIT_CARD');
  const ccVolume = ccTxns.reduce((sum, t) => sum + (t.status === 'SUCCESS' ? t.billAmount : 0), 0);

  // Live Bill / BBPS metrics
  const liveTxns = transactions.filter((t) => t.service !== 'CREDIT_CARD');
  const liveVolume = liveTxns.reduce((sum, t) => sum + (t.status === 'SUCCESS' ? t.billAmount : 0), 0);

  // Pending count
  const pendingTxns = transactions.filter((t) => t.status === 'PENDING');
  const pendingCount = pendingTxns.length;
  const pendingVolume = pendingTxns.reduce((sum, t) => sum + t.billAmount, 0);

  // Today's commission
  const totalCommission = transactions.reduce((sum, t) => sum + (t.status === 'SUCCESS' ? t.commission : 0), 0);

  // Filter transactions for recent table
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerMobile.includes(searchQuery) ||
      (t.billerName && t.billerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const quickServices = [
    { name: 'BBPS Central Hub', path: '/services/bbps', icon: Receipt, color: 'bg-emerald-500', desc: 'All Biller Categories' },
    { name: 'Credit Card Bill', path: '/services/credit-card', icon: CreditCard, color: 'bg-indigo-600', desc: 'Instant Clearance' },
    { name: 'Money Transfer', path: '/services/money-transfer', icon: Send, color: 'bg-amber-500', desc: 'DMT & Instant IMPS' },
    { name: 'Mobile Recharge', path: '/services/mobile-recharge', icon: Smartphone, color: 'bg-sky-500', desc: 'Prepaid 4G/5G' },
    { name: 'DTH Recharge', path: '/services/dth', icon: Tv, color: 'bg-rose-500', desc: 'Tata Play, Airtel, Dish' },
    { name: 'Electricity Bill', path: '/services/electricity', icon: Zap, color: 'bg-yellow-500', desc: 'Torrent, UGVCL, BESCOM' },
    { name: 'Piped Gas', path: '/services/gas', icon: Flame, color: 'bg-orange-500', desc: 'Adani, Gujarat Gas' },
    { name: 'Water Municipal', path: '/services/water', icon: Droplets, color: 'bg-blue-600', desc: 'AMC, SMC, Delhi Jal' },
    { name: 'Insurance Premium', path: '/services/insurance', icon: ShieldCheck, color: 'bg-teal-600', desc: 'LIC, HDFC Life, SBI' },
    { name: 'FASTag Recharge', path: '/services/fastag', icon: Car, color: 'bg-purple-600', desc: 'ICICI, Paytm, Kotak' },
  ];

  return (
    <div className="space-y-6">
      {/* Live Status Change Alert Toast Banner (Triggered by 10s polling) */}
      {latestChange && (
        <div
          className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200 ${
            latestChange.newStatus === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-2 ring-emerald-500/20'
              : latestChange.newStatus === 'PAYMENT DONE'
              ? 'bg-blue-50 border-blue-300 text-blue-950 ring-2 ring-blue-500/20'
              : 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-500/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                latestChange.newStatus === 'APPROVED'
                  ? 'bg-emerald-600 text-white'
                  : latestChange.newStatus === 'PAYMENT DONE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {latestChange.newStatus === 'APPROVED' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs">
                  ⚡ REAL-TIME UPDATE • {latestChange.newStatus}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {latestChange.requestId}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ({latestChange.timestamp})
                </span>
              </div>
              <p className="text-xs font-semibold mt-1 leading-snug">
                {latestChange.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {latestChange.newStatus === 'APPROVED' && (
              <button
                onClick={() => {
                  const matched = ccRequests.find((r) => r.id === latestChange.requestId);
                  if (matched) setActiveCCReceiptRequest(matched);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Receipt</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('/agent/credit-card-history')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
            >
              View History
            </button>
            <button
              onClick={dismissAlert}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-black/5"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Banner / Greeting (Matching video timestamp 00:43) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>GOOD MORNING, {currentUser?.name?.toUpperCase() || 'AGENT OPERATOR'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Agent Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage recharges, ledger history and wallet balance for {COMPANY_INFO.name}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live 10s Polling Indicator */}
            <div
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 shadow-2xs"
              title="Background status polling active every 10 seconds. Ensures instant visibility of Admin approvals or failures."
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Live Sync: 10s</span>
              <span className="text-[10px] text-emerald-600 font-mono">({secondsRemaining}s)</span>
              <button
                onClick={pollNow}
                className="p-1 hover:bg-emerald-100 rounded text-emerald-700 transition-colors ml-0.5"
                title="Force refresh now"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter:</span>
              <select
                value={filterPeriod}
                onChange={(e: any) => setFilterPeriod(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <button
              onClick={() => onNavigate('/wallet/qr-load')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Load Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Wallet Balance */}
        <div className="bg-[#107050] text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/90">
              AVAILABLE WALLET
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight tabular-nums">
              ₹{availableWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-100/80 mt-0.5">
              {reservedWallet > 0 ? `(Hold: ₹${reservedWallet.toLocaleString('en-IN')} reserved)` : 'Main Usable Balance'}
            </div>
          </div>
        </div>

        {/* 2. PENDING CC REQUESTS (Requirement #12) */}
        <div className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px] border border-violet-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200">
              PENDING CC REQUESTS
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-violet-200" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight tabular-nums flex items-baseline gap-2">
              <span>{pendingCCCount}</span>
              <span className="text-xs font-sans text-violet-300 font-medium">In Queue</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-violet-200/90 mt-1 font-mono">
              <span className="text-emerald-300 font-bold">Approved: {approvedTodayCount}</span>
              <span>·</span>
              <span className="text-blue-200 font-bold">Proc: {processingCount}</span>
              <span>·</span>
              <span className="text-rose-300 font-bold">Fail: {failedTodayCount}</span>
            </div>
          </div>
        </div>

        {/* 3. CC Bill Payment */}
        <div className="bg-[#1f58b5] text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100/90">
              CC BILL VOLUME
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight tabular-nums">
              ₹{ccVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-blue-100/80 mt-0.5">
              {myCCRequests.length} Total Requests
            </div>
          </div>
        </div>

        {/* 4. Live Bill Payment */}
        <div className="bg-[#593993] text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-100/90">
              LIVE BILL PAYMENT
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight tabular-nums">
              ₹{liveVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-purple-100/80 mt-0.5">
              {liveTxns.length} Utility Orders
            </div>
          </div>
        </div>

        {/* 5. Overall Queue */}
        <div className="bg-[#995c1c] text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100/90">
              OVERALL QUEUE
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight tabular-nums">
              {pendingCount + pendingCCCount} Txns
            </div>
            <div className="text-[10px] text-amber-100/80 mt-0.5">
              ₹{(pendingVolume + (myCCRequests.filter(r => r.status === 'REQUESTED').reduce((s, r) => s + r.amount, 0))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Quick Payment Services
            </h2>
            <p className="text-xs text-slate-500">
              Instant bill payment, direct transfer and utility recharge engines
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Earned Commission: ₹{totalCommission.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <button
                key={srv.name}
                onClick={() => onNavigate(srv.path)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between"
              >
                <div className={`w-9 h-9 rounded-lg ${srv.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {srv.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {srv.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Credit Card Bill Payment Requests Table (Live Approval Status Workflow) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-violet-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Credit Card Payment Requests
                </h3>
                <span className="text-[10px] bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded-full border border-violet-200 uppercase tracking-wider">
                  Live Workflow
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Auto-Polling (10s)</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Agent Wallet Hold → Admin Execution → Live Approval & Settlement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/services/credit-card')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <span>+ New Payment Request</span>
            </button>
            <button
              onClick={() => onNavigate('/agent/credit-card-history')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              <span>View All History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Request / Txn ID</th>
                <th className="py-3 px-4">Bank & Card</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Card Amount</th>
                <th className="py-3 px-4 text-right">Wallet Reserved</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Admin Ref / UTR</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {myCCRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No Credit Card payment requests submitted yet.{' '}
                    <button
                      onClick={() => onNavigate('/services/credit-card')}
                      className="text-violet-600 font-bold hover:underline ml-1"
                    >
                      Create First Request
                    </button>
                  </td>
                </tr>
              ) : (
                myCCRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">{req.id}</div>
                      <div className="text-[10px] text-slate-400">{req.transactionId}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{req.bankName}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {req.cardNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{req.customerName}</div>
                      <div className="text-[10px] text-slate-500">{req.customerMobile}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 tabular-nums">
                      ₹{req.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      <div className="text-[9px] text-slate-400 font-normal">
                        (₹{req.processingFee} fee)
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {req.status === 'REQUESTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>REQUESTED</span>
                        </span>
                      )}
                      {req.status === 'PROCESSING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-spin" />
                          <span>PROCESSING</span>
                        </span>
                      )}
                      {req.status === 'PAYMENT DONE' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          <span>PAYMENT DONE</span>
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>APPROVED</span>
                        </span>
                      )}
                      {(req.status === 'FAILED' || req.status === 'REJECTED') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          <span>{req.status}</span>
                        </span>
                      )}
                      {req.status === 'REFUNDED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                          <span>REFUNDED</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {req.paymentRefNumber ? (
                        <span className="font-bold text-slate-800">{req.paymentRefNumber}</span>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting Admin UTR</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('/agent/credit-card-history')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                          title="View Timeline"
                        >
                          Details
                        </button>
                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => setActiveCCReceiptRequest(req)}
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-xs font-semibold flex items-center gap-1"
                            title="Receipt"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table header & filters */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500">
              Live log of payments performed by this terminal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search ID, customer, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 w-48 lg:w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <button
              onClick={() => onNavigate('/transactions')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 ml-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Bill Amount</th>
                <th className="py-3 px-4 text-right">Commission</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 8).map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      <div>{txn.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {txn.bbpsRef || txn.referenceId}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div>{txn.date}</div>
                      <div className="text-[10px] text-slate-400">{txn.time}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {txn.categoryName || txn.service}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {txn.billerName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{txn.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {txn.customerMobile}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                      ₹{txn.billAmount.toFixed(2)}
                      {txn.serviceCharge > 0 && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          +₹{txn.serviceCharge.toFixed(2)} fee
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 whitespace-nowrap tabular-nums">
                      +₹{txn.commission.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          txn.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : txn.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveReceiptTxn(txn)}
                        title="Print / View Receipt"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
