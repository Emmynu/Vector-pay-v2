"use client";

import { motion } from "motion/react";
import { ProfileHeaderSkeleton } from "../admin/profile/profile-header";
import { bricolage, quicksand } from "../../utils/font";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function ProfileHeader({ user, isLoading }) {
  const Icon = user?.isVerified ? (
    <ShieldCheck className="w-3.5 h-3.5" />
  ) : (
    <ShieldAlert className="w-3.5 h-3.5" />
  );

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }


  const firstInitial = user?.firstName?.[0]?.toUpperCase() || "";
  const lastInitial = user?.lastName?.[0]?.toUpperCase() || "";

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col items-center gap-3"
    >
      <div>
        {!user?.photoURL ? (
          <div className="w-20 h-20 rounded-full text-white bg-[#03457c] font-bold text-2xl flex items-center justify-center">
            <h2>{firstInitial}{lastInitial}</h2>
          </div>
        ) : (
          <img
            src={user?.photoURL}
            alt={user?.firstName || "Profile"}
            className="w-20 h-20 rounded-full object-cover bg-no-repeat bg-center"
          />
        )}
      </div>

      <div className="text-center">
        <h2 className={`font-bold text-xl capitalize ${bricolage.className}`}>
          {user?.firstName} {user?.lastName}
        </h2>

        <p className="text-xs opacity-50" style={quicksand.style}>
          {user?.userName ? `${user.userName}` : ""}
        </p>

        <p className="text-xs font-semibold">
          <span
            className={`inline-flex items-center rounded-full gap-1 mt-2 px-2.5 py-1 ${
              user?.isVerified
                ? "bg-success/10 text-success"
                : "bg-orange-600/10 text-orange-600"
            }`}
            style={quicksand.style}
          >
            {Icon} {user?.isVerified ? "Verified" : "Unverified"} · Tier {user?.tier || "1"}
          </span>
        </p>
      </div>
    </motion.section>
  );
}