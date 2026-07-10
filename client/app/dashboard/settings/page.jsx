"use client"


import { rows } from "@/app/libs/utils/data";
import { Lock } from "lucide-react";
import { useForgotPassword } from "@/app/auth/api/forgot-password";
import { useUser } from "@/app/auth/api/profile";
import { RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

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
        <motion.div initial={{opacity:0 , scale: 0}} animate={{opacity:1 , scale: 1}} transition={{type: "tween", duration: "0.35", stiffness: 100}}  className="lg:col-span-2 rounded-2xl  border border-slate-300 p-6 lg:p-8 shadow-sm">
          <section>
            <h2 className="font-display font-bold text-lg">Preferences</h2>
            <ul className="mt-4 divide-y divide-slate-300">
              {rows.map(({ key, icon: Icon, label, desc }) => (
                <li key={key} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm opacity-60">{desc}</p>
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

        <motion.div className="rounded-2xl  border border-slate-300 p-6 shadow-sm h-fit" initial={{ x : 80, opacity: 0}}  animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }}>
          <aside>
            <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Security</h3>
            </div>
            <p className="text-sm opacity-60 mt-1">Change your password regularly.</p>

            <button disabled={isLoading} className="btn outline-none border-none shadow-md bg-[#03457C] text-sm rounded-full mt-3 mb-2 w-full text-white disabled:bg-[#03457C]/60" onClick={handleResetPassword}>
              {isLoading ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Sending...</h2> : "Change Password"}
          </button>
          <button disabled={isLogginOut || isLoading} className="btn btn-ghost text-error rounded-full w-full disabled:bg-[#03457C]/60" onClick={handleLogout}>{isLogginOut ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Signing out...</h2> : "Sign out"}</button>
          </aside>
        </motion.div>
        </div>        
  );
}

export default Settings;