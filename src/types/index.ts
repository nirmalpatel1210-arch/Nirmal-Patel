export type UserRole = 'agent' | 'admin';

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REVERSED';

export type ServiceType =
  | 'BBPS'
  | 'CREDIT_CARD'
  | 'MONEY_TRANSFER'
  | 'MOBILE_RECHARGE'
  | 'DTH'
  | 'ELECTRICITY'
  | 'GAS'
  | 'WATER'
  | 'INSURANCE'
  | 'FASTAG';

export interface KYCDocument {
  id: string;
  type: 'PAN_CARD' | 'AADHAAR_FRONT' | 'AADHAAR_BACK' | 'SHOP_ESTABLISHMENT' | 'BANK_PASSBOOK';
  name: string;
  documentNumber?: string;
  fileUrl?: string;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  verifiedBy?: string;
  remarks?: string;
}

export interface AgentCustomCommission {
  enabled: boolean;
  planName: string;
  adminBillMarkupType: 'FLAT' | 'PERCENT';
  adminBillMarkupValue: number; // Admin commission/markup on agent (e.g. ₹10.00 flat)
  agentBillCommissionType: 'FLAT' | 'PERCENT';
  agentBillCommissionValue: number; // Commission paid to agent (e.g. ₹3.50 flat)
  ccProcessingFee: number; // e.g. ₹50.00
  ccAgentCommission: number; // e.g. ₹15.00
  dmtAdminFeePercent: number; // e.g. 0.45%
  dmtAgentCommissionPercent: number; // e.g. 0.20%
  rechargeAgentCommissionPercent: number; // e.g. 2.0%
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  businessName: string;
  storeType?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  agentId: string;
  walletBalance: number;
  reservedBalance?: number; // Held balance for pending CC requests
  t1WalletBalance: number;
  dailyLimit?: number;
  commissionPlan?: string;
  password?: string; // Agent portal login password
  pin?: string; // 6-digit transaction MPIN
  commissionSettings?: AgentCustomCommission; // Agent-specific commission and admin markup
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  kycDocuments?: KYCDocument[];
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  panNumber?: string;
  aadhaarNumber?: string;
  initialCredentials?: {
    tempPassword?: string;
    tempMpin?: string;
    generatedAt?: string;
  };
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolder: string;
    accountType?: string;
  };
}

export interface WalletTransaction {
  id: string;
  agentId: string;
  agentName: string;
  type: 'Credit' | 'Debit' | 'Adjustment' | 'Hold' | 'Release';
  amount: number;
  balance: number;
  reference: string;
  note: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'RESERVED' | 'DEBITED' | 'CREDITED' | 'REFUNDED';
  service?: ServiceType | string;
}

export type CCRequestStatus =
  | 'REQUESTED'
  | 'PROCESSING'
  | 'PAYMENT DONE'
  | 'APPROVED'
  | 'FAILED'
  | 'REJECTED'
  | 'REFUNDED';

export interface CCTimelineEvent {
  status: CCRequestStatus | 'CREATED' | 'RESERVED';
  title: string;
  description?: string;
  timestamp: string;
  actor: string;
}

export interface CreditCardRequest {
  id: string; // e.g. CCREQ-000125
  transactionId: string; // e.g. SSE-CC-000125
  agentId: string;
  agentName: string;
  bankName: string;
  customerName: string;
  customerMobile: string;
  cardNumber: string; // masked: "XXXX XXXX XXXX 4582"
  cardLast4: string; // "4582"
  amount: number;
  processingFee: number;
  totalReserved: number; // amount + processingFee
  status: CCRequestStatus;
  createdAt: string;
  updatedAt: string;
  date: string;
  time: string;

  // Wallet tracking
  agentWalletBefore: number;
  agentAvailableAfterHold: number;
  isWalletHeld: boolean;
  isWalletDebited: boolean;

  // Payment processing details entered by Admin
  paymentDate?: string;
  paymentTime?: string;
  provider?: string;
  paymentRefNumber?: string;
  utr?: string;
  amountPaid?: number;
  adminRemarks?: string;
  paymentProofUrl?: string;

  // Final confirmation
  approvedAt?: string;
  approvedBy?: string;
  failureReason?: string;
  failedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  refundReason?: string;
  refundRef?: string;
  refundedAt?: string;

  timeline: CCTimelineEvent[];
}

export interface Transaction {
  id: string;
  referenceId: string;
  bbpsRef?: string;
  utr?: string;
  agentId: string;
  agentName: string;
  service: ServiceType;
  categoryName?: string;
  billerName?: string;
  customerName: string;
  customerMobile: string;
  customerIdentifier?: string; // Consumer ID / Card last 4 / Account / Phone
  billAmount: number;
  serviceCharge: number;
  commission: number;
  totalDeducted: number;
  status: TransactionStatus;
  date: string;
  time: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface CommissionRule {
  id: string;
  service: ServiceType;
  slabMin: number;
  slabMax: number;
  mdrPercent: number;
  fixedFee: number;
  agentCommissionPercent: number;
  agentCommissionFixed: number;
  platformCommissionPercent: number;
  platformFeeType?: 'FLAT' | 'PERCENT';
  platformFeeFixed?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface QRCodeConfig {
  id: string; // e.g. "QR-HDFC-MAIN", "QR-ICICI-02"
  name: string; // e.g. "HDFC Current A/c (Main Collection)"
  upiId: string; // e.g. "shreeshyam@hdfcbank"
  bankName: string; // e.g. "HDFC Bank"
  accountNumber?: string;
  ifsc?: string;
  accountHolder: string; // "MANNAT ENTERPRISE PVT LTD"
  isLive: boolean; // True if currently active/live for agent wallet load
  qrImageUrl?: string; // Uploaded custom QR code image (Base64 data URL or remote URL)
  dailyLimit?: number;
  totalCollected: number;
  activeRequestsCount: number;
  notes?: string;
  createdAt: string;
}

export interface FundRequest {
  id: string;
  agentId: string;
  agentName: string;
  amount: number;
  paymentMode: 'UPI' | 'NEFT/RTGS' | 'IMPS' | 'CASH_DEPOSIT';
  utrNumber: string;
  cardLast4?: string;
  proofImageUrl?: string;
  ocrExtractedText?: string;
  remarks: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedDate?: string;
  adminRemarks?: string;

  // Dynamic QR Tracking (Requirement: Track and record by QR Name)
  qrId?: string;
  qrName?: string; // e.g. "HDFC Current Account (Main Collection)"
  qrUpiId?: string; // e.g. "shreeshyam@hdfcbank"
  qrBankName?: string;
}

export interface SettlementRequest {
  id: string;
  agentId: string;
  agentName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  mode: 'IMPS' | 'NEFT';
  status: 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  utr?: string;
  requestDate: string;
  completionDate?: string;
}

export interface SupportTicket {
  id: string;
  agentId: string;
  agentName: string;
  subject: string;
  category: 'TRANSACTION_ISSUE' | 'WALLET_ISSUE' | 'KYC' | 'TECHNICAL' | 'COMMISSION';
  transactionId?: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  replies: Array<{
    sender: string;
    role: UserRole;
    message: string;
    timestamp: string;
  }>;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  entity: string;
  referenceId: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE';
}
