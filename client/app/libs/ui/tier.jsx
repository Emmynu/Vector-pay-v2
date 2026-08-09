import { ShieldCheck} from "lucide-react"
import { bricolage, montserrat } from "../utils/font";
import { useUser } from "@/app/auth/api/profile";
import { showToast } from "../toast/sonner";
import { useVerify } from "@/app/auth/api/verify";
import { formatAmount } from "../utils/utils";


function DashboardTier() {
    const { data:user, isLoading } = useUser()
    const { resendVerificationLink, isResending }  = useVerify()

    async  function handleUpgrade(){
        if(user?.isVerified){
            window.location = "/dashboard/profile"
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
        <section className="mt-6 md:mt-0  md:col-span-2 border border-slate-200 bg-white rounded-2xl px-3.5 md:px-5 py-7 shadow-md">

            <header className="flex justify-between items-center">
                <h2 className="flex items-center text-[#03457C] text-sm"><ShieldCheck className="w-4.5"/> <p className={`${bricolage.className} `}>Account tier</p></h2>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F0FA] text-[#4A90E2] text-xs font-semibold">
                    {`Tier ${user?.tier || "1"}`}
                </span>
            </header>    

            <section className="mt-5">
                {/* <div > */}
                    <header className="flex justify-between items-center text-xs text-[#03457C] " style={montserrat.style}>
                        <h2>Daily Limit</h2>
                        {isLoading ? <div className="skeleton w-24 h-2.5 bg-[#E6F0FA]"></div> :  <h4 className="mb-0.5"><span>{formatAmount(user?.dailySpent)}</span>/ <span>{formatAmount(user?.dailyLimit)}</span></h4>}
                    </header>
                    <progress className="progress transition-colors bg-[#E6F0FA] [&::-webkit-progress-value]:bg-[#03457C] w-full" value={user?.dailySpent} max={user?.dailyLimit}></progress>

        
                    {user?.tier <  3 && <button disabled={isLoading || isResending} className="border-2 border-[#03457C] text-[#03457C] font-bold btn shadow-xs w-full mt-3 hover:bg-[#E6F0FA] rounded-full text-xs md:text-sm bg-transparent disabled:opacity-70" onClick={handleUpgrade}>{isResending ? <h3><span className="loading loading-xs loading-spinner mr-1"></span><span>Sending...</span></h3> : "Upgrade tier"}</button>}
                {/* </div> */}
            </section>

        </section>
    );
}

export default DashboardTier;