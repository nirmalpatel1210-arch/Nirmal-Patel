import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface SettlementPageProps {
  onNavigate: (path: string) => void;
}

export const SettlementPage: React.FC<SettlementPageProps> = ({ onNavigate }) => {
  const { currentUser, submitSettlement, settlements } = useApp();

  const [amount, setAmount] = useState('5000');
  const [bankName, setBankName] = useState(currentUser?.bankAccount?.bankName || 'Axis Bank');
  const [accountNumber, setAccountNumber] = useState(currentUser?.bankAccount?.accountNumber || '92001004128912');
  const [ifsc, setIfsc] = useState(currentUser?.bankAccount?.ifsc || 'UTIB0001248');
  const [accountHolder, setAccountHolder] = useState(currentUser?.bankAccount?.accountHolder || currentUser?.name || 'Agent');
  const [mode, setMode] = useState<'IMPS' | 'NEFT'>('IMPS');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const parsedAmount = parseFloat(amount) || 0;
  const availableBal = currentUser?.walletBalance || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (parsedAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount');
      return;
    }

    if (parsedAmount > availableBal) {
      setErrorMsg(`Withdrawal amount exceeds available wallet balance of ₹${availableBal.toFixed(2)}`);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitSettlement({
        amount: parsedAmount,
        bankName,
        accountNumber,
        ifsc,
        accountHolder,
        mode,
      });
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  const agentSettlements = settlements.filter((s) => s.agentId === currentUser?.agentId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>OPERATOR CONSOLE / PAYOUT WITHDRAWAL</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Settlement to Bank Account
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transfer cleared wallet earnings directly to your verified commercial bank account.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
          <span className="text-[10px] uppercase font-bold text-emerald-800">Available Settlement Balance</span>
          <div className="text-xl font-mono font-black text-emerald-900">₹{availableBal.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Settlement Parameters</span>
            <span className="text-[10px] text-slate-500 font-mono">T+0 SAME DAY</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Settlement Request Queued!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Request for ₹{parsedAmount.toLocaleString('en-IN')} to {bankName} (A/C **{accountNumber.slice(-4)}) has been dispatched to banking payout queue.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Submit Another Settlement
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Settlement Amount (INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    min={100}
                    max={availableBal}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Account Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IFSC Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Holder Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Settlement Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('IMPS')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      mode === 'IMPS' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    IMPS (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('NEFT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      mode === 'NEFT' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    NEFT (Batch)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? 'Initiating Settlement...' : 'PROCEED WITHDRAWAL'}
              </button>
            </form>
          )}
        </div>

        {/* Status Queue (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 mb-4">
              Payout Requests Queue
            </div>

            <div className="space-y-3">
              {agentSettlements.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No previous settlement requests found.
                </div>
              ) : (
                agentSettlements.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{s.id}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          s.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'PROCESSING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>{s.bankName} (A/C **{s.accountNumber.slice(-4)})</span>
                      <span className="font-mono font-bold text-slate-950">₹{s.amount.toFixed(2)}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono">
                      Requested: {s.requestDate} {s.utr ? `· UTR: ${s.utr}` : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
            Direct bank settlements are audited under NPCI payout guidelines. Withdrawals initiated during banking hours clear within 15 minutes.
          </div>
        </div>
      </div>
    </div>
  );
};
