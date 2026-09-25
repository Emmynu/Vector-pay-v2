import { useTransactionDetails } from "@/app/admin/api/transactions/get-single-transaction";
import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  X, 
  ReceiptText, 
  Info, 
  Calendar, 
  FileText, 
  StickyNote, 
  Hash, 
  CheckCircle2, 
  XCircle,
  Copy, 
  Check, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { formatAmount, formatDate, getStatusBadge } from "@/app/libs/utils/utils";
import { useProcessWithdrawals } from "@/app/admin/api/transactions/process-withdrawals";
import "@/app/globals.css";
import { showToast } from "@/app/libs/toast/sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function TransactionDetailsModal({ id, transactionId }) {
  const { transaction, isLoading, isError, fetchTransactionDetail } = useTransactionDetails(transactionId);
  const [copiedField, setCopiedField] = useState(null);
  const { processWithdrawal, isProcessing } = useProcessWithdrawals(transactionId);
  const [activeAction, setActiveAction] = useState(null); // 'success' | 'failed' | null
  const [error, setError] = useState(null);
  const query = useQueryClient()

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetail();
    }
  }, [transactionId]);

  function handleClose() {
    const modal = document.getElementById(id);
    if (modal) modal.close();
    setError(null)
  }

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProcessAction = async (status) => {
    if (isProcessing) return;
    try {
      setActiveAction(status);

      const response = await processWithdrawal(status);
      if(response?.status === 200){
        handleClose();
        showToast({ type: "success", title: "Transaction updated successfully" })
        
      }
      else{
        setError(response?.msg || `Failed to mark transaction as ${status}`)
      }
    }  
    finally {
        setActiveAction(null);
        query.refetchQueries({ queryKey: ["all-transactions"]})
        query.refetchQueries({ queryKey: ["transaction-details", transactionId] })
        query.refetchQueries({ queryKey: ["admin-analytics"] })
    }
  };

  const transactionDetails = [
    { 
      label: "Date", 
      value: formatDate(transaction?.date), 
      icon: Calendar 
    },
    { 
      label: "Narration", 
      value: transaction?.narration || "N/A", 
      icon: StickyNote 
    },
    { 
      label: "Transaction ID", 
      value: transaction?.id, 
      icon: FileText,
      copyable: true 
    },
    { 
      label: "Reference", 
      value: transaction?.reference, 
      icon: Hash,
      copyable: true 
    },
  ];

  return (
    <dialog id={id} className="modal backdrop-blur-md">
      <section className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-xl p-0 relative border border-slate-100 text-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#E6F0FA]/20 shrink-0">
          <section>
            <div className="flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-[#03457C]" />
              <h2 className="text-lg font-bold" style={bricolage.style}>
                Transaction Details
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5" style={quicksand.style}>
              Review user transactions and process withdrawals.
            </p>
          </section>

          <button 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" 
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#03457C]" />
              <p className="text-xs text-slate-500 font-medium" style={quicksand.style}>
                Fetching transaction details...
              </p>
            </div>
          ) : isError || !transaction ? (
            <div className="flex flex-col p-10 gap-2 items-center justify-center text-slate-500">
              <Info className="w-6 h-6 text-amber-500" />
              <h2 className="text-center text-slate-600 text-sm font-medium" style={quicksand.style}>
                Unable to fetch transaction data.
              </h2>
            </div>
          ) : (
            <>
                {error && <div className="p-3.5 mx-4 mt-2 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-rose-600 mt-0.5" style={quicksand.style}>{error}</p>
                  </div>
                </div>}
              
                <section className="space-y-6 p-6">
                {/* Amount & Status Hero Header */}
                <div className="flex flex-col items-center justify-center py-4 bg-[#E6F0FA]/20 rounded-2xl border border-[#4A90E2]/20 hover:bg-[#E6F0FA]/40 transition-colors">
                    <h6 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-0.5" style={quicksand.style}>
                    {transaction.type || "Transaction"} Amount
                    </h6>
                    <h2 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight" style={bricolage.style}>
                    {formatAmount(transaction.amount)}
                    </h2>
                    <div style={quicksand.style} className="mt-0.5">
                    <span className={getStatusBadge(transaction?.status)}>
                        {transaction?.status}
                    </span>
                    </div>
                </div>

                {/* User / Destination Cards */}
                <div className={`grid gap-3 ${transaction?.type?.toLowerCase() !== "deposit" && "grid-cols-1 sm:grid-cols-2 "}`}>
                    <UserCard title="Sender" user={transaction.sender} />
                    {transaction?.type?.toLowerCase() === "transfer" ? (
                    <UserCard title="Recipient" user={transaction.recipient} />
                    ) : (
                    <UserCard title="Payout Destination" withdrawalInfo={transaction?.withdrawal_info} />
                    )}
                </div>

                {/* Detail List */}
                <div className="bg-[#E6F0FA]/20 rounded-2xl p-2 border border-[#4A90E2]/20 overflow-hidden hover:bg-[#E6F0FA]/40 transition-colors divide-y divide-slate-200">
                    {transactionDetails.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="px-3 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-medium" style={quicksand.style}>{item.label}</span>
                        </div>
                        <div className="flex items-center " style={quicksand.style}>
                            <h2 title={item.value} className="font-bold">
                            {item?.copyable && item?.value ? (
                                <p>{item.value.slice(0, 8)}...{item.value.slice(-4)}</p>
                            ) : (
                                item.value || "N/A"
                            )}
                            </h2>
                            {item.copyable && item.value && (
                            <button
                                type="button"
                                onClick={() => handleCopy(item.value, item.label)}
                                className="p-1 hover:bg-slate-200/60 cursor-pointer rounded transition-colors text-slate-400 hover:text-slate-600 ml-1"
                                title="Copy full text"
                            >
                                {copiedField === item.label ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                <Copy className="w-3.5 h-3.5" />
                                )}
                            </button>
                            )}
                        </div>
                        </div>
                    );
                    })}
                </div>
                </section>
            </>
          )}
        </div>

        {/* Footer with Decline & Approve actions */}
        {(transaction?.type === "withdraw" && transaction?.status.toLowerCase() === "pending") && (
          <footer className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            {/* Decline Button */}
            <button
              type="button"
              onClick={() => handleProcessAction("failed")}
              disabled={isProcessing}
              className="pagination-btn !bg-rose-50 hover:!bg-rose-100 !text-rose-600 disabled:!opacity-50 flex items-center gap-1 cursor-pointer"
              style={bricolage.style}
            >
              {isProcessing && activeAction === "failed" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Decline Transaction
                </>
              )}
            </button>

            {/* Approve/Sent Button */}
            <button
              type="button"
              onClick={() => handleProcessAction("successful")}
              disabled={isProcessing}
              className="pagination-btn !bg-[#03457C] hover:!bg-[#02335c] !text-white disabled:!opacity-50 flex items-center gap-1 cursor-pointer"
              style={bricolage.style}
            >
              {isProcessing && activeAction === "successful" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Mark as Sent
                </>
              )}
            </button>
          </footer>
        )}
      </section>

      <form method="dialog" className="modal-backdrop">
        <button type="button">close</button>
      </form>
    </dialog>
  );
}

export function UserCard({ title, user, withdrawalInfo }) {
  const isWithdrawal = !!withdrawalInfo;

  if (isWithdrawal) {
    if (!withdrawalInfo && !user) return null;

    const bankName = withdrawalInfo?.bankName || withdrawalInfo?.bank_name || "External Bank";
    const accountNumber = withdrawalInfo?.accountNumber || withdrawalInfo?.account_number || "N/A";
    const accountName = withdrawalInfo?.accountName || withdrawalInfo?.account_name || user?.userName || "N/A";

    return (
      <div className="bg-[#E6F0FA]/20 rounded-2xl p-3.5 border border-[#4A90E2]/20 space-y-2.5 hover:bg-[#E6F0FA]/40 transition-colors">
        <div className="flex items-center justify-between">
          <span 
            className="text-[10px] font-bold uppercase tracking-wider text-[#03457C]" 
            style={bricolage?.style}
          >
            {title || "Payout Destination"}
          </span>
          <span 
            className="text-[10px] bg-[#E6F0FA] text-[#03457C] px-2 py-0.5 rounded-full font-semibold border border-[#4A90E2]/20"
            style={quicksand?.style}
          >
            Bank Transfer
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E6F0FA] flex items-center justify-center text-[#03457C] shrink-0 border border-[#4A90E2]/30">
            <Building2 className="w-4 h-4 text-[#03457C]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 truncate text-xs" style={quicksand?.style}>
              {bankName}
            </p>
            <p className="text-[11px] text-slate-500 truncate" style={quicksand?.style}>
              {accountName}
            </p>
          </div>
        </div>

        <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-[#4A90E2]/15" style={quicksand?.style}>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Account No:</span>
            <span className="font-mono text-slate-800 font-semibold">{accountNumber}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#E6F0FA]/20 cursor-pointer rounded-2xl p-3.5 border border-[#4A90E2]/20 space-y-2.5 hover:bg-[#E6F0FA]/40 transition-colors">
      <div className="flex items-center justify-between">
        <span 
          className="text-[10px] font-bold uppercase tracking-wider text-[#03457C]" 
          style={bricolage?.style}
        >
          {title}
        </span>
        {user.tier && (
          <span 
            className="text-[10px] bg-[#E6F0FA] text-[#03457C] px-2 py-0.5 rounded-full font-semibold border border-[#4A90E2]/20"
            style={quicksand?.style}
          >
            Tier {user.tier}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.userName || "User"} 
            className="w-8 h-8 rounded-full object-cover border border-[#4A90E2]/30" 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#03457C] flex items-center justify-center font-bold text-[#fff] text-xs border border-[#4A90E2]/30">
            {user.firstName?.[0] || user.userName?.[0] || "U"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-slate-900 truncate text-xs" style={quicksand?.style}>
              {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || "User"}
            </p>
            {user.isVerified ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Unverified" />
            )}
          </div>
          {user.userName && (
            <p className="text-[11px] text-slate-500 truncate" style={quicksand?.style}>
              @{user.userName}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-[#4A90E2]/15" style={quicksand?.style}>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Account:</span>
          <span className="font-mono text-slate-800 font-medium">{user.accountNumber || "N/A"}</span>
        </div>
        {user.email && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Email:</span>
            <span className="truncate max-w-[130px] text-slate-700" title={user.email}>
              {user.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}