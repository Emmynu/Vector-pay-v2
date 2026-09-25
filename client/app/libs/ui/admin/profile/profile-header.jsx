import { bricolage, quicksand } from "@/app/libs/utils/font";
import { ShieldCheck } from "lucide-react";

export default function ProfileHeaderCard({ adminData, isLoading }) {
  const fullName = `${adminData?.firstName || ""} ${adminData?.lastName || ""}`.trim() || "Admin";

  if(isLoading){
    return <ProfileHeaderSkeleton />
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center gap-4">

      <div className="relative group">
        {adminData?.photoURL ? (
          <img
            src={adminData.photoURL}
            alt={fullName}
            className="w-20 h-20  rounded-full object-cover shadow-xs"
          />
        ) : (
          <div 
            style={bricolage.style}
            className="w-20 h-20  rounded-full bg-[#03457C] text-[#fff] font-extrabold text-2xl  flex items-center justify-center"
          >
            {fullName.slice(0, 2).toUpperCase()}
          </div>
        )}


      </div>

      {/* Admin Meta */}
      <div className=" text-center sm:text-left">
        <h2 style={bricolage.style} className="text-xl">
          {fullName}
        </h2>
        <p style={quicksand.style} className="text-xs text-slate-500">
          {adminData?.userName}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1" style={quicksand.style}>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-[#03457C] border border-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
            <ShieldCheck className="w-3.5 h-3.5" />
            {adminData?.role}
          </span>

          {/* {!adminData?.isVerified && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Account
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
}



export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center gap-4 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0" />

      {/* Admin Meta Skeleton */}
      <div className="flex flex-col items-center sm:items-start space-y-2 w-full sm:w-auto">
        {/* Name */}
        <div className="h-6 w-36 sm:w-44 bg-slate-200 rounded-md" />

        {/* Username */}
        <div className="h-3.5 w-24 bg-slate-100 rounded-md" />

        {/* Badge Skeleton */}
        <div className="pt-1">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}