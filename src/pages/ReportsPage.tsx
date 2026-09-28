import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  FileCheck,
  WalletCards,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  Printer,
  TrendingUp,
} from 'lucide-react';

interface ReportsPageProps {
  initialTab?: 'commission' | 'transactions' | 'wallet' | 'settlement';
  onNavigate: (path: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialTab = 'commission', onNavigate }) => {
  const { transactions, walletLedger, settlements, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'commission' | 'transactions' | 'wallet' | 'settlement'>(initialTab);

  const [dateRange, setDateRange] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  // Commission metrics
  const totalCommission = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.commission : 0), 0);
  const todayCommission = transactions
    .filter((t) => t.date.includes('28 Sept') && t.status === 'SUCCESS')
    .reduce((acc, t) => acc + t.commission, 0);

  // Transaction metrics
  const totalTxnCount = transactions.length;
  const successfulTxnCount = transactions.filter((t) => t.status === 'SUCCESS').length;
  const failedTxnCount = transactions.filter((t) => t.status === 'FAILED').length;
  const pendingTxnCount = transactions.filter((t) => t.status === 'PENDING').length;
  const totalTurnover = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.billAmount : 0), 0);

  const handleExportCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>BUSINESS INTELLIGENCE & AUDIT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Reports & Statements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download verified commission statements, terminal turnover reports, and bank settlement logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'commission' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Commission</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'transactions' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Turnover</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'wallet' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <WalletCards className="w-3.5 h-3.5 text-sky-600" />
            <span>Wallet Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'settlement' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            <span>Settlements</span>
          </button>
        </div>
      </div>

      {/* Commission Report View */}
      {activeTab === 'commission' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TODAY'S COMMISSION</span>
              <div className="text-2xl font-black font-mono text-emerald-700 mt-1 tabular-nums">
                ₹{todayCommission.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">28 Sept 2026</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">THIS WEEK</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
                ₹{(totalCommission * 0.65).toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Current Billing Cycle</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">THIS MONTH (SEPTEMBER)</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
                ₹{totalCommission.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Gross Cumulative Payout</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NET RETAINED EARNING</span>
              <div className="text-2xl font-black font-mono text-emerald-800 mt-1 tabular-nums">
                ₹{(totalCommission * 0.95).toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">After 5% TDS deduction</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Commission Ledger Details</h3>
              <button
                onClick={() =>
                  handleExportCSV(
                    'SSE_Commission_Report',
                    ['Date', 'Txn ID', 'Service', 'Bill Amount', 'Commission', 'Status'],
                    transactions.map((t) => [t.date, t.id, t.service, t.billAmount, t.commission, t.status])
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4 text-right">Order Amount</th>
                    <th className="py-3 px-4 text-right">Agent Commission</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 text-slate-600 font-mono">{t.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                      <td className="py-3 px-4 text-slate-800">{t.categoryName || t.service}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        ₹{t.billAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        +₹{t.commission.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Report View */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL ORDERS</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">{totalTxnCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Processed</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">SUCCESSFUL</span>
              <div className="text-2xl font-black font-mono text-emerald-700 mt-1">{successfulTxnCount}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {Math.round((successfulTxnCount / (totalTxnCount || 1)) * 100)}% Success Rate
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">PENDING RECON</span>
              <div className="text-2xl font-black font-mono text-amber-700 mt-1">{pendingTxnCount}</div>
              <div className="text-[11px] text-amber-600 font-medium mt-1">Awaiting Switch</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">FAILED / REFUNDED</span>
              <div className="text-2xl font-black font-mono text-rose-700 mt-1">{failedTxnCount}</div>
              <div className="text-[11px] text-rose-600 font-medium mt-1">Auto-reversed</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL VOLUME</span>
              <div className="text-xl font-black font-mono text-slate-950 mt-1 tabular-nums">
                ₹{totalTurnover.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Turnover Settled</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center">
            <p className="text-xs text-slate-500 mb-3">
              Export comprehensive transaction data for taxation, GST filings, and auditing.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  handleExportCSV(
                    'SSE_All_Turnover',
                    ['ID', 'Date', 'Customer', 'Biller', 'Amount', 'Total Deducted', 'Status'],
                    transactions.map((t) => [t.id, t.date, t.customerName, `"${t.billerName}"`, t.billAmount, t.totalDeducted, t.status])
                  )
                }
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Turnover CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Report View */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CLOSING WALLET BALANCE
              </span>
              <div className="text-3xl font-black font-mono text-slate-950 mt-1">
                ₹{currentUser?.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Terminal ID: {currentUser?.agentId}</p>
            </div>

            <button
              onClick={() => onNavigate('/wallet')}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              View Full Statement
            </button>
          </div>
        </div>
      )}

      {/* Settlement Report View */}
      {activeTab === 'settlement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Settlement Payout History</h3>
              <button
                onClick={() => onNavigate('/wallet/settlement')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                + New Settlement Request
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Settlement ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Bank & Account</th>
                    <th className="py-3 px-4">IFSC</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Bank UTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {settlements.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.id}</td>
                      <td className="py-3 px-4 text-slate-600">{s.requestDate}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{s.bankName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">A/C **{s.accountNumber.slice(-4)}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{s.ifsc}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹{s.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{s.utr || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
