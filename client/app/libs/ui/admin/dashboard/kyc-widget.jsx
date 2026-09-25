"use client";

import { Check, X, ShieldAlert, ArrowRight, Eye } from "lucide-react";
import { bricolage, quicksand } from "../../../utils/font";
import Link from "next/link";
import { formatDate } from "@/app/libs/utils/utils";
import KycDetailModal from "../kyc/kyc-detail-modal";
import { useState } from "react";

export default function PendingKYCWidget({ pendingKyc, isLoading, isRefetching }) {

  const [selectedID, setSelectedID ] = useState(null)


  const handleOpenModal = (id) => {
    setSelectedID(id)
    const modal = document.getElementById("kyc-detail-modal");
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 col-span-1 md:col-span-2 lg:col-span-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900" style={bricolage.style}>
              Pending KYC Reviews
            </h3>
            <p className="text-xs text-slate-500" style={quicksand.style}>
              Requires manual verification
            </p>
          </div>
        </div>

        <Link
          href="/admin/kyc"
          className="text-xs font-semibold text-[#03457C] hover:underline flex items-center gap-1"
          style={quicksand.style}
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div >
        {isLoading || isRefetching ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-200 rounded-md" />
                  <div className="h-2.5 w-20 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                <div className="w-7 h-7 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))
        ) : !pendingKyc || pendingKyc.length === 0 ? (
  
          <p className="text-xs text-slate-400 py-6 text-center" style={quicksand.style}>
            No pending KYC verifications at the moment.
          </p>
        ) : (
            <div className="divide-y divide-slate-100">
            {  
                pendingKyc.slice(0, 4).map((item) => (
                <div key={item?.id || item?._id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                    className="w-9 h-9 rounded-full bg-[#03457C] text-white font-bold text-xs flex items-center justify-center shrink-0"
                    style={bricolage.style}
                    >
                    {item?.full_name?.slice(0, 2)?.toUpperCase() || "U"}
                    </div>
                    <div>
                    <p className="text-xs font-semibold text-slate-800" style={bricolage.style}>
                        {item?.full_name || "Unknown User"}
                    </p>
                    <p className="text-[11px] text-slate-400" style={quicksand.style}>
                        Tier {item?.tier || "2"} · {formatDate(item?.date || item?.createdAt)}
                    </p>
                    </div>
                </div>

                
                <div className="flex items-center gap-1.5">
                    <button
                    onClick={()=>handleOpenModal(item?.userId)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Decline KYC"
                    >
                    <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                    onClick={()=>handleOpenModal(item?.userId)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Approve KYC"
                    >
                    <Check className="w-3.5 h-3.5" />
                    </button>
                </div>
                </div>
                ))
            }
          </div>
        )}
        <KycDetailModal userId={selectedID}/>
      </div>
    </div>
  );
}