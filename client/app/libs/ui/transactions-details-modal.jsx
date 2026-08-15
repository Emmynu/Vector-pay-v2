import { useTransactions } from "@/app/dashboard/api/transactions";
import { useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X, 
  Calendar, 
  Hash, 
  FileText,
  User,
  CreditCard,
  Tag,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { bricolage, quicksand } from "../utils/font";
import { formatAmount, formatDate } from "../utils/utils";

function TransactionDetailsModal({ id, transactionId, currentUserId, handleDownload, isDownloading }) {
  const { fetchSingleTransaction, isFetching, transaction } = useTransactions();

  useEffect(() => {
    if (transactionId) {
      fetchSingleTransaction({ transactionId });
    }
  }, [transactionId]);

  const data = transaction?.data;

  const isSender = data?.senderId === currentUserId;

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESSFUL":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Successful
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  

  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 text-slate-800">
        
      
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

       
        {isFetching || !data ? (
          <div className="py-8 space-y-6 animate-pulse">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div className="h-8 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        ) : (
          <div className="pt-4.5 space-y-5">
            
            <div className={`flex flex-col items-center`}>
               <h3 className={`p-3 rounded-full  ${transaction?.type === "withdraw" || (transaction?.type === "transfer" && !isSender) ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}> {transaction?.type === "withdraw" || (transaction?.type === "transfer" && !isSender) ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}</h3>
              </div>
            
            <div className="flex flex-col items-center justify-center text-center space-y-2 pb-2">
              <div className="text-4xl font-extrabold tracking-tight text-slate-900" style={bricolage.style}>
                {transaction?.type === "withdraw" || (transaction?.type === "transfer" && !isSender) ? "-" : "+"}{formatAmount(data?.amount)}
              </div>
              <div>{getStatusBadge(data.status)}</div>
            </div>

           
            <div className="bg-[#E6F0FA]/30 rounded-2xl px-3 py-5 space-y-3.5 border border-slate-200 text-sm">
              
   
              <div className="flex items-center justify-between text-xs md:text-[13px]" style={quicksand.style}>
                <span className="text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 md:w-4 md:h-4 text-slate-400" />
                  Sender
                </span>
                <span className="font-semibold text-slate-900">
                  {data.sender ? `${data.sender.firstName} ${data.sender.lastName}` : "N/A"}
                </span>
              </div>

           
              <div className="flex items-center justify-between text-xs md:text-[13px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 md:w-4 md:h-4 text-slate-400" />
                  Recipient
                </span>
                <span className="font-semibold text-slate-900" style={quicksand.style}>
                  {data.recipient ? `${data.recipient.firstName} ${data.recipient.lastName}` : "N/A"}
                </span>
              </div>

              {(data.recipient?.accountNumber || data.sender?.accountNumber) && (
                <div className="flex items-center justify-between text-xs md:text-[13px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <CreditCard className="w-3.5 md:w-4 md:h-4 text-slate-400" />
                    Account Number
                  </span>
                  <span className="font-mono text-slate-700" style={quicksand.style}>
                    {(isSender ? data.recipient?.accountNumber : data.sender?.accountNumber) || "N/A"}
                  </span>
                </div>
              )}

            
              <div className="flex items-center justify-between text-xs md:text-[13px]" style={quicksand.style}>
                <span className="text-slate-500 flex items-center gap-1">
                  <Tag className="w-3.5 md:w-4 md:h-4 text-slate-400" />
                  Type
                </span>
                <span className="text-slate-700 capitalize">
                  {data?.type}
                </span>
              </div>

              <hr className="border-slate-200 my-3" />

              <div className="flex items-center justify-between text-xs md:text-[13px]" style={quicksand.style}>
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                  Date
                </span>
                <span className="text-slate-700">
                  {data.date ? formatDate(data.date) : "N/A"}
                </span>
              </div>

            
              <div className="flex items-center justify-between text-xs md:text-[13px]" style={quicksand.style}>
                <span className="text-slate-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                  Narration
                </span>
                <span className="text-slate-700 max-w-[180px] truncate text-right">
                  {data.narration || "None"}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="flex items-center justify-between text-xs md:text-[13px]" style={quicksand.style}>
                <span className="text-slate-500 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                  Transaction ID
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {data.id ? `${data.id.slice(0, 8)}...${data.id.slice(-4)}` : "N/A"}
                </span>
              </div>
            </div>

            
            <div className="flex items-center pt-2">
              <button 
                onClick={()=>handleDownload(data)}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#03457C] hover:opacity-95  text-white font-medium rounded-xl transition-colors text-xs md:text-sm shadow-md cursor-pointer disabled:opacity-65"
                style={quicksand.style}
              >
                {isDownloading ? <h2><span className="loading loading-spinner loading-xs mr-1"></span><span>Downloading...</span></h2> : <h2 className="flex gap-2  items-center"><Download className="w-4 h-4" />
                Download Receipt</h2>}
              </button>

              {/* <button 
                onClick={() => onShare?.(data)}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-transparent hover:bg-[#E6F0FA] text-[#03457C] font-bold rounded-xl transition-colors text-xs md:text-sm border-2 border-[#03457C] cursor-pointer"
                style={quicksand.style}
              >
                <Share2 className="w-4 h-4 text-[#03457C]" />
                Share
              </button> */}
            </div>

          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default TransactionDetailsModal;