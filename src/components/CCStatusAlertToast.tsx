import React from 'react';
import { CCStatusChangeEvent } from '../hooks/useCCRequestPolling';
import { CheckCircle2, AlertCircle, X, Receipt, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CCStatusAlertToastProps {
  event: CCStatusChangeEvent | null;
  onDismiss: () => void;
  onNavigate?: (path: string) => void;
}

export const CCStatusAlertToast: React.FC<CCStatusAlertToastProps> = ({
  event,
  onDismiss,
  onNavigate,
}) => {
  const { setActiveCCReceiptRequest, ccRequests } = useApp();

  if (!event) return null;

  const isApproved = event.newStatus === 'APPROVED';
  const isFailed = event.newStatus === 'FAILED' || event.newStatus === 'REJECTED';
  const isPaymentDone = event.newStatus === 'PAYMENT DONE';
  const isRefunded = event.newStatus === 'REFUNDED';

  const handleOpenReceipt = () => {
    const fullReq = ccRequests.find((r) => r.id === event.id);
    if (fullReq) {
      setActiveCCReceiptRequest(fullReq);
    }
    onDismiss();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 shadow-2xl rounded-2xl overflow-hidden border">
      <div
        className={`p-4 flex items-start justify-between gap-3 ${
          isApproved
            ? 'bg-emerald-950 text-white border-emerald-500 ring-2 ring-emerald-500/40'
            : isFailed
            ? 'bg-rose-950 text-white border-rose-500 ring-2 ring-rose-500/40'
            : isPaymentDone
            ? 'bg-indigo-950 text-white border-indigo-500 ring-2 ring-indigo-500/40'
            : isRefunded
            ? 'bg-cyan-950 text-white border-cyan-500 ring-2 ring-cyan-500/40'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isApproved
                ? 'bg-emerald-500 text-slate-950'
                : isFailed
                ? 'bg-rose-500 text-white'
                : 'bg-indigo-500 text-white'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            ) : isFailed ? (
              <AlertCircle className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isApproved
                    ? 'bg-emerald-400 text-slate-950'
                    : isFailed
                    ? 'bg-rose-400 text-slate-950'
                    : 'bg-indigo-400 text-slate-950'
                }`}
              >
                ● STATUS UPDATED: {event.newStatus}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
            </div>

            <h4 className="text-sm font-extrabold text-white tracking-tight">
              {event.bankName} bill for {event.customerName}
            </h4>

            <p className="text-xs text-slate-300 font-mono">
              Amount: <strong className="text-white">₹{event.amount.toLocaleString('en-IN')}</strong> · ID:{' '}
              <strong className="text-slate-200">{event.id}</strong>
            </p>

            {isApproved && (
              <p className="text-[11px] text-emerald-300 font-medium">
                Admin payment confirmed & settled. Reserved wallet amount debited.
              </p>
            )}

            {isFailed && (
              <p className="text-[11px] text-rose-300 font-medium">
                Reason: {event.failureReason || event.rejectionReason || 'Declined by Admin'}.
                <br />
                <span className="font-bold text-white">
                  Reserved amount ₹{event.totalReserved.toLocaleString('en-IN')} released to your wallet.
                </span>
              </p>
            )}

            {isPaymentDone && (
              <p className="text-[11px] text-indigo-300 font-medium">
                Admin has executed the payment through bank gateway (UTR: {event.paymentRefNumber || 'Pending'}).
              </p>
            )}

            {/* Quick Action Button */}
            <div className="pt-2 flex items-center gap-2">
              {isApproved && (
                <button
                  onClick={handleOpenReceipt}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-lg transition-colors shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View & Print Receipt</span>
                </button>
              )}
              {onNavigate && (
                <button
                  onClick={() => {
                    onNavigate('/agent/credit-card-history');
                    onDismiss();
                  }}
                  className="text-xs text-slate-300 hover:text-white underline font-semibold px-1"
                >
                  View in History →
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
