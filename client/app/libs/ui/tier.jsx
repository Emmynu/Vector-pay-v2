import { ShieldCheck} from "lucide-react"
import { bricolage, montserrat, ubuntu } from "../utils/font";
import { useUser } from "@/app/auth/api/profile";


function DashboardTier() {
    const { data:user } = useUser()

    function handleUpgrade(){
        window.location = "/dashboard/profile"
        document.getElementById('my-modal-3')?.showModal()

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
                        <h4>₦513,812.30 / ₦500,000.00</h4>
                    </header>
                    <progress className="progress transition-colors bg-[#E6F0FA] [&::-webkit-progress-value]:bg-[#03457C] w-full" value="40" max="100"></progress>

        
                    {user?.tier <  3 && <button className="border-2 border-[#03457C] text-[#03457C] font-bold btn shadow-xs w-full mt-3 hover:bg-[#E6F0FA] rounded-full text-xs md:text-sm bg-transparent" onClick={handleUpgrade}>Upgrade tier</button>}
                {/* </div> */}
            </section>

        </section>
    );
}

export default DashboardTier;