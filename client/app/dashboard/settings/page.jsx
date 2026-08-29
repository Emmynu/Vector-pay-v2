"use client"


import { rows } from "@/app/libs/utils/data";
import { Lock } from "lucide-react";
import { useForgotPassword } from "@/app/auth/api/forgot-password";
import { useUser } from "@/app/auth/api/profile";
import { RefreshCcw, RotateCcw, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { bricolage, montserrat, quicksand } from "@/app/libs/utils/font"

function Settings() {
  const { forgotPassword, isLoading } = useForgotPassword();
  const { data:user, logout, isLogginOut } = useUser()

  function handleResetPassword(){
    const data = {
      email: user?.email
    }

    forgotPassword(data)
  }

  function handleLogout(){
    logout()
  }


    return (
      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.35 }}  className="lg:col-span-2 rounded-2xl  border border-slate-200 p-6 lg:p-8 shadow-sm bg-white">
          <section>
            <h2 className="font-display font-bold " style={bricolage.style}>Preferences</h2>
            <ul className="mt-4 divide-y divide-slate-200">
              {rows.map(({ key, icon: Icon, label, desc }) => (
                <li key={key} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E6F0FA] text-[#4A90E2] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs md:text-[13px]" style={montserrat.style}>{label}</p>
                      <p className="text-[11px] md:text-xs  opacity-60" style={quicksand.style}>{desc}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                  //   checked={prefs[key]}
                  //   onChange={() => toggle(key)}
                    className="toggle bg-[#03457c] opacity-75"
                  />
                </li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm h-fit" initial={{ x : 80, opacity: 0}}  animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }}>
          <aside>
            <div className="flex items-center gap-1">
                {/* <Lock className="w-4 h-4 text-[#4A90E2] " /> */}
                <h3 className="font-semibold text-[14.5px] mt-0.5" style={bricolage.style}>Security</h3>
            </div>
            <p className="text-xs opacity-60 mt-[2px] mb-1" style={quicksand.style}>Change your password regularly.</p>

            <button disabled={isLoading || isLogginOut} className="btn transition-colors outline-none border-none shadow-sm bg-[#03457C] rounded-full mt-3 mb-2 w-full text-white disabled:opacity-80 text-xs md:text-[13px]" style={bricolage.style} onClick={handleResetPassword}>
              {isLoading ? <h2 className="flex items-center">
                <span className="loading loading-spinner loading-xs mr-1"></span><p>Sending...</p></h2> : (
                  <div className="flex items-center gap-1">
                    <RotateCcw className="w-4 h-4"/>
                    <h2  className="">Change Password</h2>
                  </div>
                )}
          </button>
          <button disabled={isLogginOut || isLoading} className="btn transition-colors btn-ghost hover:bg-red-100 border-none outline-none shadow-none text-red-600 rounded-full w-full disabled:opacity-80 disabled:bg-red-50/10 text-xs md:text-[13px]" style={bricolage.style} onClick={handleLogout}>
            {isLogginOut ? 
            <h2 className="flex items-center"><span className="loading loading-spinner loading-xs mr-1"></span><p >Signing out...</p></h2> 
            : (
            <div className="flex items-center gap-1">
              <LogOut className="w-4 h-4"/>
              <h2  className="">Sign out</h2>
            </div>
          )}</button>
          </aside>
        </motion.div>
        </div>        
  );
}

export default Settings;