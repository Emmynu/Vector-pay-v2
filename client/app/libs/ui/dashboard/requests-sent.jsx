import { useRequests } from "@/app/dashboard/api/request/get-requests";
import { formatAmount, formatDateStandard, getStatusBadge } from "../../utils/utils";
import { bricolage, quicksand } from "../../utils/font";
import Link from "next/link";
import { Clock, Send, XCircle } from "lucide-react";
import { showToast } from "@/app/libs/toast/sonner";
import { useRequestsAction } from "@/app/dashboard/api/request/requests-action";

function RequestSent() {
    const { fetchRequests, requests, isRefetching, isLoading: isFetching } = useRequests({ type: "sent" });
    const { action, isLoading } = useRequestsAction()
    
    const card = "rounded-2xl bg-[#fff] border border-slate-200 shadow-sm";
    const requestList = requests?.requests || [];

    // Handler to cancel a request
    const handleCancelRequest = async (requestId) => {
        const response = await action({ actionType: "cancel", requestId })
        if(response?.status !== 200){
            showToast({ 
                type: "error", 
                title: response?.title || "Action Failed", 
                msg: response?.msg || "Could not cancel this request." 
            });

            return;
        }

        fetchRequests(); // Refresh the list
        
    };

    return ( 
        <section className={`p-5 ${card}`}>
            <header className="flex items-center justify-between">
                <h3 className="font-bold text-[15px]" style={bricolage.style}>
                    Requests you sent
                </h3>
                <Link
                    href="/dashboard/requests/sent"
                    style={bricolage.style}
                    className="text-xs font-bold text-[#03457c] hover:underline whitespace-nowrap"
                >
                    View all →
                </Link>
            </header>

            {/* Loading Skeleton State */}
            {isFetching || isRefetching ? (
                <ul className="mt-3 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="py-3 border-t border-slate-100 first:border-t-0 animate-pulse">
                            <div className="flex justify-between gap-2">
                                <div className="h-4 bg-slate-200 rounded w-1/3" />
                                <div className="h-4 bg-slate-200 rounded w-1/4" />
                            </div>
                            <div className="h-3 bg-slate-200 rounded w-1/2 mt-2" />
                            <div className="flex justify-between items-center mt-3">
                                <div className="h-3 bg-slate-200 rounded w-1/4" />
                                <div className="h-4 bg-slate-200 rounded-full w-16" />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : requestList.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center text-center py-10 px-4 mt-2 ">
                    <div className="p-3 rounded-full bg-[#E6F0FA] text-[#03457c] mb-2">
                        <Send className="w-5 h-5" />
                    </div>
                    <h4 style={bricolage.style} className="text-sm font-bold text-slate-800">
                        No requests sent yet
                    </h4>
                    <p style={quicksand.style} className="text-xs text-slate-500 max-w-[220px] mt-0.5">
                        Money requests you send to other users will appear here.
                    </p>
                </div>
            ) : (
                /* Populated List */
                <ul className="mt-2">
                    {requestList.map((r) => {
                        const name = `${r?.payer?.firstName || ""} ${r?.payer?.lastName || ""}`.trim() || "Unknown User";
                        const isPending = r?.status?.toLowerCase() === "pending";

                        return (
                            <li key={r.id} className="py-3 border-t border-slate-100 first:border-t-0" style={quicksand.style}>
                                <div className="flex justify-between gap-2">
                                    <p className="text-[13px] font-bold truncate">{name}</p>
                                    <p style={bricolage.style} className="text-[13px] font-bold tabular-nums whitespace-nowrap">
                                        {formatAmount(r?.amount)}
                                    </p>
                                </div>
                                <p className="text-[11px] opacity-60 mt-0.5 truncate">{r.narration || "N/A"}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="flex items-center gap-1 text-[11px] opacity-60">
                                        <Clock className="w-3 h-3" /> {formatDateStandard(r.requestedAt)}
                                    </span>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold capitalize px-2.5 py-0.5 rounded-full border ${getStatusBadge(r?.status)}`}>
                                            {r.status}
                                        </span>

                                       
                                        {isPending && (
                                            <button
                                                onClick={() => handleCancelRequest(r.id)}
                                                disabled={isLoading}
                                                className="text-[10px] font-semibold border border-rose-600 text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                                                title="Cancel Request"
                                                style={bricolage.style}
                                            >
                                                {!isLoading ? <>
                                                <XCircle className="w-3 h-3" />
                                                <span>Cancel</span></>:
                                                <>
                                                    <span>Cancelling...</span>
                                                </>}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export default RequestSent;