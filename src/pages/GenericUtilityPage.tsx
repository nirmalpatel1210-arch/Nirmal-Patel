import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BILLERS_DATABASE, DTH_OPERATORS, generateMockBill, simulateDelay } from '../services/mockServices';
import { ServiceType } from '../types';
import {
  Zap,
  Flame,
  Droplets,
  Tv,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  ArrowRight,
} from 'lucide-react';

interface UtilityPageProps {
  serviceType: ServiceType;
  onNavigate: (path: string) => void;
}

export const GenericUtilityPage: React.FC<UtilityPageProps> = ({ serviceType, onNavigate }) => {
  const { currentUser, processPayment, setActiveReceiptTxn, getBillPaymentFee, billPaymentFee } = useApp();
  const currentFee = getBillPaymentFee ? getBillPaymentFee() : (billPaymentFee || 10.0);

  const getServiceMeta = () => {
    switch (serviceType) {
      case 'DTH':
        return {
          title: 'DTH Recharge',
          subtitle: 'Tata Play, Airtel DTH, Dish TV, Sun Direct & D2H instant viewing packs',
          icon: Tv,
          color: 'text-rose-500',
          paramLabel: 'Subscriber ID / Viewing Card (VC)',
          placeholder: 'e.g. 1029384756',
        };
      case 'ELECTRICITY':
        return {
          title: 'Electricity Bill Payment',
          subtitle: 'State electricity distribution companies & private discoms bill settlement',
          icon: Zap,
          color: 'text-yellow-500',
          paramLabel: 'Consumer Number / Service ID',
          placeholder: 'e.g. 40918231',
        };
      case 'GAS':
        return {
          title: 'Piped Natural Gas (PNG)',
          subtitle: 'Adani Total Gas, Gujarat Gas, IGL & Sabarmati gas utility bill payment',
          icon: Flame,
          color: 'text-orange-500',
          paramLabel: 'Customer ID / BP Number',
          placeholder: 'e.g. 20019283',
        };
      case 'WATER':
        return {
          title: 'Municipal Water Bill',
          subtitle: 'Municipal corporations water supply and sewerage cess clearance',
          icon: Droplets,
          color: 'text-blue-500',
          paramLabel: 'Tenement / Consumer Number',
          placeholder: 'e.g. 0102030405',
        };
      case 'INSURANCE':
        return {
          title: 'Insurance Premium Payment',
          subtitle: 'LIC of India, HDFC Life, SBI Life & General insurance premium collection',
          icon: ShieldCheck,
          color: 'text-teal-600',
          paramLabel: 'Policy Number',
          placeholder: 'e.g. 881923049',
        };
      case 'FASTAG':
        return {
          title: 'FASTag Toll Recharge',
          subtitle: 'Instant toll tag recharge across ICICI, Paytm, SBI & HDFC NETC FASTags',
          icon: Car,
          color: 'text-purple-600',
          paramLabel: 'Vehicle Registration Number (VRN)',
          placeholder: 'e.g. GJ01KM8821',
        };
      default:
        return {
          title: 'Utility Payment',
          subtitle: 'Live bill fetch and payment gateway',
          icon: Zap,
          color: 'text-emerald-600',
          paramLabel: 'Consumer ID',
          placeholder: 'Enter Consumer ID',
        };
    }
  };

  const meta = getServiceMeta();
  const IconComponent = meta.icon;

  const billers = BILLERS_DATABASE[serviceType] || [];
  const [selectedBillerId, setSelectedBillerId] = useState(billers[0]?.id || '');
  const [consumerNumber, setCustomerNumber] = useState(meta.placeholder.replace('e.g. ', ''));
  const [mobileNumber, setMobileNumber] = useState('9825412390');

  const [fetching, setFetching] = useState(false);
  const [fetchedBill, setFetchedBill] = useState<any | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [fetchError, setFetchError] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [successTxn, setSuccessTxn] = useState<any | null>(null);

  const currentBiller = billers.find((b) => b.id === selectedBillerId) || billers[0];

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber) return;

    setFetching(true);
    setFetchError('');
    setFetchedBill(null);

    await simulateDelay(600);

    const bill = generateMockBill(serviceType, currentBiller?.id || 'BILLER1', consumerNumber);
    setFetchedBill(bill);
    setCustomAmount(bill.totalPayable.toString());
    setFetching(false);
  };

  const billAmount = parseFloat(customAmount) || fetchedBill?.totalPayable || 0;
  const commission = Math.round((billAmount * 0.003 + 2.0) * 100) / 100;

  const handleConfirmPay = () => {
    if (!fetchedBill || billAmount <= 0) return;

    setPaying(true);
    setTimeout(() => {
      const res = processPayment({
        service: serviceType,
        categoryName: meta.title,
        billerName: currentBiller ? currentBiller.name : `${meta.title} Provider`,
        customerName: fetchedBill.customerName,
        customerMobile: mobileNumber,
        customerIdentifier: consumerNumber,
        billAmount,
        serviceCharge: currentFee,
        commission,
        referencePrefix: serviceType.slice(0, 4),
        metadata: {
          billNumber: fetchedBill.billNumber,
          dueDate: fetchedBill.dueDate,
          platformFee: currentFee,
        },
      });

      setPaying(false);
      setShowConfirmModal(false);

      if (res.success && res.transaction) {
        setSuccessTxn(res.transaction);
      } else {
        setFetchError(res.message || 'Payment failed due to wallet balance constraint.');
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OPERATOR CONSOLE / {serviceType}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <IconComponent className={`w-6 h-6 ${meta.color}`} />
            <span>{meta.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{meta.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>BBPS Certified</span>
        </div>
      </div>

      {successTxn ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Payment Confirmed!
            </h2>
            <p className="text-xs text-slate-500">
              Transaction ID: <span className="font-mono font-bold text-slate-800">{successTxn.id}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Biller:</span>
              <span className="font-semibold text-slate-900">{successTxn.billerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-900">{successTxn.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{meta.paramLabel}:</span>
              <span className="font-mono font-bold text-slate-800">{successTxn.customerIdentifier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BBPS Reference:</span>
              <span className="font-mono font-bold text-emerald-700">{successTxn.bbpsRef || successTxn.referenceId}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
              <span className="text-slate-900">Amount Paid:</span>
              <span className="font-mono text-emerald-800 text-sm">₹{successTxn.totalDeducted.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveReceiptTxn(successTxn)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => {
                setSuccessTxn(null);
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
          {/* Form (lg:col-span-6) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Biller & Consumer Parameters</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">BBPS DIRECT FETCH</span>
            </div>

            {fetchError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            <form onSubmit={handleFetch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Provider / Board <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedBillerId || currentBiller?.id}
                  onChange={(e) => {
                    setSelectedBillerId(e.target.value);
                    setFetchedBill(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                >
                  {billers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.state ? `(${b.state})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {meta.paramLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={meta.placeholder}
                  value={consumerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
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
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={fetching}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                {fetching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Inquiring Central Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>FETCH DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Fetched Details (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            {fetchedBill ? (
              <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-xs space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Fetched Customer Bill
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Due: {fetchedBill.dueDate}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consumer Name:</span>
                    <span className="font-bold text-slate-900">{fetchedBill.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bill Number:</span>
                    <span className="font-mono text-slate-800">{fetchedBill.billNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Late Fee:</span>
                    <span className="font-mono text-slate-700">₹{fetchedBill.lateFee.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Payable Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Biller Amount:</span>
                    <span className="font-mono font-bold text-slate-800">₹{billAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-violet-800">
                    <span className="flex items-center gap-1 font-medium">
                      <span>Platform Markup Fee:</span>
                      <span className="text-[10px] bg-violet-100 px-1 rounded font-bold">FLAT ₹10</span>
                    </span>
                    <span className="font-mono font-bold">+₹{currentFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-800 pt-1 border-t border-slate-200">
                    <span className="font-semibold">Agent Commission Credit:</span>
                    <span className="font-mono font-bold text-emerald-800">+₹{commission.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors"
                >
                  PROCEED TO PAY (Total Debit ₹{(billAmount + currentFee).toFixed(2)})
                </button>
              </div>
            ) : (
              <div className="h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
                <IconComponent className="w-10 h-10 text-slate-400 mb-2" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  No Bill Information Queried
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Select your provider and input your consumer identifier to fetch live billing data.
                </p>
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
                Confirm {meta.title}
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
                <span className="text-slate-500">Biller:</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">
                  {currentBiller?.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Consumer:</span>
                <span className="font-bold text-slate-900">{fetchedBill.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{meta.paramLabel}:</span>
                <span className="font-mono font-bold text-slate-900">{consumerNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bill Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{billAmount.toFixed(2)}</span>
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
                <span className="font-mono font-bold">+₹{commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black">
                <span>Total Debit from Wallet:</span>
                <span className="font-mono text-slate-950">₹{(billAmount + currentFee).toFixed(2)}</span>
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
                    <span>Processing Payment...</span>
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
