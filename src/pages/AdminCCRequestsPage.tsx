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
  ArrowRight,
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
  UploadCloud,
  FileCheck2,
  Sliders,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface AdminCCRequestsProps {
  onNavigate: (path: string) => void;
}

export const AdminCCRequestsPage: React.FC<AdminCCRequestsProps> = ({ onNavigate }) => {
  const {
    ccRequests,
    agents,
    adminStartProcessingCCRequest,
    adminMarkPaymentDoneCCRequest,
    adminApproveCCRequest,
    adminMarkFailedCCRequest,
    adminRejectCCRequest,
    adminRefundCCRequest,
    setActiveCCReceiptRequest,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Selected request for full processing modal
  const [selectedRequest, setSelectedRequest] = useState<CreditCardRequest | null>(null);

  // Admin Payment Processing Form State (Requirement #8)
  const [provider, setProvider] = useState('Direct NetBanking (Corporate Gateway)');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [processingError, setProcessingError] = useState('');
  const [isDoneConfirmed, setIsDoneConfirmed] = useState(false);

  // Failure / Rejection / Refund modal states
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundRef, setRefundRef] = useState('');

  // Keep selectedRequest in sync with ccRequests
  const activeReq = selectedRequest
    ? ccRequests.find((r) => r.id === selectedRequest.id) || selectedRequest
    : null;

  // Counters
  const totalCount = ccRequests.length;
  const requestedCount = ccRequests.filter((r) => r.status === 'REQUESTED').length;
  const processingCount = ccRequests.filter((r) => r.status === 'PROCESSING').length;
  const paymentDoneCount = ccRequests.filter((r) => r.status === 'PAYMENT DONE').length;
  const approvedCount = ccRequests.filter((r) => r.status === 'APPROVED').length;
  const failedCount = ccRequests.filter((r) => r.status === 'FAILED').length;
  const rejectedCount = ccRequests.filter((r) => r.status === 'REJECTED').length;
  const refundedCount = ccRequests.filter((r) => r.status === 'REFUNDED').length;

  const pendingRequestsCount = requestedCount + processingCount + paymentDoneCount;

  // Financial aggregates (Requirement #22: Admin Report)
  const totalRequestedAmount = ccRequests.reduce((sum, r) => sum + r.amount, 0);
  const totalApprovedAmount = ccRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalFailedAmount = ccRequests
    .filter((r) => r.status === 'FAILED' || r.status === 'REJECTED')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalRefundedAmount = ccRequests
    .filter((r) => r.status === 'REFUNDED')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalWalletDebit = ccRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.totalReserved, 0);
  const totalCommission = approvedCount * 15.0;

  // Filter application
  const filteredList = ccRequests.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(q) ||
      r.transactionId.toLowerCase().includes(q) ||
      r.agentId.toLowerCase().includes(q) ||
      r.agentName.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerMobile.includes(q) ||
      r.bankName.toLowerCase().includes(q) ||
      r.cardLast4.includes(q) ||
      (r.paymentRefNumber && r.paymentRefNumber.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesAgent = agentFilter === 'ALL' || r.agentId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const paginatedList = filteredList.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleOpenProcessModal = (req: CreditCardRequest) => {
    setSelectedRequest(req);
    setProcessingError('');
    setProvider(req.provider || 'Direct NetBanking (Corporate Gateway)');
    setPaymentRefNumber(req.paymentRefNumber || `REF-UTR-${Math.floor(100000000 + Math.random() * 900000000)}`);
    setAmountPaid(req.amountPaid ? req.amountPaid.toString() : req.amount.toString());
    setAdminRemarks(req.adminRemarks || 'Card payment executed on authorized bank portal.');
    setPaymentProofUrl(req.paymentProofUrl || '');
    setIsDoneConfirmed(req.status === 'PAYMENT DONE' || req.status === 'APPROVED');
  };

  const handleMarkPaymentDone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;
    setProcessingError('');

    if (!paymentRefNumber.trim()) {
      setProcessingError('Payment Reference Number / UTR is mandatory before marking Payment Done.');
      return;
    }

    const paidVal = parseFloat(amountPaid) || activeReq.amount;

    adminMarkPaymentDoneCCRequest(activeReq.id, {
      provider,
      paymentRefNumber,
      amountPaid: paidVal,
      paymentProofUrl,
      adminRemarks,
    });

    setIsDoneConfirmed(true);
  };

  const handleFinalApproval = () => {
    if (!activeReq) return;
    if (!paymentRefNumber.trim() && !activeReq.paymentRefNumber) {
      setProcessingError('Payment Reference Number is required before final approval.');
      return;
    }

    adminApproveCCRequest(activeReq.id, adminRemarks);
    setSelectedRequest(null);
  };

  const handleStartProcessing = () => {
    if (!activeReq) return;
    adminStartProcessingCCRequest(activeReq.id, adminRemarks || 'Processing started by Super Admin.');
  };

  const handleConfirmFailed = () => {
    if (!activeReq || !failureReason.trim()) return;
    adminMarkFailedCCRequest(activeReq.id, failureReason);
    setShowFailureModal(false);
    setSelectedRequest(null);
    setFailureReason('');
  };

  const handleConfirmReject = () => {
    if (!activeReq || !rejectionReason.trim()) return;
    adminRejectCCRequest(activeReq.id, rejectionReason);
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const handleConfirmRefund = () => {
    if (!activeReq || !refundReason.trim()) return;
    const ref = refundRef.trim() || `RFD-${Date.now().toString().slice(-6)}`;
    adminRefundCCRequest(activeReq.id, refundReason, ref);
    setShowRefundModal(false);
    setSelectedRequest(null);
    setRefundReason('');
    setRefundRef('');
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-orange-900 border border-orange-300 shadow-2xs">
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
      {/* Admin Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>ADMIN GOVERNANCE / PAYMENT FULFILLMENT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-3">
            <span>Credit Card Payment Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-xs">
                {pendingRequestsCount} Pending Action
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin payment desk: Review Agent card requests, execute payments via authorized corporate gateway, record UTR references, and issue final dual approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/dashboard')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            ← Back to Admin Console
          </button>
        </div>
      </div>

      {/* Requirement #22: Admin Report & Financial Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Requests</span>
          <div className="text-xl font-black font-mono text-slate-900 mt-0.5">{totalCount}</div>
          <span className="text-[10px] text-slate-500 font-mono">₹{(totalRequestedAmount / 1000).toFixed(1)}k Vol</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-amber-200 bg-amber-50/40 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending Action</span>
          <div className="text-xl font-black font-mono text-amber-900 mt-0.5">{pendingRequestsCount}</div>
          <span className="text-[10px] text-amber-800">
            {requestedCount} New | {processingCount} Proc
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-orange-200 bg-orange-50/40 shadow-xs">
          <span className="text-[10px] font-bold text-orange-700 uppercase block">Payment Done</span>
          <div className="text-xl font-black font-mono text-orange-900 mt-0.5">{paymentDoneCount}</div>
          <span className="text-[10px] text-orange-800">Awaiting Approval</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Approved (Settled)</span>
          <div className="text-xl font-black font-mono text-emerald-900 mt-0.5">{approvedCount}</div>
          <span className="text-[10px] text-emerald-800 font-mono">₹{totalApprovedAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-rose-200 bg-rose-50/40 shadow-xs">
          <span className="text-[10px] font-bold text-rose-700 uppercase block">Failed / Rejected</span>
          <div className="text-xl font-black font-mono text-rose-900 mt-0.5">{failedCount + rejectedCount}</div>
          <span className="text-[10px] text-rose-800 font-mono">Escrow Released</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-purple-200 bg-purple-50/40 shadow-xs">
          <span className="text-[10px] font-bold text-purple-700 uppercase block">Refunded</span>
          <div className="text-xl font-black font-mono text-purple-900 mt-0.5">{refundedCount}</div>
          <span className="text-[10px] text-purple-800 font-mono">₹{totalRefundedAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Req, Agent, Customer, Card..."
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
              <option value="REQUESTED">REQUESTED ({requestedCount})</option>
              <option value="PROCESSING">PROCESSING ({processingCount})</option>
              <option value="PAYMENT DONE">PAYMENT DONE ({paymentDoneCount})</option>
              <option value="APPROVED">APPROVED ({approvedCount})</option>
              <option value="FAILED">FAILED ({failedCount})</option>
              <option value="REJECTED">REJECTED ({rejectedCount})</option>
              <option value="REFUNDED">REFUNDED ({refundedCount})</option>
            </select>

            {/* Agent Filter */}
            <select
              value={agentFilter}
              onChange={(e) => {
                setAgentFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-violet-500"
            >
              <option value="ALL">All Agents</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.agentId}>
                  {ag.agentId} - {ag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Showing <span className="font-bold text-slate-900">{filteredList.length}</span> requests
          </div>
        </div>

        {/* Requests Table (Requirement #6) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Agent Terminal</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Bank</th>
                <th className="py-3 px-4">Card Ending</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Wallet Reserved</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No credit card payment requests match your criteria.
                  </td>
                </tr>
              ) : (
                paginatedList.map((req) => {
                  const isPending =
                    req.status === 'REQUESTED' || req.status === 'PROCESSING' || req.status === 'PAYMENT DONE';

                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isPending ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Request ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {req.id}
                      </td>

                      {/* Transaction ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {req.transactionId}
                      </td>

                      {/* Agent */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{req.agentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{req.agentId}</div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{req.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">+91 {req.customerMobile}</div>
                      </td>

                      {/* Bank */}
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {req.bankName}
                      </td>

                      {/* Card Ending */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                        XXXX-{req.cardLast4}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        ₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Wallet Reserved */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 whitespace-nowrap">
                        ₹{req.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {renderStatusBadge(req.status)}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                        <div>{req.date}</div>
                        <div className="text-[10px] text-slate-400">{req.time}</div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'PAYMENT DONE' ? (
                            <button
                              onClick={() => handleOpenProcessModal(req)}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 animate-pulse"
                              title="Payment Done - Click to Finalize Approval"
                            >
                              <span>Approve</span>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : req.status === 'REQUESTED' || req.status === 'PROCESSING' ? (
                            <button
                              onClick={() => handleOpenProcessModal(req)}
                              className="px-2.5 py-1 bg-violet-700 hover:bg-violet-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <span>Process</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenProcessModal(req)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
         ADMIN REQUEST DETAILS & PAYMENT PROCESSING MODAL (Requirements #7, #8, #9, #10)
      ========================================================================= */}
      {activeReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-6 h-6 text-violet-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Credit Card Bill Payment Request — {activeReq.id}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Transaction ID: {activeReq.transactionId} | Agent: {activeReq.agentName} ({activeReq.agentId})
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Error banner */}
            {processingError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{processingError}</span>
              </div>
            )}

            {/* Requirement #7: Request Details & Escrow Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Bank / Issuer</span>
                <span className="font-bold text-slate-900 font-sans text-sm">{activeReq.bankName}</span>
              </div>

              <div>
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Card Number</span>
                <span className="font-bold text-slate-900 text-sm">{activeReq.cardNumber}</span>
              </div>

              <div>
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Customer Name</span>
                <span className="font-bold text-slate-900 font-sans">{activeReq.customerName}</span>
              </div>

              <div>
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Customer Mobile</span>
                <span className="font-bold text-slate-900">+91 {activeReq.customerMobile}</span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Requested Bill</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{activeReq.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Processing Fee</span>
                <span className="font-bold text-slate-900">
                  ₹{activeReq.processingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Total Reserved (Hold)</span>
                <span className="font-bold text-amber-700 text-sm">
                  ₹{activeReq.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Lifecycle Status</span>
                <div className="mt-0.5">{renderStatusBadge(activeReq.status)}</div>
              </div>

              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Agent Wallet Before Hold</span>
                <span className="font-bold text-slate-800">
                  ₹{activeReq.agentWalletBefore.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Agent Available After Hold</span>
                <span className="font-bold text-emerald-800">
                  ₹{activeReq.agentAvailableAfterHold.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Requirement #8: Admin Section — PAYMENT PROCESSING */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600" />
                  <span>PAYMENT PROCESSING (ADMIN EXECUTION)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  Use authorized external payment method / gateway
                </span>
              </div>

              <form onSubmit={handleMarkPaymentDone} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Provider */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Payment Provider / Route <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      disabled={activeReq.status === 'APPROVED'}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-violet-500"
                    >
                      <option value="Direct NetBanking (Corporate Gateway)">Direct NetBanking (Corporate Gateway)</option>
                      <option value="BBPS Bharat BillPay Central Switch">BBPS Bharat BillPay Central Switch</option>
                      <option value="HDFC PayZapp / Corporate Portal">HDFC PayZapp / Corporate Portal</option>
                      <option value="SBI Corporate NetBanking">SBI Corporate NetBanking</option>
                      <option value="ICICI E-Pay Portal">ICICI E-Pay Portal</option>
                      <option value="BillDesk / Razorpay Commercial Gateway">BillDesk / Razorpay Commercial Gateway</option>
                      <option value="RTGS / NEFT Direct Bank Transfer">RTGS / NEFT Direct Bank Transfer</option>
                    </select>
                  </div>

                  {/* Payment Reference Number / UTR */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Payment Reference Number / UTR <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentRefNumber}
                      onChange={(e) => setPaymentRefNumber(e.target.value)}
                      disabled={activeReq.status === 'APPROVED'}
                      placeholder="e.g. HDFC-CC-9018491823 or Bank UTR"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-violet-500"
                    />
                  </div>

                  {/* Amount Paid */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Actual Amount Paid (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      disabled={activeReq.status === 'APPROVED'}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-violet-500"
                    />
                  </div>

                  {/* Payment Proof / Attachment simulator */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Payment Proof / Screenshot Upload (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentProofUrl}
                        onChange={(e) => setPaymentProofUrl(e.target.value)}
                        disabled={activeReq.status === 'APPROVED'}
                        placeholder="e.g. proof_receipt_991.pdf"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setPaymentProofUrl(`proof_txn_${Date.now().toString().slice(-5)}.png`)}
                        className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold shrink-0"
                        title="Simulate upload"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Admin Remarks */}
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Admin Internal Remarks</label>
                    <input
                      type="text"
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      disabled={activeReq.status === 'APPROVED'}
                      placeholder="e.g. Card payment executed via HDFC Netbanking. Verified with customer Rahul Patel."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Workflow Buttons for Admin */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* Mark as Failed */}
                    {activeReq.status !== 'APPROVED' && activeReq.status !== 'FAILED' && activeReq.status !== 'REFUNDED' && (
                      <button
                        type="button"
                        onClick={() => setShowFailureModal(true)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>MARK AS FAILED</span>
                      </button>
                    )}

                    {/* Reject */}
                    {activeReq.status === 'REQUESTED' && (
                      <button
                        type="button"
                        onClick={() => setShowRejectModal(true)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                      >
                        <span>REJECT REQUEST</span>
                      </button>
                    )}

                    {/* Refund for approved request */}
                    {activeReq.status === 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => setShowRefundModal(true)}
                        className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                        <span>ISSUE REFUND TO AGENT</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Start Processing */}
                    {activeReq.status === 'REQUESTED' && (
                      <button
                        type="button"
                        onClick={handleStartProcessing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                      >
                        <span>START PROCESSING</span>
                      </button>
                    )}

                    {/* Mark As Payment Done */}
                    {activeReq.status !== 'APPROVED' && activeReq.status !== 'PAYMENT DONE' && activeReq.status !== 'FAILED' && (
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>MARK AS PAYMENT DONE</span>
                      </button>
                    )}

                    {/* Step 10: Final Approval (APPROVE PAYMENT) */}
                    {(activeReq.status === 'PAYMENT DONE' || isDoneConfirmed) && activeReq.status !== 'APPROVED' && (
                      <button
                        type="button"
                        onClick={handleFinalApproval}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold tracking-wide uppercase transition-all shadow-md shadow-emerald-700/20 flex items-center gap-2 animate-bounce"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>APPROVE PAYMENT</span>
                      </button>
                    )}

                    {/* Print Receipt if Approved */}
                    {activeReq.status === 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCCReceiptRequest(activeReq);
                          setSelectedRequest(null);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View / Print Approved Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Timeline View inside Admin Modal */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-sans">
                Audit Timeline Events
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {activeReq.timeline.map((ev, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 text-slate-700">
                    <div>
                      <strong className="text-slate-900 font-sans mr-2">✓ {ev.title}:</strong>
                      <span>{ev.description || ''}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{ev.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure Reason Modal (Requirement #15) */}
      {showFailureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Mark Credit Card Payment as Failed</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Marking this request as failed will immediately release the reserved escrow amount of{' '}
              <strong className="font-mono text-slate-900">
                ₹{activeReq?.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>{' '}
              back to the Agent's Available Wallet balance.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Failure Reason (Mandatory) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="e.g. Bank gateway declined card: Inactive account or incorrect expiry date."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowFailureModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!failureReason.trim()}
                onClick={handleConfirmFailed}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl shadow-xs"
              >
                Confirm Failure & Release Escrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal (Requirement #16) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <XCircle className="w-5 h-5 text-slate-700" />
              <span>Reject Credit Card Payment Request</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Provide a clear reason for rejecting this request. The escrow hold will be released back to the Agent wallet.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Card issuer is not currently supported or customer name mismatch."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReason.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl shadow-xs"
              >
                Confirm Rejection & Release Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal (Requirement #17) */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm">
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <span>Issue Refund for Approved Payment</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will credit{' '}
              <strong className="font-mono text-slate-900">
                ₹{activeReq?.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>{' '}
              back to the Agent's wallet and create a separate ledger entry with status REFUNDED.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Refund Reason <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Card payment reversed by bank or duplicate charge"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Refund Reference / UTR</label>
                <input
                  type="text"
                  value={refundRef}
                  onChange={(e) => setRefundRef(e.target.value)}
                  placeholder="e.g. RFD-HDFC-9912048"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!refundReason.trim()}
                onClick={handleConfirmRefund}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl shadow-xs"
              >
                Execute Wallet Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
