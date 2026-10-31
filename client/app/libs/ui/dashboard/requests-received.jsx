import { useState } from "react";
import Link from "next/link";
import { X, Check, HandCoins } from "lucide-react";
import { useRequests } from "@/app/dashboard/api/request/get-requests";
import { useRequestsAction } from "@/app/dashboard/api/request/requests-action";
import { card } from "@/app/dashboard/requests/page";
import { bricolage, quicksand } from "../../utils/font";
import { formatAmount } from "../../utils/utils";
import { showToast } from "../../toast/sonner";
import { PinModal } from "./pin-payment-modal";

const fullName = (r) =>
  `${r?.requester?.firstName || ""} ${r?.requester?.lastName || ""}`.trim() || "Unknown User";


function RequestReceived() {
  const { requests, isLoading: isFetching, isRefetching, fetchRequests } = useRequests({
    type: "received",
    status: "pending",
  });
  const { action } = useRequestsAction();

  const [busy, setBusy] = useState(null);
  const [payload, setPayload] = useState(null);

  const requestList = requests?.requests || [];


  async function handleRequest(r, actionType) {
    if (busy || !r?.id) return; 

    if(actionType === "accept"){
      setPayload({
        amount: r?.amount,
        narration: r?.narration,
        accountName:  `${r?.requester?.firstName?.toUpperCase()} ${r?.requester?.lastName?.toUpperCase()}`,
        accountNumber: r?.requester?.accountNumber,
        actionType,
        requestId: r?.id
      })

      document.getElementById("my-modal-4").showModal();
      return;
    }

    if(actionType === "reject"){
      setBusy({ id: r.id, type: actionType });
      try {
        const response = await action({ actionType, requestId: r.id });
        const ok = response?.status === 200

        if (!ok) {
          showToast({
            type: "error",
            title: response?.title || "Action failed",
            msg: response?.msg || `Could not ${actionType} this request.`,
          });
          return;
        }

        showToast({
          type: "success",
          title: "Request rejected",
          msg: `You declined the request from ${fullName(r)}.`,
        });

        await fetchRequests(); 
      } catch (err) {
        showToast({
          type: "error",
          title: "Action failed",
          msg:   `Could not ${actionType} this request.`
        });
      } 
      finally{
         setBusy(null)
      }
    }


   
  }

  return (
    <section className={`p-5 ${card}`}>
      <header className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-bold text-[15px]" style={bricolage.style}>
            Requests for you
          </h3>
          <p className="text-[11px] opacity-60 mt-0.5" style={quicksand.style}>
            {`${requestList.length} waiting for your response`}
          </p>
        </div>
        <Link
          href="/dashboard/requests/received"
          style={bricolage.style}
          className="text-xs font-bold text-[#03457c] hover:underline whitespace-nowrap"
        >
          View all →
        </Link>
      </header>

      {/* Skeleton: first load only, so a refetch doesn't wipe the buttons */}
      {isFetching || isRefetching ? (
        <ul className="mt-3 space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i} className="py-3 border-t border-slate-100 first:border-t-0 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-16" />
              </div>
              <div className="flex gap-2 mt-2.5 pl-12">
                <div className="h-7 bg-slate-200 rounded-full flex-1" />
                <div className="h-7 bg-slate-200 rounded-full flex-1" />
              </div>
            </li>
          ))}
        </ul>
      ) : requestList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 mt-2">
          <div className="p-3 rounded-full bg-[#E6F0FA] text-[#03457c] mb-2">
            <HandCoins className="w-5 h-5" />
          </div>
          <h4 style={bricolage.style} className="text-sm font-bold text-slate-800">
            No pending requests
          </h4>
          <p style={quicksand.style} className="text-xs text-slate-500 max-w-[220px] mt-0.5">
            You have no incoming money requests waiting for your approval.
          </p>
        </div>
      ) : (
        <ul className="mt-2">
          {requestList.map((r) => {
            const name = fullName(r);
            const initials = `${r?.requester?.firstName?.[0] || ""}${r?.requester?.lastName?.[0] || ""}`;
            const isRow = busy?.id === r.id;
            const rejecting = isRow && busy.type === "reject";
  
            return (
              <li key={r.id} className="py-3 border-t border-slate-100 first:border-t-0">
                <div className="flex items-center gap-3">
                  {r?.requester?.photoURL ? (
                    <img src={r.requester.photoURL} alt={name} className="w-9 h-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span
                      style={bricolage.style}
                      className="w-9 h-9 shrink-0 rounded-full bg-[#E6F0FA] text-[#03457c] text-[11px] font-bold flex items-center justify-center"
                    >
                      {initials.toUpperCase() || "U"}
                    </span>
                  )}
                  <div className="min-w-0 flex-1" style={quicksand.style}>
                    <p className="text-[13px] font-bold truncate">{name}</p>
                    <p className="text-[11px] opacity-60 truncate">{r?.narration || "N/A"}</p>
                  </div>
                  <p style={bricolage.style} className="text-[13px] font-bold tabular-nums whitespace-nowrap">
                    {formatAmount(r?.amount)}
                  </p>
                </div>

                <div className="flex gap-2 mt-2.5 pl-12">
                  <button
                    type="button"
                    style={bricolage.style}
                    onClick={() => handleRequest(r, "reject")}
                    disabled={!!busy}
                    className="flex-1 flex items-center justify-center gap-1 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11.5px] font-bold py-1.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {rejecting ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        <span>Rejecting...</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    style={bricolage.style}
                    onClick={() => handleRequest(r, "accept")}
                    disabled={!!busy}
                    className="flex-1 flex items-center justify-center gap-1 rounded-full bg-[#03457c] text-white hover:bg-[#02335c] text-[11.5px] font-bold py-1.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <PinModal formData={payload} type={"request"} setForm={""}/>
    </section>
  );
}

export default RequestReceived;