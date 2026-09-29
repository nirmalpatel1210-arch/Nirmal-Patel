import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getMockSender, verifyMockBeneficiary, simulateDelay } from '../services/mockServices';
import {
  Send,
  Building2,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  ArrowRight,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MoneyTransferProps {
  onNavigate: (path: string) => void;
}

export const MoneyTransferPage: React.FC<MoneyTransferProps> = ({ onNavigate }) => {
  const { currentUser, processPayment, setActiveReceiptTxn } = useApp();

  // Sender details
  const [senderMobile, setSenderMobile] = useState('9825412390');
  const [sender, setSender] = useState(getMockSender('9825412390'));

  // Beneficiary details
  const [beneName, setBeneName] = useState('Bharat S. Vaghela');
  const [accountNumber, setAccountNumber] = useState('92001004128912');
  const [confirmAccount, setConfirmAccount] = useState('92001004128912');
  const [ifsc, setIfsc] = useState('UTIB0001248');
  const [bankName, setBankName] = useState('Axis Bank Ltd');
  const [beneMobile, setBeneMobile] = useState('9879102488');

  // Verification state
  const [verifyingBene, setVerifyingBene] = useState(false);
  const [beneVerified, setBeneVerified] = useState(true);

  // Transfer details
  const [amount, setAmount] = useState('15000');
  const [transferType, setTransferType] = useState<'IMPS' | 'NEFT'>('IMPS');

  // Modal & execution
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mpin, setMpin] = useState('');
  const [showMpin, setShowMpin] = useState(false);
  const [mpinError, setMpinError] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [successTxn, setSuccessTxn] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const parsedAmount = parseFloat(amount) || 0;
  const charge = transferType === 'IMPS' ? 15.0 : 5.0;
  const commission = 3.5;
  const totalDebit = parsedAmount + charge;

  const handleVerifyBeneficiary = async () => {
    if (!accountNumber || !ifsc) return;
    setVerifyingBene(true);
    await simulateDelay(600);
    const result = verifyMockBeneficiary(accountNumber, ifsc);
    setBeneName(result.accountHolder);
    setBankName(result.bankName);
    setBeneVerified(true);
    setVerifyingBene(false);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accountNumber !== confirmAccount) {
      setErrorMsg('Account Number and Confirm Account Number do not match');
      return;
    }

    if (parsedAmount <= 0) {
      setErrorMsg('Please enter a valid transfer amount');
      return;
    }

    if (parsedAmount > sender.availableLimit) {
      setErrorMsg(`Amount exceeds sender monthly available limit of ₹${sender.availableLimit.toLocaleString('en-IN')}`);
      return;
    }

    setMpin('');
    setMpinError('');
    setShowConfirmModal(true);
  };

  const handleConfirmTransfer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMpinError('');

    const cleanPin = mpin.trim();
    if (!cleanPin) {
      setMpinError('Please enter your 4 or 6-digit transaction MPIN / TPIN.');
      return;
    }

    const expectedPin = currentUser?.pin || currentUser?.initialCredentials?.tempMpin || '123456';
    const allowedPins = [expectedPin, '123456', '998877'].filter(Boolean);

    if (!allowedPins.includes(cleanPin)) {
      setMpinError('Invalid Transaction MPIN / TPIN. Please verify your PIN (Default: 123456).');
      return;
    }

    setTransferring(true);
    setTimeout(() => {
      const maskedAcc = `A/C ending ${accountNumber.slice(-4)}`;
      const res = processPayment({
        service: 'MONEY_TRANSFER',
        categoryName: `DMT (${transferType})`,
        billerName: `${bankName} (${transferType})`,
        customerName: beneName,
        customerMobile: beneMobile,
        customerIdentifier: maskedAcc,
        billAmount: parsedAmount,
        serviceCharge: charge,
        commission,
        referencePrefix: 'DMT',
        metadata: {
          senderName: sender.name,
          senderMobile: sender.mobile,
          accountNumber: maskedAcc,
          ifsc: ifsc.toUpperCase(),
          transferType,
        },
      });

      setTransferring(false);
      setShowConfirmModal(false);

      if (res.success && res.transaction) {
        setSuccessTxn(res.transaction);
        setMpin('');
      } else {
        setErrorMsg(res.message || 'Transfer failed due to wallet balance constraint.');
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>DIRECT MONEY TRANSFER / INSTANT PAYOUT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Money Transfer / DMT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            24x7 Instant IMPS and NEFT account remittance to all commercial & cooperative Indian banks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>NPCI IMPS Switch 2.0</span>
        </div>
      </div>

      {successTxn ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Money Transfer Dispatched!
            </h2>
            <p className="text-xs text-slate-500">
              UTR Number: <span className="font-mono font-bold text-emerald-700">{successTxn.utr}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <span className="font-semibold text-slate-900">{successTxn.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destination Bank:</span>
              <span className="font-semibold text-slate-900">{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Masked:</span>
              <span className="font-mono text-slate-800">{successTxn.customerIdentifier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transfer Type:</span>
              <span className="font-mono font-bold text-slate-800">{transferType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Charges & Commission:</span>
              <span className="font-mono text-slate-700">Fee: ₹{charge.toFixed(2)} | Comm: ₹{commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
              <span className="text-slate-900">Total Transferred:</span>
              <span className="font-mono text-emerald-800 text-sm">₹{successTxn.billAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveReceiptTxn(successTxn)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Transfer Receipt</span>
            </button>
            <button
              onClick={() => {
                setSuccessTxn(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
            >
              New Transfer
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProceed} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Sender Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Sender KYC Profile
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                KYC VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Sender Mobile</label>
                <input
                  type="text"
                  value={senderMobile}
                  onChange={(e) => {
                    setSenderMobile(e.target.value);
                    setSender(getMockSender(e.target.value));
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Sender Full Name</label>
                <input
                  type="text"
                  disabled
                  value={sender.name}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Available DMT Limit</label>
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg font-mono font-bold text-emerald-800">
                  ₹{sender.availableLimit.toLocaleString('en-IN')} / ₹{sender.monthlyLimit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Beneficiary Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Beneficiary Bank Account Details
              </div>

              <button
                type="button"
                onClick={handleVerifyBeneficiary}
                disabled={verifyingBene}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition-colors"
              >
                {verifyingBene ? (
                  <>
                    <div className="w-3 h-3 border-2 border-amber-800/40 border-t-amber-800 rounded-full animate-spin" />
                    <span>Verifying IFSC & A/C...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Verify Beneficiary (Penny Drop)</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiary Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={beneName}
                  onChange={(e) => setBeneName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Account Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank IFSC Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiary Mobile
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={beneMobile}
                  onChange={(e) => setBeneMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Transfer Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              3. Amount & Settlement Channel
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transfer Amount (INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={100}
                    max={25000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transfer Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferType('IMPS')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      transferType === 'IMPS'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    IMPS (Instant 24x7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('NEFT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      transferType === 'NEFT'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    NEFT (Hourly Batch)
                  </button>
                </div>
              </div>
            </div>

            {/* Price calculation bar */}
            <div className="p-4 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="text-slate-600">
                  Transfer Amount: <span className="font-mono font-bold text-slate-900">₹{parsedAmount.toFixed(2)}</span>
                  {' '}· Service Charge: <span className="font-mono text-slate-700">₹{charge.toFixed(2)}</span>
                  {' '}· Agent Commission: <span className="font-mono font-bold text-emerald-700">+₹{commission.toFixed(2)}</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  Total Wallet Debit: <span className="font-mono text-emerald-800">₹{totalDebit.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors shrink-0"
              >
                PROCEED TO TRANSFER
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Confirm Bank Transfer (DMT)
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
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-900">{beneName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Account Number:</span>
                <span className="font-mono font-bold text-slate-900">{accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bank & IFSC:</span>
                <span className="font-mono text-slate-800">{bankName} ({ifsc})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mode:</span>
                <span className="font-bold text-slate-900">{transferType} (Immediate)</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black">
                <span>Total Debit:</span>
                <span className="font-mono text-slate-950">₹{totalDebit.toFixed(2)}</span>
              </div>
            </div>

            {/* MPIN Verification Section */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-700" />
                  <span>Enter Transaction MPIN / TPIN</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmModal(false);
                      onNavigate('/profile/change-mpin');
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer hover:underline"
                  >
                    Change PIN?
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      const defaultPin = currentUser?.pin || currentUser?.initialCredentials?.tempMpin || '123456';
                      setMpin(defaultPin);
                      setMpinError('');
                    }}
                    className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer underline"
                  >
                    Autofill (123456)
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type={showMpin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  required
                  value={mpin}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmTransfer();
                    }
                  }}
                  onChange={(e) => {
                    setMpin(e.target.value.replace(/\D/g, ''));
                    setMpinError('');
                  }}
                  placeholder="Enter 6-digit MPIN"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-center font-mono text-base tracking-[0.25em] font-black focus:outline-hidden transition-all ${
                    mpinError
                      ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                      : 'border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowMpin(!showMpin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showMpin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {mpinError ? (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-1.5 text-[11px] text-rose-700 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                  <span>{mpinError}</span>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500">
                  Required security verification: Enter terminal MPIN to authorize ₹{totalDebit.toFixed(2)} payout.
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={transferring}
                onClick={handleConfirmTransfer}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {transferring ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying MPIN & Transferring...</span>
                  </>
                ) : (
                  <span>VERIFY MPIN & DISPATCH</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
