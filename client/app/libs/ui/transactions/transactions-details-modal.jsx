import { useTransaction } from "@/app/dashboard/api/transactions/get-single-transaction";
import { useEffect, useState } from "react";
import { 
  X, 
  Calendar, 
  Hash, 
  FileText,
  User,
  CreditCard,
  Tag,
  Download,
  Copy,
  Landmark,
  Ticket,
  ArrowUpRight,
  ArrowDownLeft,
  Check 
} from "lucide-react";
import { bricolage, quicksand } from "../../utils/font";
import { formatAmount, formatDate, getStatusBadge } from "../../utils/utils";
import { useVerify } from "@/app/dashboard/api/transactions/verify-transaction";
import { useQueryClient } from "@tanstack/react-query";

function TransactionDetailsModal({ id, transactionId, currentUserId, handleDownload, isDownloading }) {
  const { transaction, isLoading, fetchTransaction, isRefetching } = useTransaction(transactionId);
  const { verifyTransaction, verifiedTransaction } = useVerify(transaction?.reference, transaction?.type);
  const query = useQueryClient();

  const [copyLabel, setCopyLabel] = useState(null);

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  useEffect(() => {
    if (transaction && transaction?.type === "deposit" && transaction?.reference) {
      verifyTransaction()
    }
  }, [transaction]);

  useEffect(() => {
    if (verifiedTransaction) {
      query.refetchQueries({ queryKey: ["get-single-transaction", transactionId] });
      query.refetchQueries({ queryKey: ["transactions"] });
    }
  }, [verifiedTransaction]);

  const isSender = transaction?.senderId === currentUserId;

  const allDetails = [
    { 
      title: "Sender", 
      value: transaction?.sender ? `${transaction?.sender.firstName} ${transaction?.sender.lastName}` : "N/A", 
      icon: User,
      showable: true,
    },
    { 
      title: "Recipient", 
      value: transaction?.recipient 
        ? `${transaction?.recipient.firstName} ${transaction?.recipient.lastName}` 
        : transaction?.withdrawal_info 
        ? transaction?.withdrawal_info?.account_name 
        : "N/A", 
      icon: User,
      showable: true,
    },
    { 
      title: "Account Number", 
      value: transaction?.type === "withdraw" 
        ? transaction?.withdrawal_info?.account_number 
        : transaction?.type === "transfer" 
        ? (isSender ? transaction?.recipient?.accountNumber : transaction?.sender?.accountNumber) 
        : "N/A", 
      icon: CreditCard,
      showable: true,
    },
    { 
      title: "Type", 
      value: transaction?.type, 
      icon: Tag,
      showable: true,
    },
    { 
      title: "Bank", 
      value: transaction?.withdrawal_info?.bank_name || "N/A", 
      icon: Landmark,
      showable: transaction?.type === "withdraw", // Show strictly on withdraw
    },
    { 
      title: "Date", 
      value: formatDate(transaction?.date), 
      icon: Calendar,
      showable: true,
    },
    { 
      title: "Narration", 
      value: transaction?.narration || "N/A", 
      icon: FileText,
      showable: true,
    },
    { 
      title: "Reference", 
      displayValue: transaction?.reference ? `${transaction.reference.slice(0, 8)}...${transaction.reference.slice(-4)}` : "N/A", 
      icon: Ticket,
      value: transaction?.reference,
      copyable: true,
      showable: true,
    },
    { 
      title: "Transaction ID", 
      displayValue: transaction?.id ? `${transaction.id.slice(0, 8)}...${transaction.id.slice(-4)}` : "N/A", 
      value: transaction?.id,
      icon: Hash,
      copyable: true,
      showable: true,
    },
  ];

  // Filter out non-showable items
  const activeDetails = allDetails.filter((item) => item.showable);


  const firstFour = activeDetails.slice(0, 4);
  const remainingDetails = activeDetails.slice(4);

  function handleCopy(value, label) {
    if (!value) return;
    setCopyLabel(label);
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setCopyLabel(null);
    }, 1000);
  }

  const renderDetailItem = (info) => {
    const Icon = info.icon;
    return (
      <article className="flex items-center justify-between text-xs py-1" style={quicksand.style} key={info.title}>
        <p className="text-slate-500 flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-slate-400" />
          {info.title}
        </p>
        <div className="text-slate-900 font-medium flex items-center gap-1">
          {info?.copyable && info?.value ? (
            <span>{info.displayValue}</span>
          ) : (
            <span>{info.value || "N/A"}</span>
          )}

          {info?.copyable && info?.value && (
            <button 
              type="button"
              className="p-1 hover:bg-slate-200/60 cursor-pointer rounded transition-colors text-slate-400 hover:text-slate-600 ml-0.5" 
              onClick={() => handleCopy(info?.value, info?.title)}
              title="Copy to clipboard"
            >
              {copyLabel === info.title ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-md pt-5 pb-6 px-6 sm:px-8 relative border border-slate-100 text-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-lg sm:text-xl text-black" style={bricolage.style}>
            Transaction Details
          </h3>
          <form method="dialog">
            <button className="p-2 rounded-full outline-none cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-[#E6F0FA]/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>


        {(isLoading || !transaction || isRefetching) ? (
          <TransactionDetailSkeleton />
        ) : (
          <div className="pt-4.5 space-y-5">
    
            <section className="flex flex-col items-center">
              <h3 className={`p-3 rounded-full ${(transaction?.type === "withdraw" || (transaction?.type === "transfer" && isSender)) ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                {transaction?.type === "withdraw" || (transaction?.type === "transfer" && isSender) ? (
                  <ArrowUpRight className="w-6 h-6" />
                ) : (
                  <ArrowDownLeft className="w-6 h-6" />
                )}
              </h3>
            </section>

            {/* Amount & Status */}
            <section className="flex flex-col items-center justify-center -mt-2 text-center space-y-1 pb-1.5">
              <section className="text-4xl font-extrabold tracking-tight text-slate-900" style={bricolage.style}>
                {transaction?.type === "withdraw" || (transaction?.type === "transfer" && isSender) ? "-" : "+"}
                {formatAmount(transaction?.amount)}
              </section>
              <section style={quicksand.style} className={getStatusBadge(transaction?.status)}>
                {transaction?.status}
              </section>
            </section>

            <div className="bg-[#E6F0FA]/30 rounded-2xl px-4 py-4 border border-slate-200 text-sm">
              <div className="space-y-1">
                {firstFour.map(renderDetailItem)}
              </div>

              {remainingDetails.length > 0 && (
                <>
                  <hr className="border-slate-200/80 my-3" />
                  <div className="space-y-1">
                    {remainingDetails.map(renderDetailItem)}
                  </div>
                </>
              )}
            </div>

            {/* Download Action Button */}
            <div className="flex items-center pt-2">
              <button 
                onClick={() => handleDownload(transaction)}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#03457C] hover:opacity-95 text-white font-medium rounded-xl transition-colors text-xs md:text-sm shadow-md cursor-pointer disabled:opacity-65"
                style={quicksand.style}
              >
                {isDownloading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="loading loading-spinner loading-xs" />
                    <span>Downloading...</span>
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function TransactionDetailSkeleton() {
  return (
    <div className="pt-4.5 space-y-5 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-slate-200 rounded-full" />
      </div>

      <div className="flex flex-col items-center justify-center -mt-3 space-y-1 pb-1.5">
        <div className="h-6 w-36 bg-slate-200 rounded-lg" />
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
      </div>

      <div className="bg-[#E6F0FA]/30 rounded-2xl px-4 py-4 space-y-3 border border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center justify-between"><div className="h-4 w-20 bg-slate-200 rounded" /><div className="h-4 w-28 bg-slate-200 rounded" /></div>
          <div className="flex items-center justify-between"><div className="h-4 w-20 bg-slate-200 rounded" /><div className="h-4 w-32 bg-slate-200 rounded" /></div>
          <div className="flex items-center justify-between"><div className="h-4 w-24 bg-slate-200 rounded" /><div className="h-4 w-24 bg-slate-200 rounded" /></div>
          <div className="flex items-center justify-between"><div className="h-4 w-16 bg-slate-200 rounded" /><div className="h-4 w-20 bg-slate-200 rounded" /></div>
        </div>

        <hr className="border-slate-200 my-3" />

        <div className="space-y-2">
          <div className="flex items-center justify-between"><div className="h-4 w-16 bg-slate-200 rounded" /><div className="h-4 w-28 bg-slate-200 rounded" /></div>
          <div className="flex items-center justify-between"><div className="h-4 w-20 bg-slate-200 rounded" /><div className="h-4 w-36 bg-slate-200 rounded" /></div>
          <div className="flex items-center justify-between"><div className="h-4 w-20 bg-slate-200 rounded" /><div className="h-4 w-32 bg-slate-200 rounded" /></div>
          <div className="flex items-center justify-between"><div className="h-4 w-24 bg-slate-200 rounded" /><div className="h-4 w-32 bg-slate-200 rounded" /></div>
        </div>
      </div>

      <div className="pt-2">
        <div className="h-11 w-full bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export default TransactionDetailsModal;