import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  Calendar,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { WalletTransaction } from '../types';

interface WalletLedgerProps {
  onNavigate: (path: string) => void;
}

export const WalletLedgerPage: React.FC<WalletLedgerProps> = ({ onNavigate }) => {
  const { currentUser, walletLedger } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Credit' | 'Debit' | 'Hold' | 'Release' | 'Adjustment'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  // Wallet balances
  const totalWallet = currentUser?.walletBalance || 0;
  const reservedWallet = currentUser?.reservedBalance || 0;
  const availableWallet = Math.max(0, totalWallet - reservedWallet);

  // Ledger stats
  const agentLedger = walletLedger.filter((l) => l.agentId === currentUser?.agentId);
  const totalCredit = agentLedger
    .filter((l) => l.type === 'Credit')
    .reduce((sum, l) => sum + l.amount, 0);
  const totalDebit = agentLedger
    .filter((l) => l.type === 'Debit')
    .reduce((sum, l) => sum + l.amount, 0);

  // Filter application
  const filteredList = agentLedger.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.note.toLowerCase().includes(q) ||
      l.reference.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      l.amount.toString().includes(q);

    const matchesType = typeFilter === 'ALL' || l.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const paginatedList = filteredList.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExportCSV = () => {
    const headers = ['Type', 'Amount', 'Balance', 'Reference', 'Note', 'Timestamp'];
    const rows = filteredList.map(l => [
      l.type, l.amount, l.balance, l.reference, `"${l.note.replace(/"/g, '""')}"`, l.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSE_Wallet_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title block matching video 00:30 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>OPERATOR CONSOLE / ACCOUNT STATEMENT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Wallet Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable record of every wallet movement, debits, credits, and gateway adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/wallet/qr-load')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Add Money (QR)</span>
          </button>
          <button
            onClick={() => onNavigate('/wallet/settlement')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Settlement Payout</span>
          </button>
        </div>
      </div>

      {/* Summary Cards with Reserved Balance Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Wallet Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              AVAILABLE MAIN BALANCE
            </span>
            <div className="text-2xl font-black font-mono text-emerald-600 mt-1 tabular-nums">
              ₹{availableWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Usable for all transactions
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Reserved Balance (Escrow Hold) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>RESERVED (ESCROW HOLD)</span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-700 mt-1 tabular-nums">
              ₹{reservedWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Held for pending CC requests
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Ledger Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL ACCOUNT BALANCE
            </span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
              ₹{totalWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Available + Reserved
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Debits & Credits summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              RECORDED MOVEMENT
            </span>
            <div className="text-xs font-mono font-bold mt-1 space-y-0.5">
              <div className="text-emerald-700">
                Credits: +₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-rose-700">
                Debits: -₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {agentLedger.length} ledger operations
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Bar (matching video 00:30) */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ledger notes or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white"
              />
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Debit">Debit Only</option>
              <option value="Credit">Credit Only</option>
              <option value="Hold">Hold / Escrow Only</option>
              <option value="Release">Release / Unfreeze Only</option>
              <option value="Adjustment">Adjustment Only</option>
            </select>

            {/* Date range picker simulation (matching screenshot dd-mm-yyyy) */}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Export buttons */}
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

        {/* Ledger table matching screenshot at 00:30 - 00:36 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#52796F]/10 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4 text-right">AMOUNT</th>
                <th className="py-3 px-4 text-right">BALANCE</th>
                <th className="py-3 px-4">REFERENCE</th>
                <th className="py-3 px-4">NOTE</th>
                <th className="py-3 px-4 text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No wallet entries found.
                  </td>
                </tr>
              ) : (
                paginatedList.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* TYPE */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          entry.type === 'Credit'
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.type === 'Debit'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                      <span
                        className={
                          entry.type === 'Credit'
                            ? 'text-emerald-700'
                            : entry.type === 'Debit'
                            ? 'text-rose-600'
                            : 'text-blue-700'
                        }
                      >
                        {entry.type === 'Credit' ? '+' : entry.type === 'Debit' ? '-' : ''}₹
                        {entry.amount.toFixed(2)}
                      </span>
                    </td>

                    {/* BALANCE */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 whitespace-nowrap tabular-nums">
                      ₹{entry.balance.toFixed(2)}
                    </td>

                    {/* REFERENCE */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {entry.reference}
                    </td>

                    {/* NOTE */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-md leading-relaxed">
                      {entry.note}
                    </td>

                    {/* TIME */}
                    <td className="py-3.5 px-4 text-right text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {entry.timestamp}
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
