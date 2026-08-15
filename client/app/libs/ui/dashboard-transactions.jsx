import Link from "next/link";
import {  ArrowUpRight, Wallet, Building2} from "lucide-react";
import { formatAmount, formatDate } from "../utils/utils";
import { ubuntu, montserrat, quicksand } from "../utils/font";
import { useTransactions } from "@/app/dashboard/api/transactions";
import { useEffect } from "react";
import { useUser } from "@/app/auth/api/profile";
import { Dot } from "lucide-react"

function RecentTransactions() {
    const { fetchTransactions, isLoading, transactions } = useTransactions()
    const { data:user } = useUser()


    useEffect(()=>{
        fetchTransactions({ skip: 0, limit: 5 })
    },[])
    

    return ( 
        <section  className="mt-6 md:col-span-3 shadow-md bg-white rounded-2xl border border-slate-200 px-5 py-8">
            <header className="flex justify-between items-center">
                <h2 className="font-medium text-[#03457C] text-xs md:text-sm" style={montserrat.style}>Recent Transactions</h2>
                <Link href={"/dashboard/transactions"} className="text-[#03457C] text-xs font-medium hover:opacity-70" style={ubuntu.style}>View All</Link>
            </header>

            {(isLoading && !transactions?.data?.transactions) ? ( 
                <div className="flex flex-col items-center justify-center py-20 ">
                    <div className="w-8 h-8 border-3 border-[#E6F0FA] border-t-[#03457C] rounded-full animate-spin"></div>
                    <p className="mt-3 text-xs text-[#03457C] font-medium skeleton skeleton-text" style={montserrat.style}>
                    Fetching transactions...
                    </p>
                </div>
            ) : 
            ( (transactions?.data?.transactions.length > 0 ) ? <section className="mt-3">{transactions?.data?.transactions.map(transaction=>{
                
                const isCredit = transaction.recipientId === user?.id
                const sender = transaction.sender;
                const recipient = transaction.recipient;
                const statusMap = {
                    successful: "text-green-700 ",
                    pending: "text-amber-700",
                    failed: "text-rose-700",
                    };
              

                const transactionTypeIcon = transaction?.type === "deposit" ? <Wallet className="w-4 "/> : transaction?.type === "withdraw" ? <Building2 className="w-4"/> : <ArrowUpRight className="w-4"/>

                return(
                    <article key={transaction.id} className="flex items-center justify-between my-1">
                        <div className="flex items-center ">
                            <div className={`py-1.5 px-2.5 mt-3 rounded-[100%]  bg-[#E6F0FA] text-[#4A90E2] `}>
                            {transactionTypeIcon}
                            </div>

                            <div className="ml-1.5 mt-2">

                                <h2 className="text-[11px] md:text-xs mt-2 text-[#03457C] font-medium" style={montserrat.style}>{transaction?.type === "deposit" ? transaction?.narration : isCredit ? `Transfer from ${sender?.firstName} ${sender?.lastName.slice(0,1).toUpperCase()}.`: `Transfer to ${recipient?.firstName} ${recipient?.lastName.slice(0,1).toUpperCase()}.` }</h2>

                                <h6 className="text-[11px] md:text-xs -mt-0.5 tracking-wide opacity-75 flex items-center" style={quicksand.style}>
                                    <span className="-mr-1.5">{formatDate(transaction.date)}</span> 
                                    <Dot /> 
                                    {/* <span className={`-mr-1.5 -ml-1 `}>{transaction.type}</span> 
                                    <Dot />  */}
                                    <span className={`-mr-1.5 -ml-1 font-semibold ${statusMap[transaction.status]}`}>{transaction.status}</span> 
                                </h6>
                            </div>
                        </div>

                        <h4 style={montserrat.style}className={`font-semibold text-xs ${transaction?.type === "deposit" || (transaction?.type === "transfer" && isCredit) ?"text-green-600" : "text-red-600"
                        }`}>
                            {transaction?.type === "deposit" || (transaction?.type === "transfer" && isCredit) ? `+${formatAmount(transaction?.amount)}` : `-${formatAmount(transaction?.amount)}`}</h4>
                    </article>
                )
                        

            })}
            </section> : <section className="px-6 py-28 text-center text-gray-400">
                 No transactions found.
            </section>)}
            </section>
     );
}

export default RecentTransactions;