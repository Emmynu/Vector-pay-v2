import { bricolage, quicksand } from "@/app/libs/utils/font";
import { User, Mail, AtSign, MapPin, SquarePen } from "lucide-react";

export default function ProfileTabContent({ adminData, isLoading }) {

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
       
        <div className="space-y-2">
          <div className="h-5 w-44 bg-slate-200 rounded-md"></div>
          <div className="h-3.5 w-64 bg-slate-100 rounded-md"></div>
        </div>

        {/* Grid Display Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 ${i === 4 ? "sm:col-span-2" : ""}`}>
              <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-36 bg-slate-300 rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }


  const infoItems = [
    {
      label: "First Name",
      value: adminData?.firstName || "N/A",
      icon: User,
    },
    {
      label: "Last Name",
      value: adminData?.lastName || "N/A",
      icon: User,
    },
    {
      label: "Username",
      value: adminData?.userName ? `${adminData.userName}` : "N/A",
      icon: AtSign,
    },
    {
      label: "Email Address",
      value: adminData?.email || "N/A",
      icon: Mail,
    },
    {
      label: "Location",
      value: adminData?.location || "Not specified",
      icon: MapPin,
      fullWidth: true,
    },
  ];


  return (
    <div className="space-y-6 p-2 sm:p-0">

      <div >
        <h3 style={bricolage.style} className="text-[17px] sm:text-lg font-bold text-slate-900">
          Personal Information
        </h3>
        <p style={quicksand.style} className="text-xs text-slate-500">
          Your administrative personal details and contact information.
        </p>
      </div>

 
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 ${
                item.fullWidth ? "sm:col-span-2" : ""
              }`}
            >
              <div className="p-2.5 bg-white border border-slate-200/80 text-[#03457C] rounded-xl shrink-0 shadow-2xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span style={quicksand.style} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {item.label}
                </span>
                <p style={bricolage.style} className="text-[13px] font-semibold text-slate-800 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>


      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={()=>document.getElementById("my-modal-2").showModal()}
          style={bricolage.style}
          className="flex items-center gap-2 bg-[#03457C] hover:opacity-95 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}