import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeConfig } from '../types';
import {
  QrCode,
  CheckCircle2,
  Plus,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  DollarSign,
  Radio,
  Trash2,
  Edit2,
  ExternalLink,
  UploadCloud,
  Image as ImageIcon,
  Eye,
  X,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface AdminQRManagementProps {
  onNavigate: (path: string) => void;
}

export const AdminQRManagementPage: React.FC<AdminQRManagementProps> = ({ onNavigate }) => {
  const { qrCodes, activeLiveQR, setLiveQRCode, createQRCode, updateQRCode, deleteQRCode, fundRequests } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCodeConfig | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedZoomQR, setSelectedZoomQR] = useState<QRCodeConfig | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolder, setAccountHolder] = useState('SHREE SHYAM ENTERPRISE');
  const [dailyLimit, setDailyLimit] = useState('1000000');
  const [notes, setNotes] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [setLiveImmediately, setSetLiveImmediately] = useState(true);

  // Quick switch confirmation feedback
  const [switchFeedback, setSwitchFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const quickUploadRef = useRef<HTMLInputElement | null>(null);
  const [targetQuickUploadQRId, setTargetQuickUploadQRId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetLive = (qr: QRCodeConfig) => {
    setLiveQRCode(qr.id);
    setSwitchFeedback(`Successfully set "${qr.name}" as the Live Collection QR for all agents.`);
    setTimeout(() => setSwitchFeedback(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingQR(null);
    setName('');
    setUpiId('');
    setBankName('HDFC Bank');
    setAccountNumber('');
    setIfsc('');
    setAccountHolder('SHREE SHYAM ENTERPRISE');
    setDailyLimit('1000000');
    setNotes('');
    setQrImageUrl('');
    setSetLiveImmediately(true);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (qr: QRCodeConfig) => {
    setEditingQR(qr);
    setName(qr.name);
    setUpiId(qr.upiId);
    setBankName(qr.bankName);
    setAccountNumber(qr.accountNumber || '');
    setIfsc(qr.ifsc || '');
    setAccountHolder(qr.accountHolder);
    setDailyLimit((qr.dailyLimit || 1000000).toString());
    setNotes(qr.notes || '');
    setQrImageUrl(qr.qrImageUrl || '');
    setSetLiveImmediately(qr.isLive);
    setShowAddModal(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick direct image upload on a card without opening full modal
  const handleQuickUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetQuickUploadQRId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgData = event.target.result as string;
          updateQRCode(targetQuickUploadQRId, { qrImageUrl: imgData });
          setSwitchFeedback(`QR image updated successfully for this account!`);
          setTimeout(() => setSwitchFeedback(null), 3500);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input
    if (e.target) e.target.value = '';
    setTargetQuickUploadQRId(null);
  };

  const handleUseSampleQR = () => {
    // Generate a high quality mock UPI merchant QR image
    setQrImageUrl('https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi://pay?pa=shreeshyam@hdfcbank&pn=SHREE%20SHYAM%20ENTERPRISE&mc=5411&cu=INR');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !upiId || !bankName) return;

    if (editingQR) {
      updateQRCode(editingQR.id, {
        name,
        upiId,
        bankName,
        accountNumber: accountNumber || undefined,
        ifsc: ifsc || undefined,
        accountHolder: accountHolder || 'SHREE SHYAM ENTERPRISE',
        dailyLimit: parseFloat(dailyLimit) || 1000000,
        notes: notes || undefined,
        qrImageUrl: qrImageUrl || undefined,
        isLive: setLiveImmediately,
      });
      setSwitchFeedback(`Updated QR Code "${name}" with customized QR image & details.`);
    } else {
      createQRCode({
        name,
        upiId,
        bankName,
        accountNumber: accountNumber || undefined,
        ifsc: ifsc || undefined,
        accountHolder: accountHolder || 'SHREE SHYAM ENTERPRISE',
        dailyLimit: parseFloat(dailyLimit) || 1000000,
        notes: notes || undefined,
        qrImageUrl: qrImageUrl || undefined,
        isLive: setLiveImmediately,
      });
      setSwitchFeedback(`Created new QR "${name}"${setLiveImmediately ? ' and set as LIVE' : ''}.`);
    }

    setShowAddModal(false);
    setEditingQR(null);
    setTimeout(() => setSwitchFeedback(null), 4000);
  };

  const totalCollectedAllQRs = qrCodes.reduce((sum, q) => sum + (q.totalCollected || 0), 0);
  const totalPendingRequests = fundRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Hidden input for quick card image replacement */}
      <input
        ref={quickUploadRef}
        type="file"
        accept="image/*"
        onChange={handleQuickUploadFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ADMIN GOVERNANCE / DYNAMIC LIVE QR ROUTING</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Live Collection QR Management & Image Upload
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch the active collection QR presented to agents. Upload your QR code photo — agents will see and scan this exact QR on their wallet recharge page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/admin/fund-requests')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Review Payment Requests ({totalPendingRequests})</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New QR / Upload Image</span>
          </button>
        </div>
      </div>

      {/* Hindi & English Guidance Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-900">
          <span className="font-bold text-amber-950 block text-sm">
            QR Image Upload & Live Routing System (क्यूआर इमेज अपलोड और लाइव रूटिंग)
          </span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            एडमिन अपनी दुकान / बैंक का कोई भी <strong>QR Code Image (Photo)</strong> अपलोड कर सकता है। जब आप किसी QR को <strong>&quot;Make Live QR&quot;</strong> करेंगे, तो सभी एजेंट्स को वही QR इमेज दिखेगी और उनकी सभी फंड रिक्वेस्ट उसी QR नाम के साथ रिकॉर्ड होगी।
          </p>
        </div>
      </div>

      {/* Switch Notification Banner */}
      {switchFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{switchFeedback}</span>
          </div>
          <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded font-mono font-bold">
            Live Switch Complete
          </span>
        </div>
      )}

      {/* Active Live QR Spotlight Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 border border-slate-700 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                CURRENTLY LIVE FOR ALL AGENTS
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-300 font-mono text-xs">{activeLiveQR.id}</span>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {activeLiveQR.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3 font-medium">
                <span>Bank: <strong className="text-white">{activeLiveQR.bankName}</strong></span>
                {activeLiveQR.accountNumber && (
                  <span>· A/c: <strong className="font-mono text-emerald-300">{activeLiveQR.accountNumber}</strong></span>
                )}
                {activeLiveQR.ifsc && (
                  <span>· IFSC: <strong className="font-mono text-white">{activeLiveQR.ifsc}</strong></span>
                )}
                <span>· Holder: <strong className="text-slate-200">{activeLiveQR.accountHolder}</strong></span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <span className="text-[10px] uppercase font-bold text-slate-400">Live UPI VPA</span>
                <span className="font-mono text-xs font-bold text-emerald-400">{activeLiveQR.upiId}</span>
                <button
                  onClick={() => handleCopy('live', activeLiveQR.upiId)}
                  className="text-slate-300 hover:text-white p-0.5 ml-1"
                  title="Copy UPI ID"
                >
                  {copiedId === 'live' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Collected</span>
                <span className="font-bold text-white">₹{activeLiveQR.totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {activeLiveQR.qrImageUrl && (
                <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/30">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Custom QR Photo Active</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleOpenEditModal(activeLiveQR)}
                className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit / Change QR Image</span>
              </button>
              <button
                onClick={() => {
                  setTargetQuickUploadQRId(activeLiveQR.id);
                  quickUploadRef.current?.click();
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New QR Photo</span>
              </button>
            </div>
          </div>

          {/* Actual Live QR Image or Crisp Vector Preview */}
          <div className="bg-white p-3 rounded-2xl shadow-xl w-40 h-40 flex flex-col items-center justify-center shrink-0 border-2 border-emerald-400/50 relative overflow-hidden group">
            {activeLiveQR.qrImageUrl ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <img
                  src={activeLiveQR.qrImageUrl}
                  alt={activeLiveQR.name}
                  className="w-full h-full object-contain rounded-xl"
                />
                <button
                  onClick={() => setSelectedZoomQR(activeLiveQR)}
                  className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1"
                >
                  <Eye className="w-5 h-5 text-emerald-400" />
                  <span>View Full Photo</span>
                </button>
              </div>
            ) : (
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
                <rect x="44" y="44" width="12" height="12" fill="currentColor" />
                <rect x="66" y="64" width="10" height="6" fill="currentColor" />
                <circle cx="50" cy="50" r="11" fill="white" stroke="currentColor" strokeWidth="2" />
                <text x="50" y="53" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#059669">SSE</text>
              </svg>
            )}
            <span className="text-[9px] font-mono font-bold text-slate-700 mt-1 uppercase text-center truncate max-w-full">
              {activeLiveQR.qrImageUrl ? 'Uploaded Image' : 'Default SVG'}
            </span>
          </div>
        </div>
      </div>

      {/* All Available Collection QRs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Configured Bank / UPI QR Accounts ({qrCodes.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click &quot;Make Live QR&quot; on any account to immediately switch the deposit destination and QR image for all agents.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Total QR Collections: ₹{totalCollectedAllQRs.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qrCodes.map((qr) => {
            const isCurrent = qr.isLive;
            return (
              <div
                key={qr.id}
                className={`rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{qr.id}</span>
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 text-white font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>LIVE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 font-bold uppercase px-2 py-0.5 rounded-full">
                            INACTIVE
                          </span>
                        )}

                        {qr.qrImageUrl && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-violet-100 text-violet-700 font-bold uppercase px-2 py-0.5 rounded-md">
                            <ImageIcon className="w-3 h-3" />
                            <span>Photo Attached</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 tracking-tight mt-1">
                        {qr.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {qr.bankName} · {qr.accountHolder}
                      </p>
                    </div>

                    {/* QR Thumbnail or Upload Action */}
                    <div className="flex items-center gap-2">
                      {qr.qrImageUrl ? (
                        <div
                          onClick={() => setSelectedZoomQR(qr)}
                          className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors shadow-2xs relative group"
                          title="Click to Zoom QR Photo"
                        >
                          <img
                            src={qr.qrImageUrl}
                            alt={qr.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-slate-900/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setTargetQuickUploadQRId(qr.id);
                            quickUploadRef.current?.click();
                          }}
                          className="w-12 h-12 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-700 transition-all text-[9px] font-bold"
                          title="Upload QR Image"
                        >
                          <UploadCloud className="w-4 h-4 mb-0.5" />
                          <span>+Photo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bank Details & VPA */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-xs font-mono space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans text-[10px] uppercase font-bold">UPI VPA</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <span>{qr.upiId}</span>
                        <button
                          onClick={() => handleCopy(qr.id, qr.upiId)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Copy UPI ID"
                        >
                          {copiedId === qr.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {qr.accountNumber && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 font-sans text-[10px] uppercase font-bold">Account No</span>
                        <span className="font-semibold text-slate-800">{qr.accountNumber}</span>
                      </div>
                    )}

                    {qr.ifsc && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 font-sans text-[10px] uppercase font-bold">IFSC Code</span>
                        <span className="font-semibold text-slate-800">{qr.ifsc}</span>
                      </div>
                    )}

                    {qr.notes && (
                      <div className="pt-1 border-t border-slate-200/60 text-[10px] font-sans text-slate-500">
                        {qr.notes}
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                      <span className="text-[10px] uppercase font-bold font-sans text-slate-400 block">
                        Total Collected
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{qr.totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                      <span className="text-[10px] uppercase font-bold font-sans text-slate-400 block">
                        Daily Limit
                      </span>
                      <span className="font-bold text-slate-700">
                        ₹{(qr.dailyLimit || 1000000).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(qr)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      title="Edit QR configuration"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setTargetQuickUploadQRId(qr.id);
                        quickUploadRef.current?.click();
                      }}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      title="Upload or Change QR Photo"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{qr.qrImageUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                  </div>

                  {isCurrent ? (
                    <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live & Active</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSetLive(qr)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <Radio className="w-3 h-3 text-emerald-400" />
                      <span>Make Live QR</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Size Zoom Preview Modal */}
      {selectedZoomQR && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedZoomQR.name}</h3>
                <p className="text-xs text-slate-500 font-mono">UPI: {selectedZoomQR.upiId}</p>
              </div>
              <button
                onClick={() => setSelectedZoomQR(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center">
              {selectedZoomQR.qrImageUrl ? (
                <img
                  src={selectedZoomQR.qrImageUrl}
                  alt={selectedZoomQR.name}
                  className="max-h-80 w-auto object-contain rounded-xl shadow-xs"
                />
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No image uploaded for this QR.
                </div>
              )}
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-slate-800 block">{selectedZoomQR.bankName}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Holder: {selectedZoomQR.accountHolder}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {selectedZoomQR.isLive ? '● Live Collection QR' : 'Inactive QR'}
              </span>
              <button
                onClick={() => setSelectedZoomQR(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit QR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingQR ? 'Edit Collection QR & Image' : 'Add New Collection QR & Image'}
                </h3>
                <p className="text-xs text-slate-500">
                  Mere pass QR ki image hogi vo upload karunga aur agent ko dikhega
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              {/* QR Image Upload Box (Prominent Feature) */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Upload QR Code Image (एजेंट को यही इमेज दिखेगी)</span>
                  </label>
                  {qrImageUrl && (
                    <button
                      type="button"
                      onClick={() => setQrImageUrl('')}
                      className="text-rose-600 hover:text-rose-700 font-bold text-[11px]"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {qrImageUrl ? (
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-emerald-300">
                    <img
                      src={qrImageUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain rounded-md border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>QR Image Ready</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        This image will be displayed on agent&apos;s &quot;QR Load Wallet&quot; page.
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Click to change photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white/70 hover:bg-white rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <span className="font-bold text-slate-800 block text-xs">
                      Click to Browse & Upload QR Photo (JPG, PNG, WEBP)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Apne phone/computer se QR code ki photo select karein
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500">Or use a sample template:</span>
                  <button
                    type="button"
                    onClick={handleUseSampleQR}
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                  >
                    Generate Smart UPI QR Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  QR Account Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Current A/c (Main Collection)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    UPI VPA Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shreeshyam@hdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bank Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 50200088921102"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Daily Limit (₹)</label>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Internal Remarks / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Primary merchant gateway for Nikol branch"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setLiveImmediately}
                    onChange={(e) => setSetLiveImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="text-slate-800 font-bold">
                    Set this QR as LIVE immediately for all agents
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingQR ? 'Update QR Account' : 'Save QR Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
