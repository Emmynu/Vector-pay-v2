import { motion } from "motion/react"
import { Lock, BadgeCheck, Loader2, RotateCcw, KeyRound } from "lucide-react"
import { bricolage, quicksand } from "../../utils/font"
import { usePINResetRequest } from "@/app/dashboard/api/pin/pin-reset-request"
import PinResetModal from "../dashboard/pin-reset-modal"

export default function TransactionPINPanel({ user, isLoading }) {
    const { resetTransactionPinRequest, isRequestting } =  usePINResetRequest()

    return(
        <motion.div className="rounded-2xl  border border-slate-200 bg-[#FFF] p-6 lg:p-8 shadow-sm" initial={{y:90,opacity:0}} animate={{y:0, opacity:1}} transition={{type: "tween", duration: 0.3}}>
              <section>
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E6F0FA] text-[#4A90E2] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[17px] sm:text-lg" style={bricolage.style}>Transaction PIN</h3>
                      <p className="text-xs opacity-70" style={quicksand.style}>
                        A 4-digit PIN used to authorize transfers, withdrawals and other sensitive actions.
                      </p>
                    </div>
                    {user?.transactionPin && (
                      isLoading ? <div className="skeleton w-18 h-4.5 bg-slate-200"></div> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success" style={bricolage.style}>
                        <BadgeCheck className="w-3.5 h-3.5" /> PIN set
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 sm:gap-3">
                    <button disabled={isLoading || isRequestting} className={`btn bg-[#03457c] disabled:bg-[#03457c]/60 disabled:cursor-not-allowed text-white text-sm rounded-full border-none ${bricolage.className}`} onClick={()=>document.getElementById('my_modal_1').showModal()}>
                      <KeyRound className="w-4 h-4" />
                      {user?.transactionPin ? "Change PIN" : "Set up PIN"}
                    </button>

                 
                   {user?.transactionPin && <button type="submit" disabled={isLoading || isRequestting} onClick={resetTransactionPinRequest}  className="btn shadow-sm bg-transparent rounded-full text-[#03457C] border-2 flex items-center border-[#03457C] text-sm disabled:opacity-60" style={bricolage.style}>
                        {isRequestting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Resetting...
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
              <PinResetModal id="pin_reset_modal" email={user?.email}/>
            </motion.div>
    )
}