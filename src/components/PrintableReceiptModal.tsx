import React from 'react';
import { Transaction, CreditCardRequest } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { Printer, Download, X, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

interface ReceiptProps {
  transaction?: Transaction | null;
  ccRequest?: CreditCardRequest | null;
  onClose: () => void;
}

export const PrintableReceiptModal: React.FC<ReceiptProps> = ({
  transaction,
  ccRequest,
  onClose,
}) => {
  if (!transaction && !ccRequest) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  // If credit card request receipt
  if (ccRequest) {
    const receiptNumber = `REC-CC-${ccRequest.id.replace(/\D/g, '') || '9012'}`;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
          {/* Top Actions (no-print) */}
          <div className="no-print bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Credit Card Receipt
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                {ccRequest.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Area (Requirement #20) */}
          <div id="printable-receipt" className="p-8 font-sans text-slate-800 text-xs">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-extrabold text-base shadow-sm mb-2 border border-slate-700">
                MEPL
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-950 uppercase">
                {COMPANY_INFO.name}
              </h2>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-0.5">
                {COMPANY_INFO.address}
              </p>
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 mt-1 font-mono">
                <span>Support Email: {COMPANY_INFO.email}</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                GSTIN: {COMPANY_INFO.gstin}
              </div>
            </div>

            {/* Approved Status Banner */}
            <div className="my-5 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                    STATUS: {ccRequest.status}
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Payment verified & executed via {ccRequest.provider || 'Authorized Corporate Bank Gateway'}.
                  </p>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-black text-slate-950">
                  ₹{ccRequest.totalReserved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500 uppercase">Wallet Debited</span>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 py-2 border-b border-slate-100 pb-4 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Receipt Number
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{receiptNumber}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Request ID
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{ccRequest.id}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Transaction ID
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{ccRequest.transactionId}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Date & Time
                </span>
                <p className="font-medium text-slate-900 mt-0.5">
                  {ccRequest.approvedAt || ccRequest.createdAt}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Agent Terminal Name
                </span>
                <p className="font-medium text-slate-900 font-sans mt-0.5">
                  {ccRequest.agentName} ({ccRequest.agentId})
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Customer Name
                </span>
                <p className="font-medium text-slate-900 font-sans mt-0.5">
                  {ccRequest.customerName} (+91 {ccRequest.customerMobile})
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Credit Card Bank
                </span>
                <p className="font-bold text-slate-900 font-sans mt-0.5">{ccRequest.bankName}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Card Ending
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{ccRequest.cardNumber}</p>
              </div>

              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider block">
                  Payment Reference Number / Bank UTR
                </span>
                <p className="font-black text-slate-900 text-sm mt-0.5">
                  {ccRequest.paymentRefNumber || 'HDFC-PAY-901842918'}
                </p>
              </div>
            </div>

            {/* Bill Summary Table */}
            <div className="mt-4 pt-2">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 font-sans">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-sans font-medium text-slate-800">
                      Credit Card Bill Payment — {ccRequest.bankName} ({ccRequest.customerName})
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900">
                      ₹{ccRequest.amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans text-slate-600">Processing & Escrow Handling Fee</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">
                      ₹{ccRequest.processingFee.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-slate-900 font-bold text-slate-950">
                    <td className="py-3 text-sm font-sans uppercase">Total Wallet Debit</td>
                    <td className="py-3 text-right text-base font-black">
                      ₹{ccRequest.totalReserved.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Stamp & Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-900 rounded-md font-bold text-[10px] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Verified & Approved</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Authorized Signatory · Mannat Enterprise Operations
                </p>
              </div>

              <div className="text-right text-[10px] text-slate-400">
                <p>Computer Generated Invoice Receipt</p>
                <p>No Physical Signature Required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard transaction receipt (existing)
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Actions */}
        <div className="no-print bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Payment Receipt
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              {transaction.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="p-8 font-sans text-slate-800 text-xs">
          <div className="border-b border-slate-200 pb-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-extrabold text-base shadow-sm mb-2 border border-slate-700">
              MEPL
            </div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-950 uppercase">
              {COMPANY_INFO.name}
            </h2>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-0.5">
              {COMPANY_INFO.address}
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 mt-1 font-mono">
              <span>Support Email: {COMPANY_INFO.email}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono">
              GSTIN: {COMPANY_INFO.gstin}
            </div>
          </div>

          <div className="my-5 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Transaction {transaction.status}
                </p>
                <p className="text-[11px] text-emerald-800">
                  {transaction.service} Payment has been successfully acknowledged by the biller switch.
                </p>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-extrabold text-slate-950">
                ₹{transaction.totalDeducted.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 uppercase">Total Paid</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 py-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Transaction ID
              </span>
              <p className="font-mono font-semibold text-slate-900 text-xs mt-0.5">
                {transaction.id}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Date & Timestamp
              </span>
              <p className="font-medium text-slate-900 text-xs mt-0.5">
                {transaction.date} · {transaction.time}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Reference / BBPS Ref
              </span>
              <p className="font-mono font-medium text-slate-800 text-xs mt-0.5">
                {transaction.bbpsRef || transaction.utr || transaction.referenceId}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Agent / Store Terminal
              </span>
              <p className="font-medium text-slate-900 text-xs mt-0.5">
                {transaction.agentName} ({transaction.agentId})
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Customer Name
              </span>
              <p className="font-medium text-slate-900 text-xs mt-0.5">
                {transaction.customerName}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Consumer / Account / Card
              </span>
              <p className="font-mono font-semibold text-slate-900 text-xs mt-0.5">
                {transaction.customerIdentifier || transaction.customerMobile}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Biller / Operator
              </span>
              <p className="font-medium text-slate-900 text-xs mt-0.5">
                {transaction.billerName || transaction.service}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Category
              </span>
              <p className="font-medium text-slate-900 text-xs mt-0.5">
                {transaction.categoryName || transaction.service}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 font-sans">
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-800">
                    Bill / Recharge Payable Amount
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    ₹{transaction.billAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans text-slate-600">Platform Handling Fee</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    ₹{transaction.serviceCharge.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t-2 border-slate-900 font-bold text-slate-950">
                  <td className="py-3 text-sm font-sans uppercase">Total Amount Debited</td>
                  <td className="py-3 text-right text-base font-black">
                    ₹{transaction.totalDeducted.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-900 rounded-md font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Verified Transaction</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Mannat Enterprise Digital Receipt
              </p>
            </div>

            <div className="text-right text-[10px] text-slate-400">
              <p>Generated by Mannat Enterprise Pvt Ltd</p>
              <p>Authentic Digital Voucher</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
