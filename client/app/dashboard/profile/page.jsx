"use client"
import { useUser } from "@/app/auth/api/profile";
import  EditProfileModal from "@/app/libs/ui/profile-edit";
import TransactionPinModal from "@/app/libs/ui/pin-setup-modal";
import KYCModal from "@/app/libs/ui/kyc-modal";
import { ShieldCheck, Mail, KeyRound,Lock, ShieldAlert, BadgeCheck, BadgeInfo, Loader2, RotateCcw, Wallet2, CreditCard, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { bricolage, montserrat, quicksand } from "@/app/libs/utils/font";
import { showToast } from "@/app/libs/toast/sonner";
import { useVerify } from "@/app/auth/api/verify";
import { usePin } from "../api/pin";


function Profile() {

  const { data: user, isLoading } = useUser()
  const { resendVerificationLink, isResending } = useVerify()
  const { resetTransactionPin, isResetting } = usePin()
  const Icon = user?.isVerified ? <ShieldCheck className="w-3.5 h-3.5"/>: <ShieldAlert className="w-3.5 h-3.5"/>
  const rejectionReason = "The name provided doesnt match the name on the NIN slip."
  
  console.log(user)

 async function handleKycModal() {
    if(user?.isVerified){
      document.getElementById('my-modal-3')?.showModal()
    }
  else{

      const data = {
        email: user?.email
      }
      const response =  await resendVerificationLink(data)

      if(response.status === 200){
          showToast({type: response?.data?.status, title:response?.data?.msg, msg:response?.data?.description})
      }else{
          showToast({type:response?.status, title:response?.title,  msg: response?.msg })
      }

  }
  }



  function handlePinReset() {
    resetTransactionPin()
  }


    return (    
        <div className="grid lg:grid-cols-3 gap-5">
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "tween", duration: 0.35 }} className="rounded-2xl border text-y border-slate-200 bg-[#FFF] p-6 shadow-sm text-center">
             {isLoading ? <section>
              <div className="flex flex-col items-center justify-center mx-auto">
                <div className="skeleton w-22 h-22 rounded-full bg-slate-200"></div>
                <div className="skeleton w-40 h-3.5 mt-4 bg-slate-200"></div>
                <div className="skeleton w-36 h-3.5 mt-2 bg-slate-200"></div>
                <div className="skeleton w-32 h-3.5 mt-2 bg-slate-200"></div>
              </div>
             </section> :  <section >

                <div className="flex items-center justify-center mx-auto">
                   {!user?.photoURL ? <div className="w-22 h-22 rounded-full text-white bg-[#03457c] font-bold text-3xl flex items-center justify-center">
                  <h2>{user?.firstName.split(" ").map((s) => s[0]).join("").toUpperCase()}</h2>
                  <h2>{user?.lastName.split(" ").map((s) => s[0]).join("").toUpperCase()}</h2>
                  </div> : <img src={user?.photoURL} alt={user?.firstName} className="w-22 h-22 rounded-full bg-no-repeat bg-center"/>
                  }
                </div>

              
                <h2 className={`mt-4 font-bold text-xl ${bricolage.className}`}>{
                  `${ user?.firstName.split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1))}
                    ${ user?.lastName.split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1))}
                  `}</h2>

                  <p className={`text-xs opacity-50 `} style={quicksand.style}>{user?.userName}</p>
                  <p className="text-xs font-semibold">
                    <span className={`inline-flex items-center rounded-full gap-1 mt-2 px-2.5 py-1 ${user?.isVerified ? "bg-success/10 text-success": "bg-orange-600/10 text-orange-600"}`} style={quicksand.style}>{Icon} {user?.isVerified ? `Verified ` : `Unverified`} · {`Tier ${user?.tier || "1"}`}</span>
                </p>
              </section>}
            </motion.div>

            <motion.div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-[#FFF] p-4 md:p-6 lg:p-8 shadow-sm" initial={{ x : 80, opacity: 0}}  animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }}>
                <section>
              <h2 className="font-display font-bold text-lg" style={bricolage.style}>Personal details</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Field isLoading={isLoading} icon={Mail} label="Email" value={user?.email} />
                  <Field isLoading={isLoading} icon={MapPin} label="Location" value={user?.location} />
              </div>
              <div className="mt-6 pt-6 border-t border-slate-300">
                  <h3 className="font-semibold text-sm" style={bricolage.style}>Account</h3>
                  <div className="mt-3 grid sm:grid-cols-2 gap-4">
                    <Field isLoading={isLoading} icon={CreditCard} label="Account number" value={user?.accountNumber} mono />
                    <Field isLoading={isLoading} icon={Wallet2} label="Wallet" value={"VectorPay Wallet"} />
                  </div>
              </div>
              <button disabled={isLoading || isResending || isResetting} className={`btn bg-[#03457c] text-white hover:opacity-90 transition-opacity shadow-none border-none outline-none rounded-full mt-6 disabled:bg-[#03457c]/60 disabled:cursor-not-allowed ${bricolage.className}`}  onClick={()=>document.getElementById('my-modal-2').showModal()} >Edit profile</button>
              
              {(user?.kycStatus === "unverified" || user?.kycStatus ==="declined") && (<button disabled={isLoading || isResending || isResetting } className={`ml-1.5 btn bg-transparent border-2 border-[#03457c] hover:bg-[#03457C] hover:text-white transition-colors shadow-none text-[#03457C] outline-none rounded-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed ${bricolage.className}`} onClick={handleKycModal}><ShieldCheck className="w-5 h-5"/>{isResending ? "Verifying...": "Verify with NIN" }</button>)}
              </section>
            </motion.div>

             {/* Transaction PIN panel */}
            <motion.div className="lg:col-span-3 rounded-2xl  border border-slate-200 bg-[#FFF] p-6 lg:p-8 shadow-sm" initial={{y:90,opacity:0}} animate={{y:0, opacity:1}} transition={{type: "tween", duration: 0.3}}>
              <section>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E6F0FA] text-[#4A90E2] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-bold text-base" style={montserrat.style}>Transaction PIN</h3>
                      <p className="text-xs md:text-[13px] opacity-70 mt-0.5" style={quicksand.style}>
                        A 4-digit PIN used to authorize transfers, withdrawals and other sensitive actions.
                      </p>
                    </div>
                    {user?.transactionPin && (
                      isLoading ? <div className="skeleton w-18 h-4.5 bg-slate-200"></div> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                        <BadgeCheck className="w-3.5 h-3.5" /> PIN set
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button disabled={isLoading || isResending || isResetting} className={`btn bg-[#03457c] disabled:bg-[#03457c]/60 disabled:cursor-not-allowed text-white text-sm rounded-full border-none ${bricolage.className}`} onClick={()=>document.getElementById('my_modal_1').showModal()}>
                      <KeyRound className="w-4 h-4" />
                      {user?.transactionPin ? "Change PIN" : "Set up PIN"}
                    </button>
                    
                   {user?.transactionPin && <button type="submit" disabled={isLoading || isResending || isResetting} onClick={handlePinReset} className="btn shadow-sm bg-transparent rounded-full text-[#03457C] border-2 flex items-center border-[#03457C] text-sm" style={bricolage.style}>
                        {!true ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Reseting...
                        </>
                        ): (
                         <>
                          <RotateCcw className="w-4 h-4"/>
                          Reset PIN
                          </>
                        )}
                    </button>}
                  </div>
                </div>
              </div>
              </section>
            </motion.div>

            {/* KYC Panel */}
            <motion.div className="lg:col-span-3 rounded-2xl  border border-slate-200 bg-[#FFF] p-6 lg:p-8 shadow-sm" initial={{y:90,opacity:0}} animate={{y:0, opacity:1}} transition={{type: "tween", duration: 0.3}}>
              <section >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E6F0FA] text-[#4A90E2] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold" style={montserrat.style}>Identity verification (KYC)</h3>
                  <p className="text-xs md:text-[13px] opacity-70 mt-0.5" style={quicksand.style}>
                    Verify your identity with your National Identification Number (NIN) to raise your transaction limits
                    and unlock all VectorPay features.
                  </p>
                 {user?.kycStatus === "unverified" && <button disabled={isLoading || isResending || isResetting} className={`btn bg-[#03457C] text-white mt-2 border-none text-sm rounded-full p-6 font-medium disabled:bg-[#03457c]/60 disabled:cursor-not-allowed ${bricolage.className}`} onClick={handleKycModal}>{isResending ? <h3><span className="loading loading-xs loading-spinner mr-1"></span><span>Sending...</span></h3> : "Start NIN verification"}</button>}

                {user?.kycStatus === "pending" && (
                <div className="mt-2.5 p-2.5 md:p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-3">
                  <BadgeInfo className="w-7 md:w-4 h-4 text-warning" />
                  <p className="text-xs md:text-sm text-black/70">
                    Your NIN submission is under manual review. This usually takes about 5-7 working days.
                  </p>
                </div>
              )}

              {user?.kycStatus === "verified" && (
                <div className="mt-2.5 p-2.5 md:p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
                  <BadgeCheck className="w-7 md:w-4 h-4 text-success" />
                  <p className="text-xs md:text-sm text-black/70">Your identity has been verified. You now have full access.</p>
                </div>
              )}

              {user?.kycStatus === "declined" && (
                <div className="mt-2.5 p-2.5 md:p-4 rounded-xl bg-red-50 border border-red-300">
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                    <p className="text-[13px] font-semibold text-red-500" style={montserrat.style}>Verification failed</p>
                  </div>
                  {rejectionReason && <p className="text-xs md:text-[13px] opacity-70 mt-1" style={quicksand.style}>{rejectionReason}</p>}
                  <button onClick={handleKycModal} disabled={isLoading || isResending || isResetting} className="btn bg-transparent outline-none hover:bg-red-500 text-xs md:text-sm shadow-none hover:shadow-md border-2 border-red-400 text-red-600 hover:text-white rounded-full mt-3 disabled:opacity-60">
                    {isResending ? <h3><span className="loading loading-xs loading-spinner mr-1"></span><span>Sending...</span></h3> : "Re-submit NIN"}
                  </button>
                </div>
              )}

                 </div>
              </div>
            </section>
            </motion.div>

            <EditProfileModal id="my-modal-2" user={user}/>
            <TransactionPinModal id="my_modal_1" hasPin={user?.transactionPin !== null ? true : false}/>
            <KYCModal id="my-modal-3"/>
        </div>

     );
}


function Field({
  icon: Icon,
  label,
  value,
  mono,
  isLoading
}) {
  return (
  <>
    <div className="p-4 rounded-xl border border-slate-400 ">
      <div className="flex items-center gap-1 text-xs opacity-60" style={quicksand.style}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      {isLoading ? <div className="skeleton mt-3 w-38 h-3 bg-slate-200"></div>: <p className={`mt-1 font-bold ${mono ? "font-mono tracking-wide" : ""} text-sm`} style={quicksand.style}>{value}</p>}
    </div>
  </>
  );
}

export default Profile;