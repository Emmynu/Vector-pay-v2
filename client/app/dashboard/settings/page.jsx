"use client";

import { useState, useEffect } from "react";
import { rows } from "@/app/libs/utils/data";
import { useForgotPassword } from "@/app/auth/api/forgot-password";
import { useUser } from "@/app/auth/api/profile";
import { RotateCcw, LogOut, ShieldCheck, SlidersHorizontal, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { bricolage, montserrat, quicksand } from "@/app/libs/utils/font";
import { usePathname } from "next/navigation";
import { usePreferences } from "../api/settings/preferences";

function Settings() {
  const { forgotPassword, isLoading } = useForgotPassword();
  const { updatePreferences, isUpdating } = usePreferences();
  const { data: user, logout, isLogginOut } = useUser();
  const pathname = usePathname();

  const [updatingKey, setUpdatingKey] = useState(null);

  const [preferences, setPreferences] = useState({
    isMarketingEnabled: false,
    isBiometricsEnabled: false,
  });


  useEffect(() => {
    if (user) {
      setPreferences({
        isMarketingEnabled: user.isMarketingEnabled,
        isBiometricsEnabled: user.isBiometricsEnabled,
      });
    }
  }, [user]);

  const togglePreference = async (key, locked) => {
    if (locked || isUpdating) return;

    const newValue = !preferences[key];

    setPreferences((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    setUpdatingKey(key);

    try {
      if (key === "isBiometricsEnabled") {
        console.log("Setting up biometrics");
      }

      await updatePreferences({ key, value: newValue });
    } 
    catch (error) {
      // Revert state if update fails
      setPreferences((prev) => ({
        ...prev,
        [key]: !newValue,
      }));
    } 
    finally {
      setUpdatingKey(null);
    }
  };

  function handleResetPassword() {
    const data = {
      email: user?.email,
      role: pathname.includes("/admin") ? "admin" : "user",
    };

    forgotPassword(data);
  }

  function handleLogout() {
    logout("/auth/login");
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {/* Account Preferences Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="lg:col-span-2 rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-xs bg-white"
      >
        <section>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#03457C]" />
            <h2 className="font-bold text-slate-900 md:text-[17px]" style={bricolage.style}>
              Account Preferences
            </h2>
          </div>
          <p style={quicksand.style} className="text-xs text-slate-500">
            Manage your notifications, security alerts, and display configuration.
          </p>

          <ul className="mt-4 divide-y divide-slate-100">
            {rows.map(({ key, icon: Icon, label, desc, isEnforced }) => {
              const isItemUpdating = updatingKey === key;

              return (
                <li key={key} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#03457C] border border-blue-100/80 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs md:text-[13px] font-semibold text-slate-800" style={montserrat.style}>
                        {label}
                      </p>
                      <p className="text-[11px] md:text-xs text-slate-500" style={quicksand.style}>
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isItemUpdating && (
                      <Loader2 className="w-3.5 h-3.5 text-[#03457C] animate-spin" />
                    )}

                    <input
                      type="checkbox"
                      checked={isEnforced ? true : !!preferences[key]}
                      disabled={isEnforced || isUpdating}
                      onChange={() => togglePreference(key, isEnforced)}
                      className={`toggle toggle-sm transition-all ${
                        isEnforced
                          ? "cursor-not-allowed opacity-60 bg-[#03457C] border-[#03457C]"
                          : "border-slate-300 checked:bg-[#03457C] checked:border-[#03457C] bg-slate-200 cursor-pointer disabled:opacity-50"
                      }`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </motion.div>

      {/* Security Actions Card */}
      <motion.div
        className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs h-fit"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <aside className="space-y-3">
          <div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#03457C]" />
              <h3 className="font-bold text-[15px] text-slate-900" style={bricolage.style}>
                Security Controls
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5" style={quicksand.style}>
             Request a password reset or sign out securely.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              disabled={isLoading || isLogginOut}
              className="btn transition-all outline-none border-none shadow-xs bg-[#03457C] hover:bg-[#02335d] rounded-full w-full text-white disabled:opacity-70 text-xs md:text-[13px] font-semibold h-10 min-h-10 cursor-pointer"
              style={bricolage.style}
              onClick={handleResetPassword}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs" />
                  <span>Sending reset link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Change Password</span>
                </div>
              )}
            </button>

            <button
              disabled={isLogginOut || isLoading}
              className="btn transition-all btn-ghost hover:bg-rose-50 border-none outline-none shadow-none text-rose-600 rounded-full w-full disabled:opacity-70 text-xs md:text-[13px] font-semibold h-10 min-h-10 cursor-pointer"
              style={bricolage.style}
              onClick={handleLogout}
            >
              {isLogginOut ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs" />
                  <span>Signing out...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              )}
            </button>
          </div>
        </aside>
      </motion.div>
    </div>
  );
}

export default Settings;