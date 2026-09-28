import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, CommissionRule, AgentCustomCommission } from '../types';
import {
  Users,
  Plus,
  Wallet,
  Sliders,
  CheckSquare,
  ArrowUpRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  QrCode,
  Building2,
  Filter,
  Radio,
  Eye,
  EyeOff,
  Edit2,
  Zap,
  Tag,
  Check,
  X,
  Settings2,
  Key,
  Copy,
  Lock,
  Percent,
  RotateCcw,
  Sparkles,
  Share2,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';

/* =========================================================================
   1. ADMIN AGENTS PAGE
========================================================================= */
export { AdminAgentsPage } from './AdminAgentsPage';

/* =========================================================================
   2. ADMIN WALLET ADJUSTMENTS PAGE
========================================================================= */
export const AdminWalletPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { agents, adminAdjustWallet, currentUser } = useApp();
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.agentId || 'SSE-AG-88219');
  const [amount, setAmount] = useState('5000');
  const [actionType, setActionType] = useState<'Credit' | 'Debit'>('Credit');
  const [reason, setReason] = useState('Cash collection deposit verified at Nikol branch');
  const [successMsg, setSuccessMsg] = useState('');

  const targetAgent = agents.find((a) => a.agentId === selectedAgentId) || agents[0];

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    adminAdjustWallet(selectedAgentId, parsed, actionType, reason);
    setSuccessMsg(`Successfully executed ${actionType} of ₹${parsed.toFixed(2)} on wallet for ${targetAgent.name}`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>ADMIN GOVERNANCE / WALLET LEDGER ADJUSTMENTS</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Direct Agent Wallet Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute manual balance adjustments, liquidity injections, and deductions with mandatory audit logging.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Select Agent & Adjustment Type
          </h3>

          <form onSubmit={handleAdjust} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Agent</label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-hidden"
              >
                {agents.map((a) => (
                  <option key={a.agentId} value={a.agentId}>
                    {a.name} ({a.agentId}) — Bal: ₹{a.walletBalance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Action Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('Credit')}
                  className={`py-2 px-3 rounded-lg font-bold border transition-colors ${
                    actionType === 'Credit'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  + Credit to Wallet
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('Debit')}
                  className={`py-2 px-3 rounded-lg font-bold border transition-colors ${
                    actionType === 'Debit'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  - Debit from Wallet
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Adjustment Amount (INR) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Audit Log Reason *</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State the verified physical reason for adjustment"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-white transition-colors ${
                actionType === 'Credit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Execute {actionType} ({targetAgent.name})
            </button>
          </form>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
              Agent Balance Card
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Selected Agent</span>
                <div className="font-extrabold text-slate-900 text-sm">{targetAgent.name}</div>
                <div className="text-slate-500 font-mono">{targetAgent.agentId} · {targetAgent.businessName}</div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-slate-600 font-medium">Current Live Balance:</span>
                <span className="text-xl font-black font-mono text-emerald-800">₹{targetAgent.walletBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
            Every balance modification generates an immutable audit record visible to super administrators and regulatory auditors.
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. ADMIN COMMISSION SLABS PAGE
========================================================================= */
export const AdminCommissionPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { commissionRules, updateCommissionRule, billPaymentFee, setBillPaymentFee } = useApp();
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [feeType, setFeeType] = useState<'FLAT' | 'PERCENT'>('FLAT');
  const [platformFeeValue, setPlatformFeeValue] = useState<string>('10');
  const [agentCommPercent, setAgentCommPercent] = useState<string>('0.25');
  const [agentCommFixed, setAgentCommFixed] = useState<string>('2.0');
  const [fixedFeeValue, setFixedFeeValue] = useState<string>('0');
  const [mdrPercentValue, setMdrPercentValue] = useState<string>('0');
  const [ruleStatus, setRuleStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bbpsRule = commissionRules.find((r) => r.service === 'BBPS');
  const currentBillPaymentFee = bbpsRule?.platformFeeFixed ?? bbpsRule?.fixedFee ?? billPaymentFee ?? 10.0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = (rule: CommissionRule) => {
    setEditingRule(rule);
    const isFlat = rule.platformFeeType === 'FLAT' || (rule.fixedFee > 0 && rule.platformCommissionPercent === 0) || rule.service === 'BBPS';
    setFeeType(isFlat ? 'FLAT' : 'PERCENT');
    const feeVal = isFlat
      ? (rule.platformFeeFixed ?? (rule.fixedFee > 0 ? rule.fixedFee : 10))
      : rule.platformCommissionPercent;
    setPlatformFeeValue(feeVal.toString());
    setAgentCommPercent(rule.agentCommissionPercent.toString());
    setAgentCommFixed(rule.agentCommissionFixed.toString());
    setFixedFeeValue(rule.fixedFee.toString());
    setMdrPercentValue(rule.mdrPercent.toString());
    setRuleStatus(rule.status);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    const parsedFee = parseFloat(platformFeeValue) || 0;
    const isFlat = feeType === 'FLAT';

    const updates: Partial<CommissionRule> = {
      platformFeeType: feeType,
      platformFeeFixed: isFlat ? parsedFee : 0,
      fixedFee: isFlat ? parsedFee : parseFloat(fixedFeeValue) || 0,
      platformCommissionPercent: !isFlat ? parsedFee : 0,
      agentCommissionPercent: parseFloat(agentCommPercent) || 0,
      agentCommissionFixed: parseFloat(agentCommFixed) || 0,
      mdrPercent: parseFloat(mdrPercentValue) || 0,
      status: ruleStatus,
    };

    updateCommissionRule(editingRule.id, updates);

    if (editingRule.service === 'BBPS' && setBillPaymentFee) {
      setBillPaymentFee(parsedFee, feeType);
    }

    setEditingRule(null);
    showToast(`Updated ${editingRule.service} fee rule to ${isFlat ? `Flat ₹${parsedFee.toFixed(2)}` : `${parsedFee}%`} successfully!`);
  };

  const handleInstantSetFlat10 = () => {
    if (setBillPaymentFee) {
      setBillPaymentFee(10.0, 'FLAT');
    }
    const bbps = commissionRules.find((r) => r.service === 'BBPS');
    if (bbps) {
      updateCommissionRule(bbps.id, {
        platformFeeType: 'FLAT',
        platformFeeFixed: 10.0,
        fixedFee: 10.0,
        platformCommissionPercent: 0.0,
      });
    }
    showToast('Bill Payment platform fee successfully locked to Flat ₹10.00 per bill!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>ADMIN GOVERNANCE / MARGIN RULES</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Commission Slabs & Platform Fee Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure service markup fees, flat bill payment charges, agent commission payouts, and gateway interchange fees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstantSetFlat10}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs"
          >
            <Zap className="w-4 h-4 text-emerald-200" />
            <span>Set Flat ₹10 Bill Fee</span>
          </button>
        </div>
      </div>

      {/* Highlighted Banner: Bill Payment Flat Fee Spotlight */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Rule: Flat ₹10 Bill Payment Fee</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Agent Bill Payment Markup / Platform Fee: <span className="text-emerald-400 font-mono">₹{currentBillPaymentFee.toFixed(2)} Flat</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Admin abhi agent se bill payment par percentage (%) fee ki jagah <strong>Flat ₹10.00</strong> platform markup fee charge karta hai. BBPS, Electricity, Gas, Water sabhi utility bill payments par yeh flat ₹10 fee agent ke wallet se automatically debit hoti hai (Bill Amount + ₹10.00).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-3 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Current Flat Fee</div>
              <div className="text-2xl font-black font-mono text-emerald-300">₹{currentBillPaymentFee.toFixed(2)}</div>
              <div className="text-[9px] text-emerald-400 font-bold uppercase">Per Transaction</div>
            </div>

            {bbpsRule && (
              <button
                onClick={() => handleOpenEdit(bbpsRule)}
                className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-extrabold transition-all shadow-sm"
              >
                <Settings2 className="w-4 h-4 text-violet-600" />
                <span>Configure Fee</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
              Active Service Margin & Commission Rules ({commissionRules.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Click 'Edit' on any rule to modify flat fee or percentage rates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Transaction Slab</th>
                <th className="py-3 px-4 text-center">Platform / Markup Fee (Agent Charge)</th>
                <th className="py-3 px-4 text-right">Agent Commission</th>
                <th className="py-3 px-4 text-right">MDR %</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {commissionRules.map((rule) => {
                const isBBPS = rule.service === 'BBPS';
                const isFlat = rule.platformFeeType === 'FLAT' || (rule.fixedFee > 0 && rule.platformCommissionPercent === 0) || isBBPS;
                const feeAmt = isFlat ? (rule.platformFeeFixed ?? rule.fixedFee ?? 10) : rule.platformCommissionPercent;

                return (
                  <tr key={rule.id} className={`hover:bg-slate-50/70 transition-colors ${isBBPS ? 'bg-violet-50/20' : ''}`}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{rule.service}</span>
                        {isBBPS && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
                            Utility & BBPS
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      ₹{rule.slabMin} - ₹{rule.slabMax.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isFlat ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-100 border border-violet-300 text-violet-900 rounded-lg font-mono font-black text-xs">
                          <span>₹{feeAmt.toFixed(2)}</span>
                          <span className="text-[9px] font-sans font-bold uppercase bg-violet-200 px-1 rounded text-violet-800">
                            FLAT
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-mono font-bold text-xs">
                          <span>{feeAmt.toFixed(2)}%</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      {rule.agentCommissionPercent.toFixed(2)}% {rule.agentCommissionFixed > 0 ? `+ ₹${rule.agentCommissionFixed}` : ''}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      {rule.mdrPercent.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rule.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-violet-100 hover:text-violet-800 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                  RULE ID: {editingRule.id}
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Configure Fee & Commission: {editingRule.service}
                </h3>
              </div>
              <button
                onClick={() => setEditingRule(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              {/* Platform / Markup Fee Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Admin Platform / Markup Fee (Agent Charge)
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Debited from Agent Wallet</span>
                </div>

                {/* Toggle Flat Fee vs Percentage */}
                <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setFeeType('FLAT');
                      if (platformFeeValue === '0' || platformFeeValue === '0.15') setPlatformFeeValue('10');
                    }}
                    className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      feeType === 'FLAT'
                        ? 'bg-violet-600 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Flat Fee (₹ Flat)</span>
                    <span className="text-[10px] opacity-80 font-normal">[Recommended]</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFeeType('PERCENT');
                      if (platformFeeValue === '10') setPlatformFeeValue('0.15');
                    }}
                    className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      feeType === 'PERCENT'
                        ? 'bg-violet-600 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Percentage (%)</span>
                  </button>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {feeType === 'FLAT' ? 'Flat Amount per Transaction (INR)' : 'Platform Fee Percentage (%)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500 text-sm">
                      {feeType === 'FLAT' ? '₹' : '%'}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={platformFeeValue}
                      onChange={(e) => setPlatformFeeValue(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-extrabold text-slate-900 focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFeeType('FLAT');
                      setPlatformFeeValue('10');
                    }}
                    className="px-2.5 py-1 bg-violet-100 hover:bg-violet-200 text-violet-800 text-[11px] font-bold rounded-md transition-colors"
                  >
                    Flat ₹10.00 (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeeType('FLAT');
                      setPlatformFeeValue('5');
                    }}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold rounded-md transition-colors"
                  >
                    Flat ₹5.00
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeeType('PERCENT');
                      setPlatformFeeValue('0.15');
                    }}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold rounded-md transition-colors"
                  >
                    0.15% (Old Rate)
                  </button>
                </div>
              </div>

              {/* Agent Commission */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agent Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={agentCommPercent}
                    onChange={(e) => setAgentCommPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agent Fixed Comm (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={agentCommFixed}
                    onChange={(e) => setAgentCommFixed(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Status
                </label>
                <select
                  value={ruleStatus}
                  onChange={(e) => setRuleStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-violet-500"
                >
                  <option value="ACTIVE">ACTIVE (In-Effect)</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Rule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   4. ADMIN FUND REQUESTS REVIEW PAGE
========================================================================= */
export const AdminFundRequestsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { fundRequests, adminApproveFundRequest, adminRejectFundRequest, qrCodes, activeLiveQR } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [qrFilter, setQrFilter] = useState<string>('ALL');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  // Filter requests
  const filteredRequests = fundRequests.filter((req) => {
    const q = search.toLowerCase();
    const matchesSearch =
      req.id.toLowerCase().includes(q) ||
      req.agentId.toLowerCase().includes(q) ||
      req.agentName.toLowerCase().includes(q) ||
      req.utrNumber.toLowerCase().includes(q) ||
      (req.qrName && req.qrName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesQR = qrFilter === 'ALL' || req.qrName === qrFilter || (qrFilter === activeLiveQR.name && !req.qrName);

    return matchesSearch && matchesStatus && matchesQR;
  });

  const pendingCount = fundRequests.filter((r) => r.status === 'PENDING').length;
  const approvedVolume = fundRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600">
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            <span>ADMIN GOVERNANCE / LIQUIDITY QUEUE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Agent Fund Requests & QR Deposits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve or decline agent UPI / bank deposits. Each request is tracked and recorded under the official Live QR account.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/admin/qr-management')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Live QR Switcher & Config ({qrCodes.length})</span>
          </button>
        </div>
      </div>

      {/* Live QR Spotlight Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                ● CURRENT LIVE QR
              </span>
              <span className="font-extrabold text-slate-900 text-sm">{activeLiveQR.name}</span>
            </div>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              VPA: <strong className="text-slate-900">{activeLiveQR.upiId}</strong> · Bank: {activeLiveQR.bankName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('/admin/qr-management')}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            Change Live QR →
          </button>
        </div>
      </div>

      {/* Main Table with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search UTR, agent, or request ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 font-medium"
              />
            </div>

            {/* QR Account Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">QR Account:</span>
              <select
                value={qrFilter}
                onChange={(e) => setQrFilter(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All QRs / Accounts</option>
                {qrCodes.map((q) => (
                  <option key={q.id} value={q.name}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-hidden cursor-pointer text-slate-700"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending Only ({pendingCount})</option>
              <option value="APPROVED">Approved Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          <div className="text-xs font-mono font-bold text-slate-600">
            Total Approved: <span className="text-emerald-700">₹{approvedVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Agent Terminal</th>
                <th className="py-3 px-4">Collection QR Account</th>
                <th className="py-3 px-4">Mode & UTR</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No fund requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{req.id}</td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{req.agentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{req.agentId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-900 border border-violet-200">
                        <QrCode className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        <div>
                          <div className="font-bold text-xs leading-tight">
                            {req.qrName || activeLiveQR.name}
                          </div>
                          <div className="text-[10px] font-mono text-violet-700">
                            {req.qrUpiId || activeLiveQR.upiId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{req.paymentMode}</div>
                      <div className="font-mono text-[10px] text-slate-500 font-bold">{req.utrNumber}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950 text-sm tabular-nums">
                      ₹{req.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {req.requestDate}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {req.proofImageUrl && (
                            <button
                              onClick={() => setSelectedProofUrl(req.proofImageUrl || null)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1"
                              title="View Attached Screenshot"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Proof</span>
                            </button>
                          )}
                          <button
                            onClick={() => adminApproveFundRequest(req.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => adminRejectFundRequest(req.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {req.status} by {req.reviewedBy?.split(' ')[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Preview Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Payment Screenshot</h3>
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-80">
              <img src={selectedProofUrl} alt="Deposit Proof" className="object-contain max-h-80 w-full" />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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

/* =========================================================================
   5. ADMIN SETTLEMENTS QUEUE PAGE
========================================================================= */
export const AdminSettlementsPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { settlements, adminUpdateSettlement } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          <span>ADMIN GOVERNANCE / PAYOUT SETTLEMENTS</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Settlement Dispatch Queue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Process bank payouts for agents, assign banking UTR numbers, or approve batch payouts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Settlement ID</th>
                <th className="py-3 px-4">Agent Terminal</th>
                <th className="py-3 px-4">Bank Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Bank UTR</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{s.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{s.agentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{s.agentId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800">{s.bankName} (A/C **{s.accountNumber.slice(-4)})</div>
                    <div className="text-[10px] text-slate-400 font-mono">IFSC: {s.ifsc}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                    ₹{s.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'PROCESSING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.utr || 'Pending Dispatch'}</td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {s.status === 'PROCESSING' ? (
                      <button
                        onClick={() => adminUpdateSettlement(s.id, 'COMPLETED')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Dispatched</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. ADMIN AUDIT & SECURITY LOGS PAGE
========================================================================= */
export const AdminAuditLogsPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>ADMIN GOVERNANCE / SECURITY AUDIT TRAIL</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          System Audit & Security Logs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Cryptographically timestamped audit log of all administrator logins, fund approvals, and wallet mutations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Reference ID</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{log.adminName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{log.action}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{log.entity}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">{log.referenceId}</td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs">{log.details}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
