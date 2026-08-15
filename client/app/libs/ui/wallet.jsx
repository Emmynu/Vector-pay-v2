"use client"

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { showToast } from "../toast/sonner";
import { bricolage, ubuntu } from "../utils/font";
import { Wallet, Plus, EyeOff, Eye, ArrowUpRight, ArrowDownLeft, Copy } from "lucide-react"
import { useUser } from "@/app/auth/api/profile";
import Link from "next/link";
import AmountModal from "./amount-modal";
import VerifyPaymentModal from "./verify-payment-modal";

function DashboardWallet() {    
    const [showBalance, setShowBalance] = useState(false)
    const [reference, setReference] = useState(null)

    const { data:user, isLoading } = useUser()


    useEffect(()=>{
        // localStorage?.getItem("reference") || 
        if(typeof window !== undefined){
            setReference(localStorage?.getItem("reference"))

            if(reference){
                document.getElementById("verify-payment-modal").showModal()
            }
        }
        
    },[reference])

    function handleBalanceToggle() {
        setShowBalance(!showBalance)
    }

    function handleCopy() {
        navigator.clipboard.writeText(user?.accountNumber)
        showToast({ type: "info", title: "Copied to clipboard" })
    }


    return ( 
         <section className="bg-[#03457C] md:col-span-3 rounded-2xl px-3.5 md:px-5 py-7 shadow-md text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff09_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff09_35%,transparent_36%)] bg-size-[4.95em_4.95em] ">
            <article className="flex items-center text-xs md:text-sm mb-1.5">
                <Wallet className="w-3.5 md:w-4.5 mr-1"/>
                <h2 className="tracking-wide">Available Balance</h2>
                <button className="ml-1 mt-0.5 cursor-pointer"  onClick={handleBalanceToggle}>{!showBalance ? <Eye className="w-3.5 md:w-4"/> : <EyeOff className="w-3.5 md:w-4"/>}</button>

            </article>

            {isLoading ? <span className="loading loading-spinner loading-sm text-white mt-2 mb-3"/>  : <h1 className={`text-4xl select-none tracking-wide font-bold ${bricolage.className}`}>{showBalance ? <CountUp start={0} end={user?.balance} duration={0.9} prefix="₦"  decimal="," />: <p className="mt-2">*****</p>}</h1>}

            <section className={`${showBalance && "mt-3" } flex items-center`}>
                <button disabled={isLoading} className="flex items-center btn bg-white  text-[#03457c] hover:opacity-80 disabled:opacity-60 shadow-xs border-none rounded-full" onClick={()=>document.getElementById("amount-modal").showModal()}>
                    <Plus className="w-4 -mr-1"/><h2  className={`${ubuntu.className} font-medium text-xs md:text-sm`}>Deposit</h2></button>

                <Link href={"/dashboard/transfer"} disabled={isLoading} className="flex items-center ml-1 md:ml-2 btn bg-transparent hover:opacity-80 disabled:opacity-60  text-white shadow-xs border-none rounded-full" ><ArrowUpRight className="w-4 -mr-1"/><h2 className={`${ubuntu.className} font-medium text-xs md:text-sm`}>Transfer</h2></Link>

                <Link href={"/dashboard/withdraw"} disabled={isLoading} className="flex items-center ml-1 md:ml-2 btn bg-transparent hover:opacity-80 disabled:opacity-60 text-white shadow-xs border-none rounded-full"><ArrowDownLeft className="w-4 -mr-1"/> <h2 className={`${ubuntu.className} font-medium text-xs md:text-sm`}>Withdraw</h2></Link>
            </section>

            <div className="divider my-2"></div>
            {/* account type */}
            <section className="flex items-center justify-between">
                <article>
                    <h2 className={`text-xs md:text-[13px] ${bricolage.className} text-slate-400`}>Account Number</h2>
                    {isLoading ? <div className="skeleton bg-slate-300 h-4 w-24"></div> :<h3 className="tracking-wide font-bold">{user?.accountNumber}</h3>}
                    <h4 className={`text-xs md:text-[13px] ${bricolage.className} text-slate-400`}>VectorPay Wallet</h4>
                </article>
                <button className="flex items-center cursor-pointer" onClick={handleCopy}><Copy className="w-4 mr-1"/> <h2 className={`${ubuntu.className} text-sm font-medium`}>Copy</h2></button>
            </section>
            <AmountModal id={"amount-modal"}/>
            <VerifyPaymentModal id={"verify-payment-modal"} reference={reference}/>
        </section>
     );
}

export default DashboardWallet;