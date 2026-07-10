"use client"
import { useUser } from "@/app/auth/api/profile";
import  EditProfileModal from "@/app/libs/ui/profile-edit";
import TransactionPinModal from "@/app/libs/ui/pin-setup-modal";
import { ShieldCheck, Mail, KeyRound,Lock, ShieldAlert, IdCard, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { bricolage } from "@/app/libs/utils/font";

function Profile() {

  const { data: user } = useUser()
  const Icon = user?.isVerified ? <ShieldCheck className="w-3.5 h-3.5"/>: <ShieldAlert className="w-3.5 h-3.5"/>

    console.log(user);
    
    
    return (    
        <div className="grid lg:grid-cols-3 gap-5">
            
            <motion.div initial={{opacity:0 , scale: 0}} animate={{opacity:1 , scale: 1}} transition={{type: "tween", duration: "0.25", stiffness: 100}} className="rounded-2xl border border-slate-300 p-6 shadow-sm text-center">
              <section >
                <div className="w-24 h-24 rounded-full bg-[#03457C] flex items-center justify-center text-primary-content text-3xl font-bold mx-auto">
                   {`${user?.firstName.split(" ").map((s) => s[0]).join("").toUpperCase()} 
                    ${user?.lastName.split(" ").map((s) => s[0]).join("").toUpperCase()}`}
                </div>
                <h2 className={`mt-4 font-bold text-xl ${bricolage.className}`}>{
                  `${ user?.firstName.split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1))}
                    ${ user?.lastName.split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1))}
                  `}</h2>
                <p className={`text-sm opacity-50 `}>{user?.userName}</p>
                <p className="text-xs font-semibold">
                    <span className={`inline-flex items-center rounded-full gap-1 mt-3 px-2.5 py-1 ${user?.isVerified ? "bg-success/10 text-success": "bg-orange-600/10 text-orange-600"}`}>{Icon} {user?.isVerified ? `Verified ` : `Unverified`} · {`Tier ${user?.tier || "1"}`}</span>
                </p>
            </section>
            </motion.div>

            <motion.div className="lg:col-span-2 rounded-2xl border border-slate-300 p-4 md:p-6 lg:p-8 shadow-sm" initial={{ x : 80, opacity: 0}}  animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }}>
                <section>
              <h2 className="font-display font-bold text-lg">Personal details</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Field icon={Mail} label="Email" value={user?.email} />
                  <Field icon={IdCard} label="NIN" value={user?.nin || <span className="italic">Not Provided</span>} />
              </div>
              <div className="mt-6 pt-6 border-t border-slate-300">
                  <h3 className="font-semibold">Account</h3>
                  <div className="mt-3 grid sm:grid-cols-2 gap-4">
                    <Field label="Account number" value={user?.accountNumber} mono />
                    <Field label="Wallet" value={"VectorPay Wallet"} />
                  </div>
              </div>
              <button className={`btn bg-[#03457c] hover:opacity-90 transition-opacity shadow-none border-none outline-none rounded-full mt-6 ${bricolage.className}`} popoverTarget="my-modal-2" >Edit profile</button>
              
               <button className={`ml-1.5 btn bg-transparent border-2 border-[#03457c] hover:bg-[#03457C] hover:text-white transition-colors shadow-none text-[#03457C] outline-none rounded-full mt-6 ${bricolage.className}`} >         <ShieldCheck className="w-5 h-5"/> Verify with NIN</button>
              </section>
            </motion.div>

             {/* Transaction PIN panel */}
            <motion.div className="lg:col-span-3 rounded-2xl  border border-slate-300 p-6 lg:p-8 shadow-sm" initial={{y:90,opacity:0}} animate={{y:0, opacity:1}} transition={{type: "tween", duration: 0.3}}>
              <section className="lg:col-span-3 rounded-2xl  border border-slate-200 p-6 lg:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-bold text-lg">Transaction PIN</h3>
                      <p className="text-sm opacity-70 mt-1">
                        A 4-digit PIN used to authorize transfers, withdrawals and other sensitive actions.
                      </p>
                    </div>
                    {user?.transactionPin && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                        <BadgeCheck className="w-3.5 h-3.5" /> PIN set
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button className="btn bg-[#03457c] rounded-full border-none" onClick={()=>document.getElementById('my_modal_1').showModal()}>
                      <KeyRound className="w-4 h-4" />
                      {user?.transactionPin ? "Change PIN" : "Set up PIN"}
                    </button>
                  </div>
                </div>
              </div>
              </section>
            </motion.div>

            {/* KYC Panel */}
            <motion.div className="lg:col-span-3 rounded-2xl  border border-slate-300 p-6 lg:p-8 shadow-sm" initial={{y:90,opacity:0}} animate={{y:0, opacity:1}} transition={{type: "tween", duration: 0.3}}>
              <section >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg">Identity verification (KYC)</h3>
                  <p className="text-sm opacity-70 mt-1">
                    Verify your identity with your National Identification Number (NIN) to raise your transaction limits
                    and unlock all VectorPay features.
                  </p>
                  <button className={`btn bg-[#03457C] text-white mt-2 border-none rounded-full p-6 font-medium ${bricolage.className}`}>Start NIN verification</button>
                 </div>
              </div>
            </section>
            </motion.div>
            <EditProfileModal id="my-modal-2" user={user}/>
            <TransactionPinModal id="my_modal_1" hasPin={user?.transactionPin ? true: false}/>
        </div>

     );
}


function Field({
  icon: Icon,
  label,
  value,
  mono,
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-400">
      <div className="flex items-center gap-2 text-xs opacity-60">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <p className={`mt-1 font-medium ${mono ? "font-mono tracking-wider" : ""}`}>{value}</p>
    </div>
  );
}

export default Profile;