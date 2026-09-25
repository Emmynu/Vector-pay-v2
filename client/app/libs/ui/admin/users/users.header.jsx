import { bricolage, quicksand } from "@/app/libs/utils/font";
import { RefreshCcw } from "lucide-react";
import CustomSelect from "../../custom/custom-select";


export default function UsersHeader({ fetchUsers, options, setTier }) {
 
    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            {/* Title & Subtitle */}
            <section className="space-y-0.5">
                <h2 
                    style={bricolage.style}  
                    className="text-xl font-bold text-slate-900 tracking-tight"
                >
                    User Management
                </h2>
                <p 
                    className="text-xs  text-slate-500" 
                    style={quicksand.style}
                >
                    Manage registered accounts, view KYC verification statuses, and filter users by tier.
                </p> 
            </section>

            {/* Actions & Filters */}
            <section className="flex items-center gap-2.5 w-full sm:w-auto">
                <button 
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-[13px] text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-colors shrink-0" 
                    style={quicksand.style} 
                    onClick={() => fetchUsers()}
                >
                    <RefreshCcw className="w-3.5 h-3.5 text-slate-500 group-hover:rotate-180 transition-transform duration-300" />
                    <span>Refresh</span>
                </button>

                <div className="w-full sm:w-44">
                    <CustomSelect 
                        options={options}
                        placeholder="All Tiers"
                        handleChange={(e)=>setTier(e ? e.value : "all")}
                    />
                </div>
            </section>
        </header>
    );
}