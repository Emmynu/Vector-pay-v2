import { bricolage,quicksand } from "@/app/libs/utils/font"
import { RefreshCcw } from "lucide-react"
import { getSelectOptions } from "@/app/libs/utils/utils"
import { kycStatus } from "@/app/libs/utils/data"
import CustomSelect from "../../custom/custom-select"

export default function KYCHeader({ setStatus, fetchKYC }){
    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight" style={bricolage.style}>
                    Verification Requests
                </h2>
                <p className="text-xs text-slate-500" style={quicksand.style}>
                    Review and manage identity document submissions across the platform
                </p>
            </div>
        
            <section className="flex items-center gap-2.5 w-full sm:w-auto">
                <button className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[13px] text-gray-600 h-full flex items-center gap-1 cursor-pointer group hover:bg-white transition-colors w-fit" style={quicksand.style} onClick={()=>fetchKYC()}>
                    <RefreshCcw className="w-[15px] h-[15px] "/>
                    <span>Refresh</span>
                </button>
                <div className="w-full sm:w-56">
                    <CustomSelect 
                        options={getSelectOptions(kycStatus)}
                        handleChange={(e) => setStatus(e ? e.value : null)}
                        placeholder="All Statuses"
                        
                    />
                </div>
            </section>
        </header>
    )
}