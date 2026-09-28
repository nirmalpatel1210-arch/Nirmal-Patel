import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CREDIT_CARD_ISSUERS } from '../services/mockServices';
import { CreditCardRequest } from '../types';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Clock,
  Wallet,
  ExternalLink,
  History,
  Sparkles,
  Info,
  Check,
  Copy,
} from 'lucide-react';

interface CreditCardPayProps {
  onNavigate: (path: string) => void;
}

export const CreditCardPayPage: React.FC<CreditCardPayProps> = ({ onNavigate }) => {
  const { currentUser, createCCRequest } = useApp();

  // Form state initialized to exact prompt specifications
  const [bankName, setBankName] = useState('HDFC Bank');
  const [customerName, setCustomerName] = useState('Rahul Patel');
  const [customerMobile, setCustomerMobile] = useState('9825412390');
  const [cardNumber, setCardNumber] = useState('4582'); // Last 4 or 16 digits
  const [amountStr, setAmountStr] = useState('5000');

  const [processingFee] = useState(50); // Flat ₹50 fee as per prompt example
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdRequest, setCreatedRequest] = useState<CreditCardRequest | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Formatted masked card display
  const cleanCardDigits = cardNumber.replace(/\D/g, '');
  const cardLast4 = cleanCardDigits.slice(-4) || '4582';
  const maskedCardDisplay = `XXXX XXXX XXXX ${cardLast4}`;

  // Balance calculations
  const totalWallet = currentUser?.walletBalance || 0;
  const reservedWallet = currentUser?.reservedBalance || 0;
  const availableWallet = Math.max(0, totalWallet - reservedWallet);

  const amount = parseFloat(amountStr) || 0;
  const totalRequired = amount > 0 ? amount + processingFee : 0;
  const isInsufficient = availableWallet < totalRequired;
  const remainingAfter = Math.max(0, availableWallet - totalRequired);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!bankName) {
      setSubmitError('Please select the Credit Card Bank.');
      return;
    }
    if (!customerName.trim()) {
      setSubmitError('Please enter the customer name.');
      return;
    }
    if (!customerMobile || customerMobile.length !== 10) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!cardLast4 || cardLast4.length !== 4) {
      setSubmitError('Please enter valid credit card digits.');
      return;
    }
    if (amount <= 0) {
      setSubmitError('Please specify an amount greater than ₹0.');
      return;
    }
    if (isInsufficient) {
      setSubmitError(
        `Insufficient Wallet Balance. Available: ₹${availableWallet.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
        })}, Required: ₹${totalRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmReservation = () => {
    setSubmitting(true);
    setSubmitError('');

    setTimeout(() => {
      const res = createCCRequest({
        bankName,
        customerName,
        customerMobile,
        cardNumber: maskedCardDisplay,
        amount,
        processingFee,
      });

      setSubmitting(false);
      setShowConfirmModal(false);

      if (res.success && res.request) {
        setCreatedRequest(res.request);
      } else {
        setSubmitError(res.message || 'Unable to create payment request.');
      }
    }, 400);
  };

  const handleCopyReqId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleFillDemo = (bank: string, cust: string, mob: string, card: string, amt: string) => {
    setBankName(bank);
    setCustomerName(cust);
    setCustomerMobile(mob);
    setCardNumber(card);
    setAmountStr(amt);
    setSubmitError('');
    setCreatedRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>OPERATOR CONSOLE / CREDIT CARD BILL PAYMENT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Credit Card Bill Payment Request
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit card bill payment request for Admin execution. Required funds are held in escrow and debited only after Super Admin completes payment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/agent/credit-card-history')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>CC Bill History & Timeline</span>
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Form & Live Escrow Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Request Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Demo Pre-fill Chips */}
          <div className="bg-violet-50/70 border border-violet-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-violet-900 font-bold">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Prompt Test Cases (One-Click Pre-fill):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('HDFC Bank', 'Rahul Patel', '9825412390', '4582', '5000')}
                className="px-2.5 py-1 bg-white hover:bg-violet-100 text-violet-800 font-bold rounded-lg border border-violet-300 transition-colors shadow-2xs"
              >
                HDFC ₹5,000 (Rahul Patel)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('SBI Card', 'Amit Shah', '9898234190', '9012', '12000')}
                className="px-2.5 py-1 bg-white hover:bg-violet-100 text-violet-800 font-bold rounded-lg border border-violet-300 transition-colors shadow-2xs"
              >
                SBI ₹12,000 (Amit Shah)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('ICICI Bank', 'Priya Sharma', '9724109841', '3319', '8500')}
                className="px-2.5 py-1 bg-white hover:bg-violet-100 text-violet-800 font-bold rounded-lg border border-violet-300 transition-colors shadow-2xs"
              >
                ICICI ₹8,500 (Priya Sharma)
              </button>
            </div>
          </div>

          {/* Success Banner if just created */}
          {createdRequest && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-slate-900 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-950">
                      Payment Request Submitted Successfully!
                    </h3>
                    <p className="text-xs text-emerald-800">
                      Dispatched to Super Admin panel. Funds are securely reserved in your wallet.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>{createdRequest.status}</span>
                </span>
              </div>

              {/* Request Metadata Grid */}
              <div className="bg-white rounded-xl p-4 border border-emerald-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Request ID</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span>{createdRequest.id}</span>
                    <button
                      onClick={() => handleCopyReqId(createdRequest.id)}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                      title="Copy Request ID"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Transaction ID</span>
                  <span className="font-bold text-slate-900">{createdRequest.transactionId}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Credit Card Bank</span>
                  <span className="font-bold text-slate-900 font-sans">{createdRequest.bankName}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Customer Name</span>
                  <span className="font-bold text-slate-900 font-sans">{createdRequest.customerName}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Card Number</span>
                  <span className="font-bold text-slate-900">{createdRequest.cardNumber}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Card Amount</span>
                  <span className="font-bold text-slate-900">₹{createdRequest.amount.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Wallet Reserved</span>
                  <span className="font-bold text-amber-700">₹{createdRequest.totalReserved.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Submitted Date & Time</span>
                  <span className="font-semibold text-slate-700">{createdRequest.createdAt}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold">Current Status</span>
                  <span className="font-extrabold text-amber-700">🟡 REQUESTED</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreatedRequest(null)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  + Submit Another Payment Request
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/agent/credit-card-history')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Track Live Status & Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-violet-600" />
                <span>Card Bill Payment Details</span>
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Workflow: Agent Request → Admin Execution
              </span>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{submitError}</span>
              </div>
            )}

            {/* Insufficient Balance Notice */}
            {isInsufficient && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Insufficient Wallet Balance</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your Available Wallet Balance is{' '}
                  <strong className="font-mono">
                    ₹{availableWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </strong>
                  , but this request requires{' '}
                  <strong className="font-mono">
                    ₹{totalRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </strong>{' '}
                  (Card Bill ₹{amount.toLocaleString('en-IN')} + Fee ₹{processingFee}).
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('/wallet/qr-load')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Instant UPI Wallet Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Credit Card Bank */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credit Card Bank / Issuer <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-violet-500 focus:bg-white"
                  >
                    {CREDIT_CARD_ISSUERS.map((issuer) => (
                      <option key={issuer.id} value={issuer.name}>
                        {issuer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Customer Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Name (As printed on Card) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Patel"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-violet-500 focus:bg-white"
                  />
                </div>

                {/* 3. Customer Mobile Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="9825412390"
                      className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-hidden focus:border-violet-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* 4. Credit Card Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credit Card Number (Last 4 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="e.g. 4582 or full 16 digits"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-hidden focus:border-violet-500 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>Masked Preview:</span>
                    <span className="font-bold text-slate-800">{maskedCardDisplay}</span>
                  </div>
                </div>

                {/* 5. Amount */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bill Payment Amount (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold text-base select-none">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold text-lg focus:outline-hidden focus:border-violet-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bill Breakdown summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Requested Card Payment:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Processing Fee:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{processingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Wallet Amount to Reserve:</span>
                  <span className="font-mono text-violet-700 text-base">
                    ₹{totalRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isInsufficient || amount <= 0}
                  className="w-full py-3 bg-violet-700 hover:bg-violet-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md shadow-violet-700/20 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>SUBMIT PAYMENT REQUEST</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  * Funds will be reserved in wallet escrow. Admin will make the actual payment and finalize the status.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1 Col): Wallet Balance & Escrow Information */}
        <div className="space-y-6">
          {/* Agent Wallet Escrow Card (matches prompt example) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Wallet Escrow Summary
              </span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block">
                  Total Ledger Balance
                </span>
                <span className="text-lg font-black text-slate-900">
                  ₹{totalWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-sans uppercase font-bold text-emerald-700 block">
                  Available Wallet Balance
                </span>
                <span className="text-xl font-black text-emerald-900">
                  ₹{availableWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-sans text-emerald-700 block mt-0.5">
                  Available for new transactions
                </span>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-[10px] font-sans uppercase font-bold text-amber-800 block">
                  Reserved (Hold) Balance
                </span>
                <span className="text-lg font-black text-amber-900">
                  ₹{reservedWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-sans text-amber-700 block mt-0.5">
                  Held for pending CC requests
                </span>
              </div>

              {amount > 0 && (
                <div className="p-3 bg-violet-50 rounded-xl border border-violet-200 text-xs font-sans">
                  <span className="text-[10px] uppercase font-bold text-violet-700 block mb-1">
                    Simulation for this Request:
                  </span>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Requested:</span>
                      <span className="font-bold">₹{amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Fee:</span>
                      <span className="font-bold">₹{processingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-violet-200 pt-1 text-violet-950 font-bold">
                      <span className="font-sans">New Hold:</span>
                      <span>₹{totalRequired.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span className="font-sans">Available After:</span>
                      <span>₹{remainingAfter.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/wallet/qr-load')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>+ Recharge Wallet via UPI QR</span>
              </button>
            </div>
          </div>

          {/* Workflow Architecture Guide */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Official Workflow Guarantee
            </span>

            <ol className="space-y-2 text-[11px] leading-relaxed list-decimal list-inside text-slate-300">
              <li>
                <strong className="text-white">Agent Wallet Check:</strong> Available balance validated before hold.
              </li>
              <li>
                <strong className="text-white">Escrow Hold:</strong> ₹{processingFee} fee + amount reserved safely.
              </li>
              <li>
                <strong className="text-white">Admin Executes:</strong> Super Admin uses authorized bank gateway.
              </li>
              <li>
                <strong className="text-white">Dual Verification:</strong> UTR/Reference entered before final approval.
              </li>
              <li>
                <strong className="text-white">Auto Refund:</strong> If rejected or failed, reserved balance is immediately released.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Confirm Payment Request</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are submitting a Credit Card Bill Payment request. An escrow hold of{' '}
              <strong className="font-mono text-slate-900">
                ₹{totalRequired.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>{' '}
              will be applied to your available wallet.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Bank:</span>
                <span className="font-bold text-slate-900 font-sans">{bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Customer:</span>
                <span className="font-bold text-slate-900 font-sans">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Card:</span>
                <span className="font-bold text-slate-900">{maskedCardDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Bill Amount:</span>
                <span className="font-bold text-slate-900">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Processing Fee:</span>
                <span className="font-bold text-slate-900">₹{processingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-violet-700">
                <span className="font-sans">Total Escrow Hold:</span>
                <span>₹{totalRequired.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmReservation}
                className="px-5 py-2.5 bg-violet-700 hover:bg-violet-800 text-white rounded-xl font-extrabold transition-colors flex items-center gap-2 shadow-xs"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reserving Escrow...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
