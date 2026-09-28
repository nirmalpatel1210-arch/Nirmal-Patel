import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  Paperclip,
} from 'lucide-react';
import { SupportTicket } from '../types';

interface SupportPageProps {
  onNavigate: (path: string) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const { tickets, createSupportTicket, replySupportTicket, currentUser } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('TRANSACTION_ISSUE');
  const [transactionId, setTransactionId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SupportTicket['priority']>('MEDIUM');

  // Reply message
  const [replyText, setReplyText] = useState('');

  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    createSupportTicket({
      subject,
      category,
      transactionId: transactionId || undefined,
      description,
      priority,
    });

    setShowCreateModal(false);
    setSubject('');
    setTransactionId('');
    setDescription('');
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replySupportTicket(selectedTicket.id, replyText);
    setReplyText('');

    // Keep active ticket updated
    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            replies: [
              ...prev.replies,
              {
                sender: currentUser?.name || 'Agent',
                role: currentUser?.role || 'agent',
                message: replyText,
                timestamp: 'Just now',
              },
            ],
          }
        : null
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OPERATOR CONSOLE / HELPDESK & ESCALATIONS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Support Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Raise dispute tickets for delayed bank recons, settlement inquiries, or gateway errors.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OPEN TICKETS</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-1">{openCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting Support Triage</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PENDING / IN PROGRESS</span>
            <div className="text-2xl font-black font-mono text-amber-600 mt-1">{inProgressCount}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Under Bank Switch Review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RESOLVED TICKETS</span>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-1">{resolvedCount}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Closed Satisfactorily</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Your Escalated Tickets</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No support tickets found. Click "Create New Ticket" to report an issue.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{t.createdAt}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{t.category.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'RESOLVED' || t.status === 'CLOSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Raise Support Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Subject / Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transaction amount debited but bill unpaid"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  >
                    <option value="TRANSACTION_ISSUE">Transaction Issue</option>
                    <option value="WALLET_ISSUE">Wallet / Recharge Issue</option>
                    <option value="COMMISSION">Commission Discrepancy</option>
                    <option value="KYC">KYC & Onboarding</option>
                    <option value="TECHNICAL">Technical / Portal Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Related Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-20260925-9921"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Issue Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details including consumer number, amount, and timestamp..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details & Discussion Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedTicket.id}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mt-1">{selectedTicket.subject}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            {/* Original message */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1 text-[11px]">
                <span className="font-semibold text-slate-800">{selectedTicket.agentName} (Agent)</span>
                <span>{selectedTicket.createdAt}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{selectedTicket.description}</p>
              {selectedTicket.transactionId && (
                <div className="mt-2 text-[11px] font-mono text-emerald-700 font-semibold">
                  Linked Txn: {selectedTicket.transactionId}
                </div>
              )}
            </div>

            {/* Replies thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {selectedTicket.replies.map((reply, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl ${
                    reply.role === 'admin'
                      ? 'bg-emerald-50/80 border border-emerald-200 ml-4'
                      : 'bg-slate-100/80 border border-slate-200 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="font-bold text-slate-900">{reply.sender}</span>
                    <span className="text-slate-400">{reply.timestamp}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{reply.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleReplySubmit} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                required
                placeholder="Type your reply message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
