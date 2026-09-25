"use client";

import { motion } from "motion/react";
import { 
  Mail, 
  Wallet2, 
  CreditCard, 
  MapPin, 
  AtSign,
  Edit
} from "lucide-react";
import { bricolage, quicksand } from "../../utils/font";

export default function ProfileDetails({ user, isLoading }) {
  const detailCards = [
    {
      label: "Email Address",
      value: user?.email || "N/A",
      icon: Mail,
    },
    {
      label: "Username",
      value: user?.userName ? `${user.userName}` : "N/A",
      icon: AtSign,
    },
    {
      label: "Location",
      value: user?.location || "Not set",
      icon: MapPin,
    },
    {
      label: "Account Number",
      value: user?.accountNumber || "N/A",
      icon: CreditCard,
      mono: true,
    },
    {
      label: "Wallet Type",
      value: "VectorPay Wallet",
      icon: Wallet2,
      fullWidth: true,
    },
  ];

  if (isLoading) {
    return <ProfileDetailsSkeleton />;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
    >
      <header className="flex flex-col">
        <h2 style={bricolage.style} className="text-[17px] sm:text-lg font-bold text-slate-900">
          Personal Information
        </h2>
        <p style={quicksand.style} className="text-xs text-slate-500">
          Your administrative personal details and contact information.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-3.5">
        {detailCards.map((info, idx) => {
          const Icon = info.icon;
          return (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className={`bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 ${
                info?.fullWidth ? "sm:col-span-2" : ""
              }`}
            >
              <section className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <h2 className="text-xs text-slate-500 font-medium" style={quicksand.style}>
                  {info.label}
                </h2>
              </section>
              <h3
                style={bricolage.style}
                className={`text-[13px] text-slate-800 font-semibold ${
                  info.mono ? "font-mono tracking-wider" : ""
                }`}
              >
                {info.value}
              </h3>
            </motion.article>
          );
        })}
      </section>

      <footer className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => document.getElementById("my-modal-2")?.showModal()}
          style={bricolage.style}
          className="flex items-center gap-2 bg-[#03457C] hover:opacity-95 text-white text-xs sm:text-sm font-semibold px-4.5 py-2.5 rounded-full shadow-xs transition-all cursor-pointer !outline-none !border-none"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </footer>
    </motion.main>
  );
}


export function ProfileDetailsSkeleton() {
  return (
    <div className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 animate-pulse">
      <div className="space-y-1.5">
        <div className="h-5 w-40 bg-slate-200 rounded-md" />
        <div className="h-3 w-64 bg-slate-100 rounded-md" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded-md" />
            <div className="h-4 w-32 bg-slate-200 rounded-md" />
          </div>
        ))}
        <div className="sm:col-span-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
          <div className="h-3 w-20 bg-slate-200 rounded-md" />
          <div className="h-4 w-40 bg-slate-200 rounded-md" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <div className="h-9 w-28 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}