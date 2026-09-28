import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BBPS_CATEGORIES,
  BILLERS_DATABASE,
  generateMockBill,
  simulateDelay,
} from '../services/mockServices';
import { ServiceType } from '../types';
import {
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Printer,
  ChevronRight,
  AlertCircle,
  Zap,
  Flame,
  Droplets,
  Tv,
  Car,
  CreditCard,
  Smartphone,
  PhoneCall,
  Wifi,
  Phone,
} from 'lucide-react';

interface BBPSPageProps {
  onNavigate: (path: string) => void;
}

export const BBPSPage: React.FC<BBPSPageProps> = ({ onNavigate }) => {
  const { currentUser, processPayment, setActiveReceiptTxn, getBillPaymentFee, billPaymentFee } = useApp();
  const currentFee = getBillPaymentFee ? getBillPaymentFee() : (billPaymentFee || 10.0);

  const [selectedCategory, setSelectedCategory] = useState<string>('ELECTRICITY');
  const [selectedBillerId, setSelectedBillerId] = useState<string>('');
  const [customerNumber, setCustomerNumber] = useState('40918231');
  const [mobileNumber, setMobileNumber] = useState('9825412390');

  const [fetchingBill, setFetchingBill] = useState(false);
  const [fetchedBill, setFetchedBill] = useState<any | null>(null);
  const [fetchError, setFetchError] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccessTxn, setPaymentSuccessTxn] = useState<any | null>(null);

  const billersList = BILLERS_DATABASE[selectedCategory] || BILLERS_DATABASE['ELECTRICITY'];
  const currentBiller = billersList.find((b) => b.id === selectedBillerId) || billersList[0];

  const handleFetchBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerNumber || !mobileNumber) return;

    setFetchingBill(true);
    setFetchError('');
    setFetchedBill(null);

    await simulateDelay(600);

    const bill = generateMockBill(selectedCategory, currentBiller.id, customerNumber);
    setFetchedBill(bill);
    setFetchingBill(false);
  };

  const calculateCommission = (billAmount: number): number => {
    const s = currentUser?.commissionSettings;
    if (s?.enabled) {
      if (s.agentBillCommissionType === 'FLAT') {
        return s.agentBillCommissionValue;
      }
      return Math.round(billAmount * (s.agentBillCommissionValue / 100) * 100) / 100;
    }
    return Math.round((billAmount * 0.0025 + 2.0) * 100) / 100;
  };

  const handleConfirmPay = () => {
    if (!fetchedBill) return;

    setPaying(true);
    setTimeout(() => {
      const commission = calculateCommission(fetchedBill.totalPayable);
      const serviceCharge = currentFee; // Flat ₹10.00 bill payment fee (or agent configured markup)

      const res = processPayment({
        service: (selectedCategory as ServiceType) || 'BBPS',
        categoryName: BBPS_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'BBPS Utility',
        billerName: currentBiller.name,
        customerName: fetchedBill.customerName,
        customerMobile: mobileNumber,
        customerIdentifier: customerNumber,
        billAmount: fetchedBill.totalPayable,
        serviceCharge,
        commission,
        referencePrefix: 'BBPS',
        metadata: {
          billNumber: fetchedBill.billNumber,
          dueDate: fetchedBill.dueDate,
          lateFee: fetchedBill.lateFee,
          platformFee: currentFee,
        },
      });

      setPaying(false);
      setShowConfirmModal(false);

      if (res.success && res.transaction) {
        setPaymentSuccessTxn(res.transaction);
      } else {
        setFetchError(res.message || 'Payment failed due to insufficient funds.');
      }
    }, 700);
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'ELECTRICITY': return Zap;
      case 'GAS': return Flame;
      case 'WATER': return Droplets;
      case 'DTH': return Tv;
      case 'FASTAG': return Car;
      case 'CREDIT_CARD': return CreditCard;
      case 'MOBILE_RECHARGE': return Smartphone;
      case 'POSTPAID': return PhoneCall;
      case 'BROADBAND': return Wifi;
      default: return Receipt;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>BHARAT BILL PAYMENT SYSTEM (BBPS)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            BBPS Central Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant online fetch & live settlement for electricity, gas, water, municipal and utility bills.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>NPCI / BBPS Certified Switch</span>
        </div>
      </div>

      {paymentSuccessTxn ? (
        /* Success Screen */
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Bill Payment Successful!
            </h2>
            <p className="text-xs text-slate-500">
              Transaction ID: <span className="font-mono font-bold text-slate-800">{paymentSuccessTxn.id}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Biller Name:</span>
              <span className="font-semibold text-slate-900">{paymentSuccessTxn.billerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-semibold text-slate-900">{paymentSuccessTxn.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer Number:</span>
              <span className="font-mono text-slate-800">{paymentSuccessTxn.customerIdentifier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BBPS Reference ID:</span>
              <span className="font-mono font-bold text-emerald-700">{paymentSuccessTxn.bbpsRef}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
              <span className="text-slate-900">Amount Paid:</span>
              <span className="font-mono text-emerald-800 text-sm">₹{paymentSuccessTxn.totalDeducted.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveReceiptTxn(paymentSuccessTxn)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={() => {
                setPaymentSuccessTxn(null);
                setFetchedBill(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
            >
              New Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step 1: Category Picker (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-2 border-b border-slate-100">
              Step 1: Select Category
            </div>

            <div className="space-y-1.5">
              {BBPS_CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat.id);
                const isSel = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedBillerId('');
                      setFetchedBill(null);
                      setFetchError('');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSel
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSel ? 'text-white' : 'text-slate-500'}`} />
                      <span className="text-xs">{cat.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSel ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Form & Fetch Bill (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 pb-2 border-b border-slate-100">
                Step 2: Enter Biller & Consumer Details
              </div>

              {fetchError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{fetchError}</span>
                </div>
              )}

              <form onSubmit={handleFetchBill} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Biller Organization <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedBillerId || currentBiller.id}
                    onChange={(e) => {
                      setSelectedBillerId(e.target.value);
                      setFetchedBill(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  >
                    {billersList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.state ? `(${b.state})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {currentBiller.paramName} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={currentBiller.paramPlaceholder}
                      value={customerNumber}
                      onChange={(e) => setCustomerNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={fetchingBill}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {fetchingBill ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Fetching Bill Details from Biller Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>FETCH BILL</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Fetched Bill Display */}
            {fetchedBill && (
              <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-xs animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Bill Details Retrieved
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    DUE: {fetchedBill.dueDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Consumer Name</span>
                    <div className="font-bold text-slate-900 mt-0.5">{fetchedBill.customerName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Bill Number</span>
                    <div className="font-mono text-slate-800 mt-0.5">{fetchedBill.billNumber}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Bill Date</span>
                    <div className="text-slate-800 mt-0.5">{fetchedBill.billDate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Late Fee</span>
                    <div className="font-mono text-slate-800 mt-0.5">₹{fetchedBill.lateFee.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-600 font-medium">Bill Amount:</span>
                      <span className="font-mono font-bold text-slate-900">₹{fetchedBill.totalPayable.toFixed(2)}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs text-slate-600 font-medium">Platform Fee:</span>
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-violet-800 bg-violet-100 px-2 py-0.5 rounded text-[11px] border border-violet-200">
                        ₹{currentFee.toFixed(2)} Flat
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Total Debit from Wallet: <span className="text-base font-black font-mono text-slate-950">₹{(fetchedBill.totalPayable + currentFee).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors shrink-0"
                  >
                    PROCEED TO PAY
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && fetchedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Confirm BBPS Bill Payment
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Biller:</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{currentBiller.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{fetchedBill.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Consumer No:</span>
                <span className="font-mono text-slate-900">{customerNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bill Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{fetchedBill.totalPayable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-violet-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>Platform / Markup Fee:</span>
                  <span className="text-[10px] bg-violet-100 text-violet-800 px-1.5 py-0.2 rounded font-black border border-violet-200">
                    FLAT ₹10
                  </span>
                </span>
                <span className="font-mono font-bold">+₹{currentFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                <span>Agent Commission Credit:</span>
                <span className="font-mono font-bold">+₹{calculateCommission(fetchedBill.totalPayable).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black">
                <span>Total Debit from Wallet:</span>
                <span className="font-mono text-slate-950">₹{(fetchedBill.totalPayable + currentFee).toFixed(2)}</span>
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
                disabled={paying}
                onClick={handleConfirmPay}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {paying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <span>CONFIRM PAYMENT</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
