import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { Transaction } from '../types';

interface LiveBillHistoryProps {
  onNavigate: (path: string) => void;
}

export const LiveBillHistoryPage: React.FC<LiveBillHistoryProps> = ({ onNavigate }) => {
  const { transactions, setActiveReceiptTxn } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [amountSearch, setAmountSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Filter BBPS & live utility transactions (non-credit-card)
  const liveTxns = transactions.filter((t) => t.service !== 'CREDIT_CARD');

  // Metrics
  const successfulTxns = liveTxns.filter((t) => t.status === 'SUCCESS');
  const successTotal = successfulTxns.reduce((sum, t) => sum + t.billAmount, 0);

  const pendingTxns = liveTxns.filter((t) => t.status === 'PENDING');
  const pendingTotal = pendingTxns.reduce((sum, t) => sum + t.billAmount, 0);

  const failedTxns = liveTxns.filter((t) => t.status === 'FAILED' || t.status === 'REVERSED');
  const failedTotal = failedTxns.reduce((sum, t) => sum + t.billAmount, 0);

  // Filter application
  const filteredList = liveTxns.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.id.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerMobile.includes(q) ||
      (t.billerName && t.billerName.toLowerCase().includes(q)) ||
      (t.customerIdentifier && t.customerIdentifier.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    const matchesAmount = !amountSearch || t.billAmount.toString().includes(amountSearch);

    return matchesSearch && matchesStatus && matchesAmount;
  });

  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const paginatedList = filteredList.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Time', 'Customer', 'Mobile', 'Biller', 'Consumer No', 'Bill Amount', 'Charges', 'Total Deducted', 'Status'];
    const rows = filteredList.map(t => [
      t.id, t.date, t.time, t.customerName, t.customerMobile, t.billerName || '', t.customerIdentifier || '', t.billAmount, t.serviceCharge, t.totalDeducted, t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSE_Live_Bill_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title block matching video 00:20 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>OPERATOR CONSOLE / LIVE BILL HISTORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Live Bill History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated overview of all your utility, gas, electricity, and other live bill payments.
          </p>
        </div>

        {/* Bharat Connect / BBPS Badge (matching video 00:20) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">
              BC
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-slate-900 leading-tight">Bharat Connect</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 leading-tight">BBPS Enabled</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/services/bbps')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>Pay Live Bill</span>
          </button>
        </div>
      </div>

      {/* 3 Top Cards (Matching exact visual hierarchy in video 00:20) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SUCCESSFUL PAYMENTS */}
        <div className="bg-[#12774a] text-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-100/90">
              SUCCESSFUL PAYMENTS
            </div>
            <div className="text-2xl font-black font-mono mt-1 tabular-nums">
              ₹{successTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{successfulTxns.length} Transactions</span>
            </div>
          </div>
        </div>

        {/* PENDING REVIEW */}
        <div className="bg-[#8c671b] text-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-100/90">
              PENDING REVIEW
            </div>
            <div className="text-2xl font-black font-mono mt-1 tabular-nums">
              ₹{pendingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-amber-100/80 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingTxns.length} Transactions</span>
            </div>
          </div>
        </div>

        {/* REVERSED & FAILED */}
        <div className="bg-[#8b2323] text-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-100/90">
              REVERSED & FAILED
            </div>
            <div className="text-2xl font-black font-mono mt-1 tabular-nums">
              ₹{failedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-rose-100/80 mt-1 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{failedTxns.length} Transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar (matching screenshot at 00:20) */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Customer, Biller ID, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {/* Date filter dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Week">This Week</option>
            </select>

            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Search Amount */}
            <input
              type="text"
              placeholder="Search Amount"
              value={amountSearch}
              onChange={(e) => setAmountSearch(e.target.value)}
              className="w-32 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white font-mono"
            />
          </div>

          {/* Export buttons (matching video) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Table data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#52796F]/10 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">DATE & TIME</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">BILLER NAME / ID</th>
                <th className="py-3 px-4">MOBILE NUMBER</th>
                <th className="py-3 px-4">CARD / CONSUMER NO</th>
                <th className="py-3 px-4 text-right">BILL AMOUNT</th>
                <th className="py-3 px-4 text-right">CHARGES</th>
                <th className="py-3 px-4 text-right">TOTAL DEDUCTED</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No live bill history transactions found.
                  </td>
                </tr>
              ) : (
                paginatedList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <div>{t.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.time}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {t.customerName}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{t.billerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {t.categoryName || t.service}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {t.customerMobile}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {t.customerIdentifier || '—'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                      ₹{t.billAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                      ₹{t.serviceCharge.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-950 whitespace-nowrap tabular-nums">
                      ₹{t.totalDeducted.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveReceiptTxn(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {filteredList.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} to{' '}
            {Math.min(page * rowsPerPage, filteredList.length)} of {filteredList.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 font-mono">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
