import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCardRequest, CCRequestStatus } from '../types';

export interface CCStatusChangeEvent {
  id: string;
  requestId: string;
  transactionId: string;
  bankName: string;
  customerName: string;
  amount: number;
  totalReserved: number;
  previousStatus: CCRequestStatus;
  newStatus: CCRequestStatus;
  message: string;
  timestamp: string;
  failureReason?: string;
  rejectionReason?: string;
  paymentRefNumber?: string;
}

export type StatusChangeEvent = CCStatusChangeEvent;

interface UseCCRequestPollingOptions {
  intervalMs?: number;
  enabled?: boolean;
  onStatusChange?: (change: CCStatusChangeEvent) => void;
}

export function useCCRequestPolling({
  intervalMs = 10000,
  enabled = true,
  onStatusChange,
}: UseCCRequestPollingOptions = {}) {
  const { currentUser, ccRequests, refreshCCRequests } = useApp();
  const [lastPolledAt, setLastPolledAt] = useState<Date>(new Date());
  const [pollCount, setPollCount] = useState<number>(0);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(Math.round(intervalMs / 1000));
  const [latestChange, setLatestChange] = useState<CCStatusChangeEvent | null>(null);

  // Keep a map of previous statuses: requestId -> status
  const prevStatusesRef = useRef<Map<string, CCRequestStatus>>(new Map());
  const initialLoadRef = useRef<boolean>(true);

  // Helper to detect status changes
  const checkStatusChanges = useCallback(
    (currentList: CreditCardRequest[]) => {
      const agentId = currentUser?.agentId || currentUser?.id;
      // Filter for this agent's requests only
      const myRequests = currentList.filter(
        (r) => !agentId || r.agentId === agentId || r.agentId === currentUser?.agentId
      );

      // On initial load, just populate the map without firing notifications
      if (initialLoadRef.current) {
        myRequests.forEach((req) => {
          prevStatusesRef.current.set(req.id, req.status);
        });
        initialLoadRef.current = false;
        return;
      }

      // Check each request for transitions
      myRequests.forEach((req) => {
        const prevStatus = prevStatusesRef.current.get(req.id);
        if (prevStatus && prevStatus !== req.status) {
          // Status has changed!
          const nowStr = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

          let message = '';
          if (req.status === 'APPROVED') {
            message = `Payment of ₹${req.amount.toLocaleString('en-IN')} for ${req.bankName} (Card ending ${req.cardLast4}) was APPROVED by Super Admin! Receipt generated and commission credited.`;
          } else if (req.status === 'FAILED' || req.status === 'REJECTED') {
            message = `Payment request ${req.id} was marked as ${req.status}. ₹${req.totalReserved.toLocaleString('en-IN')} has been immediately released back to your available balance.`;
          } else if (req.status === 'PAYMENT DONE') {
            message = `Payment for request ${req.id} has been executed by Admin (Ref: ${req.paymentRefNumber || req.utr || 'Pending'}). Awaiting final approval.`;
          } else if (req.status === 'PROCESSING') {
            message = `Super Admin has begun processing your credit card payment request ${req.id}.`;
          } else if (req.status === 'REFUNDED') {
            message = `Request ${req.id} was refunded. ₹${req.totalReserved.toLocaleString('en-IN')} credited back to your wallet.`;
          } else {
            message = `Request ${req.id} status updated to ${req.status}.`;
          }

          const changeEvent: CCStatusChangeEvent = {
            id: req.id,
            requestId: req.id,
            transactionId: req.transactionId,
            bankName: req.bankName,
            customerName: req.customerName,
            amount: req.amount,
            totalReserved: req.totalReserved,
            previousStatus: prevStatus,
            newStatus: req.status,
            message,
            timestamp: nowStr,
            failureReason: req.failureReason,
            rejectionReason: req.rejectionReason,
            paymentRefNumber: req.paymentRefNumber || req.utr,
          };

          setLatestChange(changeEvent);
          if (onStatusChange) {
            onStatusChange(changeEvent);
          }
        }
        // Update stored status
        prevStatusesRef.current.set(req.id, req.status);
      });
    },
    [currentUser, onStatusChange]
  );

  // Manual or automatic poll action
  const pollNow = useCallback(() => {
    try {
      const updatedList = refreshCCRequests();
      setLastPolledAt(new Date());
      setPollCount((prev) => prev + 1);
      setSecondsRemaining(Math.round(intervalMs / 1000));
      checkStatusChanges(updatedList);
    } catch (e) {
      console.error('Polling error:', e);
    }
  }, [refreshCCRequests, intervalMs, checkStatusChanges]);

  // Main 10-second polling interval
  useEffect(() => {
    if (!enabled) return;

    // Immediately run check on mount
    checkStatusChanges(ccRequests);

    const intervalTimer = setInterval(() => {
      pollNow();
    }, intervalMs);

    // 1-second ticker for the countdown UI
    const tickTimer = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? Math.round(intervalMs / 1000) : prev - 1));
    }, 1000);

    return () => {
      clearInterval(intervalTimer);
      clearInterval(tickTimer);
    };
  }, [enabled, intervalMs, pollNow, ccRequests, checkStatusChanges]);

  // Cross-tab storage listener for instantaneous updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sse_cc_requests' && e.newValue) {
        try {
          const freshRequests: CreditCardRequest[] = JSON.parse(e.newValue);
          checkStatusChanges(freshRequests);
          setLastPolledAt(new Date());
        } catch (err) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkStatusChanges]);

  const dismissAlert = () => setLatestChange(null);

  return {
    lastPolledAt,
    pollCount,
    isPolling,
    secondsRemaining,
    latestChange,
    dismissAlert,
    pollNow,
  };
}
