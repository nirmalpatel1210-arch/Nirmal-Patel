-- ============================================================================
-- SHREE SHYAM ENTERPRISE - PAYMENT PORTAL DATABASE SCHEMA
-- PostgreSQL DDL Schema with Foreign Keys, Enums, Constraints and Indexes
-- ============================================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('agent', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE txn_status AS ENUM ('SUCCESS', 'PENDING', 'FAILED', 'REVERSED');
CREATE TYPE service_type AS ENUM (
  'BBPS', 'CREDIT_CARD', 'MONEY_TRANSFER', 'MOBILE_RECHARGE', 
  'DTH', 'ELECTRICITY', 'GAS', 'WATER', 'INSURANCE', 'FASTAG'
);
CREATE TYPE fund_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE settlement_status AS ENUM ('REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- 2. USERS & ROLES
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  mpin_hash VARCHAR(255),
  role user_role NOT NULL DEFAULT 'agent',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  business_name VARCHAR(200),
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AGENTS
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. SSE-AG-88219
  pan_number VARCHAR(10),
  aadhaar_masked VARCHAR(20),
  kyc_status kyc_status NOT NULL DEFAULT 'VERIFIED',
  kyc_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WALLETS & LEDGER
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  t1_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (t1_balance >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'Credit', 'Debit', 'Adjustment'
  amount NUMERIC(15, 2) NOT NULL,
  balance_after NUMERIC(15, 2) NOT NULL,
  reference VARCHAR(100) NOT NULL,
  note TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BILLERS & PROVIDERS
CREATE TABLE billers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  service service_type NOT NULL,
  state VARCHAR(50),
  param_label VARCHAR(100) NOT NULL,
  param_regex VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. TRANSACTIONS
CREATE TABLE transactions (
  id VARCHAR(50) PRIMARY KEY, -- e.g. TXN-20260928-0912
  reference_id VARCHAR(100) UNIQUE NOT NULL,
  bbps_ref VARCHAR(100),
  utr VARCHAR(100),
  agent_id VARCHAR(50) NOT NULL,
  service service_type NOT NULL,
  category_name VARCHAR(100),
  biller_id VARCHAR(50) REFERENCES billers(id),
  biller_name VARCHAR(150) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_mobile VARCHAR(15) NOT NULL,
  customer_identifier VARCHAR(100), -- Masked Card / Consumer Number / Account
  bill_amount NUMERIC(12, 2) NOT NULL,
  service_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  commission NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_deducted NUMERIC(12, 2) NOT NULL,
  status txn_status NOT NULL DEFAULT 'PENDING',
  failure_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. COMMISSION RULES
CREATE TABLE commission_rules (
  id VARCHAR(50) PRIMARY KEY,
  service service_type NOT NULL,
  slab_min NUMERIC(12, 2) NOT NULL,
  slab_max NUMERIC(12, 2) NOT NULL,
  mdr_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  fixed_fee NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  agent_commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  agent_commission_fixed NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  platform_commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 8. FUND REQUESTS
CREATE TABLE fund_requests (
  id VARCHAR(50) PRIMARY KEY,
  agent_id VARCHAR(50) NOT NULL,
  agent_name VARCHAR(150) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  payment_mode VARCHAR(20) NOT NULL,
  utr_number VARCHAR(100) NOT NULL,
  card_last4 VARCHAR(4),
  proof_image_url TEXT,
  ocr_extracted_text TEXT,
  remarks TEXT,
  status fund_request_status NOT NULL DEFAULT 'PENDING',
  reviewed_by VARCHAR(150),
  reviewed_at TIMESTAMPTZ,
  admin_remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SETTLEMENTS
CREATE TABLE settlements (
  id VARCHAR(50) PRIMARY KEY,
  agent_id VARCHAR(50) NOT NULL,
  agent_name VARCHAR(150) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  ifsc VARCHAR(20) NOT NULL,
  account_holder VARCHAR(150) NOT NULL,
  mode VARCHAR(10) NOT NULL DEFAULT 'IMPS',
  status settlement_status NOT NULL DEFAULT 'REQUESTED',
  utr VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 10. SUPPORT TICKETS
CREATE TABLE support_tickets (
  id VARCHAR(50) PRIMARY KEY,
  agent_id VARCHAR(50) NOT NULL,
  agent_name VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(50),
  description TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'MEDIUM',
  status ticket_status NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id VARCHAR(50) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_name VARCHAR(150) NOT NULL,
  sender_role user_role NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(50) NOT NULL,
  admin_name VARCHAR(150) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  reference_id VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(45) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. INDEXES FOR PERFORMANCE
CREATE INDEX idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_service ON transactions(service);
CREATE INDEX idx_wallet_txns_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_txns_created_at ON wallet_transactions(created_at);
CREATE INDEX idx_fund_requests_status ON fund_requests(status);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
