import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/mockData';
import {
  QrCode,
  Copy,
  Check,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Eye,
  Maximize2,
  Download,
  X,
} from 'lucide-react';

interface QRLoadWalletProps {
  onNavigate: (path: string) => void;
}

export const QRLoadWalletPage: React.FC<QRLoadWalletProps> = ({ onNavigate }) => {
  const { currentUser, submitFundRequest, fundRequests, activeLiveQR, qrCodes } = useApp();

  const [utrNumber, setUtrNumber] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [amount, setAmount] = useState('10000');
  const [remarks, setRemarks] = useState('');
  const [requestElderQR, setRequestElderQR] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [showZoomQR, setShowZoomQR] = useState(false);

  // Screenshot & OCR simulation states
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<'IDLE' | 'ANALYZING' | 'SUCCESS'>('IDLE');
  const [ocrData, setOcrData] = useState<{ amount?: string; utr?: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedReq, setSubmittedReq] = useState<any>(null);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(activeLiveQR.upiId);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const url = URL.createObjectURL(file);
      setScreenshotPreview(url);

      // Trigger OCR simulation
      setOcrStatus('ANALYZING');
      setTimeout(() => {
        setOcrStatus('SUCCESS');
        const simulatedUTR = 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000);
        setOcrData({
          amount: amount,
          utr: simulatedUTR,
        });
        if (!utrNumber) {
          setUtrNumber(simulatedUTR);
        }
      }, 1500);
    }
  };

  const handleSimulateDemoUpload = () => {
    setScreenshotPreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80');
    setOcrStatus('ANALYZING');
    setTimeout(() => {
      setOcrStatus('SUCCESS');
      const simulatedUTR = 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000);
      setOcrData({
        amount: amount,
        utr: simulatedUTR,
      });
      setUtrNumber(simulatedUTR);
      setCardLast4('4892');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    if (!utrNumber) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = submitFundRequest({
        amount: parsedAmount,
        paymentMode: 'UPI',
        utrNumber,
        cardLast4: cardLast4 || undefined,
        remarks: remarks || `Loaded via Live QR: ${activeLiveQR.name}`,
        proofImageUrl: screenshotPreview || undefined,
        ocrExtractedText: ocrData ? `Extracted UTR: ${ocrData.utr}, Amount: ₹${ocrData.amount}` : undefined,
        qrId: activeLiveQR.id,
        qrName: activeLiveQR.name,
        qrUpiId: activeLiveQR.upiId,
        qrBankName: activeLiveQR.bankName,
      });
      setSubmittedReq(created);
      setSubmitting(false);
      setSubmitSuccess(true);
    }, 800);
  };

  const agentRequests = fundRequests.filter((r) => r.agentId === currentUser?.agentId);

  return (
    <div className="space-y-6">
      {/* Page Header matching video */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OPERATOR CONSOLE / RECHARGE WALLET</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Recharge Wallet
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pay via UPI, then submit UTR + screenshot for admin verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Balance</div>
            <div className="text-lg font-mono font-bold text-emerald-700">
              ₹{currentUser?.walletBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout (Matching Video 00:00 - 00:15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Active UPI QR (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Live QR
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
                0% CONVENIENCE FEE
              </span>
            </div>

            {/* Currently Live Collection Account Banner */}
            <div className="mt-3 p-2.5 rounded-xl bg-violet-50/70 border border-violet-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-violet-600 block">
                Official Collection Account
              </span>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                {activeLiveQR.name}
              </div>
              <div className="text-[11px] text-violet-800 font-medium mt-0.5">
                Bank: <span className="font-bold">{activeLiveQR.bankName}</span>
                {activeLiveQR.accountNumber && (
                  <span> · A/c: <span className="font-mono">{activeLiveQR.accountNumber}</span></span>
                )}
                {activeLiveQR.ifsc && (
                  <span> · IFSC: <span className="font-mono">{activeLiveQR.ifsc}</span></span>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  SCAN QR TO PAY
                </span>
                {activeLiveQR.qrImageUrl && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Official Live QR</span>
                  </span>
                )}
              </div>

              {/* Realistic QR Container (Supports uploaded QR image or SVG) */}
              <div className="mx-auto w-60 h-60 p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-inner flex flex-col items-center justify-center relative group">
                {activeLiveQR.qrImageUrl ? (
                  <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-xl">
                    <img
                      src={activeLiveQR.qrImageUrl}
                      alt={activeLiveQR.name}
                      className="w-full h-full object-contain select-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowZoomQR(true)}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                    >
                      <Maximize2 className="w-6 h-6 text-emerald-400" />
                      <span>Click to Enlarge / Full Screen</span>
                    </button>
                  </div>
                ) : (
                  /* High Quality SVG QR Code Pattern fallback */
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                    <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                    <rect x="12" y="12" width="14" height="14" fill="currentColor" rx="2" />

                    <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                    <rect x="74" y="12" width="14" height="14" fill="currentColor" rx="2" />

                    <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                    <rect x="12" y="74" width="14" height="14" fill="currentColor" rx="2" />

                    <rect x="38" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="48" y="14" width="8" height="6" fill="currentColor" />
                    <rect x="38" y="24" width="12" height="6" fill="currentColor" />
                    <rect x="8" y="38" width="6" height="12" fill="currentColor" />
                    <rect x="20" y="44" width="8" height="8" fill="currentColor" />
                    <rect x="34" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="44" y="44" width="12" height="12" fill="currentColor" />
                    <rect x="60" y="38" width="6" height="14" fill="currentColor" />
                    <rect x="72" y="40" width="14" height="6" fill="currentColor" />
                    <rect x="88" y="46" width="6" height="12" fill="currentColor" />
                    <rect x="38" y="64" width="8" height="8" fill="currentColor" />
                    <rect x="52" y="62" width="6" height="14" fill="currentColor" />
                    <rect x="66" y="64" width="10" height="6" fill="currentColor" />
                    <rect x="80" y="70" width="8" height="8" fill="currentColor" />
                    <rect x="40" y="80" width="14" height="8" fill="currentColor" />
                    <rect x="60" y="82" width="8" height="10" fill="currentColor" />
                    <rect x="74" y="86" width="16" height="6" fill="currentColor" />

                    <circle cx="50" cy="50" r="11" fill="white" stroke="currentColor" strokeWidth="2" />
                    <text x="50" y="53" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#059669">
                      SSE
                    </text>
                  </svg>
                )}
              </div>

              {/* Action buttons under QR */}
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowZoomQR(true)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  <Maximize2 className="w-3 h-3 text-slate-600" />
                  <span>Full Screen QR</span>
                </button>
                {activeLiveQR.qrImageUrl && (
                  <a
                    href={activeLiveQR.qrImageUrl}
                    download={`QR-${activeLiveQR.name.replace(/\s+/g, '_')}.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Download className="w-3 h-3 text-slate-600" />
                    <span>Download</span>
                  </a>
                )}
              </div>

              {/* Merchant Title Pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-tight">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{activeLiveQR.accountHolder || COMPANY_INFO.merchantName}</span>
              </div>

              {/* VPA copy bar */}
              <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-left px-2">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">UPI VPA</span>
                  <span className="font-mono text-xs text-slate-900 font-bold">
                    {activeLiveQR.upiId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded border border-slate-300 shadow-2xs transition-colors"
                >
                  {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVpa ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            Scan via Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app. Enter the 12-digit UTR in the form to get instant wallet credit verified by Super Admin.
          </div>
        </div>

        {/* Column 2: Submit Recharge Request (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Submit Recharge Request
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-Audit Enabled
            </span>
          </div>

          {submitSuccess ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Recharge Request Submitted!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your request for ₹{parseFloat(amount).toLocaleString('en-IN')} with UTR{' '}
                <span className="font-mono font-bold text-slate-800">{utrNumber}</span> has been queued for Super Admin review.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-left max-w-sm mx-auto space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Deposited Collection Account
                </span>
                <div className="font-extrabold text-slate-900">
                  {submittedReq?.qrName || activeLiveQR.name}
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  UPI VPA: {submittedReq?.qrUpiId || activeLiveQR.upiId}
                </div>
              </div>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setUtrNumber('');
                  setScreenshotPreview(null);
                  setOcrStatus('IDLE');
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UTR / TRANSACTION ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 12-digit UTR/ID"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CARD NUMBER (LAST 4 DIGITS)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter Last 4 Digits"
                  value={cardLast4}
                  onChange={(e) => setCardLast4(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    AMOUNT PAID <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold font-mono">
                    LIMIT: ₹100 - ₹5,00,000
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={100}
                    max={500000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white tabular-nums"
                  />
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['5000', '10000', '25000', '50000', '81500'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAmount(chip)}
                      className={`text-[11px] px-2 py-1 rounded font-mono font-medium border transition-colors ${
                        amount === chip
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ₹{parseInt(chip, 10).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Screenshot (matching video upload box) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PAYMENT SCREENSHOT
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to upload screenshot
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG or PDF up to 5MB
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSimulateDemoUpload}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold underline"
                  >
                    Load Sample Payment Receipt (Demo)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="elderQR"
                  checked={requestElderQR}
                  onChange={(e) => setRequestElderQR(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="elderQR" className="text-xs text-slate-600 cursor-pointer">
                  Request to elder QR code (Alternative settlement route)
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Submit Request →</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Column 3: Screenshot & OCR Preview (lg:col-span-3) matching video */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Screenshot & OCR Preview
              </span>
            </div>

            {screenshotPreview ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-56 flex items-center justify-center">
                  <img
                    src={screenshotPreview}
                    alt="Receipt Screenshot"
                    className="object-contain max-h-56 w-full"
                  />
                  {ocrStatus === 'ANALYZING' && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs font-semibold text-emerald-300">
                        Analyzing payment screenshot with OCR...
                      </p>
                    </div>
                  )}
                </div>

                {ocrStatus === 'SUCCESS' && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Screenshot analyzed successfully!</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-700 space-y-0.5">
                      <div>UTR: <span className="font-bold text-slate-900">{ocrData?.utr}</span></div>
                      <div>Amount: <span className="font-bold text-slate-900">₹{ocrData?.amount}</span></div>
                      <div>Beneficiary: <span className="text-slate-600">SHREE SHYAM ENTERPRISE</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  NO SCREENSHOT UPLOADED
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Attach a payment screenshot to view real-time OCR extraction & validation preview.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
            OCR verification assists automated ledger reconciliation. Super Admin inspects matched UTR against core bank statements.
          </div>
        </div>
      </div>

      {/* Recharge History Table (below the 3 columns) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Recent Load Requests</h3>
          <p className="text-xs text-slate-500">History of wallet balance recharge submissions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Collection QR Account</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">UTR / Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No recharge requests found.
                  </td>
                </tr>
              ) : (
                agentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {req.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{req.requestDate}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        {req.qrName || activeLiveQR.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {req.qrUpiId || activeLiveQR.upiId}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{req.paymentMode}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{req.utrNumber}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-[200px]">
                      {req.adminRemarks || req.remarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Screen QR Zoom Modal for Easy Scanning */}
      {showZoomQR && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Official Live Collection QR
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">{activeLiveQR.name}</h3>
              </div>
              <button
                onClick={() => setShowZoomQR(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center">
              {activeLiveQR.qrImageUrl ? (
                <img
                  src={activeLiveQR.qrImageUrl}
                  alt={activeLiveQR.name}
                  className="w-64 h-64 object-contain rounded-xl select-none"
                />
              ) : (
                <div className="w-64 h-64 p-2 bg-white rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                    <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                    <rect x="12" y="12" width="14" height="14" fill="currentColor" rx="2" />
                    <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                    <rect x="74" y="12" width="14" height="14" fill="currentColor" rx="2" />
                    <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="5" rx="3" />
                    <rect x="12" y="74" width="14" height="14" fill="currentColor" rx="2" />
                    <rect x="38" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="48" y="14" width="8" height="6" fill="currentColor" />
                    <rect x="38" y="24" width="12" height="6" fill="currentColor" />
                    <rect x="8" y="38" width="6" height="12" fill="currentColor" />
                    <rect x="20" y="44" width="8" height="8" fill="currentColor" />
                    <rect x="34" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="44" y="44" width="12" height="12" fill="currentColor" />
                    <rect x="60" y="38" width="6" height="14" fill="currentColor" />
                    <rect x="72" y="40" width="14" height="6" fill="currentColor" />
                    <rect x="88" y="46" width="6" height="12" fill="currentColor" />
                    <rect x="38" y="64" width="8" height="8" fill="currentColor" />
                    <rect x="52" y="62" width="6" height="14" fill="currentColor" />
                    <rect x="66" y="64" width="10" height="6" fill="currentColor" />
                    <rect x="80" y="70" width="8" height="8" fill="currentColor" />
                    <circle cx="50" cy="50" r="11" fill="white" stroke="currentColor" strokeWidth="2" />
                    <text x="50" y="53" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#059669">SSE</text>
                  </svg>
                </div>
              )}

              <div className="mt-3">
                <span className="text-xs font-mono font-bold text-slate-900 block">{activeLiveQR.upiId}</span>
                <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                  Holder: {activeLiveQR.accountHolder || COMPANY_INFO.merchantName}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              {activeLiveQR.qrImageUrl && (
                <a
                  href={activeLiveQR.qrImageUrl}
                  download={`QR-${activeLiveQR.name.replace(/\s+/g, '_')}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Image</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setShowZoomQR(false)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
