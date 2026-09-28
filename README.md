# SHREE SHYAM ENTERPRISE — Agent & Admin Payment Portal

A production-style Indian Fintech and Digital Payment Operator Portal built for **SHREE SHYAM ENTERPRISE** (Ahmedabad, Gujarat), supporting Bharat Bill Payment System (BBPS), Credit Card Bill Settlement, Domestic Money Transfer (DMT), Prepaid Mobile/DTH Recharges, Utility Clearance, Multi-Tier Wallet Management, and Comprehensive Admin Governance.

---

## 🏢 Global Company Information

- **Company Name:** SHREE SHYAM ENTERPRISE
- **Corporate Address:** 512 Golden Square, Kalyan Chowk, New Nikol, Ahmedabad, Gujarat - 382350
- **Helpline Mobile:** +91 7016550832
- **Corporate Email:** ccshyam945@gmail.com
- **UPI VPA:** `shreeshyam@okaxis`
- **Banking Partner:** HDFC Bank Ltd (A/C: 50200084918231, IFSC: HDFC0001024)
- **GSTIN:** 24AAECS4912K1Z8

---

## 🚀 Key Functional Modules

### 1. Agent Operator Console & Dashboard
- **Top Metrics Bar:** Real-time Available Wallet Balance (`₹569.75`), T+1 Settlement Wallet, Date Indicator, and NPCI Live Status.
- **Top Stat Cards (Matching Reference Visual Architecture):**
  - **TOTAL WALLET BALANCE**
  - **CC BILL PAYMENT** (Volume & Count)
  - **LIVE BILL PAYMENT** (BBPS Utility Orders)
  - **PENDING REVIEW** (Bank Reconciliation Queue)
  - **TODAY'S CALENDAR FILTER**
- **Quick Services Hub:** BBPS, Credit Card Pay, Money Transfer, Mobile Recharge, DTH, Electricity, Gas, Water, Insurance, FASTag.
- **Recent Transactions Table:** Search by Transaction ID, Customer, Mobile, or Biller; live status tags (`SUCCESS`, `PENDING`, `FAILED`); 1-click Receipt & Printable A4 Invoice.

### 2. QR Load Wallet (UPI & Bank Proof OCR)
- **Active UPI QR:** Instant QR code with copyable VPA `shreeshyam@okaxis` and 0% convenience fee.
- **Recharge Submission Form:** 12-digit UTR entry, Card ending digits, Amount quick chips (`₹1,000` to `₹81,500`), and Screenshot Upload.
- **Screenshot & OCR Preview:** Realistic optical character recognition simulation verifying amount and transaction reference number.

### 3. CC Bill History & Live Bill History
- Specialized transaction history matching operator screens with 3 aggregated metric cards (*Successful Payments*, *Pending Review*, *Reversed & Refunded*).
- Multi-dimensional filters: Search by Customer/Phone/Bank, Date dropdown, Status dropdown, Search Amount, Export PDF, and Export Excel.

### 4. Account Statement (Wallet Ledger)
- Immutable financial ledger tracing every `Credit`, `Debit`, and `Adjustment` event with closing balances, timestamp, and gateway reference notes.
- Export to formatted CSV or PDF printout.

### 5. Payment Services & Utilities
- **BBPS Central Hub (`/services/bbps`):** Two-step workflow (Select Category $\to$ Select Biller $\to$ Fetch Bill $\to$ Review Late Fee/Due Date $\to$ Debit Wallet $\to$ Print Receipt).
- **Credit Card Bill Payment (`/services/credit-card`):** PCI-DSS compliant masked card input (`XXXX XXXX XXXX 1234`), bill fetch, choice of Minimum Due, Total Outstanding, or Custom Amount, processing fee and commission calculations.
- **Money Transfer / DMT (`/services/money-transfer`):** Sender KYC and monthly quota check, penny-drop Beneficiary verification, IMPS/NEFT routing, charges and UTR generation.
- **Prepaid Mobile Recharge (`/services/mobile-recharge`):** Operator selection, circle routing, interactive pack catalogs (*Popular*, *Unlimited*, *Data*, *Validity*).
- **Other Utilities:** Electricity, Gas, Water, DTH, Insurance, and FASTag.

### 6. Super Admin Governance Portal
- **Admin Dashboard (`/admin/dashboard`):** Total agents, active terminals, gross network turnover, wallet liquidity pool, pending fund approvals, and service volume distribution.
- **Agent Management (`/admin/agents`):** Onboard agents, configure KYC status, activate/suspend terminals.
- **Wallet Adjustments (`/admin/wallet`):** Manual credit/debit with mandatory audit rationale.
- **Commission Slabs (`/admin/commission`):** Configurable MDR, agent commission percentages, and fixed fee splits.
- **Fund Requests Review (`/admin/fund-requests`):** Approve or reject agent deposits, instantly updating agent balance and generating audit entries.
- **Settlement Queue (`/admin/settlements`):** Process payout requests and assign bank UTRs.
- **Audit Logs (`/admin/audit-logs`):** Cryptographically timestamped logs with IP stamping.

---

## 🔐 Demo Credentials

Use the **Instant Demo Access** quick-fill buttons on the login screen or enter manually:

| Role | Username / Identifier | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Agent Terminal** | `SSE-AG-88219` (or `shailesh.patel@gmail.com`) | `password123` | `/login` $\to$ `/dashboard` |
| **Super Admin** | `ccshyam945@gmail.com` | `admin@shyam2026` | `/admin/login` $\to$ `/admin/dashboard` |

*Note: You can also use the top header role switcher ("Agent View" / "Admin View") to seamlessly inspect either viewpoint without re-authenticating.*

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database Architecture
A production-ready PostgreSQL DDL schema is provided at `/database/schema.sql` defining:
- `users`, `agents`, `wallets`, `wallet_transactions`
- `billers`, `transactions`, `commission_rules`
- `fund_requests`, `settlements`, `support_tickets`, `ticket_replies`, `audit_logs`
- Foreign keys, enum definitions, checks, and performance indexes.
