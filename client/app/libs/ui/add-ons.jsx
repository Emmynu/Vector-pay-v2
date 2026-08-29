import { bricolage, quicksand } from "../utils/font";
import { Wallet, Dot } from "lucide-react"
import { formatAmount } from "../utils/utils";
import { addOnsData } from "../utils/data";
import { usePathname } from "next/navigation";


function AddOns({ balance, loading }) {
    const pathname = usePathname()

    console.log(pathname);
    

    const addOnsInfo =  addOnsData.filter(data=>pathname.includes(data.label))


    console.log(addOnsInfo);
    

    return ( 
        <aside className="rounded-2xl bg-[#fff] border border-slate-200 p-6 shadow-sm h-fit">
            <p className="text-xs md:text-[13px] opacity-60 flex items-center" style={quicksand.style}>
            <Wallet className="w-3.5 mr-1" /> Available balance
            </p>
            <p
            className="text-[30px] font-display font-bold"
            style={bricolage.style}
            >
            {loading ? "₦0.00" : formatAmount(balance) || "₦0.00"}
            </p>
            <div className="mt-2 pt-3 border-t border-slate-300 text-[11px] md:text-xs space-y-1.5 opacity-70" style={quicksand.style}>
                {addOnsInfo.map(data=> {
                    const { data:info } = data
                    return(
                        <div key={info}> 
                            {info.map(item=>{
                                return <p className="flex items-center mb-1.5" key={item}><Dot className="w-4 h-4"/><span>{item}</span></p>
                            })}
                        </div>
                    )
                })}
            
            </div>
        </aside>
        
     );
}

export default AddOns;