"use client";

import { PieChart } from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";

export default function KYCConversionWidget({ kyc = { total: 0, verified: 0, pending: 0, declined: 0 } }) {

  const total = kyc.total || 1;
  const approvedPct = Math.round(((kyc.verified || 0) / total) * 100);
  const pendingPct = Math.round(((kyc.pending || 0) / total) * 100);
  const declinedPct = Math.round(((kyc.declined || 0) / total) * 100);


  

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 col-span-1 md:col-span-2">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <PieChart className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900" style={bricolage.style}>
            Verification Health
          </h3>
          <p className="text-xs text-slate-500" style={quicksand.style}>
            KYC approval ratio
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
        <div style={{ width: `${approvedPct}%` }} className="bg-emerald-500 h-full" title="Approved" />
        <div style={{ width: `${pendingPct}%` }} className="bg-amber-500 h-full" title="Pending" />
        <div style={{ width: `${declinedPct}%` }} className="bg-rose-500 h-full" title="Declined" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium" style={quicksand.style}>Approved</p>
          <p className="text-sm font-bold text-emerald-600" style={bricolage.style}>{approvedPct}%</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium" style={quicksand.style}>Pending</p>
          <p className="text-sm font-bold text-amber-600" style={bricolage.style}>{pendingPct}%</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium" style={quicksand.style}>Declined</p>
          <p className="text-sm font-bold text-rose-600" style={bricolage.style}>{declinedPct}%</p>
        </div>
      </div>
    </div>
  );
}