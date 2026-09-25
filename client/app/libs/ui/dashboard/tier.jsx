import { ShieldCheck, BadgeCheck } from "lucide-react"
import { bricolage, montserrat, quicksand } from "../../utils/font";
import { useUser } from "@/app/auth/api/profile";
import { showToast } from "../../toast/sonner";
import { useVerify } from "@/app/auth/api/verify";
import { formatAmount } from "../../utils/utils";


function DashboardTier() {
    const { data:user, isLoading } = useUser()
    const { resendVerificationLink, isResending }  = useVerify()

    async  function handleUpgrade(){
        if(user?.isVerified && user?.tier === 2){
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

    return (  
        <section className="mt-6 md:mt-0 border border-slate-200 bg-white rounded-2xl px-3.5 md:px-5 py-7 shadow-md">

            <header className="flex justify-between items-center">
                <h2 className="flex items-center text-[#03457C] text-sm"><ShieldCheck className="w-4.5"/> <p className={`${bricolage.className} `}>Account Tier</p></h2>
               {isLoading ? 
                <div className="skeleton bg-[#E6F0FA] h-4 w-12"></div>
              :
             <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F0FA] text-[#4A90E2] text-xs font-semibold" style={quicksand.style}>
              {`Tier ${user?.tier || "1"}`}
            </span>
            }
            </header>    

            <section className="mt-5">
                {/* <div > */}
                    <header className="flex justify-between items-center text-xs text-[#03457C] " style={montserrat.style}>
                        <h2>Daily Limit</h2>
                        {isLoading ? <div className="skeleton w-24 h-2.5 bg-[#E6F0FA]"></div> :  <h4 className="mb-0.5"><span>{formatAmount(user?.dailySpent)}</span>/ <span>{formatAmount(user?.dailyLimit)}</span></h4>}
                    </header>
                    <progress className="progress transition-colors bg-[#E6F0FA] [&::-webkit-progress-value]:bg-[#03457C] w-full" value={user?.dailySpent} max={user?.dailyLimit}></progress>

                    <button 
                        disabled={isLoading || isResending || user?.tier === 3} 
                        className="border-[2px] border-[#03457C] text-[#03457C] btn shadow-xs w-full mt-3 hover:bg-[#03457C] hover:text-white transition-colors rounded-full text-xs md:text-[13px] bg-transparent disabled:opacity-70 disabled:cursor-not-allowed" 
                        onClick={handleUpgrade} 
                        style={bricolage.style}
                        >
                        {isResending ? (
                            <h3 className="flex items-center justify-center gap-2">
                            <span className="loading loading-xs loading-spinner"></span>
                            <span>Sending...</span>
                            </h3>
                        ) : (
                            <div className="flex items-center justify-center gap-1">
                                <BadgeCheck className="w-4 h-4" />
                                <span className="mt-0.5">Upgrade tier</span>
                            </div>
                        )}
                        </button>
                {/* </div> */}
            </section>

        </section>
    );
}

export default DashboardTier;