import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PrintableReceiptModal } from './components/PrintableReceiptModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';
import { QRLoadWalletPage } from './pages/QRLoadWalletPage';
import { CCHistoryPage } from './pages/CCHistoryPage';
import { AgentCCHistoryPage } from './pages/AgentCCHistoryPage';
import { LiveBillHistoryPage } from './pages/LiveBillHistoryPage';
import { WalletLedgerPage } from './pages/WalletLedgerPage';
import { BBPSPage } from './pages/BBPSPage';
import { CreditCardPayPage } from './pages/CreditCardPayPage';
import { MoneyTransferPage } from './pages/MoneyTransferPage';
import { MobileRechargePage } from './pages/MobileRechargePage';
import { GenericUtilityPage } from './pages/GenericUtilityPage';
import { SettlementPage } from './pages/SettlementPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfileSecurityPage } from './pages/ProfileSecurityPage';
import { SupportPage } from './pages/SupportPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminCCRequestsPage } from './pages/AdminCCRequestsPage';
import { AdminAgentOnboardingWizard } from './pages/AdminAgentOnboardingWizard';
import { AdminQRManagementPage } from './pages/AdminQRManagementPage';
import {
  AdminAgentsPage,
  AdminWalletPage,
  AdminCommissionPage,
  AdminFundRequestsPage,
  AdminSettlementsPage,
  AdminAuditLogsPage,
} from './pages/AdminManagementPages';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    role,
    activeReceiptTxn,
    setActiveReceiptTxn,
    activeCCReceiptRequest,
    setActiveCCReceiptRequest,
  } = useApp();
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync route if unauthenticated
  useEffect(() => {
    if (!currentUser && currentPath !== '/forgot-password' && currentPath !== '/admin/login') {
      setCurrentPath('/login');
    } else if (currentUser && (currentPath === '/login' || currentPath === '/admin/login')) {
      setCurrentPath(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [currentUser, role]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth pages view
  if (!currentUser) {
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/admin/login') {
      return <LoginPage isAdmin onNavigate={handleNavigate} />;
    }
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // Render content according to currentPath
  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <AgentDashboardPage onNavigate={handleNavigate} />;
      case '/wallet/qr-load':
        return <QRLoadWalletPage onNavigate={handleNavigate} />;
      case '/agent/credit-card-history':
      case '/services/cc-history':
        return <AgentCCHistoryPage onNavigate={handleNavigate} />;
      case '/services/live-bill-history':
        return <LiveBillHistoryPage onNavigate={handleNavigate} />;
      case '/wallet':
        return <WalletLedgerPage onNavigate={handleNavigate} />;
      case '/wallet/settlement':
        return <SettlementPage onNavigate={handleNavigate} />;
      case '/services/bbps':
        return <BBPSPage onNavigate={handleNavigate} />;
      case '/services/credit-card':
        return <CreditCardPayPage onNavigate={handleNavigate} />;
      case '/services/money-transfer':
        return <MoneyTransferPage onNavigate={handleNavigate} />;
      case '/services/mobile-recharge':
        return <MobileRechargePage onNavigate={handleNavigate} />;
      case '/services/dth':
        return <GenericUtilityPage serviceType="DTH" onNavigate={handleNavigate} />;
      case '/services/electricity':
        return <GenericUtilityPage serviceType="ELECTRICITY" onNavigate={handleNavigate} />;
      case '/services/gas':
        return <GenericUtilityPage serviceType="GAS" onNavigate={handleNavigate} />;
      case '/services/water':
        return <GenericUtilityPage serviceType="WATER" onNavigate={handleNavigate} />;
      case '/services/insurance':
        return <GenericUtilityPage serviceType="INSURANCE" onNavigate={handleNavigate} />;
      case '/services/fastag':
        return <GenericUtilityPage serviceType="FASTAG" onNavigate={handleNavigate} />;
      case '/transactions':
        return <TransactionsPage onNavigate={handleNavigate} />;
      case '/reports/commission':
        return <ReportsPage initialTab="commission" onNavigate={handleNavigate} />;
      case '/reports/transactions':
        return <ReportsPage initialTab="transactions" onNavigate={handleNavigate} />;
      case '/reports/wallet':
        return <ReportsPage initialTab="wallet" onNavigate={handleNavigate} />;
      case '/reports/settlement':
        return <ReportsPage initialTab="settlement" onNavigate={handleNavigate} />;
      case '/profile':
        return <ProfileSecurityPage initialTab="profile" onNavigate={handleNavigate} />;
      case '/profile/change-password':
        return <ProfileSecurityPage initialTab="password" onNavigate={handleNavigate} />;
      case '/profile/change-mpin':
        return <ProfileSecurityPage initialTab="mpin" onNavigate={handleNavigate} />;
      case '/support':
      case '/admin/tickets':
        return <SupportPage onNavigate={handleNavigate} />;

      // Admin Routes
      case '/admin/dashboard':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case '/admin/cc-requests':
      case '/admin/credit-card-requests':
        return <AdminCCRequestsPage onNavigate={handleNavigate} />;
      case '/admin/agents':
        return <AdminAgentsPage onNavigate={handleNavigate} />;
      case '/admin/agents/create':
      case '/admin/agents/onboard':
      case '/admin/onboard-agent':
        return <AdminAgentOnboardingWizard onNavigate={handleNavigate} />;
      case '/admin/wallet':
        return <AdminWalletPage onNavigate={handleNavigate} />;
      case '/admin/commission':
        return <AdminCommissionPage onNavigate={handleNavigate} />;
      case '/admin/fund-requests':
        return <AdminFundRequestsPage onNavigate={handleNavigate} />;
      case '/admin/qr-management':
      case '/admin/qr-codes':
        return <AdminQRManagementPage onNavigate={handleNavigate} />;
      case '/admin/settlements':
        return <AdminSettlementsPage onNavigate={handleNavigate} />;
      case '/admin/audit-logs':
        return <AdminAuditLogsPage onNavigate={handleNavigate} />;

      default:
        return <AgentDashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activePath={currentPath}
          onNavigate={handleNavigate}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      {/* Global Printable Receipt Modal */}
      <PrintableReceiptModal
        transaction={activeReceiptTxn}
        ccRequest={activeCCReceiptRequest}
        onClose={() => {
          setActiveReceiptTxn(null);
          setActiveCCReceiptRequest(null);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
