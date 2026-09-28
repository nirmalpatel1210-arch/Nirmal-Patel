import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsPageProps {
  onNavigate: (path: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  const { transactions, setActiveReceiptTxn } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filteredList = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.id.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerMobile.includes(q) ||
      (t.referenceId && t.referenceId.toLowerCase().includes(q)) ||
      (t.utr && t.utr.toLowerCase().includes(q)) ||
      (t.billerName && t.billerName.toLowerCase().includes(q));

    const matchesService = serviceFilter === 'ALL' || t.service === serviceFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const paginatedList = filteredList.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Time', 'Service', 'Customer', 'Mobile', 'Biller', 'Amount', 'Charges', 'Commission', 'Total Deducted', 'Reference', 'Status'];
    const rows = filteredList.map(t => [
      t.id, t.date, t.time, t.service, t.customerName, t.customerMobile, `"${t.billerName || ''}"`, t.billAmount, t.serviceCharge, t.commission, t.totalDeducted, t.referenceId, t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSE_Transactions_${Date.now()}.csv`);
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
            <span>OPERATOR CONSOLE / AUDIT RECORD</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            All Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central ledger of all BBPS, credit card, remittance and recharge orders executed across this terminal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, customer, phone, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Services</option>
              <option value="BBPS">BBPS</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="MONEY_TRANSFER">Money Transfer</option>
              <option value="MOBILE_RECHARGE">Mobile Recharge</option>
              <option value="DTH">DTH</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="GAS">Gas</option>
              <option value="WATER">Water</option>
              <option value="INSURANCE">Insurance</option>
              <option value="FASTAG">FASTag</option>
            </select>

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
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Total Records: <span className="font-bold text-slate-900">{filteredList.length}</span>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#52796F]/10 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">TRANSACTION ID</th>
                <th className="py-3 px-4">DATE & TIME</th>
                <th className="py-3 px-4">SERVICE</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4 text-right">BILL AMOUNT</th>
                <th className="py-3 px-4 text-right">COMMISSION</th>
                <th className="py-3 px-4">REFERENCE / UTR</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                paginatedList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {t.id}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div>{t.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.time}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{t.categoryName || t.service}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {t.billerName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{t.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{t.customerMobile}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                      ₹{t.billAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600 whitespace-nowrap tabular-nums">
                      +₹{t.commission.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 truncate max-w-[140px]">
                      {t.utr || t.bbpsRef || t.referenceId}
                    </td>

                    <td className="py-3.5 px-4 text-center">
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

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => setSelectedTxn(t)}
                        title="View Timeline & Details"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => setActiveReceiptTxn(t)}
                        title="Print Official Receipt"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
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

      {/* Transaction Details & Timeline Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Transaction Audit Trail
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-mono">
                  {selectedTxn.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                Execution Lifecycle
              </span>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-slate-900">Initiated at Terminal</div>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedTxn.date}, {selectedTxn.time}</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-slate-900">Forwarded to Biller NPCI Gateway</div>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedTxn.referenceId}</div>
                </div>

                <div className="relative">
                  <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                    selectedTxn.status === 'SUCCESS' ? 'bg-emerald-600' : selectedTxn.status === 'PENDING' ? 'bg-amber-500' : 'bg-rose-600'
                  }`}>
                    {selectedTxn.status === 'SUCCESS' ? '✓' : '!'}
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Settlement Status: {selectedTxn.status}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedTxn.reason || 'Payment confirmed by banking switch.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-900">{selectedTxn.customerName} ({selectedTxn.customerMobile})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Biller / Operator:</span>
                <span className="font-semibold text-slate-900">{selectedTxn.billerName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Bill Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{selectedTxn.billAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Service Convenience Fee:</span>
                <span className="font-mono text-slate-700">₹{selectedTxn.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-700">
                <span>Earned Commission:</span>
                <span className="font-mono font-bold">+₹{selectedTxn.commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span>Total Deducted:</span>
                <span className="font-mono text-slate-950">₹{selectedTxn.totalDeducted.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedTxn(null);
                  onNavigate('/support');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Raise Dispute / Ticket
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const t = selectedTxn;
                    setSelectedTxn(null);
                    setActiveReceiptTxn(t);
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
