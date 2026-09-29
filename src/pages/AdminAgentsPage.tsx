import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, AgentCustomCommission } from '../types';
import {
  Key,
  Percent,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Search,
  Plus,
  ArrowRight,
  Shield,
  CreditCard,
  UserCheck,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface AdminAgentsPageProps {
  onNavigate: (path: string) => void;
}

export const AdminAgentsPage: React.FC<AdminAgentsPageProps> = ({ onNavigate }) => {
  const {
    agents,
    createAgent,
    updateAgentStatus,
    updateAgentKycDocument,
    updateAgentKycOverall,
    updateAgentCredentials,
    updateAgentCommission,
    resetAllBalancesAndEntriesToZero,
  } = useApp();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentForKyc, setSelectedAgentForKyc] = useState<User | null>(null);
  const [selectedAgentForCredentials, setSelectedAgentForCredentials] = useState<User | null>(null);
  const [selectedAgentForCommission, setSelectedAgentForCommission] = useState<User | null>(null);
  const [showZeroResetModal, setShowZeroResetModal] = useState(false);
  const [showAccessHelpModal, setShowAccessHelpModal] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // New Agent Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Credentials State for New Agent
  const [customAgentId, setCustomAgentId] = useState(`SSE-AG-${88220 + agents.length}`);
  const [customPassword, setCustomPassword] = useState(`Shyam@2026#${Math.floor(1000 + Math.random() * 9000)}`);
  const [customPin, setCustomPin] = useState('123456');
  const [showNewPass, setShowNewPass] = useState(false);
  const [startingBalance, setStartingBalance] = useState('0');
  const [newAdminMarkup, setNewAdminMarkup] = useState('10.00');
  const [newAgentCommission, setNewAgentCommission] = useState('3.50');
  const [createdSuccessCreds, setCreatedSuccessCreds] = useState<{
    agentId: string;
    name: string;
    mobile: string;
    password: string;
    pin: string;
  } | null>(null);

  // Edit Credentials Modal State
  const [editAgentIdVal, setEditAgentIdVal] = useState('');
  const [editPasswordVal, setEditPasswordVal] = useState('');
  const [editPinVal, setEditPinVal] = useState('');
  const [showEditPass, setShowEditPass] = useState(false);

  // Edit Commission Modal State
  const [commAdminMarkupType, setCommAdminMarkupType] = useState<'FLAT' | 'PERCENT'>('FLAT');
  const [commAdminMarkupVal, setCommAdminMarkupVal] = useState('10.00');
  const [commAgentCommType, setCommAgentCommType] = useState<'FLAT' | 'PERCENT'>('FLAT');
  const [commAgentCommVal, setCommAgentCommVal] = useState('3.50');
  const [commCcProcessingFee, setCommCcProcessingFee] = useState('50.00');
  const [commCcAgentComm, setCommCcAgentComm] = useState('15.00');
  const [commDmtAdminFee, setCommDmtAdminFee] = useState('0.45');
  const [commDmtAgentComm, setCommDmtAgentComm] = useState('0.20');
  const [commRechargeAgentComm, setCommRechargeAgentComm] = useState('2.00');
  const [commPlanName, setCommPlanName] = useState('Silver Master Plan');

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.agentId.toLowerCase().includes(search.toLowerCase()) ||
      a.mobile.includes(search) ||
      a.businessName.toLowerCase().includes(search.toLowerCase())
  );

  const openCredentialsModal = (agent: User) => {
    setSelectedAgentForCredentials(agent);
    setEditAgentIdVal(agent.agentId);
    setEditPasswordVal(agent.password || agent.initialCredentials?.tempPassword || 'agent@shyam2026');
    setEditPinVal(agent.pin || agent.initialCredentials?.tempMpin || '123456');
    setShowEditPass(false);
  };

  const openCommissionModal = (agent: User) => {
    setSelectedAgentForCommission(agent);
    const s = agent.commissionSettings;
    setCommPlanName(s?.planName || agent.commissionPlan || 'Silver Master Plan');
    setCommAdminMarkupType(s?.adminBillMarkupType || 'FLAT');
    setCommAdminMarkupVal(s?.adminBillMarkupValue?.toString() || '10.00');
    setCommAgentCommType(s?.agentBillCommissionType || 'FLAT');
    setCommAgentCommVal(s?.agentBillCommissionValue?.toString() || '3.50');
    setCommCcProcessingFee(s?.ccProcessingFee?.toString() || '50.00');
    setCommCcAgentComm(s?.ccAgentCommission?.toString() || '15.00');
    setCommDmtAdminFee(s?.dmtAdminFeePercent?.toString() || '0.45');
    setCommDmtAgentComm(s?.dmtAgentCommissionPercent?.toString() || '0.20');
    setCommRechargeAgentComm(s?.rechargeAgentCommissionPercent?.toString() || '2.00');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForCredentials) return;
    if (!editAgentIdVal.trim() || !editPasswordVal.trim()) {
      showToast('Agent ID and Password cannot be empty', 'error');
      return;
    }
    updateAgentCredentials(selectedAgentForCredentials.agentId, {
      agentId: editAgentIdVal.trim(),
      password: editPasswordVal.trim(),
      pin: editPinVal.trim() || '123456',
    });
    showToast(`Credentials updated successfully for ${selectedAgentForCredentials.name}`);
    setSelectedAgentForCredentials(null);
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForCommission) return;
    const settings: AgentCustomCommission = {
      enabled: true,
      planName: commPlanName,
      adminBillMarkupType: commAdminMarkupType,
      adminBillMarkupValue: parseFloat(commAdminMarkupVal) || 10.0,
      agentBillCommissionType: commAgentCommType,
      agentBillCommissionValue: parseFloat(commAgentCommVal) || 3.5,
      ccProcessingFee: parseFloat(commCcProcessingFee) || 50.0,
      ccAgentCommission: parseFloat(commCcAgentComm) || 15.0,
      dmtAdminFeePercent: parseFloat(commDmtAdminFee) || 0.45,
      dmtAgentCommissionPercent: parseFloat(commDmtAgentComm) || 0.2,
      rechargeAgentCommissionPercent: parseFloat(commRechargeAgentComm) || 2.0,
    };
    updateAgentCommission(selectedAgentForCommission.agentId, settings);
    showToast(`Custom commission set for ${selectedAgentForCommission.name} (Admin Markup: ${commAdminMarkupType === 'FLAT' ? `₹${settings.adminBillMarkupValue}` : `${settings.adminBillMarkupValue}%`})`);
    setSelectedAgentForCommission(null);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !mobile) {
      showToast('Name, Email and Mobile are required', 'error');
      return;
    }

    const assignedId = customAgentId.trim() || `SSE-AG-${88220 + agents.length}`;
    const assignedPass = customPassword.trim() || `Shyam@2026#${Math.floor(1000 + Math.random() * 9000)}`;
    const assignedPin = customPin.trim() || '123456';
    const initBal = parseFloat(startingBalance) || 0.0;

    const commissionSettings: AgentCustomCommission = {
      enabled: true,
      planName: 'Silver Master Plan',
      adminBillMarkupType: 'FLAT',
      adminBillMarkupValue: parseFloat(newAdminMarkup) || 10.0,
      agentBillCommissionType: 'FLAT',
      agentBillCommissionValue: parseFloat(newAgentCommission) || 3.5,
      ccProcessingFee: 50.0,
      ccAgentCommission: 15.0,
      dmtAdminFeePercent: 0.45,
      dmtAgentCommissionPercent: 0.20,
      rechargeAgentCommissionPercent: 2.0,
    };

    createAgent({
      name,
      email,
      mobile,
      businessName: businessName || `${name} Digital Seva`,
      address: address || 'Ahmedabad, Gujarat',
      agentId: assignedId,
      password: assignedPass,
      pin: assignedPin,
      walletBalance: initBal,
      commissionPlan: 'Silver Master Plan',
      commissionSettings,
      kycStatus: 'VERIFIED',
      bankAccount: accountNumber
        ? {
            bankName: bankName || 'HDFC Bank',
            accountNumber,
            ifsc: ifsc || 'HDFC0001024',
            accountHolder: name,
          }
        : undefined,
    });

    setCreatedSuccessCreds({
      agentId: assignedId,
      name,
      mobile,
      password: assignedPass,
      pin: assignedPin,
    });

    setShowCreateModal(false);
    setName('');
    setEmail('');
    setMobile('');
    setBusinessName('');
    setAddress('');
    setStartingBalance('0');
    setCustomAgentId(`MEPL-AG-${88221 + agents.length}`);
    setCustomPassword(`Mannat@2026#${Math.floor(1000 + Math.random() * 9000)}`);
    showToast(`Agent ${name} created successfully with ID ${assignedId}`);
  };

  const handleCopyWhatsApp = (agent: { agentId: string; name: string; mobile: string; password?: string; pin?: string }) => {
    const pass = agent.password || 'agent@mannat2026';
    const pin = agent.pin || '123456';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `*मन्नत एंटरप्राइज प्रा. लि. - एजेंट लॉगिन क्रेडेंशियल्स*\n\nनमस्ते ${agent.name},\nआपका एजेंट टर्मिनल एक्टिवेट हो गया है। लॉगिन विवरण निम्नलिखित हैं:\n\n🔗 पोर्टल लिंक: ${origin}/login\n👤 एजेंट आईडी (ID): ${agent.agentId}\n📱 रजिस्टर्ड मोबाइल: ${agent.mobile}\n🔑 पासवर्ड (Password): ${pass}\n🔢 ट्रांजैक्शन पिन (PIN): ${pin}\n\n⚠️ कृपया पहली बार लॉगिन करने के बाद अपना पासवर्ड सुरक्षित रखें।\n\n- MANNAT ENTERPRISE PVT LTD`;

    navigator.clipboard.writeText(text);
    showToast('Credentials copied to clipboard! Ready to paste on WhatsApp.');
  };

  const handleExecuteZeroReset = () => {
    resetAllBalancesAndEntriesToZero();
    setShowZeroResetModal(false);
    showToast('All agent wallet balances set to ₹0.00 and dummy entries cleared!');
  };

  const activeKycAgent = selectedAgentForKyc
    ? agents.find((a) => a.agentId === selectedAgentForKyc.agentId) || selectedAgentForKyc
    : null;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-3 ${
          toastMsg.type === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ADMIN CONSOLE / AGENT ROSTER & CREDENTIAL MANAGEMENT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Agent Terminal & Credential Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create agent IDs & passwords, configure custom markup commissions per agent, and manage zero-balance ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowZeroResetModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Reset all balances and transactions to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>एंट्री व बैलेंस 0 करें (Zero Out All)</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            <Key className="w-4 h-4 stroke-[2.5]" />
            <span>+ नया एजेंट बनाएं (ID & Password)</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/agents/create')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Onboarding Wizard</span>
          </button>

          <button
            onClick={() => setShowAccessHelpModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer"
            title="How do agents get access? (एजेंट को एक्सेस कैसे मिलेगी?)"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>एजेंट को एक्सेस कैसे मिलेगी?</span>
          </button>
        </div>
      </div>

      {/* How to Create Agent Guide Banner (Hindi & English) */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-800/50">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Key className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>एजेंट का ID और पासवर्ड कैसे बनाएं? (How to create Agent ID & Password)</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Guide
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 text-xs text-slate-200">
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <span className="font-bold text-emerald-400 block mb-0.5">1. नया एजेंट फॉर्म खोलें</span>
                <span>ऊपर <strong className="text-white">+ नया एजेंट बनाएं</strong> बटन दबाएं। नाम, मोबाइल नंबर और दुकान का नाम भरें।</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <span className="font-bold text-emerald-400 block mb-0.5">2. ID और पासवर्ड तय करें</span>
                <span>सिस्टम ऑटोमैटिक ID (जैसे <code className="text-emerald-300">SSE-AG-88220</code>) और पासवर्ड देगा, या आप अपना मनचाहा पासवर्ड लिख सकते हैं।</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <span className="font-bold text-emerald-400 block mb-0.5">3. बैलेंस और कमीशन सेट करें</span>
                <span>स्टार्टिंग बैलेंस (0 रु.) और बिल पेमेंट पर आपका मार्कअप कमीशन (Flat ₹10.00) डिफ़ॉल्ट सेट रहेगा।</span>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <span className="font-bold text-emerald-400 block mb-0.5">4. WhatsApp पर भेजें</span>
                <span>सबमिट करते ही <strong className="text-emerald-300">Copy WhatsApp</strong> दबाएं और एजेंट को भेजें। एजेंट तुरंत लॉगिन कर सकता है।</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agent name, ID, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Total Terminals: <span className="font-bold text-slate-900">{filteredAgents.length}</span> (All Zero-Balance Ready)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Agent ID & Login</th>
                <th className="py-3 px-4">Agent Name & Mobile</th>
                <th className="py-3 px-4">Business / Store</th>
                <th className="py-3 px-4">Admin Markup & Commission</th>
                <th className="py-3 px-4 text-right">Wallet Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Credentials & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAgents.map((agent) => {
                const markupVal = agent.commissionSettings?.adminBillMarkupValue ?? 10.0;
                const markupType = agent.commissionSettings?.adminBillMarkupType ?? 'FLAT';
                const agentShareVal = agent.commissionSettings?.agentBillCommissionValue ?? 3.5;
                const agentShareType = agent.commissionSettings?.agentBillCommissionType ?? 'FLAT';

                return (
                  <tr key={agent.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                          {agent.agentId}
                        </span>
                        <button
                          onClick={() => openCredentialsModal(agent)}
                          title="View / Edit Password"
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{agent.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <span>📱 {agent.mobile}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{agent.businessName}</div>
                      <div className="text-[10px] text-slate-400">{agent.storeType || 'Digital Seva Point'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-violet-800 bg-violet-100 px-2 py-0.5 rounded text-[10px] border border-violet-200">
                            Admin Fee: {markupType === 'FLAT' ? `₹${markupVal.toFixed(2)} Flat` : `${markupVal}%`}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                          <span>Agent Share: {agentShareType === 'FLAT' ? `₹${agentShareVal.toFixed(2)}` : `${agentShareVal}%`}</span>
                          <button
                            onClick={() => openCommissionModal(agent)}
                            className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                          >
                            (Edit)
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      <span className={agent.walletBalance === 0 ? 'text-slate-500' : 'text-emerald-700'}>
                        ₹{agent.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          agent.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : agent.status === 'SUSPENDED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* ID & Password Button */}
                      <button
                        onClick={() => openCredentialsModal(agent)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-bold transition-colors cursor-pointer"
                        title="View and Edit Login Password & PIN"
                      >
                        <Key className="w-3 h-3 text-emerald-600" />
                        <span>पासवर्ड (Credentials)</span>
                      </button>

                      {/* Set Commission Button */}
                      <button
                        onClick={() => openCommissionModal(agent)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 rounded text-xs font-bold transition-colors cursor-pointer"
                        title="Set Admin Markup & Agent Commission"
                      >
                        <Percent className="w-3 h-3 text-violet-600" />
                        <span>कमीशन सेट करें</span>
                      </button>

                      {/* Copy WhatsApp */}
                      <button
                        onClick={() => handleCopyWhatsApp(agent)}
                        className="p-1 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                        title="Copy WhatsApp Login Message"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedAgentForKyc(agent)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                      >
                        KYC
                      </button>

                      {agent.status === 'ACTIVE' ? (
                        <button
                          onClick={() => updateAgentStatus(agent.agentId, 'SUSPENDED')}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold cursor-pointer"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => updateAgentStatus(agent.agentId, 'ACTIVE')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-xs font-semibold cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW & EDIT CREDENTIALS / PASSWORD */}
      {selectedAgentForCredentials && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Agent Login Credentials & Password
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedAgentForCredentials.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgentForCredentials(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Agent Login ID</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editAgentIdVal}
                    onChange={(e) => setEditAgentIdVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Agent can use this ID or their 10-digit mobile number to log in.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Portal Password</label>
                  <button
                    type="button"
                    onClick={() => setEditPasswordVal(`Shyam@2026#${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-emerald-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditPass ? 'text' : 'password'}
                    required
                    value={editPasswordVal}
                    onChange={(e) => setEditPasswordVal(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPass(!showEditPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showEditPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transaction MPIN (6-digit)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={editPinVal}
                  onChange={(e) => setEditPinVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Mobile:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedAgentForCredentials.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Login URL:</span>
                  <span className="font-mono text-slate-700">/login</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp({
                    ...selectedAgentForCredentials,
                    agentId: editAgentIdVal,
                    password: editPasswordVal,
                    pin: editPinVal,
                  })}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Copy</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAgentForCredentials(null)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
                  >
                    Save Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SET COMMISSION ON AGENT (मेरा कमीशन सेट करें) */}
      {selectedAgentForCommission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Set Commission on Agent (कमीशन व सर्विस चार्ज सेट करें)
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedAgentForCommission.name} ({selectedAgentForCommission.agentId})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgentForCommission(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
              {/* BBPS Markup & Commission (Highlighted) */}
              <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-violet-900 uppercase tracking-wider text-[11px]">
                    1. BBPS Utility Bill Payment Fee (बिजली, गैस, पानी)
                  </span>
                  <span className="text-[10px] bg-violet-200 text-violet-900 px-2 py-0.5 rounded font-black">
                    RECOMMENDED: FLAT ₹10
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Mera Commission / Admin Markup *
                    </label>
                    <p className="text-[10px] text-slate-500 mb-1.5">
                      (जो एडमिन एजेंट से बिल पेमेंट पर काटेगा)
                    </p>
                    <div className="flex gap-1.5">
                      <select
                        value={commAdminMarkupType}
                        onChange={(e) => setCommAdminMarkupType(e.target.value as any)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold"
                      >
                        <option value="FLAT">Flat ₹</option>
                        <option value="PERCENT">%</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={commAdminMarkupVal}
                        onChange={(e) => setCommAdminMarkupVal(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900"
                        placeholder="10.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Agent Commission Credit *
                    </label>
                    <p className="text-[10px] text-slate-500 mb-1.5">
                      (जो एजेंट को पेमेंट पर मिलेगा)
                    </p>
                    <div className="flex gap-1.5">
                      <select
                        value={commAgentCommType}
                        onChange={(e) => setCommAgentCommType(e.target.value as any)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold"
                      >
                        <option value="FLAT">Flat ₹</option>
                        <option value="PERCENT">%</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={commAgentCommVal}
                        onChange={(e) => setCommAgentCommVal(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900"
                        placeholder="3.50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CC Payment Settings */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  2. Credit Card Bill Payment Slabs
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Admin Processing Fee (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={commCcProcessingFee}
                      onChange={(e) => setCommCcProcessingFee(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Agent Share (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={commCcAgentComm}
                      onChange={(e) => setCommCcAgentComm(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono font-semibold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* DMT & Recharge */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  3. Money Transfer & Mobile Recharge
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">DMT Admin Fee (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={commDmtAdminFee}
                      onChange={(e) => setCommDmtAdminFee(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Mobile Recharge Agent (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={commRechargeAgentComm}
                      onChange={(e) => setCommRechargeAgentComm(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-semibold">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCommAdminMarkupType('FLAT');
                    setCommAdminMarkupVal('10.00');
                    setCommAgentCommType('FLAT');
                    setCommAgentCommVal('3.50');
                  }}
                  className="px-2.5 py-1 bg-violet-100 hover:bg-violet-200 text-violet-800 rounded text-[11px] font-bold cursor-pointer"
                >
                  Flat ₹10 Admin Fee (Default)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCommAdminMarkupType('FLAT');
                    setCommAdminMarkupVal('10.00');
                    setCommAgentCommType('FLAT');
                    setCommAgentCommVal('4.50');
                  }}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-[11px] font-bold cursor-pointer"
                >
                  High Volume (₹4.50 Agent)
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAgentForCommission(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                >
                  Save Commission Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ZERO OUT ALL BALANCES CONFIRMATION */}
      {showZeroResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  सभी एंट्री और बैलेंस 0 करें?
                </h3>
                <p className="text-xs text-slate-500">Live Production Zero-Balance Reset</p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl space-y-2">
              <p className="font-bold">
                यह कार्य करने से:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-rose-800">
                <li>सभी एजेंटों का वॉलेट बैलेंस तुरंत <strong>₹0.00</strong> हो जाएगा।</li>
                <li>सभी टेस्ट ट्रांजैक्शन हिस्ट्री और लेजर एंट्रीज साफ (0 एंट्रीज) हो जाएंगी।</li>
                <li>सिस्टम बिल्कुल नए लाइव पोर्टल की तरह फ्रेश तैयार हो जाएगा।</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowZeroResetModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleExecuteZeroReset}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-extrabold shadow-sm cursor-pointer"
              >
                हाँ, सभी बैलेंस और एंट्री 0 करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SUCCESS CREDENTIALS POPUP */}
      {createdSuccessCreds && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                Agent Created Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                लॉगिन आईडी और पासवर्ड तैयार है। इसे WhatsApp पर एजेंट को भेजें:
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Agent Name:</span>
                <span className="font-bold text-slate-900">{createdSuccessCreds.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Login ID:</span>
                <span className="font-bold text-emerald-700">{createdSuccessCreds.agentId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Registered Mobile:</span>
                <span className="font-bold text-slate-900">{createdSuccessCreds.mobile}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Password:</span>
                <span className="font-bold text-slate-900">{createdSuccessCreds.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">MPIN:</span>
                <span className="font-bold text-slate-900">{createdSuccessCreds.pin}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyWhatsApp(createdSuccessCreds)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp पर शेयर / Copy करें</span>
              </button>
              <button
                type="button"
                onClick={() => setCreatedSuccessCreds(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Document Tracking Modal / Drawer */}
      {activeKycAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    KYC COMPLIANCE TRACKER
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">{activeKycAgent.agentId}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {activeKycAgent.name} ({activeKycAgent.businessName})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAgentForKyc(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Overall Status Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Overall Terminal Compliance Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded font-extrabold text-xs uppercase ${
                      activeKycAgent.kycStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeKycAgent.kycStatus === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeKycAgent.kycStatus}
                  </span>
                  <span className="text-xs text-slate-600">
                    {activeKycAgent.kycStatus === 'VERIFIED'
                      ? 'Terminal cleared for live BBPS & Credit Card settlements'
                      : 'Pending complete document review'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateAgentKycOverall(activeKycAgent.agentId, 'VERIFIED')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Mark All Verified
                </button>
              </div>
            </div>

            {/* Document Tracking List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tracked Compliance Documents
              </h4>

              {(activeKycAgent.kycDocuments && activeKycAgent.kycDocuments.length > 0
                ? activeKycAgent.kycDocuments
                : [
                    { id: 'pan', type: 'PAN_CARD', name: 'PAN Card Certificate', status: 'VERIFIED', documentNumber: activeKycAgent.panNumber || 'ABCPS1234F' },
                    { id: 'aadhaar', type: 'AADHAAR_FRONT', name: 'Aadhaar Identification Document', status: 'VERIFIED', documentNumber: activeKycAgent.aadhaarNumber || 'XXXX-XXXX-9412' },
                    { id: 'shop', type: 'SHOP_ESTABLISHMENT', name: 'Shop & Establishment / Trade License', status: 'VERIFIED', documentNumber: 'GUM-AHM-2024-8812' },
                    { id: 'bank', type: 'BANK_PASSBOOK', name: 'Bank Passbook / Cancelled Cheque', status: 'VERIFIED', documentNumber: `${activeKycAgent.bankAccount?.bankName} - A/C **${activeKycAgent.bankAccount?.accountNumber.slice(-4)}` },
                  ]
              ).map((doc: any) => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {doc.documentNumber || 'Document on File'}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        doc.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'UPLOADED'
                          ? 'bg-blue-100 text-blue-800'
                          : doc.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">{doc.remarks || 'No notes attached'}</span>

                    <div className="space-x-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateAgentKycDocument(
                            activeKycAgent.agentId,
                            doc.id,
                            'VERIFIED',
                            'Verified by Super Admin compliance desk'
                          )
                        }
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold cursor-pointer"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateAgentKycDocument(
                            activeKycAgent.agentId,
                            doc.id,
                            'REJECTED',
                            'Document illegible or rejected by compliance'
                          )
                        }
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAgentForKyc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Compliance Tracker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE AGENT WITH ID & PASSWORD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Create Agent Terminal (ID & Password)
                  </h3>
                  <p className="text-[11px] text-slate-500">नया एजेंट बनाएं, आईडी और पासवर्ड सेट करें</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4 text-xs">
              {/* Profile Details */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  1. Agent & Business Profile
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Agent Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nileshbhai Patel"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Business / Store Name *</label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Patel Telecom & CSC"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mobile Number (Login ID) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agent@shyam.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Operating Shop Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Shop No, Complex, Nikol, Ahmedabad"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <span className="font-extrabold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-700" />
                  <span>2. Login ID & Password (एजेंट का आईडी और पासवर्ड)</span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-800 font-bold">Agent ID *</label>
                      <button
                        type="button"
                        onClick={() => setCustomAgentId(`SSE-AG-${88220 + agents.length + Math.floor(Math.random() * 10)}`)}
                        className="text-[10px] text-emerald-700 hover:underline font-bold cursor-pointer"
                      >
                        Auto-Gen
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={customAgentId}
                      onChange={(e) => setCustomAgentId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-800 font-bold">Agent Password *</label>
                      <button
                        type="button"
                        onClick={() => setCustomPassword(`Shyam@2026#${Math.floor(1000 + Math.random() * 9000)}`)}
                        className="text-[10px] text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Random</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-white border border-emerald-300 rounded-lg font-mono text-slate-900 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Transaction MPIN</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Starting Wallet Balance (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={startingBalance}
                      onChange={(e) => setStartingBalance(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-900"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Commission Setup on Agent */}
              <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-violet-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-violet-700" />
                    <span>3. Commission on Agent (कमीशन व चार्ज)</span>
                  </span>
                  <span className="text-[10px] bg-violet-200 text-violet-900 font-black px-1.5 py-0.2 rounded">
                    FLAT ₹10 BILL FEE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Mera Commission (Admin Fee)
                    </label>
                    <div className="flex items-center bg-white border border-slate-200 rounded px-2.5 py-1.5">
                      <span className="text-slate-500 font-mono mr-1">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={newAdminMarkup}
                        onChange={(e) => setNewAdminMarkup(e.target.value)}
                        className="w-full font-mono font-bold text-slate-900 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-500 font-bold ml-1">Flat</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Agent Commission Credit
                    </label>
                    <div className="flex items-center bg-white border border-slate-200 rounded px-2.5 py-1.5">
                      <span className="text-slate-500 font-mono mr-1">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={newAgentCommission}
                        onChange={(e) => setNewAgentCommission(e.target.value)}
                        className="w-full font-mono font-bold text-slate-900 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-500 font-bold ml-1">Flat</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                >
                  Create Agent & Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Access Help Modal (एजेंट को एक्सेस कैसे मिलेगी?) */}
      {showAccessHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    एजेंट को एक्सेस कैसे मिलेगी? (Agent Access Flow & Panel Segregation)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Step-by-step onboarding & login guidance for Mannat Enterprise agents
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAccessHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* 4 Steps Container */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. एडमिन और एजेंट की 4-स्टेप एक्सेस प्रक्रिया:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shrink-0 font-mono">1</span>
                    <span>एडमिन एजेंट को रजिस्टर करता है</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                    एडमिन पैनल में <strong className="text-emerald-700">+ नया एजेंट बनाएं</strong> या <strong className="text-slate-800">Onboarding Wizard</strong> पर क्लिक करके एजेंट का नाम, मोबाइल नंबर, दुकान और कमीशन प्लान दर्ज करें।
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] shrink-0 font-mono">2</span>
                    <span>क्रेडेंशियल्स जनरेट होते हैं</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                    सिस्टम ऑटोमैटिक यूनिक <strong className="text-indigo-700 font-mono">Agent ID (जैसे SSE-AG-88220)</strong>, सुरक्षित पासवर्ड और ट्रांजैक्शन पिन (MPIN) जनरेट करता है।
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[11px] shrink-0 font-mono">3</span>
                    <span>WhatsApp / SMS पर शेयर करें</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                    एजेंट टेबल में हरे रंग के <strong className="text-emerald-700">WhatsApp आइकन</strong> या <strong className="text-slate-800">पासवर्ड</strong> बटन पर क्लिक करके तैयार मैसेज कॉपी करें और एजेंट को भेजें।
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] shrink-0 font-mono">4</span>
                    <span>एजेंट टर्मिनल में लॉगिन</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                    एजेंट <strong className="text-slate-800">/login</strong> पर जाता है, <strong>Agent Terminal</strong> टैब चुनता है, अपनी ID और पासवर्ड डालकर तुरंत बिल पेमेंट शुरू करता है।
                  </p>
                </div>
              </div>
            </div>

            {/* Panel Segregation Info */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-indigo-950">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>एडमिन पैनल और एजेंट पैनल अलग-अलग (Separated Dedicated Portals)</span>
              </div>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                • <strong>Agent Terminal Panel:</strong> एजेंट केवल अपने रिटेल सर्विसेज (BBPS बिल पेमेंट, क्रेडिट कार्ड पे, मोबाइल रिचार्ज, मनी ट्रांसफर, QR वॉलेट लोड और सपोर्ट) का उपयोग कर सकता है। वह एडमिन सेटिंग्स कभी नहीं देख सकता।
              </p>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                • <strong>HQ Admin Panel:</strong> केवल ऑथराइज्ड एडमिन (ccshyam945@gmail.com) सभी एजेंट्स, कमीशन स्लैब (₹10 डिफ़ॉल्ट मार्कअप), क्रेडिट कार्ड अप्रूवल और बैंक सेटलमेंट नियंत्रित करता है।
              </p>
            </div>

            {/* Ready WhatsApp Template */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  एजेंट को भेजने के लिए WhatsApp मैसेज टेम्पलेट:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                    const sampleText = `*मन्नत एंटरप्राइज प्रा. लि. - एजेंट लॉगिन क्रेडेंशियल्स*\n\nनमस्ते,\nआपका एजेंट टर्मिनल एक्टिवेट कर दिया गया है।\n\n🔗 पोर्टल लिंक: ${origin}/login\n👤 एजेंट आईडी: MEPL-AG-XXXXX (या आपका मोबाइल नंबर)\n🔑 पासवर्ड: YourPassword\n🔢 ट्रांजैक्शन पिन: 123456\n\n- MANNAT ENTERPRISE PVT LTD`;
                    navigator.clipboard.writeText(sampleText);
                    setCopiedTemplate(true);
                    setTimeout(() => setCopiedTemplate(false), 2500);
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
{`*मन्नत एंटरप्राइज प्रा. लि. - एजेंट लॉगिन क्रेडेंशियल्स*

नमस्ते [एजेंट का नाम],
आपका एजेंट टर्मिनल एक्टिवेट कर दिया गया है। लॉगिन विवरण:

🔗 पोर्टल लिंक: https://.../login (Agent Terminal चुनें)
👤 एजेंट आईडी: MEPL-AG-XXXXX (या रजिस्टर्ड मोबाइल)
🔑 पासवर्ड: [एडमिन द्वारा दिया गया पासवर्ड]
🔢 ट्रांजैक्शन पिन (MPIN): 123456

- MANNAT ENTERPRISE PVT LTD`}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAccessHelpModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                समझ गया (Close Guide)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
