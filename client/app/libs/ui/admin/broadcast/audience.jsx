"use client"

import { Users, UserPlus, UserX } from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { formatChartDate } from "@/app/libs/utils/utils";


function Audience({ summary, mailTo, setMailTo }) {

    function handleBroadCast(id) {
        setMailTo(id)
    }


    const cards = [
        { 
            "Icon": Users, 
            title: "All users",
            subtitle: "Every registered users.", 
            count: summary?.totalUsers || 0, 
            id: "1"
        },
        { 
            "Icon": UserPlus, 
            title: "New users", 
            subtitle: `Signed up users in the month of ${formatChartDate(new Date().toISOString())}.`, count: summary?.newUsers ?? 0, 
            id: "2" 
        },
        {
            Icon: UserX,
            title: "Inactive Users",
            subtitle: "Users who haven't logged in over the last 30 days.",
            count: summary?.inActiveUsers ?? 0,
            id: "3",
        },
    ]
    return ( 
        <main className="!w-full space-y-6 !bg-white rounded-2xl border border-gray-200 p-7">
            <header>
                <h1 className="text-[17px] sm:text-lg font-bold text-slate-900 flex items-center gap-2" style={bricolage.style}>Audience</h1>
                <p className="text-xs text-slate-500" style={quicksand.style}>Choose recipient that will receive this message.</p>
            </header>

            <section className="flex flex-col gap-4">
                {cards.map((card, index)=>{
                    const { Icon, title, subtitle, count, id } = card
                    const active = mailTo === id
                    return (
                        <article key={index} className={`${active ? "bg-[#E6F0FA]/25 border-[#03457C]" : "border-slate-200 bg-slate-50/30"} border flex justify-between items-center  px-4 py-3 rounded-lg gap-3 cursor-pointer`} onClick={()=>handleBroadCast(id)}>
                            <section className="flex items-center gap-1.5">
                               <div className={`${active ? "bg-[#03457C] text-white": "bg-slate-100"} p-2 rounded-md`}><Icon className="w-4 h-4 "/></div>
                                <div>
                                    <h3 style={bricolage.style} className="text-[13.5px]">{title}</h3>
                                    <p  style={quicksand.style} className="text-[11.5px] -mt-0.5 text-slate-600">{subtitle}</p>
                                </div>
                            </section>
                            <h4 style={bricolage.style} className="text-sm">{count}</h4>
                        </article>
                    )
                })}
            </section>
        </main>
     );
}

export default Audience;