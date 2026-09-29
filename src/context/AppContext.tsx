import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Transaction,
  WalletTransaction,
  FundRequest,
  SettlementRequest,
  CommissionRule,
  SupportTicket,
  AppNotification,
  AuditLog,
  UserRole,
  ServiceType,
  CreditCardRequest,
  CCRequestStatus,
  QRCodeConfig,
  AgentCustomCommission,
} from '../types';
import {
  INITIAL_AGENT,
  INITIAL_ADMIN,
  INITIAL_AGENTS_LIST,
  INITIAL_TRANSACTIONS,
  INITIAL_WALLET_LEDGER,
  INITIAL_FUND_REQUESTS,
  INITIAL_SETTLEMENTS,
  INITIAL_COMMISSION_RULES,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CC_REQUESTS,
  INITIAL_QR_CODES,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  role: UserRole;
  demoMode: boolean;
  agents: User[];
  transactions: Transaction[];
  walletLedger: WalletTransaction[];
  fundRequests: FundRequest[];
  settlements: SettlementRequest[];
  commissionRules: CommissionRule[];
  tickets: SupportTicket[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  activeReceiptTxn: Transaction | null;
  setActiveReceiptTxn: (txn: Transaction | null) => void;
  // Credit Card Request System
  ccRequests: CreditCardRequest[];
  activeCCReceiptRequest: CreditCardRequest | null;
  setActiveCCReceiptRequest: (req: CreditCardRequest | null) => void;
  createCCRequest: (params: {
    bankName: string;
    customerName: string;
    customerMobile: string;
    cardNumber: string;
    amount: number;
    processingFee?: number;
  }) => { success: boolean; request?: CreditCardRequest; message?: string };
  adminStartProcessingCCRequest: (requestId: string, adminRemarks?: string) => void;
  adminMarkPaymentDoneCCRequest: (
    requestId: string,
    params: {
      provider: string;
      paymentRefNumber: string;
      amountPaid: number;
      paymentProofUrl?: string;
      adminRemarks?: string;
    }
  ) => void;
  adminApproveCCRequest: (requestId: string, adminRemarks?: string) => void;
  adminMarkFailedCCRequest: (requestId: string, failureReason: string) => void;
  adminRejectCCRequest: (requestId: string, rejectionReason: string) => void;
  adminRefundCCRequest: (requestId: string, refundReason: string, refundRef: string) => void;
  refreshCCRequests: () => CreditCardRequest[];
  setDemoMode: (enabled: boolean) => void;
  login: (identifier: string, pass: string, asAdmin?: boolean) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  processPayment: (params: {
    service: ServiceType;
    categoryName?: string;
    billerName?: string;
    customerName: string;
    customerMobile: string;
    customerIdentifier?: string;
    billAmount: number;
    serviceCharge: number;
    commission: number;
    referencePrefix?: string;
    metadata?: Record<string, any>;
  }) => { success: boolean; transaction?: Transaction; message?: string };
  // Dynamic Live QR Management
  qrCodes: QRCodeConfig[];
  activeLiveQR: QRCodeConfig;
  setLiveQRCode: (qrId: string) => void;
  createQRCode: (data: Omit<QRCodeConfig, 'id' | 'totalCollected' | 'activeRequestsCount' | 'createdAt'>) => QRCodeConfig;
  updateQRCode: (qrId: string, updates: Partial<QRCodeConfig>) => void;
  deleteQRCode: (qrId: string) => void;
  submitFundRequest: (params: {
    amount: number;
    paymentMode: 'UPI' | 'NEFT/RTGS' | 'IMPS' | 'CASH_DEPOSIT';
    utrNumber: string;
    cardLast4?: string;
    remarks: string;
    proofImageUrl?: string;
    ocrExtractedText?: string;
    qrId?: string;
    qrName?: string;
    qrUpiId?: string;
    qrBankName?: string;
  }) => FundRequest;
  adminApproveFundRequest: (id: string, adminRemarks?: string) => void;
  adminRejectFundRequest: (id: string, adminRemarks?: string) => void;
  adminAdjustWallet: (agentId: string, amount: number, type: 'Credit' | 'Debit' | 'Adjustment', note: string) => void;
  submitSettlement: (params: { amount: number; bankName: string; accountNumber: string; ifsc: string; accountHolder: string; mode: 'IMPS' | 'NEFT' }) => SettlementRequest;
  adminUpdateSettlement: (id: string, status: 'PROCESSING' | 'COMPLETED' | 'REJECTED', utr?: string) => void;
  createSupportTicket: (params: { subject: string; category: SupportTicket['category']; transactionId?: string; description: string; priority: SupportTicket['priority'] }) => SupportTicket;
  replySupportTicket: (ticketId: string, message: string) => void;
  createAgent: (agentData: Partial<User>) => User;
  updateAgentStatus: (agentId: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => void;
  updateAgentKycDocument: (agentId: string, docId: string, status: 'VERIFIED' | 'REJECTED' | 'UPLOADED', remarks?: string) => void;
  updateAgentKycOverall: (agentId: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED') => void;
  updateAgentCredentials: (
    agentId: string,
    updates: {
      agentId?: string;
      password?: string;
      pin?: string;
      name?: string;
      mobile?: string;
      email?: string;
    }
  ) => void;
  updateAgentCommission: (agentId: string, settings: AgentCustomCommission) => void;
  resetAllBalancesAndEntriesToZero: () => void;
  updateCommissionRule: (ruleId: string, updates: Partial<CommissionRule>) => void;
  billPaymentFee: number;
  getBillPaymentFee: (agent?: User) => number;
  setBillPaymentFee: (fee: number, feeType?: 'FLAT' | 'PERCENT') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('agent');
  
  // Persisted or initialized state with zero-balance & zero-entry check
  const isZeroMigrated = typeof window !== 'undefined' && localStorage.getItem('sse_zeroed_v3') === 'true';

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (!isZeroMigrated) {
      return INITIAL_AGENT;
    }
    const saved = localStorage.getItem('sse_current_user');
    return saved ? JSON.parse(saved) : INITIAL_AGENT;
  });

  const [agents, setAgents] = useState<User[]>(() => {
    if (!isZeroMigrated) {
      return INITIAL_AGENTS_LIST;
    }
    const saved = localStorage.getItem('sse_agents');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        return parsed.map((a) => ({
          ...a,
          password: a.password || a.initialCredentials?.tempPassword || 'agent@shyam2026',
          pin: a.pin || a.initialCredentials?.tempMpin || '123456',
          commissionSettings: a.commissionSettings || {
            enabled: true,
            planName: a.commissionPlan || 'Silver Master Plan',
            adminBillMarkupType: 'FLAT',
            adminBillMarkupValue: 10.00,
            agentBillCommissionType: 'FLAT',
            agentBillCommissionValue: 3.50,
            ccProcessingFee: 50.00,
            ccAgentCommission: 15.00,
            dmtAdminFeePercent: 0.45,
            dmtAgentCommissionPercent: 0.20,
            rechargeAgentCommissionPercent: 2.00,
          },
        }));
      } catch (e) {
        console.error('Failed to parse agents', e);
      }
    }
    return INITIAL_AGENTS_LIST;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (!isZeroMigrated) return [];
    const saved = localStorage.getItem('sse_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [walletLedger, setWalletLedger] = useState<WalletTransaction[]>(() => {
    if (!isZeroMigrated) return [];
    const saved = localStorage.getItem('sse_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  const [fundRequests, setFundRequests] = useState<FundRequest[]>(() => {
    if (!isZeroMigrated) return [];
    const saved = localStorage.getItem('sse_fund_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [settlements, setSettlements] = useState<SettlementRequest[]>(() => {
    if (!isZeroMigrated) return [];
    const saved = localStorage.getItem('sse_settlements');
    return saved ? JSON.parse(saved) : [];
  });

  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(() => {
    const saved = localStorage.getItem('sse_commission_rules');
    if (saved) {
      try {
        const parsed: CommissionRule[] = JSON.parse(saved);
        // Ensure BBPS rule is migrated to Flat ₹10 fee if it had old percent or 0 fixed fee
        return parsed.map((r) => {
          if (r.service === 'BBPS' && (r.fixedFee === 0 || r.platformCommissionPercent === 0.15 || !r.platformFeeType)) {
            return {
              ...r,
              fixedFee: 10.0,
              platformCommissionPercent: 0.0,
              platformFeeType: 'FLAT',
              platformFeeFixed: 10.0,
            };
          }
          return r;
        });
      } catch (e) {
        console.error('Failed to parse saved commission rules', e);
      }
    }
    return INITIAL_COMMISSION_RULES;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('sse_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sse_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [adminAccount, setAdminAccount] = useState<User>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sse_admin_account') : null;
    return saved ? JSON.parse(saved) : INITIAL_ADMIN;
  });

  useEffect(() => {
    localStorage.setItem('sse_admin_account', JSON.stringify(adminAccount));
  }, [adminAccount]);

  const [activeReceiptTxn, setActiveReceiptTxn] = useState<Transaction | null>(null);

  const [ccRequests, setCcRequests] = useState<CreditCardRequest[]>(() => {
    if (!isZeroMigrated) return [];
    const saved = localStorage.getItem('sse_cc_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCCReceiptRequest, setActiveCCReceiptRequest] = useState<CreditCardRequest | null>(null);

  // Dynamic Live QR Management state
  const [qrCodes, setQrCodes] = useState<QRCodeConfig[]>(() => {
    const saved = localStorage.getItem('sse_qr_codes');
    return saved ? JSON.parse(saved) : INITIAL_QR_CODES;
  });

  const activeLiveQR: QRCodeConfig =
    qrCodes.find((q) => q.isLive) || qrCodes[0] || INITIAL_QR_CODES[0];

  useEffect(() => {
    if (!isZeroMigrated) {
      localStorage.setItem('sse_zeroed_v3', 'true');
      localStorage.setItem('sse_transactions', JSON.stringify([]));
      localStorage.setItem('sse_ledger', JSON.stringify([]));
      localStorage.setItem('sse_fund_requests', JSON.stringify([]));
      localStorage.setItem('sse_settlements', JSON.stringify([]));
      localStorage.setItem('sse_cc_requests', JSON.stringify([]));
    }
  }, [isZeroMigrated]);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sse_current_user', JSON.stringify(currentUser));
      setRole(currentUser.role);
    } else {
      localStorage.removeItem('sse_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sse_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('sse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sse_ledger', JSON.stringify(walletLedger));
  }, [walletLedger]);

  useEffect(() => {
    localStorage.setItem('sse_fund_requests', JSON.stringify(fundRequests));
  }, [fundRequests]);

  useEffect(() => {
    localStorage.setItem('sse_settlements', JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem('sse_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('sse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sse_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('sse_cc_requests', JSON.stringify(ccRequests));
  }, [ccRequests]);

  useEffect(() => {
    localStorage.setItem('sse_qr_codes', JSON.stringify(qrCodes));
  }, [qrCodes]);

  useEffect(() => {
    localStorage.setItem('sse_commission_rules', JSON.stringify(commissionRules));
  }, [commissionRules]);

  // Real-time multi-tab cross-sync via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sse_cc_requests' && e.newValue) {
        try {
          setCcRequests(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'sse_current_user' && e.newValue) {
        try {
          setCurrentUser(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'sse_qr_codes' && e.newValue) {
        try {
          setQrCodes(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const refreshCCRequests = (): CreditCardRequest[] => {
    try {
      const saved = localStorage.getItem('sse_cc_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCcRequests(parsed);
        const savedUser = localStorage.getItem('sse_current_user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
        const savedLedger = localStorage.getItem('sse_ledger');
        if (savedLedger) {
          setWalletLedger(JSON.parse(savedLedger));
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return ccRequests;
  };

  // Auth functions
  const login = (identifier: string, pass: string, asAdmin = false) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter your login ID / Email and password.' };
    }

    // 1. Identify Admin Login
    const isAdminIdentifier =
      asAdmin ||
      cleanId === 'admin' ||
      cleanId.includes('admin') ||
      cleanId === 'nirmalpatel1210@gmail.com' ||
      cleanId === 'ccshyam945@gmail.com' ||
      cleanId === 'admin@mannatenterprise.in' ||
      cleanId === 'support@mannatenterprise.in' ||
      cleanId === (adminAccount.email || '').toLowerCase() ||
      cleanId === (adminAccount.agentId || '').toLowerCase() ||
      cleanId === 'mepl-adm-001' ||
      cleanId === 'sse-adm-001' ||
      cleanId === '9825000000' ||
      cleanId === adminAccount.mobile ||
      cleanId === 'nirmal patel' ||
      cleanId.includes('nirmal');

    if (isAdminIdentifier) {
      const allowedAdminPasswords = [
        adminAccount.password,
        'admin@mannat2026',
        'admin@shyam2026',
        'password123',
        'admin123',
        'admin',
        'mannat2026',
        '123456',
      ].filter(Boolean);

      if (!allowedAdminPasswords.includes(cleanPass)) {
        return {
          success: false,
          message: 'Invalid Admin password. Default demo password is: admin@mannat2026 (or password123)',
        };
      }

      setCurrentUser(adminAccount);
      setRole('admin');
      localStorage.setItem('sse_current_user', JSON.stringify(adminAccount));
      return { success: true };
    }

    // 2. Identify Agent Login
    const normalizedId = cleanId
      .replace(/^sse-ag-/, 'mepl-ag-')
      .replace(/^sse-/, 'mepl-');

    const matchedAgent =
      agents.find((a) => {
        const aId = (a.agentId || '').toLowerCase();
        const normAId = aId.replace(/^sse-ag-/, 'mepl-ag-').replace(/^sse-/, 'mepl-');
        return (
          aId === cleanId ||
          normAId === normalizedId ||
          (a.email || '').toLowerCase() === cleanId ||
          a.mobile === cleanId ||
          (a.name || '').toLowerCase().includes(cleanId)
        );
      }) || (cleanId === 'agent' || cleanId.includes('88219') ? agents[0] || INITIAL_AGENT : null);

    if (!matchedAgent) {
      return {
        success: false,
        message: `Agent terminal not found for "${identifier}". Use ID MEPL-AG-88219 or Mobile 9825412390, or use the One-Click Demo Login below.`,
      };
    }

    // Check agent password (tolerant with defaults)
    const allowedAgentPasswords = [
      matchedAgent.password,
      matchedAgent.initialCredentials?.tempPassword,
      'agent@mannat2026',
      'agent@shyam2026',
      'password123',
      'agent123',
      '123456',
      'mannat2026',
      'agent',
    ].filter(Boolean);

    if (!allowedAgentPasswords.includes(cleanPass)) {
      return {
        success: false,
        message: `Incorrect password for agent ${matchedAgent.name}. Default is: agent@mannat2026 (or password123)`,
      };
    }

    if (matchedAgent.status === 'SUSPENDED') {
      return {
        success: false,
        message: 'This agent terminal has been suspended by Super Admin.',
      };
    }

    setCurrentUser(matchedAgent);
    setRole('agent');
    localStorage.setItem('sse_current_user', JSON.stringify(matchedAgent));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sse_current_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setCurrentUser(adminAccount);
      setRole('admin');
      localStorage.setItem('sse_current_user', JSON.stringify(adminAccount));
    } else {
      const defaultAgent = agents[0] || INITIAL_AGENT;
      setCurrentUser(defaultAgent);
      setRole('agent');
      localStorage.setItem('sse_current_user', JSON.stringify(defaultAgent));
    }
  };

  // Payment execution
  const processPayment = ({
    service,
    categoryName,
    billerName,
    customerName,
    customerMobile,
    customerIdentifier,
    billAmount,
    serviceCharge,
    commission,
    referencePrefix = 'SSE',
    metadata = {},
  }: {
    service: ServiceType;
    categoryName?: string;
    billerName?: string;
    customerName: string;
    customerMobile: string;
    customerIdentifier?: string;
    billAmount: number;
    serviceCharge: number;
    commission: number;
    referencePrefix?: string;
    metadata?: Record<string, any>;
  }) => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };

    const totalDeducted = billAmount + serviceCharge;

    // Check available balance (total minus held reserve)
    const availableBalance = currentUser.walletBalance - (currentUser.reservedBalance || 0);
    if (availableBalance < totalDeducted) {
      return {
        success: false,
        message: `Insufficient available wallet balance (Available: ₹${availableBalance.toFixed(2)}, Reserved: ₹${(currentUser.reservedBalance || 0).toFixed(2)}, Required: ₹${totalDeducted.toFixed(2)})`,
      };
    }

    const newBalance = Math.round((currentUser.walletBalance - totalDeducted + commission) * 100) / 100;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const timestampNum = now.getTime().toString().slice(-6);
    const txnId = `TXN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${timestampNum}`;
    const refId = `REF-${referencePrefix}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const bbpsRef = service === 'BBPS' || service === 'ELECTRICITY' || service === 'GAS' || service === 'WATER' || service === 'INSURANCE'
      ? `BBPS${Math.floor(100000000000 + Math.random() * 900000000000)}`
      : undefined;

    const newTxn: Transaction = {
      id: txnId,
      referenceId: refId,
      bbpsRef,
      utr: service === 'MONEY_TRANSFER' || service === 'CREDIT_CARD' ? `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}` : undefined,
      agentId: currentUser.agentId,
      agentName: currentUser.name,
      service,
      categoryName: categoryName || service,
      billerName: billerName || 'BBPS Direct Gateway',
      customerName,
      customerMobile,
      customerIdentifier,
      billAmount,
      serviceCharge,
      commission,
      totalDeducted,
      status: 'SUCCESS',
      date: dateStr,
      time: timeStr,
      reason: 'Transaction processed successfully',
      metadata,
    };

    // Update agent wallet
    const updatedUser: User = {
      ...currentUser,
      walletBalance: newBalance,
    };

    setCurrentUser(updatedUser);
    setAgents((prev) => prev.map((a) => (a.agentId === updatedUser.agentId ? updatedUser : a)));

    // Add to transactions
    setTransactions((prev) => [newTxn, ...prev]);

    // Add ledger movement
    const ledgerEntry: WalletTransaction = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      agentId: currentUser.agentId,
      agentName: currentUser.name,
      type: 'Debit',
      amount: totalDeducted,
      balance: newBalance,
      reference: service.toLowerCase() + '_pay',
      note: `${service} Pay: ₹${billAmount.toFixed(2)} (Charge ₹${serviceCharge.toFixed(2)}, Comm ₹${commission.toFixed(2)}) - ${billerName || ''} for ${customerMobile}`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'SUCCESS',
      service,
    };
    setWalletLedger((prev) => [ledgerEntry, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `${categoryName || service} Payment Success`,
      message: `Transaction ${txnId} for ₹${billAmount.toFixed(2)} completed. Commission of ₹${commission.toFixed(2)} credited.`,
      type: 'SUCCESS',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Automatically open receipt
    setActiveReceiptTxn(newTxn);

    return { success: true, transaction: newTxn };
  };

  // =========================================================================
  // CREDIT CARD BILL PAYMENT REQUEST WORKFLOW
  // Agent Wallet -> Request -> Admin -> Admin Makes Payment -> Admin Updates Status -> Agent Gets Approval Indicator
  // =========================================================================
  const createCCRequest = ({
    bankName,
    customerName,
    customerMobile,
    cardNumber,
    amount,
    processingFee = 50,
  }: {
    bankName: string;
    customerName: string;
    customerMobile: string;
    cardNumber: string;
    amount: number;
    processingFee?: number;
  }) => {
    if (!currentUser) return { success: false, message: 'User session not found' };

    const availableBalance = currentUser.walletBalance - (currentUser.reservedBalance || 0);
    const totalRequired = amount + processingFee;

    // Step 2: Wallet Balance Check
    if (availableBalance < totalRequired) {
      return {
        success: false,
        message: `Insufficient Wallet Balance. Available: ₹${availableBalance.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
        })}, Required: ₹${totalRequired.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
        })} (Card Amount ₹${amount.toLocaleString('en-IN')} + Fee ₹${processingFee}).`,
      };
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const reqNum = 125 + ccRequests.length + 1;
    const reqId = `CCREQ-000${reqNum}`;
    const txnId = `SSE-CC-000${reqNum}`;
    const rawDigits = cardNumber.replace(/\D/g, '');
    const cardLast4 = rawDigits.slice(-4) || '4582';
    const maskedCard = `XXXX XXXX XXXX ${cardLast4}`;

    // Step 3: Wallet Amount Hold (Reserve)
    const newReserved = (currentUser.reservedBalance || 0) + totalRequired;
    const availableAfter = currentUser.walletBalance - newReserved;

    const updatedAgent: User = {
      ...currentUser,
      reservedBalance: newReserved,
    };
    setCurrentUser(updatedAgent);
    setAgents((prev) => prev.map((a) => (a.agentId === currentUser.agentId ? updatedAgent : a)));

    // Create wallet ledger hold entry
    const ledgerEntry: WalletTransaction = {
      id: `WLT-HOLD-${Date.now().toString().slice(-6)}`,
      agentId: currentUser.agentId,
      agentName: currentUser.name,
      type: 'Hold',
      amount: totalRequired,
      balance: currentUser.walletBalance,
      reference: reqId,
      note: `Credit Card Payment Hold - ${reqId} (${bankName} - ${customerName})`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'RESERVED',
      service: 'CREDIT_CARD',
    };
    setWalletLedger((prev) => [ledgerEntry, ...prev]);

    // Step 4: Create Request with REQUESTED status & timeline
    const newRequest: CreditCardRequest = {
      id: reqId,
      transactionId: txnId,
      agentId: currentUser.agentId,
      agentName: currentUser.name,
      bankName,
      customerName,
      customerMobile,
      cardNumber: maskedCard,
      cardLast4,
      amount,
      processingFee,
      totalReserved: totalRequired,
      status: 'REQUESTED',
      createdAt: `${dateStr}, ${timeStr}`,
      updatedAt: `${dateStr}, ${timeStr}`,
      date: dateStr,
      time: timeStr,
      agentWalletBefore: currentUser.walletBalance,
      agentAvailableAfterHold: availableAfter,
      isWalletHeld: true,
      isWalletDebited: false,
      timeline: [
        {
          status: 'CREATED',
          title: 'Request Created',
          description: `Payment request initiated by Agent for ${bankName} card ending ${cardLast4}`,
          timestamp: `${dateStr} ${timeStr}`,
          actor: `Agent (${currentUser.name})`,
        },
        {
          status: 'RESERVED',
          title: 'Wallet Amount Reserved',
          description: `₹${totalRequired.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
          })} (Amount ₹${amount.toLocaleString('en-IN')} + Fee ₹${processingFee}) held from Available Balance`,
          timestamp: `${dateStr} ${timeStr}`,
          actor: 'System Escrow Service',
        },
      ],
    };

    setCcRequests((prev) => [newRequest, ...prev]);

    // Step 18: Admin Notification
    const adminNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'admin',
      title: 'New Credit Card Payment Request',
      message: `Agent: ${currentUser.name} (${currentUser.agentId}) | Bank: ${bankName} | Amount: ₹${amount.toLocaleString(
        'en-IN'
      )} | Request ID: ${reqId}`,
      type: 'INFO',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
      link: '/admin/cc-requests',
    };
    setNotifications((prev) => [adminNotification, ...prev]);

    return { success: true, request: newRequest };
  };

  const adminStartProcessingCCRequest = (requestId: string, adminRemarks?: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setCcRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const newTimeline = [
          ...req.timeline,
          {
            status: 'PROCESSING' as CCRequestStatus,
            title: 'Admin Started Processing',
            description: adminRemarks || 'Admin opened transaction with authorized payment provider',
            timestamp: `${dateStr} ${timeStr}`,
            actor: 'Super Admin (Nirmal Patel)',
          },
        ];
        return {
          ...req,
          status: 'PROCESSING',
          updatedAt: `${dateStr}, ${timeStr}`,
          adminRemarks: adminRemarks || req.adminRemarks,
          timeline: newTimeline,
        };
      })
    );

    const targetReq = ccRequests.find((r) => r.id === requestId);
    if (targetReq) {
      const agentNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: targetReq.agentId,
        title: 'Credit Card Request Processing',
        message: `Admin has started processing your ${targetReq.bankName} payment request ${requestId} for ₹${targetReq.amount.toLocaleString(
          'en-IN'
        )}.`,
        type: 'INFO',
        read: false,
        timestamp: `${dateStr}, ${timeStr}`,
        link: '/agent/credit-card-history',
      };
      setNotifications((prev) => [agentNotification, ...prev]);
    }
  };

  const adminMarkPaymentDoneCCRequest = (
    requestId: string,
    params: {
      provider: string;
      paymentRefNumber: string;
      amountPaid: number;
      paymentProofUrl?: string;
      adminRemarks?: string;
    }
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setCcRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const newTimeline = [
          ...req.timeline,
          {
            status: 'PAYMENT DONE' as CCRequestStatus,
            title: 'Payment Done',
            description: `Ref: ${params.paymentRefNumber} executed via ${params.provider}`,
            timestamp: `${dateStr} ${timeStr}`,
            actor: 'Super Admin (Nirmal Patel)',
          },
        ];
        return {
          ...req,
          status: 'PAYMENT DONE',
          updatedAt: `${dateStr}, ${timeStr}`,
          paymentDate: dateStr,
          paymentTime: timeStr,
          provider: params.provider,
          paymentRefNumber: params.paymentRefNumber,
          utr: params.paymentRefNumber,
          amountPaid: params.amountPaid,
          adminRemarks: params.adminRemarks,
          paymentProofUrl: params.paymentProofUrl,
          timeline: newTimeline,
        };
      })
    );

    const targetReq = ccRequests.find((r) => r.id === requestId);
    if (targetReq) {
      const agentNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: targetReq.agentId,
        title: 'Payment Done by Admin',
        message: `Actual credit card payment has been performed for request ${requestId} via ${params.provider}. Payment reference: ${params.paymentRefNumber}. Awaiting final authorization.`,
        type: 'INFO',
        read: false,
        timestamp: `${dateStr}, ${timeStr}`,
        link: '/agent/credit-card-history',
      };
      setNotifications((prev) => [agentNotification, ...prev]);
    }
  };

  const adminApproveCCRequest = (requestId: string, adminRemarks?: string) => {
    const targetReq = ccRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const commissionAmount = 15.0; // Agent commission for successful card settlement

    // Finalize wallet deduction: deducts permanently from wallet & releases hold
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.agentId === targetReq.agentId) {
          const newWallet = Math.round((agent.walletBalance - targetReq.totalReserved + commissionAmount) * 100) / 100;
          const newReserved = Math.max(0, (agent.reservedBalance || 0) - targetReq.totalReserved);
          return {
            ...agent,
            walletBalance: newWallet,
            reservedBalance: newReserved,
          };
        }
        return agent;
      })
    );

    setCurrentUser((prev) => {
      if (prev && prev.agentId === targetReq.agentId) {
        const newWallet = Math.round((prev.walletBalance - targetReq.totalReserved + commissionAmount) * 100) / 100;
        const newReserved = Math.max(0, (prev.reservedBalance || 0) - targetReq.totalReserved);
        return {
          ...prev,
          walletBalance: newWallet,
          reservedBalance: newReserved,
        };
      }
      return prev;
    });

    // Wallet ledger entries
    const debitLedger: WalletTransaction = {
      id: `WLT-DEBIT-${Date.now().toString().slice(-6)}`,
      agentId: targetReq.agentId,
      agentName: targetReq.agentName,
      type: 'Debit',
      amount: targetReq.totalReserved,
      balance: targetReq.agentWalletBefore - targetReq.totalReserved,
      reference: targetReq.id,
      note: `Credit Card Payment - ${targetReq.id} (${targetReq.bankName} - ${targetReq.customerName})`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'DEBITED',
      service: 'CREDIT_CARD',
    };

    const commLedger: WalletTransaction = {
      id: `WLT-COMM-${Date.now().toString().slice(-6)}`,
      agentId: targetReq.agentId,
      agentName: targetReq.agentName,
      type: 'Credit',
      amount: commissionAmount,
      balance: targetReq.agentWalletBefore - targetReq.totalReserved + commissionAmount,
      reference: targetReq.id,
      note: `Commission Credited - Credit Card Payment ${targetReq.id}`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'SUCCESS',
      service: 'CREDIT_CARD',
    };

    setWalletLedger((prev) => [commLedger, debitLedger, ...prev]);

    // Record official transaction for dashboard and reports
    const officialTxn: Transaction = {
      id: targetReq.transactionId,
      referenceId: targetReq.id,
      utr: targetReq.paymentRefNumber || `UTR-${Date.now()}`,
      agentId: targetReq.agentId,
      agentName: targetReq.agentName,
      service: 'CREDIT_CARD',
      categoryName: 'Credit Card Bill',
      billerName: targetReq.bankName,
      customerName: targetReq.customerName,
      customerMobile: targetReq.customerMobile,
      customerIdentifier: targetReq.cardNumber,
      billAmount: targetReq.amount,
      serviceCharge: targetReq.processingFee,
      commission: commissionAmount,
      totalDeducted: targetReq.totalReserved,
      status: 'SUCCESS',
      date: dateStr,
      time: timeStr,
      metadata: {
        paymentRefNumber: targetReq.paymentRefNumber,
        provider: targetReq.provider,
        approvedBy: 'Super Admin (Nirmal Patel)',
      },
    };
    setTransactions((prev) => [officialTxn, ...prev]);

    // Update request state
    setCcRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const newTimeline = [
          ...req.timeline,
          {
            status: 'APPROVED' as CCRequestStatus,
            title: 'Payment Approved',
            description: `Payment confirmed and approved by Super Admin. Official receipt generated. Ref: ${req.paymentRefNumber || 'Authorized'}`,
            timestamp: `${dateStr} ${timeStr}`,
            actor: 'Super Admin (Nirmal Patel)',
          },
        ];
        return {
          ...req,
          status: 'APPROVED',
          isWalletHeld: false,
          isWalletDebited: true,
          approvedAt: `${dateStr}, ${timeStr}`,
          approvedBy: 'Super Admin (Nirmal Patel)',
          updatedAt: `${dateStr}, ${timeStr}`,
          adminRemarks: adminRemarks || req.adminRemarks,
          timeline: newTimeline,
        };
      })
    );

    // Step 11: Agent Approval Indicator Notification
    const approvalNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetReq.agentId,
      title: 'Payment Approved',
      message: `Your ${targetReq.bankName} credit card payment request ${targetReq.id} for ₹${targetReq.amount.toLocaleString(
        'en-IN'
      )} has been approved.`,
      type: 'SUCCESS',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
      link: '/agent/credit-card-history',
    };
    setNotifications((prev) => [approvalNotification, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: 'SSE-ADM-001',
      adminName: 'Nirmal Patel (Super Admin)',
      action: 'APPROVE_CC_PAYMENT',
      entity: 'CREDIT_CARD_REQUEST',
      referenceId: targetReq.id,
      details: `Approved credit card payment request ${targetReq.id} for ${targetReq.bankName} (₹${targetReq.amount}). Wallet debited ₹${targetReq.totalReserved}.`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const adminMarkFailedCCRequest = (requestId: string, failureReason: string) => {
    const targetReq = ccRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Step 15: Release reserved wallet amount
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.agentId === targetReq.agentId) {
          const newReserved = Math.max(0, (agent.reservedBalance || 0) - targetReq.totalReserved);
          return {
            ...agent,
            reservedBalance: newReserved,
          };
        }
        return agent;
      })
    );

    setCurrentUser((prev) => {
      if (prev && prev.agentId === targetReq.agentId) {
        const newReserved = Math.max(0, (prev.reservedBalance || 0) - targetReq.totalReserved);
        return {
          ...prev,
          reservedBalance: newReserved,
        };
      }
      return prev;
    });

    // Ledger entry for release
    const releaseLedger: WalletTransaction = {
      id: `WLT-REL-${Date.now().toString().slice(-6)}`,
      agentId: targetReq.agentId,
      agentName: targetReq.agentName,
      type: 'Release',
      amount: targetReq.totalReserved,
      balance: targetReq.agentWalletBefore,
      reference: targetReq.id,
      note: `Refund - Failed Credit Card Payment Request ${targetReq.id} (${failureReason})`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'CREDITED',
      service: 'CREDIT_CARD',
    };
    setWalletLedger((prev) => [releaseLedger, ...prev]);

    // Update request
    setCcRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const newTimeline = [
          ...req.timeline,
          {
            status: 'FAILED' as CCRequestStatus,
            title: 'Payment Failed & Reserved Amount Released',
            description: `Payment Failed: ${failureReason}. Reserved escrow of ₹${req.totalReserved.toLocaleString(
              'en-IN'
            )} released back to wallet.`,
            timestamp: `${dateStr} ${timeStr}`,
            actor: 'Super Admin (Nirmal Patel)',
          },
        ];
        return {
          ...req,
          status: 'FAILED',
          isWalletHeld: false,
          failureReason,
          failedAt: `${dateStr}, ${timeStr}`,
          updatedAt: `${dateStr}, ${timeStr}`,
          timeline: newTimeline,
        };
      })
    );

    // Notify Agent
    const failedNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetReq.agentId,
      title: 'Payment Request Failed',
      message: `Your ${targetReq.bankName} credit card payment request for ₹${targetReq.amount.toLocaleString(
        'en-IN'
      )} has failed. The reserved wallet amount has been released.`,
      type: 'ALERT',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
      link: '/agent/credit-card-history',
    };
    setNotifications((prev) => [failedNotification, ...prev]);

    // Audit
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: 'SSE-ADM-001',
      adminName: 'Nirmal Patel (Super Admin)',
      action: 'FAILED_CC_PAYMENT',
      entity: 'CREDIT_CARD_REQUEST',
      referenceId: targetReq.id,
      details: `Marked CC request ${targetReq.id} as failed: ${failureReason}. Escrow ₹${targetReq.totalReserved} released.`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const adminRejectCCRequest = (requestId: string, rejectionReason: string) => {
    adminMarkFailedCCRequest(requestId, `Request Rejected: ${rejectionReason}`);
    setCcRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'REJECTED' as CCRequestStatus, rejectionReason } : req))
    );
  };

  const adminRefundCCRequest = (requestId: string, refundReason: string, refundRef: string) => {
    const targetReq = ccRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Credit refund to wallet
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.agentId === targetReq.agentId) {
          return {
            ...agent,
            walletBalance: agent.walletBalance + targetReq.totalReserved,
          };
        }
        return agent;
      })
    );

    setCurrentUser((prev) => {
      if (prev && prev.agentId === targetReq.agentId) {
        return {
          ...prev,
          walletBalance: prev.walletBalance + targetReq.totalReserved,
        };
      }
      return prev;
    });

    const refundLedger: WalletTransaction = {
      id: `WLT-REFUND-${Date.now().toString().slice(-6)}`,
      agentId: targetReq.agentId,
      agentName: targetReq.agentName,
      type: 'Credit',
      amount: targetReq.totalReserved,
      balance: (currentUser?.walletBalance || 0) + targetReq.totalReserved,
      reference: targetReq.id,
      note: `Refund - Credit Card Payment ${targetReq.id} (Ref: ${refundRef}, Reason: ${refundReason})`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'CREDITED',
      service: 'CREDIT_CARD',
    };
    setWalletLedger((prev) => [refundLedger, ...prev]);

    setCcRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const newTimeline = [
          ...req.timeline,
          {
            status: 'REFUNDED' as CCRequestStatus,
            title: 'Payment Refunded to Wallet',
            description: `Refund processed: ${refundReason} (Ref: ${refundRef}). ₹${req.totalReserved.toLocaleString(
              'en-IN'
            )} credited back to Agent wallet.`,
            timestamp: `${dateStr} ${timeStr}`,
            actor: 'Super Admin (Nirmal Patel)',
          },
        ];
        return {
          ...req,
          status: 'REFUNDED',
          refundReason,
          refundRef,
          refundedAt: `${dateStr}, ${timeStr}`,
          timeline: newTimeline,
        };
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetReq.agentId,
      title: 'Payment Refunded',
      message: `Your credit card payment request ${targetReq.id} has been refunded. ₹${targetReq.totalReserved.toLocaleString(
        'en-IN'
      )} has been credited back to your wallet.`,
      type: 'INFO',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
      link: '/agent/credit-card-history',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Dynamic Live QR Management methods
  const setLiveQRCode = (qrId: string) => {
    const target = qrCodes.find((q) => q.id === qrId);
    if (!target) return;

    setQrCodes((prev) =>
      prev.map((q) => ({
        ...q,
        isLive: q.id === qrId,
      }))
    );

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'SET_LIVE_QR',
      entity: 'QR_CONFIG',
      referenceId: qrId,
      details: `Switched live collection QR to "${target.name}" (UPI: ${target.upiId})`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Admin & Agent Notifications
    const notifAdmin: AppNotification = {
      id: `notif-${Date.now()}-adm`,
      userId: 'admin',
      title: 'Live QR Changed',
      message: `Active Live QR set to "${target.name}". All new agent wallet recharges will be recorded under this QR.`,
      type: 'SUCCESS',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
    };
    const notifAgent: AppNotification = {
      id: `notif-${Date.now()}-ag`,
      userId: currentUser?.agentId || 'SSE-AG-88219',
      title: 'Collection QR Updated',
      message: `Admin has updated the official collection QR to "${target.name}". Please scan the new QR on your recharge page.`,
      type: 'INFO',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
    };
    setNotifications((prev) => [notifAdmin, notifAgent, ...prev]);
  };

  const createQRCode = (
    data: Omit<QRCodeConfig, 'id' | 'totalCollected' | 'activeRequestsCount' | 'createdAt'>
  ): QRCodeConfig => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const newQR: QRCodeConfig = {
      ...data,
      id: `QR-${Date.now().toString().slice(-6)}`,
      totalCollected: 0,
      activeRequestsCount: 0,
      createdAt: `${dateStr} ${timeStr}`,
    };

    setQrCodes((prev) => {
      if (newQR.isLive) {
        return [newQR, ...prev.map((q) => ({ ...q, isLive: false }))];
      }
      return [...prev, newQR];
    });

    return newQR;
  };

  const updateQRCode = (qrId: string, updates: Partial<QRCodeConfig>) => {
    setQrCodes((prev) =>
      prev.map((q) => {
        if (q.id === qrId) {
          return { ...q, ...updates };
        }
        if (updates.isLive && q.id !== qrId) {
          return { ...q, isLive: false };
        }
        return q;
      })
    );
  };

  const deleteQRCode = (qrId: string) => {
    setQrCodes((prev) => prev.filter((q) => q.id !== qrId));
  };

  // Fund requests
  const submitFundRequest = ({
    amount,
    paymentMode,
    utrNumber,
    cardLast4,
    remarks,
    proofImageUrl,
    ocrExtractedText,
    qrId,
    qrName,
    qrUpiId,
    qrBankName,
  }: {
    amount: number;
    paymentMode: 'UPI' | 'NEFT/RTGS' | 'IMPS' | 'CASH_DEPOSIT';
    utrNumber: string;
    cardLast4?: string;
    remarks: string;
    proofImageUrl?: string;
    ocrExtractedText?: string;
    qrId?: string;
    qrName?: string;
    qrUpiId?: string;
    qrBankName?: string;
  }) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    // Attach currently live QR if not explicitly provided
    const resolvedQRId = qrId || activeLiveQR.id;
    const resolvedQRName = qrName || activeLiveQR.name;
    const resolvedQRUpi = qrUpiId || activeLiveQR.upiId;
    const resolvedQRBank = qrBankName || activeLiveQR.bankName;

    const newReq: FundRequest = {
      id: `FR-${Math.floor(100000 + Math.random() * 900000)}`,
      agentId: currentUser?.agentId || 'SSE-AG-88219',
      agentName: currentUser?.name || 'Agent',
      amount,
      paymentMode,
      utrNumber,
      cardLast4,
      proofImageUrl,
      ocrExtractedText,
      remarks,
      requestDate: `${dateStr}, ${timeStr}`,
      status: 'PENDING',
      qrId: resolvedQRId,
      qrName: resolvedQRName,
      qrUpiId: resolvedQRUpi,
      qrBankName: resolvedQRBank,
    };

    setFundRequests((prev) => [newReq, ...prev]);

    // Increment active requests count for the corresponding QR
    setQrCodes((prev) =>
      prev.map((q) =>
        q.id === resolvedQRId ? { ...q, activeRequestsCount: q.activeRequestsCount + 1 } : q
      )
    );

    // Add notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'usr-agent-01',
      title: 'Fund Request Submitted',
      message: `Request ${newReq.id} for ₹${amount.toLocaleString(
        'en-IN'
      )} via ${resolvedQRName} submitted and under admin review.`,
      type: 'INFO',
      read: false,
      timestamp: `${dateStr}, ${timeStr}`,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newReq;
  };

  const adminApproveFundRequest = (id: string, adminRemarks: string = 'Approved by Super Admin after bank verification') => {
    const req = fundRequests.find((r) => r.id === id);
    if (!req) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    // Find agent
    const targetAgent = agents.find((a) => a.agentId === req.agentId) || INITIAL_AGENT;
    const newBalance = Math.round((targetAgent.walletBalance + req.amount) * 100) / 100;

    const updatedAgent: User = {
      ...targetAgent,
      walletBalance: newBalance,
    };

    setAgents((prev) => prev.map((a) => (a.agentId === req.agentId ? updatedAgent : a)));
    if (currentUser?.agentId === req.agentId) {
      setCurrentUser(updatedAgent);
    }

    // Update fund request
    setFundRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              reviewedBy: currentUser?.name || 'Super Admin',
              reviewedDate: `${dateStr}, ${timeStr}`,
              adminRemarks,
            }
          : r
      )
    );

    // Update QR metrics: increase totalCollected and decrement activeRequestsCount
    if (req.qrId) {
      setQrCodes((prev) =>
        prev.map((q) =>
          q.id === req.qrId
            ? {
                ...q,
                totalCollected: q.totalCollected + req.amount,
                activeRequestsCount: Math.max(0, q.activeRequestsCount - 1),
              }
            : q
        )
      );
    }

    // Add ledger credit with exact QR Account Name recorded in note
    const qrLabel = req.qrName ? ` via ${req.qrName}` : '';
    const ledgerEntry: WalletTransaction = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      agentId: req.agentId,
      agentName: req.agentName,
      type: 'Credit',
      amount: req.amount,
      balance: newBalance,
      reference: 'recharge',
      note: `Fund Request ${req.id} approved${qrLabel} (${req.paymentMode}, UTR: ${req.utrNumber})`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'SUCCESS',
    };
    setWalletLedger((prev) => [ledgerEntry, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'FUND_APPROVAL',
      entity: 'FUND_REQUEST',
      referenceId: req.id,
      details: `Approved ₹${req.amount.toFixed(2)} for ${req.agentName} (${req.agentId}) on ${req.qrName || 'Collection QR'}`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const adminRejectFundRequest = (id: string, adminRemarks: string = 'Rejected: UTR not found in bank statement') => {
    const req = fundRequests.find((r) => r.id === id);
    if (!req) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    setFundRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              reviewedBy: currentUser?.name || 'Super Admin',
              reviewedDate: `${dateStr}, ${timeStr}`,
              adminRemarks,
            }
          : r
      )
    );

    // Decrement activeRequestsCount for this QR
    if (req.qrId) {
      setQrCodes((prev) =>
        prev.map((q) =>
          q.id === req.qrId ? { ...q, activeRequestsCount: Math.max(0, q.activeRequestsCount - 1) } : q
        )
      );
    }
  };

  const adminAdjustWallet = (agentId: string, amount: number, type: 'Credit' | 'Debit' | 'Adjustment', note: string) => {
    const targetAgent = agents.find((a) => a.agentId === agentId);
    if (!targetAgent) return;

    let newBalance = targetAgent.walletBalance;
    if (type === 'Credit') newBalance += amount;
    else if (type === 'Debit') newBalance -= amount;

    newBalance = Math.round(newBalance * 100) / 100;

    const updatedAgent: User = {
      ...targetAgent,
      walletBalance: Math.max(0, newBalance),
    };

    setAgents((prev) => prev.map((a) => (a.agentId === agentId ? updatedAgent : a)));
    if (currentUser?.agentId === agentId) {
      setCurrentUser(updatedAgent);
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    // Ledger
    const ledgerEntry: WalletTransaction = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      agentId: targetAgent.agentId,
      agentName: targetAgent.name,
      type,
      amount,
      balance: newBalance,
      reference: 'admin_adjustment',
      note: `Admin Manual Adjustment: ${note}`,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'SUCCESS',
    };
    setWalletLedger((prev) => [ledgerEntry, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'WALLET_ADJUSTMENT',
      entity: 'AGENT_WALLET',
      referenceId: agentId,
      details: `${type} ₹${amount.toFixed(2)} - ${note}`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const submitSettlement = ({
    amount,
    bankName,
    accountNumber,
    ifsc,
    accountHolder,
    mode,
  }: {
    amount: number;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    accountHolder: string;
    mode: 'IMPS' | 'NEFT';
  }) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const newReq: SettlementRequest = {
      id: `SETTL-${Math.floor(1000 + Math.random() * 9000)}`,
      agentId: currentUser?.agentId || 'SSE-AG-88219',
      agentName: currentUser?.name || 'Agent',
      amount,
      bankName,
      accountNumber,
      ifsc,
      accountHolder,
      mode,
      status: 'PROCESSING',
      requestDate: `${dateStr}, ${timeStr}`,
    };

    setSettlements((prev) => [newReq, ...prev]);
    return newReq;
  };

  const adminUpdateSettlement = (id: string, status: 'PROCESSING' | 'COMPLETED' | 'REJECTED', utr?: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status,
              utr: utr || (status === 'COMPLETED' ? `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}` : s.utr),
              completionDate: status === 'COMPLETED' ? `${dateStr}, ${timeStr}` : s.completionDate,
            }
          : s
      )
    );
  };

  const createSupportTicket = ({
    subject,
    category,
    transactionId,
    description,
    priority,
  }: {
    subject: string;
    category: SupportTicket['category'];
    transactionId?: string;
    description: string;
    priority: SupportTicket['priority'];
  }) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const newTicket: SupportTicket = {
      id: `TCK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(tickets.length + 1).padStart(3, '0')}`,
      agentId: currentUser?.agentId || 'SSE-AG-88219',
      agentName: currentUser?.name || 'Agent',
      subject,
      category,
      transactionId,
      description,
      priority,
      status: 'OPEN',
      createdAt: `${dateStr}, ${timeStr}`,
      updatedAt: `${dateStr}, ${timeStr}`,
      replies: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: `${dateStr}, ${timeStr}`,
              replies: [
                ...t.replies,
                {
                  sender: currentUser?.name || 'User',
                  role: currentUser?.role || 'agent',
                  message,
                  timestamp: `${dateStr}, ${timeStr}`,
                },
              ],
            }
          : t
      )
    );
  };

  const createAgent = (agentData: Partial<User>) => {
    const nextIdNum = 88220 + agents.length;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const assignedAgentId = agentData.agentId?.trim() || `SSE-AG-${nextIdNum}`;
    const assignedPassword = agentData.password?.trim() || `Shyam@${Math.floor(1000 + Math.random() * 9000)}`;
    const assignedPin = agentData.pin?.trim() || Math.floor(100000 + Math.random() * 900000).toString();

    const newAgent: User = {
      id: `usr-agent-${Date.now()}`,
      name: agentData.name || 'New Agent',
      email: agentData.email || `agent${nextIdNum}@shreeshyam.com`,
      mobile: agentData.mobile || '9999999999',
      role: 'agent',
      businessName: agentData.businessName || 'Shyam Digital Seva',
      storeType: agentData.storeType || 'Retail & Multi-Recharge Store',
      address: agentData.address || 'Nikol, Ahmedabad',
      city: agentData.city || 'Ahmedabad',
      state: agentData.state || 'Gujarat',
      pincode: agentData.pincode || '382350',
      agentId: assignedAgentId,
      password: assignedPassword,
      pin: assignedPin,
      walletBalance: agentData.walletBalance ?? 0.0,
      reservedBalance: 0.0,
      t1WalletBalance: 0.0,
      dailyLimit: agentData.dailyLimit || 500000,
      commissionPlan: agentData.commissionPlan || 'Silver Master Plan',
      commissionSettings: agentData.commissionSettings || {
        enabled: true,
        planName: agentData.commissionPlan || 'Silver Master Plan',
        adminBillMarkupType: 'FLAT',
        adminBillMarkupValue: 10.00,
        agentBillCommissionType: 'FLAT',
        agentBillCommissionValue: 3.50,
        ccProcessingFee: 50.00,
        ccAgentCommission: 15.00,
        dmtAdminFeePercent: 0.45,
        dmtAgentCommissionPercent: 0.20,
        rechargeAgentCommissionPercent: 2.00,
      },
      kycStatus: agentData.kycStatus || 'VERIFIED',
      kycDocuments: agentData.kycDocuments || [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      panNumber: agentData.panNumber,
      aadhaarNumber: agentData.aadhaarNumber,
      initialCredentials: {
        tempPassword: assignedPassword,
        tempMpin: assignedPin,
        generatedAt: `${dateStr} ${timeStr}`,
      },
      bankAccount: agentData.bankAccount,
    };

    setAgents((prev) => [newAgent, ...prev]);

    // Create Audit Log for agent onboarding
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'AGENT_ONBOARDED',
      entity: 'AGENT_ACCOUNT',
      referenceId: newAgent.agentId,
      details: `Onboarded agent ${newAgent.name} (ID: ${newAgent.agentId}) with starting balance ₹${newAgent.walletBalance.toFixed(2)}, plan '${newAgent.commissionPlan}', Admin Markup: Flat ₹${newAgent.commissionSettings?.adminBillMarkupValue || 10.00}`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newAgent;
  };

  const updateAgentCredentials = (
    agentId: string,
    updates: {
      agentId?: string;
      password?: string;
      pin?: string;
      name?: string;
      mobile?: string;
      email?: string;
    }
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    // Check if updating Admin account
    const cleanTargetId = (agentId || '').toLowerCase();
    const isAdminTarget =
      cleanTargetId === 'mepl-adm-001' ||
      cleanTargetId === 'sse-adm-001' ||
      cleanTargetId === 'admin' ||
      cleanTargetId === (adminAccount.agentId || '').toLowerCase() ||
      cleanTargetId === (adminAccount.email || '').toLowerCase() ||
      cleanTargetId === adminAccount.mobile ||
      (currentUser?.role === 'admin' && cleanTargetId === (currentUser.agentId || '').toLowerCase());

    if (isAdminTarget) {
      setAdminAccount((prev) => {
        const updatedAdmin = { ...prev, ...updates };
        if (currentUser?.role === 'admin') {
          setCurrentUser(updatedAdmin);
          localStorage.setItem('sse_current_user', JSON.stringify(updatedAdmin));
        }
        localStorage.setItem('sse_admin_account', JSON.stringify(updatedAdmin));
        return updatedAdmin;
      });
    }

    setAgents((prev) =>
      prev.map((a) => {
        const aId = (a.agentId || '').toLowerCase();
        const aNorm = aId.replace(/^sse-/, 'mepl-');
        const targetNorm = cleanTargetId.replace(/^sse-/, 'mepl-');

        if (
          aId === cleanTargetId ||
          aNorm === targetNorm ||
          (a.email || '').toLowerCase() === cleanTargetId ||
          a.mobile === agentId
        ) {
          const updated: User = {
            ...a,
            ...updates,
            initialCredentials: {
              ...a.initialCredentials,
              tempPassword: updates.password || a.password,
              tempMpin: updates.pin || a.pin,
              generatedAt: `${dateStr} ${timeStr}`,
            },
          };
          if (currentUser?.agentId === a.agentId || currentUser?.id === a.id) {
            setCurrentUser(updated);
            localStorage.setItem('sse_current_user', JSON.stringify(updated));
          }
          return updated;
        }
        return a;
      })
    );

    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'UPDATE_AGENT_CREDENTIALS',
      entity: 'AGENT_ACCOUNT',
      referenceId: updates.agentId || agentId,
      details: `Updated ID / Password credentials for agent ${agentId}`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const updateAgentCommission = (agentId: string, settings: AgentCustomCommission) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    setAgents((prev) =>
      prev.map((a) => {
        if (a.agentId === agentId) {
          const updated: User = {
            ...a,
            commissionSettings: settings,
            commissionPlan: settings.planName || a.commissionPlan,
          };
          if (currentUser?.agentId === agentId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return a;
      })
    );

    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'AGENT_COMMISSION_UPDATE',
      entity: 'COMMISSION_RULE',
      referenceId: agentId,
      details: `Configured custom commission on agent ${agentId}: Admin Markup ${settings.adminBillMarkupType === 'FLAT' ? `Flat ₹${settings.adminBillMarkupValue}` : `${settings.adminBillMarkupValue}%`}, Agent Commission ${settings.agentBillCommissionType === 'FLAT' ? `Flat ₹${settings.agentBillCommissionValue}` : `${settings.agentBillCommissionValue}%`}`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const resetAllBalancesAndEntriesToZero = () => {
    const zeroedAgents = agents.map((a) => ({
      ...a,
      walletBalance: 0.0,
      reservedBalance: 0.0,
      t1WalletBalance: 0.0,
    }));
    setAgents(zeroedAgents);

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        walletBalance: 0.0,
        reservedBalance: 0.0,
        t1WalletBalance: 0.0,
      });
    }

    setTransactions([]);
    setWalletLedger([]);
    setFundRequests([]);
    setSettlements([]);
    setCcRequests([]);
    setActiveReceiptTxn(null);
    setActiveCCReceiptRequest(null);

    localStorage.setItem('sse_agents', JSON.stringify(zeroedAgents));
    localStorage.setItem('sse_transactions', JSON.stringify([]));
    localStorage.setItem('sse_ledger', JSON.stringify([]));
    localStorage.setItem('sse_fund_requests', JSON.stringify([]));
    localStorage.setItem('sse_settlements', JSON.stringify([]));
    localStorage.setItem('sse_cc_requests', JSON.stringify([]));
    localStorage.setItem('sse_zeroed_v3', 'true');

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: 'SSE-ADM-001',
      adminName: 'Super Admin (Nirmal Patel)',
      action: 'ZERO_RESET_PRODUCTION',
      entity: 'WALLET_LEDGER',
      referenceId: 'ALL-SYSTEM',
      details: 'All agent balances set to ₹0.00 and dummy entries/transactions cleared for live production.',
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const updateAgentStatus = (agentId: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    setAgents((prev) => prev.map((a) => (a.agentId === agentId ? { ...a, status } : a)));
  };

  const updateAgentKycDocument = (
    agentId: string,
    docId: string,
    status: 'VERIFIED' | 'REJECTED' | 'UPLOADED',
    remarks?: string
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.agentId !== agentId) return agent;

        const updatedDocs = (agent.kycDocuments || []).map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              status,
              verifiedAt: status === 'VERIFIED' ? `${dateStr}, ${timeStr}` : undefined,
              verifiedBy: status === 'VERIFIED' ? (currentUser?.name || 'Super Admin') : undefined,
              remarks: remarks || doc.remarks,
            };
          }
          return doc;
        });

        // If all documents are verified, auto-mark agent overall KYC as VERIFIED
        const allVerified = updatedDocs.length > 0 && updatedDocs.every((d) => d.status === 'VERIFIED');
        const anyRejected = updatedDocs.some((d) => d.status === 'REJECTED');

        const overallKyc = allVerified ? 'VERIFIED' : anyRejected ? 'REJECTED' : 'PENDING';

        return {
          ...agent,
          kycDocuments: updatedDocs,
          kycStatus: overallKyc,
        };
      })
    );

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      adminId: currentUser?.agentId || 'SSE-ADM-001',
      adminName: currentUser?.name || 'Super Admin',
      action: 'KYC_DOCUMENT_UPDATE',
      entity: 'AGENT_DOCUMENT',
      referenceId: `${agentId}/${docId}`,
      details: `Document ${docId} set to ${status}. Notes: ${remarks || 'None'}`,
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const updateAgentKycOverall = (agentId: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED') => {
    setAgents((prev) => prev.map((a) => (a.agentId === agentId ? { ...a, kycStatus: status } : a)));
  };

  const updateCommissionRule = (ruleId: string, updates: Partial<CommissionRule>) => {
    setCommissionRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
  };

  const getBillPaymentFee = (agent?: User): number => {
    const targetAgent = agent || (currentUser?.role === 'agent' ? currentUser : undefined);
    if (targetAgent?.commissionSettings?.enabled) {
      return targetAgent.commissionSettings.adminBillMarkupValue;
    }
    const bbpsRule = commissionRules.find((r) => r.service === 'BBPS' && r.status === 'ACTIVE');
    if (!bbpsRule) return 10.0;
    if (bbpsRule.platformFeeFixed !== undefined) return bbpsRule.platformFeeFixed;
    if (bbpsRule.platformFeeType === 'FLAT' || (bbpsRule.fixedFee > 0 && bbpsRule.platformCommissionPercent === 0)) {
      return bbpsRule.fixedFee;
    }
    return 10.0;
  };

  const billPaymentFee = getBillPaymentFee();

  const setBillPaymentFee = (fee: number, feeType: 'FLAT' | 'PERCENT' = 'FLAT') => {
    setCommissionRules((prev) =>
      prev.map((r) => {
        if (r.service === 'BBPS') {
          return {
            ...r,
            fixedFee: feeType === 'FLAT' ? fee : 0,
            platformFeeFixed: feeType === 'FLAT' ? fee : 0,
            platformCommissionPercent: feeType === 'PERCENT' ? fee : 0,
            platformFeeType: feeType,
          };
        }
        return r;
      })
    );

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const newAuditLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      action: 'UPDATE_COMMISSION_RULE',
      adminId: currentUser?.role === 'admin' ? currentUser.agentId : 'SSE-ADM-001',
      adminName: currentUser?.role === 'admin' ? currentUser.name : 'Super Admin (System)',
      entity: 'COMMISSION_RULE',
      referenceId: 'CR-01',
      ipAddress: '152.57.19.42',
      status: 'SUCCESS',
      timestamp: `${dateStr}, ${timeStr}`,
      details: `Updated Bill Payment platform fee to ${feeType === 'FLAT' ? `Flat ₹${fee.toFixed(2)}` : `${fee}%`}`,
    };
    setAuditLogs((prev) => [newAuditLog, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_AGENT);
    setRole('agent');
    setAgents(INITIAL_AGENTS_LIST);
    setTransactions(INITIAL_TRANSACTIONS);
    setWalletLedger(INITIAL_WALLET_LEDGER);
    setFundRequests(INITIAL_FUND_REQUESTS);
    setSettlements(INITIAL_SETTLEMENTS);
    setCommissionRules(INITIAL_COMMISSION_RULES);
    setTickets(INITIAL_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCcRequests(INITIAL_CC_REQUESTS);
    setActiveCCReceiptRequest(null);
    setQrCodes(INITIAL_QR_CODES);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        demoMode,
        agents,
        transactions,
        walletLedger,
        fundRequests,
        settlements,
        commissionRules,
        tickets,
        notifications,
        auditLogs,
        activeReceiptTxn,
        setActiveReceiptTxn,
        ccRequests,
        activeCCReceiptRequest,
        setActiveCCReceiptRequest,
        createCCRequest,
        adminStartProcessingCCRequest,
        adminMarkPaymentDoneCCRequest,
        adminApproveCCRequest,
        adminMarkFailedCCRequest,
        adminRejectCCRequest,
        adminRefundCCRequest,
        refreshCCRequests,
        qrCodes,
        activeLiveQR,
        setLiveQRCode,
        createQRCode,
        updateQRCode,
        deleteQRCode,
        setDemoMode,
        login,
        logout,
        switchRole,
        processPayment,
        submitFundRequest,
        adminApproveFundRequest,
        adminRejectFundRequest,
        adminAdjustWallet,
        submitSettlement,
        adminUpdateSettlement,
        createSupportTicket,
        replySupportTicket,
        createAgent,
        updateAgentStatus,
        updateAgentKycDocument,
        updateAgentKycOverall,
        updateAgentCredentials,
        updateAgentCommission,
        resetAllBalancesAndEntriesToZero,
        updateCommissionRule,
        billPaymentFee,
        getBillPaymentFee,
        setBillPaymentFee,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
