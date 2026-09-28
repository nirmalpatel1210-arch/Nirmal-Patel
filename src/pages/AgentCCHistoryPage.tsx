import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCardRequest, CCRequestStatus } from '../types';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building2,
  Receipt,
  User,
  Check,
  Copy,
  Bell,
  X,
  Sparkles,
} from 'lucide-react';
import { useCCRequestPolling } from '../hooks/useCCRequestPolling';

interface AgentCCHistoryProps {
  onNavigate: (path: string) => void;
}

export const AgentCCHistoryPage: React.FC<AgentCCHistoryProps> = ({ onNavigate }) => {
  const { currentUser, ccRequests, setActiveCCReceiptRequest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const [selectedRequestForTimeline, setSelectedRequestForTimeline] = useState<CreditCardRequest | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 10-second polling hook for live status changes
  const {
    secondsRemaining,
    latestChange,
    dismissAlert,
    pollNow,
  } = useCCRequestPolling({
    intervalMs: 10000,
  });

  // Strict RBAC: Agent sees ONLY his own requests! (Rule #24)
  const myRequests = ccRequests.filter(
    (r) => r.agentId === currentUser?.agentId || r.agentId === currentUser?.id
  );

  // Metrics
  const totalCount = myRequests.length;
  const pendingCount = myRequests.filter(
    (r) => r.status === 'REQUESTED' || r.status === 'PROCESSING' || r.status === 'PAYMENT DONE'
  ).length;
  const approvedCount = myRequests.filter((r) => r.status === 'APPROVED').length;
  const failedCount = myRequests.filter((r) => r.status === 'FAILED' || r.status === 'REJECTED').length;
  const refundedCount = myRequests.filter((r) => r.status === 'REFUNDED').length;

  const totalVolume = myRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.amount, 0);

  // Filtering
  const filteredList = myRequests.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(q) ||
      r.transactionId.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerMobile.includes(q) ||
      r.bankName.toLowerCase().includes(q) ||
      r.cardLast4.includes(q) ||
      (r.paymentRefNumber && r.paymentRefNumber.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const paginatedList = filteredList.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleRefresh = () => {
    setRefreshing(true);
    pollNow();
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Transaction ID',
      'Bank',
      'Customer Name',
      'Mobile',
      'Card Ending',
      'Amount',
      'Processing Fee',
      'Wallet Debit',
      'Status',
      'Payment Ref / UTR',
      'Date & Time',
    ];

    const rows = filteredList.map((r) => [
      r.id,
      r.transactionId,
      r.bankName,
      r.customerName,
      r.customerMobile,
      r.cardLast4,
      r.amount,
      r.processingFee,
      r.totalReserved,
      r.status,
      r.paymentRefNumber || 'N/A',
      r.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSE_CC_Requests_${currentUser?.agentId || 'agent'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Status Badges
  const renderStatusBadge = (status: CCRequestStatus) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>REQUESTED</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-900 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>PROCESSING</span>
          </span>
        );
      case 'PAYMENT DONE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-orange-900 border border-orange-300">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>PAYMENT DONE</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>APPROVED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>FAILED</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800 border border-slate-300">
            <AlertCircle className="w-3 h-3 text-slate-600" />
            <span>REJECTED</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900 border border-purple-300">
            <RotateCcw className="w-3 h-3 text-purple-600" />
            <span>REFUNDED</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Status Change Alert Banner (Triggered automatically every 10s without manual page reload) */}
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
                  LIVE STATUS UPDATE • {latestChange.newStatus}
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
              onClick={dismissAlert}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-black/5"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>OPERATOR CONSOLE / CREDIT CARD BILL HISTORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Credit Card Bill History & Live Status
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of all your credit card payment requests. Auto-syncs status changes every 10 seconds without manual page refresh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Polling Status Pill */}
          <div
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 shadow-2xs"
            title="Auto-polling active every 10 seconds for real-time status updates."
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Live Polling: 10s</span>
            <span className="text-[10px] text-emerald-600 font-mono">({secondsRemaining}s)</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            title="Force refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>

          <button
            onClick={() => onNavigate('/services/credit-card')}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>+ New Payment Request</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">APPROVED PAYMENTS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{approvedCount}</div>
          <div className="text-[11px] text-emerald-700 font-semibold font-mono mt-0.5">
            ₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Settled
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PENDING ADMIN ACTION</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
            Under verification & payment
          </div>
        </div>

        {/* Failed / Rejected */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FAILED / REJECTED</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{failedCount}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Escrow hold released back
          </div>
        </div>

        {/* Refunded */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">REFUNDED</span>
            <RotateCcw className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{refundedCount}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
            Credited back to wallet
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Req ID, Customer, Bank..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-violet-500"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-violet-500"
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="PAYMENT DONE">PAYMENT DONE</option>
              <option value="APPROVED">APPROVED</option>
              <option value="FAILED">FAILED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Bank / Issuer</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Card Ending</th>
                <th className="py-3 px-4 text-right">Card Amount</th>
                <th className="py-3 px-4 text-right">Wallet Debit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Payment Reference</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No credit card payment requests found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedList.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Request ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {req.id}
                    </td>

                    {/* Transaction ID */}
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                      {req.transactionId}
                    </td>

                    {/* Bank */}
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {req.bankName}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{req.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">+91 {req.customerMobile}</div>
                    </td>

                    {/* Card Ending */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      XXXX-{req.cardLast4}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      ₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Wallet Debit (Reserved) */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 whitespace-nowrap">
                      ₹{req.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {renderStatusBadge(req.status)}
                    </td>

                    {/* Payment Reference */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {req.paymentRefNumber ? (
                        <span className="font-bold text-slate-900">{req.paymentRefNumber}</span>
                      ) : (
                        <span className="text-slate-400 italic">Pending Admin Entry</span>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      <div>{req.date}</div>
                      <div className="text-[10px] text-slate-400">{req.time}</div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRequestForTimeline(req)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          title="View Payment Timeline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Timeline</span>
                        </button>

                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => setActiveCCReceiptRequest(req)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            title="Print / View Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing Page <span className="font-bold text-slate-900">{page}</span> of{' '}
              <span className="font-bold text-slate-900">{totalPages}</span> ({filteredList.length} items)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-lg font-bold flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-lg font-bold flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
         PAYMENT TIMELINE MODAL (Requirement #14)
         Shows step-by-step live progress visible to the Agent
      ========================================================================= */}
      {selectedRequestForTimeline && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-violet-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Payment Request Timeline & Status
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    {selectedRequestForTimeline.id} ({selectedRequestForTimeline.bankName})
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequestForTimeline(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                  Current Lifecycle Status
                </span>
                <div className="mt-1">{renderStatusBadge(selectedRequestForTimeline.status)}</div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                  Total Wallet Debit
                </span>
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{selectedRequestForTimeline.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Customer Name</span>
                <span className="font-bold text-slate-900 font-sans">{selectedRequestForTimeline.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Mobile Number</span>
                <span className="font-bold text-slate-900">+91 {selectedRequestForTimeline.customerMobile}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Masked Card</span>
                <span className="font-bold text-slate-900">{selectedRequestForTimeline.cardNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Payment Reference / UTR</span>
                <span className="font-bold text-slate-900">
                  {selectedRequestForTimeline.paymentRefNumber || 'Awaiting Admin entry'}
                </span>
              </div>
              {selectedRequestForTimeline.provider && (
                <div className="col-span-2">
                  <span className="text-slate-400 font-sans block text-[10px]">Payment Provider</span>
                  <span className="font-bold text-slate-900 font-sans">{selectedRequestForTimeline.provider}</span>
                </div>
              )}
              {selectedRequestForTimeline.failureReason && (
                <div className="col-span-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg font-sans">
                  <strong className="block text-[11px] font-bold">Failure / Rejection Reason:</strong>
                  <span className="text-[11px]">{selectedRequestForTimeline.failureReason}</span>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">
                    ✓ Escrow hold of ₹{selectedRequestForTimeline.totalReserved} released back to your Available Wallet.
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Timeline Display */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-600" />
                <span>Execution Timeline</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedRequestForTimeline.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle icon marker */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-xs ${
                        event.status === 'APPROVED'
                          ? 'bg-emerald-600'
                          : event.status === 'FAILED'
                          ? 'bg-rose-600'
                          : event.status === 'PAYMENT DONE'
                          ? 'bg-orange-500'
                          : event.status === 'PROCESSING'
                          ? 'bg-blue-600'
                          : 'bg-emerald-500'
                      }`}
                    >
                      ✓
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{event.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                      )}
                      <span className="text-[10px] text-slate-400 italic block">Actor: {event.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRequestForTimeline(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close Timeline
              </button>

              {selectedRequestForTimeline.status === 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCCReceiptRequest(selectedRequestForTimeline);
                    setSelectedRequestForTimeline(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Download / Print Receipt</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
