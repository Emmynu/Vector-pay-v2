import { motion } from "motion/react"
import { ShieldCheck, BadgeInfo, BadgeCheck, ShieldAlert } from "lucide-react"
import { bricolage, quicksand, montserrat } from "../../utils/font"
import { useVerify } from "@/app/auth/api/verify"
import { showToast } from "../../toast/sonner"


export default function KYCPanel({ user, isLoading }) {

    const { resendVerificationLink, isResending } = useVerify()

    async function handleKycModal() {
        if(user?.isVerified && user?.tier === 2){
            document.getElementById('my-modal-3')?.showModal()
        }
        else{

            const response =  await resendVerificationLink({ email: user?.email })

            if(response.status === 200){
                showToast({type: response?.data?.status, title:response?.data?.msg, msg:response?.data?.description})
            }else{
                showToast({type:response?.status, title:response?.title,  msg: response?.msg })
            }

        }
    }
    
    return (
        <motion.div className="lg:col-span-3 rounded-2xl  border border-slate-200 bg-[#FFF] p-6 lg:p-8 shadow-sm" initial={{y:90,opacity:0}} animate={{y:0, opacity:1}} transition={{type: "tween", duration: 0.3}}>
            <section >
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E6F0FA] text-[#4A90E2] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] sm:text-lg" style={bricolage.style}>Identity verification (KYC)</h3>
                  <p className="text-[11px] sm:text-xs  opacity-70" style={quicksand.style}>
                    Verify your identity with your National Identification Number (NIN) to raise your transaction limits
                    and unlock all VectorPay features.
                  </p>
                 {user?.kycStatus === "unverified" && <button disabled={isLoading || isResending} className={`btn bg-[#03457C] text-white mt-2 border-none text-sm rounded-full p-6 font-medium disabled:bg-[#03457c]/60 disabled:cursor-not-allowed ${bricolage.className}`} onClick={handleKycModal}>{isResending ? <h3><span className="loading loading-xs loading-spinner mr-1"></span><span>Sending...</span></h3> : "Start NIN verification"}</button>}

                {user?.kycStatus === "pending" && (
                <div className="mt-2.5 p-2.5 md:p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-3">
                  <BadgeInfo className="w-7 md:w-4 h-4 text-warning" />
                  <p className="text-xs  text-black/70">
                    Your NIN submission is under manual review. This usually takes about 5-7 working days.
                  </p>
                </div>
              )}

              {user?.kycStatus === "verified" && (
                <div className="mt-2.5 p-2.5 md:p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
                  <BadgeCheck className="w-7 md:w-4 h-4 text-success" />
                  <p className="text-xs  text-black/70">Your identity has been verified. You now have full access.</p>
                </div>
              )}

              {user?.kycStatus === "declined" && (
                <div className="mt-2.5 p-2.5 md:p-4 rounded-xl bg-red-50 border border-red-300">
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                    <p className="text-[13px] font-semibold text-red-500" style={montserrat.style}>Verification failed</p>
                  </div>
                  {(user?.kyc?.reason) && <p className="text-xs md:text-[13px] opacity-70 mt-1" style={quicksand.style}>{user?.kyc?.reason}</p>}
                  <button onClick={handleKycModal} disabled={isLoading || isResending } className="btn bg-transparent outline-none hover:bg-red-500 text-xs shadow-none hover:shadow-md border-2 border-red-400 text-red-600 hover:text-white rounded-full mt-2 disabled:opacity-60" style={bricolage.style}>
                    {isResending ? <h3><span className="loading loading-xs loading-spinner mr-1"></span><span>Sending...</span></h3> : "Re-submit NIN"}
                  </button>
                </div>
              )}

                 </div>
              </div>
            </section>
        </motion.div>
    )
}