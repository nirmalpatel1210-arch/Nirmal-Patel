import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMMISSION_PACKAGES, CommissionPlanPackage, COMPANY_INFO } from '../data/mockData';
import { KYCDocument, User } from '../types';
import {
  UserCheck,
  Building2,
  FileCheck2,
  CreditCard,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Printer,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  UploadCloud,
  Eye,
  RefreshCw,
  Clock,
  BadgeAlert,
  Percent,
  Coins,
  Zap,
  Calculator,
  Sliders,
  Tag,
  HelpCircle,
  Info,
} from 'lucide-react';

interface WizardProps {
  onNavigate: (path: string) => void;
}

export const AdminAgentOnboardingWizard: React.FC<WizardProps> = ({ onNavigate }) => {
  const { createAgent, adminAdjustWallet, agents } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [pennyDropTested, setPennyDropTested] = useState(false);
  const [testingPennyDrop, setTestingPennyDrop] = useState(false);

  // STEP 1: Profile & Business
  const [name, setName] = useState('Dhavalbhai K. Vaghela');
  const [email, setEmail] = useState('dhaval.vaghela@gmail.com');
  const [mobile, setMobile] = useState('9898451203');
  const [businessName, setBusinessName] = useState('Vaghela Multi-Services & CSC');
  const [storeType, setStoreType] = useState('CSC Seva Kendra & Utility Point');
  const [address, setAddress] = useState('Shop 8, Radhe Complex, Near Kalyan Chowk, New Nikol');
  const [city, setCity] = useState('Ahmedabad');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('382350');

  // STEP 2: KYC & Compliance Status Tracking
  const [panNumber, setPanNumber] = useState('BKVPV4812L');
  const [panStatus, setPanStatus] = useState<'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [aadhaarNumber, setAadhaarNumber] = useState('981245891204');
  const [aadhaarStatus, setAadhaarStatus] = useState<'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [shopCertNumber, setShopCertNumber] = useState('GUM-AHM-2026-9041');
  const [shopCertStatus, setShopCertStatus] = useState<'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'>('UPLOADED');
  const [bankDocStatus, setBankDocStatus] = useState<'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [kycRemarks, setKycRemarks] = useState('NSDL PAN and Aadhaar OTP verified via automated gateway check.');

  // STEP 3: Bank Settlement Details
  const [bankHolderName, setBankHolderName] = useState('Dhavalbhai K. Vaghela');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('50100481920391');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('50100481920391');
  const [ifsc, setIfsc] = useState('HDFC0001024');
  const [accountType, setAccountType] = useState('Current Account');

  // STEP 4: Commission Configuration & Platform Fees
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_silver');
  const [feeType, setFeeType] = useState<'FLAT' | 'PERCENT'>('FLAT');
  const [platformFeeValue, setPlatformFeeValue] = useState<string>('10'); // Default 10 INR platform fee per transaction for new agents
  const [adminMarkupPercent, setAdminMarkupPercent] = useState<string>('0.25'); // Percentage-based markup
  const [agentCommType, setAgentCommType] = useState<'FLAT' | 'PERCENT'>('FLAT');
  const [agentCommValue, setAgentCommValue] = useState<string>('3.50');
  const [dmtAdminMarkupPercent, setDmtAdminMarkupPercent] = useState<string>('0.45');
  const [dmtAgentCommPercent, setDmtAgentCommPercent] = useState<string>('0.20');
  const [ccProcessingFee, setCcProcessingFee] = useState<string>('50');
  const [ccAgentComm, setCcAgentComm] = useState<string>('15');
  const [rechargeCommPercent, setRechargeCommPercent] = useState<string>('2.0');
  const [simulatedTxnAmount, setSimulatedTxnAmount] = useState<string>('1000');
  const [openingFloat, setOpeningFloat] = useState<string>('2000');
  const [dailyLimit, setDailyLimit] = useState<string>('500000');

  // STEP 5: Credentials Generated
  const nextAgentId = `MEPL-AG-${88220 + agents.length}`;
  const [generatedAgentId] = useState<string>(nextAgentId);
  const [tempPassword, setTempPassword] = useState<string>('Mannat@2026#9841');
  const [tempMpin, setTempMpin] = useState<string>('849120');

  // Onboarding Completed State
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdAgentRecord, setCreatedAgentRecord] = useState<User | null>(null);
  const [validationError, setValidationError] = useState('');

  const selectedPlan = COMMISSION_PACKAGES.find((p) => p.id === selectedPlanId) || COMMISSION_PACKAGES[1];

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPlanId(pkgId);
    if (pkgId === 'plan_gold') {
      setAgentCommValue('4.50');
      setDmtAgentCommPercent('0.25');
      setCcAgentComm('20');
      setRechargeCommPercent('2.50');
    } else if (pkgId === 'plan_platinum') {
      setAgentCommValue('6.00');
      setDmtAgentCommPercent('0.30');
      setCcAgentComm('25');
      setRechargeCommPercent('3.00');
    } else if (pkgId === 'plan_diamond') {
      setAgentCommValue('8.00');
      setDmtAgentCommPercent('0.35');
      setCcAgentComm('30');
      setRechargeCommPercent('3.50');
    } else {
      setAgentCommValue('3.50');
      setDmtAgentCommPercent('0.20');
      setCcAgentComm('15');
      setRechargeCommPercent('2.00');
    }
  };

  const handleResetDefault10Fee = () => {
    setFeeType('FLAT');
    setPlatformFeeValue('10');
  };

  // Helper to re-generate random credentials
  const handleRegenerateCredentials = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setTempPassword(`Mannat@2026#${randomSuffix}`);
    setTempMpin(Math.floor(100000 + Math.random() * 900000).toString());
  };

  const handlePennyDropTest = () => {
    if (!accountNumber || !ifsc) return;
    setTestingPennyDrop(true);
    setTimeout(() => {
      setTestingPennyDrop(false);
      setPennyDropTested(true);
    }, 1000);
  };

  const handleSimulateAutomatedKYC = () => {
    setPanStatus('VERIFIED');
    setAadhaarStatus('VERIFIED');
    setShopCertStatus('VERIFIED');
    setBankDocStatus('VERIFIED');
    setKycRemarks('Automated NSDL and UIDAI verification completed successfully. Identity and address matched 100%.');
  };

  // Step Navigators
  const goToNextStep = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!name || !email || !mobile || !businessName) {
        setValidationError('Please fill in all mandatory profile fields (*).');
        return;
      }
      if (mobile.length !== 10) {
        setValidationError('Mobile number must be exactly 10 digits.');
        return;
      }
    } else if (currentStep === 2) {
      if (!panNumber || !aadhaarNumber) {
        setValidationError('PAN Number and Aadhaar Number are required.');
        return;
      }
    } else if (currentStep === 3) {
      if (!accountNumber || !ifsc || !bankHolderName) {
        setValidationError('Please specify complete bank settlement details.');
        return;
      }
      if (accountNumber !== confirmAccountNumber) {
        setValidationError('Account Number and Confirm Account Number do not match.');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const goToPrevStep = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final submit
  const handleFinalActivation = () => {
    const floatAmount = parseFloat(openingFloat) || 0;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const kycDocs: KYCDocument[] = [
      {
        id: `doc-${Date.now()}-1`,
        type: 'PAN_CARD',
        name: 'PAN Card Verification Certificate',
        documentNumber: panNumber.toUpperCase(),
        status: panStatus,
        verifiedAt: panStatus === 'VERIFIED' ? nowStr : undefined,
        verifiedBy: panStatus === 'VERIFIED' ? 'Super Admin (Nirmal Patel)' : undefined,
        remarks: 'NSDL ITD Database Check',
      },
      {
        id: `doc-${Date.now()}-2`,
        type: 'AADHAAR_FRONT',
        name: 'Aadhaar Identification Document',
        documentNumber: `XXXX-XXXX-${aadhaarNumber.slice(-4)}`,
        status: aadhaarStatus,
        verifiedAt: aadhaarStatus === 'VERIFIED' ? nowStr : undefined,
        verifiedBy: aadhaarStatus === 'VERIFIED' ? 'Super Admin (Nirmal Patel)' : undefined,
        remarks: 'UIDAI OTP Verified',
      },
      {
        id: `doc-${Date.now()}-3`,
        type: 'SHOP_ESTABLISHMENT',
        name: 'Shop Establishment / Trade Permit',
        documentNumber: shopCertNumber,
        status: shopCertStatus,
        verifiedAt: shopCertStatus === 'VERIFIED' ? nowStr : undefined,
        remarks: 'Municipal commercial trade clearance',
      },
      {
        id: `doc-${Date.now()}-4`,
        type: 'BANK_PASSBOOK',
        name: 'Bank Passbook / Mandate Cheque',
        documentNumber: `${bankName} - A/C **${accountNumber.slice(-4)}`,
        status: bankDocStatus,
        verifiedAt: bankDocStatus === 'VERIFIED' ? nowStr : undefined,
        remarks: 'NPCI IMPS Penny Drop Match',
      },
    ];

    const overallKyc =
      panStatus === 'VERIFIED' && aadhaarStatus === 'VERIFIED' && bankDocStatus === 'VERIFIED'
        ? 'VERIFIED'
        : 'PENDING';

    const finalMarkupValue =
      feeType === 'FLAT'
        ? (parseFloat(platformFeeValue) || 10)
        : (parseFloat(adminMarkupPercent) || 0.25);

    const newAgent = createAgent({
      name,
      email,
      mobile,
      businessName,
      storeType,
      address,
      city,
      state,
      pincode,
      agentId: generatedAgentId,
      password: tempPassword,
      pin: tempMpin,
      walletBalance: floatAmount,
      dailyLimit: parseInt(dailyLimit, 10) || 500000,
      commissionPlan: selectedPlan.name,
      commissionSettings: {
        enabled: true,
        planName: selectedPlan.name,
        adminBillMarkupType: feeType,
        adminBillMarkupValue: finalMarkupValue,
        agentBillCommissionType: agentCommType,
        agentBillCommissionValue: parseFloat(agentCommValue) || 3.50,
        ccProcessingFee: parseFloat(ccProcessingFee) || 50.00,
        ccAgentCommission: parseFloat(ccAgentComm) || 15.00,
        dmtAdminFeePercent: parseFloat(dmtAdminMarkupPercent) || 0.45,
        dmtAgentCommissionPercent: parseFloat(dmtAgentCommPercent) || 0.20,
        rechargeAgentCommissionPercent: parseFloat(rechargeCommPercent) || 2.00,
      },
      kycStatus: overallKyc,
      kycDocuments: kycDocs,
      panNumber: panNumber.toUpperCase(),
      aadhaarNumber: `XXXX-XXXX-${aadhaarNumber.slice(-4)}`,
      initialCredentials: {
        tempPassword,
        tempMpin,
        generatedAt: nowStr,
      },
      bankAccount: {
        accountHolder: bankHolderName,
        accountNumber,
        bankName,
        ifsc: ifsc.toUpperCase(),
        accountType,
      },
    });

    if (floatAmount > 0) {
      adminAdjustWallet(
        newAgent.agentId,
        floatAmount,
        'Credit',
        `Initial opening liquidity float allocated during agent onboarding wizard (${selectedPlan.name})`
      );
    }

    setCreatedAgentRecord(newAgent);
    setIsCompleted(true);
  };

  const handleCopyCredentials = () => {
    const feeDisplay =
      feeType === 'FLAT'
        ? `₹${parseFloat(platformFeeValue || '10').toFixed(2)} Flat (Default 10 INR Platform Fee)`
        : `${parseFloat(adminMarkupPercent || '0.25').toFixed(2)}% Percentage Markup`;

    const credText = `MANNAT ENTERPRISE PVT LTD - Agent Terminal Credentials\nAgent ID: ${generatedAgentId}\nName: ${name}\nLogin ID: ${email} or ${mobile}\nPassword: ${tempPassword}\nMPIN: ${tempMpin}\nCommission Plan: ${selectedPlan.name}\nPlatform Fee per Txn: ${feeDisplay}\nAgent Bill Commission: ${agentCommType === 'FLAT' ? `₹${parseFloat(agentCommValue || '3.5').toFixed(2)} Flat` : `${agentCommValue}%`}\nTerminal URL: ${window.location.origin}/login`;
    navigator.clipboard.writeText(credText);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  const steps = [
    { num: 1, title: 'Profile & Store', icon: Building2 },
    { num: 2, title: 'KYC Tracking', icon: ShieldCheck },
    { num: 3, title: 'Bank Settlement', icon: CreditCard },
    { num: 4, title: 'Commission & Fees', icon: Sparkles },
    { num: 5, title: 'Activation', icon: KeyRound },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ADMIN GOVERNANCE / AUTOMATED ONBOARDING</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Agent Onboarding Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            5-step guided wizard: Configure business details, verify KYC documents, assign commission plan, and dispatch initial terminal credentials.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/admin/agents')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Agent Roster</span>
        </button>
      </div>

      {/* Stepper Progress Bar (Only when not completed) */}
      {!isCompleted && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isPast = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              return (
                <div key={st.num} className="flex-1 flex flex-col items-center relative z-10">
                  <button
                    onClick={() => {
                      if (isPast) setCurrentStep(st.num);
                    }}
                    disabled={!isPast && !isCurrent}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                  </button>

                  <span
                    className={`mt-2 text-xs font-semibold text-center whitespace-nowrap ${
                      isCurrent ? 'text-slate-900 font-extrabold' : isPast ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>

                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                        currentStep > st.num ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Alert Banner */}
      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: Basic & Business Profile */}
      {!isCompleted && currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Step 1: Agent & Business Store Profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter contact details, business trade name, and physical retail location.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md">
              Step 1 of 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Agent Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dhavalbhai K. Vaghela"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business / Store Trade Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Vaghela Multi-Services & CSC"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Mobile Number (10 Digits) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9898451203"
                  className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dhaval.vaghela@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Storefront / Terminal Category
              </label>
              <select
                value={storeType}
                onChange={(e) => setStoreType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              >
                <option value="CSC Seva Kendra & Utility Point">CSC Seva Kendra & Utility Point</option>
                <option value="Retail & Multi-Recharge Store">Retail & Multi-Recharge Store</option>
                <option value="Cyber Cafe, Printing & Xerox">Cyber Cafe, Printing & Xerox</option>
                <option value="Mobile Sales & Accessories">Mobile Sales & Accessories</option>
                <option value="Supermarket / Grocery Outlet">Supermarket / Grocery Outlet</option>
                <option value="Financial Inclusion Kiosk / Grahak Seva">Financial Inclusion Kiosk / Grahak Seva</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pincode (6 Digits)</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="382350"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Complete Operating Shop Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop number, Arcade/Complex, Road, Ward"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / District</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={goToNextStep}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Proceed to KYC Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: KYC & Compliance Documents Status Tracking System */}
      {!isCompleted && currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Step 2: KYC Document Status Tracking System
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify individual compliance documents with real-time status tracking and audit notes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateAutomatedKYC}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automated Gateway Verification (NSDL & UIDAI)</span>
            </button>
          </div>

          {/* Individual KYC Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. PAN Card Document */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>1. PAN Card (Permanent Account Number)</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    panStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : panStatus === 'UPLOADED'
                      ? 'bg-blue-100 text-blue-800'
                      : panStatus === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {panStatus}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">10-Digit PAN Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. BKVPV4812L"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">NSDL / Income Tax Department Match</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPanStatus('VERIFIED')}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanStatus('REJECTED')}
                    className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-[11px] font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Aadhaar Document */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>2. Aadhaar Card (12-Digit UIDAI)</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    aadhaarStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : aadhaarStatus === 'UPLOADED'
                      ? 'bg-blue-100 text-blue-800'
                      : aadhaarStatus === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {aadhaarStatus}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="12-digit UID"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Masked Preview: XXXX-XXXX-{aadhaarNumber.slice(-4)}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAadhaarStatus('VERIFIED')}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setAadhaarStatus('REJECTED')}
                    className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-[11px] font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Shop & Establishment Certificate */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>3. Shop & Establishment / Trade License</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    shopCertStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : shopCertStatus === 'UPLOADED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {shopCertStatus}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Certificate / Registration Number</label>
                <input
                  type="text"
                  value={shopCertNumber}
                  onChange={(e) => setShopCertNumber(e.target.value)}
                  placeholder="e.g. GUM-AHM-2026-9041"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Municipal / Panchayati Trade Permit</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShopCertStatus('VERIFIED')}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setShopCertStatus('UPLOADED')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
                  >
                    Uploaded
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Bank Account Passbook / Cancelled Cheque */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>4. Bank Cancelled Cheque / Mandate</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    bankDocStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bankDocStatus === 'UPLOADED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {bankDocStatus}
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-mono text-[11px]">cheque_mandate_dhaval.pdf (420 KB)</span>
                <span className="text-emerald-600 font-bold text-[10px]">ATTACHED</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Bank reconciliation copy</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBankDocStatus('VERIFIED')}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankDocStatus('UPLOADED')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
                  >
                    In Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              KYC Compliance Officer Verification Remarks
            </label>
            <input
              type="text"
              value={kycRemarks}
              onChange={(e) => setKycRemarks(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={goToNextStep}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Proceed to Bank Settlement Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Bank Settlement Details */}
      {!isCompleted && currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Step 3: Bank Settlement Account Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set up direct settlement bank account for wallet payouts and auto-disbursements.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md">
              Step 3 of 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Holder Name (As per Bank Records) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bankHolderName}
                onChange={(e) => setBankHolderName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bank Name <span className="text-rose-500">*</span>
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              >
                <option value="HDFC Bank Ltd">HDFC Bank Ltd</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="ICICI Bank Ltd">ICICI Bank Ltd</option>
                <option value="Axis Bank Ltd">Axis Bank Ltd</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bank IFSC Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001024"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 uppercase focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              >
                <option value="Current Account">Current Account (Commercial)</option>
                <option value="Savings Account">Savings Account</option>
              </select>
            </div>
          </div>

          {/* Penny Drop Verification Tester */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                NPCI IMPS Penny Drop Bank Verification Test
              </span>
              <p className="text-slate-600 mt-0.5">
                Verify beneficiary account name validity and instant IMPS routing.
              </p>
            </div>

            <button
              type="button"
              disabled={testingPennyDrop}
              onClick={handlePennyDropTest}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shrink-0 shadow-xs"
            >
              {testingPennyDrop ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying with NPCI Switch...</span>
                </>
              ) : pennyDropTested ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Penny Drop Match Verified (₹1.00)</span>
                </>
              ) : (
                <span>Test Penny Drop Verification</span>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={goToNextStep}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Proceed to Commission Configuration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Commission Configuration & Platform Fees */}
      {!isCompleted && currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STEP 4 OF 5 · MARGINS & COMMISSIONS</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                Commission Configuration & Platform Fee Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the platform fee per transaction (default 10 INR), set percentage-based markups, and customize agent commission splits.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md">
              Step 4 of 5
            </span>
          </div>

          {/* =========================================================================
              FEATURED CARD: DEFAULT 10 INR PLATFORM FEE & PERCENTAGE MARKUP POLICY
             ========================================================================= */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-800/50 shadow-md space-y-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Platform Markup Policy for New Agent</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Platform Fee & Markup Mode
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  By default, new agents are onboarded with a <strong className="text-emerald-400">Default 10 INR Platform Fee</strong> per transaction on utility bills. You can also configure a custom <strong className="text-indigo-300">percentage-based markup</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetDefault10Fee}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Reset to Default ₹10 INR Fee</span>
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFeeType('FLAT');
                  if (platformFeeValue === '0' || !platformFeeValue) setPlatformFeeValue('10');
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  feeType === 'FLAT'
                    ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-xs'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                      feeType === 'FLAT' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      ₹
                    </div>
                    <span className="font-extrabold text-sm text-white">Default 10 INR Flat Fee</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Fixed ₹10.00 INR platform fee charged per utility bill transaction debited from agent wallet (Bill + ₹10.00).
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeeType('PERCENT');
                  if (adminMarkupPercent === '0' || !adminMarkupPercent) setAdminMarkupPercent('0.25');
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  feeType === 'PERCENT'
                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-xs'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                      feeType === 'PERCENT' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      %
                    </div>
                    <span className="font-extrabold text-sm text-white">Percentage-Based Markup</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">
                    Dynamic
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Calculates platform fee dynamically as a percentage markup on the transaction amount (e.g. 0.25% or 0.50%).
                </p>
              </button>
            </div>

            {/* Input & Presets based on active mode */}
            {feeType === 'FLAT' ? (
              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-0.5">
                      Platform Fee Per Transaction (INR) <span className="text-emerald-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Standard default is 10 INR per transaction for all newly onboarded agents.
                    </span>
                  </div>

                  <div className="relative w-full sm:w-48">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={platformFeeValue}
                      onChange={(e) => setPlatformFeeValue(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm font-mono font-extrabold text-emerald-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setPlatformFeeValue('10')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      platformFeeValue === '10'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    ⭐ Default ₹10.00 Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformFeeValue('5')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      platformFeeValue === '5'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    ₹5.00 Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformFeeValue('15')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      platformFeeValue === '15'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    ₹15.00 Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformFeeValue('20')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      platformFeeValue === '20'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    ₹20.00 Flat
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-0.5">
                      Percentage-Based Markup Rate (%) <span className="text-indigo-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Calculated on bill amount and debited from agent wallet per transaction.
                    </span>
                  </div>

                  <div className="relative w-full sm:w-48">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                      %
                    </span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      required
                      value={adminMarkupPercent}
                      onChange={(e) => setAdminMarkupPercent(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm font-mono font-extrabold text-indigo-300 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setAdminMarkupPercent('0.15')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      adminMarkupPercent === '0.15'
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    0.15% (Low Markup)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminMarkupPercent('0.25')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      adminMarkupPercent === '0.25'
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    0.25% (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminMarkupPercent('0.50')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      adminMarkupPercent === '0.50'
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    0.50% (High Margin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminMarkupPercent('0.75')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      adminMarkupPercent === '0.75'
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    0.75%
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminMarkupPercent('1.00')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      adminMarkupPercent === '1.00'
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    1.00%
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              LIVE TRANSACTION MARGIN & FEE SIMULATOR
             ========================================================================= */}
          {(() => {
            const simAmt = parseFloat(simulatedTxnAmount) || 1000;
            const feeAmt =
              feeType === 'FLAT'
                ? (parseFloat(platformFeeValue) || 10)
                : (simAmt * (parseFloat(adminMarkupPercent) || 0.25)) / 100;
            const totalDebited = simAmt + feeAmt;
            const agentEarnings =
              agentCommType === 'FLAT'
                ? (parseFloat(agentCommValue) || 3.5)
                : (simAmt * (parseFloat(agentCommValue) || 0.25)) / 100;

            return (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Live Transaction Fee & HQ Margin Simulator
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Test how the configured markup fee behaves on live utility bill payments.
                      </p>
                    </div>
                  </div>

                  {/* Simulator Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Test Bill:</span>
                    {['500', '1000', '2500', '5000', '10000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSimulatedTxnAmount(amt)}
                        className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-colors ${
                          simulatedTxnAmount === amt
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ₹{parseInt(amt, 10).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-sans block">Customer Bill</span>
                    <span className="text-sm font-bold text-slate-800">₹{simAmt.toLocaleString('en-IN')}.00</span>
                  </div>

                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                    <span className="text-[10px] text-indigo-700 font-sans font-bold block">
                      Platform Fee ({feeType === 'FLAT' ? 'Default 10 INR' : `${adminMarkupPercent}%`})
                    </span>
                    <span className="text-sm font-black text-indigo-900">+ ₹{feeAmt.toFixed(2)}</span>
                  </div>

                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-sans font-bold block">Agent Wallet Debited</span>
                    <span className="text-sm font-black text-rose-900">₹{totalDebited.toFixed(2)}</span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-sans font-bold block">Agent Earns Comm</span>
                    <span className="text-sm font-black text-emerald-800">₹{agentEarnings.toFixed(2)}</span>
                  </div>

                  <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-emerald-400 font-sans font-bold block">HQ Net Retention</span>
                    <span className="text-sm font-black text-white">₹{feeAmt.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =========================================================================
              BASE COMMISSION PACKAGES TEMPLATE
             ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Base Commission Package Slab
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select standard tier to pre-populate service commission rates for this agent.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMISSION_PACKAGES.map((pkg) => {
                const isSelected = selectedPlanId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-sm text-slate-900">{pkg.name}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                          pkg.recommended ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3">{pkg.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-slate-100 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">BBPS Bills</span>
                        <span className="font-bold text-emerald-700">{pkg.rates.bbps}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Credit Card</span>
                        <span className="font-bold text-violet-700">{pkg.rates.creditCard}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">DMT Transfer</span>
                        <span className="font-bold text-amber-700">{pkg.rates.dmt}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Mobile Recharge</span>
                        <span className="font-bold text-sky-700">{pkg.rates.mobileRecharge}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              GRANULAR SERVICE COMMISSIONS & PAYOUTS
             ========================================================================= */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Agent Payout & Service Commission Customization
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* 1. BBPS Agent Commission */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">1. BBPS & Utility Bills</span>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Commission Type</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-md text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setAgentCommType('FLAT')}
                      className={`py-1 rounded text-center ${
                        agentCommType === 'FLAT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Flat (₹)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgentCommType('PERCENT')}
                      className={`py-1 rounded text-center ${
                        agentCommType === 'PERCENT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Percent (%)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">
                    Agent Commission Payout ({agentCommType === 'FLAT' ? '₹' : '%'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={agentCommValue}
                    onChange={(e) => setAgentCommValue(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 2. DMT */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">2. Domestic Money Transfer (DMT)</span>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Admin Fee Markup (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={dmtAdminMarkupPercent}
                    onChange={(e) => setDmtAdminMarkupPercent(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Agent Commission (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={dmtAgentCommPercent}
                    onChange={(e) => setDmtAgentCommPercent(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 3. Credit Card */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">3. Credit Card Bill Payout</span>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Processing Fee Fixed (₹)</label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={ccProcessingFee}
                    onChange={(e) => setCcProcessingFee(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Agent Commission (₹)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={ccAgentComm}
                    onChange={(e) => setCcAgentComm(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 4. Mobile Recharge */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">4. Prepaid & DTH Recharge</span>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Agent Commission (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={rechargeCommPercent}
                    onChange={(e) => setRechargeCommPercent(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div className="pt-2 text-[10px] text-slate-400">
                  Instant credit to agent wallet upon recharge confirmation.
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              OPENING FLOAT & DAILY LIMIT
             ========================================================================= */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Opening Wallet Float (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  min={0}
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Directly debited from HQ treasury and credited to agent main balance.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Daily Transaction Quota Cap (INR)
              </label>
              <select
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-hidden"
              >
                <option value="200000">₹2,00,000 / Day</option>
                <option value="500000">₹5,00,000 / Day (Standard)</option>
                <option value="1000000">₹10,00,000 / Day (High Volume)</option>
                <option value="2500000">₹25,00,000 / Day (Enterprise)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={goToNextStep}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Proceed to Credential Generation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Automated Credential Generation & Preview */}
      {!isCompleted && currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Step 5: Automated Credential Generation & Review
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review generated credentials and launch agent terminal activation.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md">
              Step 5 of 5
            </span>
          </div>

          {/* Credentials Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                  SSE
                </div>
                <div>
                  <div className="text-sm font-bold">{name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{businessName}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegenerateCredentials}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Credentials</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block mb-1">
                  Assigned Agent ID
                </span>
                <span className="text-base font-black text-emerald-400">{generatedAgentId}</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block mb-1">
                  Temporary Password
                </span>
                <span className="text-base font-black text-white">{tempPassword}</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block mb-1">
                  Default Transaction MPIN
                </span>
                <span className="text-base font-black text-amber-400">{tempMpin}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2 text-xs">
              <div className="text-slate-300 text-[11px] space-y-0.5">
                <div>
                  Commission Slab: <span className="text-emerald-400 font-bold">{selectedPlan.name}</span>
                  {' · '}Platform Fee: <span className="text-amber-300 font-bold">
                    {feeType === 'FLAT' ? `₹${parseFloat(platformFeeValue || '10').toFixed(2)} Flat (Default 10 INR)` : `${adminMarkupPercent}% Markup`}
                  </span>
                </div>
                <div>
                  Agent Bill Payout: <span className="text-indigo-300 font-bold">
                    {agentCommType === 'FLAT' ? `₹${parseFloat(agentCommValue || '3.5').toFixed(2)} Flat` : `${agentCommValue}%`}
                  </span>
                  {' · '}Initial Float: <span className="text-white font-bold font-mono">₹{parseFloat(openingFloat || '0').toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
              >
                {copiedCredentials ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCredentials ? 'COPIED TO CLIPBOARD' : 'COPY CREDENTIALS'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleFinalActivation}
              className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-2 shadow-md shadow-emerald-700/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Activate Terminal & Finish Onboarding</span>
            </button>
          </div>
        </div>
      )}

      {/* FINAL STEP: Success Confirmation & Welcome Kit Download */}
      {isCompleted && createdAgentRecord && (
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 shadow-lg max-w-2xl mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Agent Onboarding Completed!
            </h2>
            <p className="text-xs text-slate-500">
              Terminal <span className="font-mono font-bold text-slate-800">{createdAgentRecord.agentId}</span> is officially active on Mannat Enterprise Pvt Ltd network.
            </p>
          </div>

          {/* Printable Welcome Certificate Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs space-y-3 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-extrabold uppercase text-[11px] text-slate-800">
                Official Agent Welcome Pack
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                KYC: {createdAgentRecord.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-2.5 font-mono">
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Agent ID</span>
                <span className="font-bold text-slate-900">{createdAgentRecord.agentId}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Store Name</span>
                <span className="font-bold text-slate-900 font-sans">{createdAgentRecord.businessName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Login Identifier</span>
                <span className="font-bold text-slate-900">{createdAgentRecord.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Mobile Number</span>
                <span className="font-bold text-slate-900">+91 {createdAgentRecord.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Temporary Password</span>
                <span className="font-bold text-slate-900">{tempPassword}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Default MPIN</span>
                <span className="font-bold text-slate-900">{tempMpin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Platform Fee per Txn</span>
                <span className="font-bold text-indigo-700 font-mono">
                  {createdAgentRecord.commissionSettings?.adminBillMarkupType === 'FLAT'
                    ? `₹${createdAgentRecord.commissionSettings.adminBillMarkupValue.toFixed(2)} Flat (Default 10 INR)`
                    : `${createdAgentRecord.commissionSettings?.adminBillMarkupValue}% Percentage Markup`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Agent Bill Commission</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {createdAgentRecord.commissionSettings?.agentBillCommissionType === 'FLAT'
                    ? `₹${createdAgentRecord.commissionSettings.agentBillCommissionValue.toFixed(2)} Flat`
                    : `${createdAgentRecord.commissionSettings?.agentBillCommissionValue}%`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Commission Plan</span>
                <span className="font-bold text-emerald-700 font-sans">{createdAgentRecord.commissionPlan}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Opening Wallet Float</span>
                <span className="font-bold text-slate-900">₹{createdAgentRecord.walletBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyCredentials}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              {copiedCredentials ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCredentials ? 'Copied' : 'Copy Welcome Credentials'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Welcome Letter</span>
            </button>

            <button
              onClick={() => onNavigate('/admin/agents')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              View in Agent Roster →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
