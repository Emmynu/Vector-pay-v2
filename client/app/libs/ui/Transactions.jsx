import Link from "next/link";
import { transactions } from "../utils/data";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatNumber } from "../utils/utils";
import { ubuntu, montserrat } from "../utils/font";

function RecentTransactions() {
    return ( 
        <section  className="mt-6 md:col-span-3 shadow-md bg-white rounded-2xl border border-slate-200 px-5 py-8">
            <header className="flex justify-between items-center">
                <h2 className="font-medium text-[#03457C] text-xs md:text-sm" style={montserrat.style}>Recent Transactions</h2>
                <Link href={"/dashboard/transactions"} className="text-[#03457C] text-xs font-medium hover:opacity-70" style={ubuntu.style}>View All</Link>
            </header>

            <section className="mt-3">{transactions.slice(0,5).map(transaction=>{
                return(
                    <article key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`py-1.5 px-2.5 mt-3 rounded-[100%] ${transaction.type === "debit" ? "bg-[#E6F0FA]": "bg-emerald-100"}`}>
                            {transaction.type === "debit" ? <ArrowDownLeft className="w-4 text-[#4A90E2]"/>:<ArrowUpRight className="w-4 text-emerald-400"/>}
                            </div>

                            <div className="ml-1.5 mt-2">
                                <h2 className="text-[11px] md:text-xs text-[#03457C] font-medium" style={montserrat.style}>{transaction.description}</h2>
                                <h6 className="text-[11px] md:text-xs tracking-wide opacity-65">{transaction.counterparty}</h6>
                            </div>
                        </div>

                        <h4 style={montserrat.style} className={`text-[10px] md:text-xs  ${transaction.type === "debit" ? "text-green-400": "text-[#03457C]"}`}>{formatNumber(transaction.amount)}</h4>
                    </article>
                )
                        

            })}
            </section>
            </section>
     );
}

export default RecentTransactions;