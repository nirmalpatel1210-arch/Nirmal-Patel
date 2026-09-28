import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  CreditCard,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { agents, transactions, fundRequests, tickets, settlements, ccRequests } = useApp();

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'ACTIVE').length;

  const totalTxnCount = transactions.length;
  const totalVolume = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.billAmount : 0), 0);
  const totalCommission = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.commission : 0), 0);

  const pendingFunds = fundRequests.filter((r) => r.status === 'PENDING').length;
  const pendingTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const pendingSettlements = settlements.filter((s) => s.status === 'PROCESSING' || s.status === 'REQUESTED').length;

  // Credit Card Bill payment requests metrics
  const pendingCCRequests = ccRequests.filter(
    (r) => r.status === 'REQUESTED' || r.status === 'PROCESSING'
  ).length;
  const paymentDoneCCRequests = ccRequests.filter((r) => r.status === 'PAYMENT DONE').length;
  const approvedCCRequests = ccRequests.filter((r) => r.status === 'APPROVED').length;

  const totalAgentWalletPool = agents.reduce((acc, a) => acc + a.walletBalance, 0);

  // Service breakdown
  const serviceBreakdown = [
    { service: 'Credit Card Bill', count: transactions.filter(t => t.service === 'CREDIT_CARD').length, color: 'bg-violet-600' },
    { service: 'Electricity (BBPS)', count: transactions.filter(t => t.service === 'ELECTRICITY').length, color: 'bg-yellow-500' },
    { service: 'Money Transfer (DMT)', count: transactions.filter(t => t.service === 'MONEY_TRANSFER').length, color: 'bg-amber-500' },
    { service: 'Gas & Water', count: transactions.filter(t => t.service === 'GAS' || t.service === 'WATER').length, color: 'bg-orange-500' },
    { service: 'Mobile & DTH Recharge', count: transactions.filter(t => t.service === 'MOBILE_RECHARGE' || t.service === 'DTH').length, color: 'bg-sky-500' },
    { service: 'FASTag & Insurance', count: transactions.filter(t => t.service === 'FASTAG' || t.service === 'INSURANCE').length, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SHREE SHYAM ENTERPRISE / CENTRAL GOVERNANCE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Super Administrator Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor terminal volume, liquidity pools, agent compliance, and pending approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/cc-requests')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>CC Requests ({pendingCCRequests})</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/agents/create')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard New Agent</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/fund-requests')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Review Funds ({pendingFunds})</span>
          </button>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Credit Card Requests Card */}
        <div
          onClick={() => onNavigate('/admin/cc-requests')}
          className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white hover:opacity-95 cursor-pointer transition-all rounded-2xl p-5 border border-violet-800 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200">
              PENDING CC REQUESTS
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-violet-200" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums flex items-baseline gap-2">
            <span>{pendingCCRequests}</span>
            <span className="text-xs font-sans text-violet-300 font-medium">To Execute</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-violet-200/90 mt-1 font-mono">
            <span className="text-indigo-200">Done: {paymentDoneCCRequests}</span>
            <span>·</span>
            <span className="text-emerald-300">Approved: {approvedCCRequests}</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">Action Required →</span>
          </div>
        </div>
        {/* Total Agents */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL AGENTS</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{totalAgents}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {activeAgents} Active Terminals
          </div>
        </div>

        {/* Total Turnover Volume */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NETWORK TURNOVER</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
            ₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalTxnCount} Total Processed Orders
          </div>
        </div>

        {/* Agent Wallet Pool */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACTIVE WALLET POOL</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1 tabular-nums">
            ₹{totalAgentWalletPool.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total Agent Pre-funded Liquidity</div>
        </div>

        {/* Total Network Commission */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DISBURSED COMMISSIONS</span>
            <ShieldCheck className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-black font-mono text-violet-700 mt-1 tabular-nums">
            ₹{totalCommission.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct Agent Earnings</div>
        </div>

        {/* Pending Fund Requests */}
        <div
          onClick={() => onNavigate('/admin/fund-requests')}
          className="bg-white hover:bg-slate-50 cursor-pointer transition-colors rounded-2xl p-5 border border-slate-200 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">PENDING FUND REQUESTS</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-700 mt-1">{pendingFunds}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Requires Bank Recon Approval →</div>
        </div>

        {/* Pending Settlements */}
        <div
          onClick={() => onNavigate('/admin/settlements')}
          className="bg-white hover:bg-slate-50 cursor-pointer transition-colors rounded-2xl p-5 border border-slate-200 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">PENDING SETTLEMENTS</span>
            <Building2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700 mt-1">{pendingSettlements}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Payout Dispatches Pending →</div>
        </div>

        {/* Pending Tickets */}
        <div
          onClick={() => onNavigate('/admin/tickets')}
          className="bg-white hover:bg-slate-50 cursor-pointer transition-colors rounded-2xl p-5 border border-slate-200 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">PENDING TICKETS</span>
            <HelpCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-700 mt-1">{pendingTickets}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Open Agent Escalations →</div>
        </div>

        {/* Compliance Rating */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BBPS SWITCH HEALTH</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">99.98%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Operating Normal</div>
        </div>
      </div>

      {/* Service Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Service Volume Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Service Volume Share</h3>

          <div className="space-y-3">
            {serviceBreakdown.map((item) => (
              <div key={item.service} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.service}</span>
                  <span className="font-mono text-slate-500 font-bold">{item.count} orders</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${Math.max(5, (item.count / (totalTxnCount || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Admin Governance Shortcuts</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/admin/agents')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Create / Manage Agents</div>
                  <div className="text-[10px] text-slate-500">Add new agent terminal, configure KYC and limits</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('/admin/wallet')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Direct Wallet Credit / Debit</div>
                  <div className="text-[10px] text-slate-500">Manual adjustments with mandatory audit trail</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('/admin/commission')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-violet-500 bg-slate-50 hover:bg-violet-50/30 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Configure Commission Slabs</div>
                  <div className="text-[10px] text-slate-500">Set MDR and agent/platform split percentages</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            Administrative actions are tracked in immutable audit logs with IP stamping.
          </div>
        </div>
      </div>
    </div>
  );
};
