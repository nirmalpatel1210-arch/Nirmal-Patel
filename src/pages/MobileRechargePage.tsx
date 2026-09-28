import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MOBILE_OPERATORS,
  MOBILE_CIRCLES,
  RECHARGE_PLANS,
  simulateDelay,
} from '../services/mockServices';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface MobileRechargeProps {
  onNavigate: (path: string) => void;
}

export const MobileRechargePage: React.FC<MobileRechargeProps> = ({ onNavigate }) => {
  const { currentUser, processPayment, setActiveReceiptTxn } = useApp();

  const [mobileNumber, setMobileNumber] = useState('9978123456');
  const [operator, setOperator] = useState('JIO');
  const [circle, setCircle] = useState('Gujarat');
  const [amount, setAmount] = useState('349');
  const [planCategory, setPlanCategory] = useState<'Popular' | 'Unlimited' | 'Data' | 'Validity'>('Popular');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successTxn, setSuccessTxn] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const plans = RECHARGE_PLANS[planCategory] || [];
  const parsedAmount = parseFloat(amount) || 0;
  const commission = Math.round(parsedAmount * 0.015 * 100) / 100;

  const handleSelectPlan = (planAmount: number) => {
    setAmount(planAmount.toString());
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (parsedAmount <= 0) {
      setErrorMsg('Please select or enter a recharge pack');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmRecharge = () => {
    setSubmitting(true);
    setTimeout(() => {
      const selectedOp = MOBILE_OPERATORS.find((o) => o.id === operator)?.name || 'Prepaid Telecom';
      const res = processPayment({
        service: 'MOBILE_RECHARGE',
        categoryName: 'Prepaid Mobile Recharge',
        billerName: `${selectedOp} (${circle})`,
        customerName: 'Mobile Subscriber',
        customerMobile: mobileNumber,
        customerIdentifier: mobileNumber,
        billAmount: parsedAmount,
        serviceCharge: 0.0,
        commission,
        referencePrefix: 'RCHG',
        metadata: {
          operator,
          circle,
          planCategory,
        },
      });

      setSubmitting(false);
      setShowConfirmModal(false);

      if (res.success && res.transaction) {
        setSuccessTxn(res.transaction);
      } else {
        setErrorMsg(res.message || 'Recharge failed due to insufficient wallet balance.');
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>OPERATOR CONSOLE / TELECOM RECHARGE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mobile Recharge
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant prepaid top-up, unlimited 5G packs, data boosters, and validity extensions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Instant API Confirmation</span>
        </div>
      </div>

      {successTxn ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Mobile Recharge Successful!
            </h2>
            <p className="text-xs text-slate-500">
              Recharge ID: <span className="font-mono font-bold text-slate-800">{successTxn.id}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile Number:</span>
              <span className="font-mono font-bold text-slate-900">{successTxn.customerMobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Operator & Circle:</span>
              <span className="font-semibold text-slate-900">{successTxn.billerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recharge Amount:</span>
              <span className="font-mono font-bold text-slate-900">₹{successTxn.billAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Agent Commission:</span>
              <span className="font-mono font-bold">+₹{successTxn.commission.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveReceiptTxn(successTxn)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Recharge Receipt</span>
            </button>
            <button
              onClick={() => {
                setSuccessTxn(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
            >
              New Recharge
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Recharge Parameters</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">1.5% COMMISSION</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleProceed} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  10-Digit Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter customer mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_OPERATORS.map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setOperator(op.id)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                        operator === op.id
                          ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {op.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telecom Circle <span className="text-rose-500">*</span>
                </label>
                <select
                  value={circle}
                  onChange={(e) => setCircle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500 focus:bg-white"
                >
                  {MOBILE_CIRCLES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Recharge Amount <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Comm: ₹{commission.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={10}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>PROCEED TO RECHARGE (₹{parsedAmount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right: Plan Browser (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                Browse Operator Plans
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {operator} · {circle}
              </span>
            </div>

            {/* Plan Category Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(['Popular', 'Unlimited', 'Data', 'Validity'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPlanCategory(tab)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    planCategory === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Plan List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlan(p.amount)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    amount === p.amount.toString()
                      ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black font-mono text-slate-950">
                        ₹{p.amount}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">
                        {p.validity}
                      </span>
                      <span className="text-[11px] text-sky-700 font-bold">
                        · {p.data}
                      </span>
                    </div>

                    {p.tag && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider bg-amber-100 text-amber-800">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Confirm Mobile Recharge
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mobile:</span>
                <span className="font-mono font-bold text-slate-900">+91 {mobileNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Operator & Circle:</span>
                <span className="font-semibold text-slate-900">{operator} ({circle})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Recharge Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{parsedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                <span>Agent Commission:</span>
                <span className="font-mono font-bold">+₹{commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black">
                <span>Total Debit from Wallet:</span>
                <span className="font-mono text-slate-950">₹{parsedAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmRecharge}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Dispatching Recharge...</span>
                  </>
                ) : (
                  <span>CONFIRM RECHARGE</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
