import { useForgotPassword } from "@/app/auth/api/forgot-password";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { Lock, LogOut, KeyRound, ShieldAlert, Loader2 } from "lucide-react";

export default function SecurityTabContent({ onSignOut, isLogginOut, adminData }) {
  const { forgotPassword, isLoading } = useForgotPassword();

  const handleForgotPassword = () => {
    if (!adminData?.email) return;
    forgotPassword({
      email: adminData.email,
      role: "admin",
    });
  };

  return (
    <div className="space-y-6 p-2 sm:p-0">
      <div >
        <h3 style={bricolage.style} className="text-[16px] sm:text-lg font-bold text-slate-900">
          Security & Account Control
        </h3>
        <p style={quicksand.style} className="text-xs text-slate-500">
          Manage your password credentials and active session settings.
        </p>
      </div>

     
      <div className="grid grid-cols-1 gap-4">
        
        {/* Card 1: Change Password */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-50 text-[#03457C] rounded-xl shrink-0 border border-blue-100">
              <KeyRound className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div >
              <h4 style={bricolage.style} className="text-xs sm:text-sm font-bold text-slate-900">
                Password Settings
              </h4>
              <p style={quicksand.style} className="text-[11px] sm:text-xs text-slate-500">
                Update your login password regularly to ensure system security.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading || !adminData?.email}
            onClick={handleForgotPassword}
            style={bricolage.style}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#03457C]" />
                <span>Sending Mail...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Change Password</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Active Session & Logout */}
        <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100/70 text-rose-600 rounded-xl shrink-0 border border-rose-200/60">
              <ShieldAlert className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div >
              <h4 style={bricolage.style} className="text-xs sm:text-sm font-bold text-slate-900">
                Sign Out Session
              </h4>
              <p style={quicksand.style} className="text-[11px] sm:text-xs text-slate-500">
                Terminate your current admin dashboard session securely.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isLogginOut}
            onClick={onSignOut}
            style={bricolage.style}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isLogginOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}