"use client"

import { X } from "lucide-react";
import { bricolage, montserrat, quicksand } from "../utils/font";
import { suggestedAmount } from "../utils/data";
import { formatAmount } from "../utils/utils";
import { useState } from "react";
import { useDeposit } from "@/app/dashboard/api/deposit";
// import VerifyPaymentModal from "./verify-payment-modal";

function AmountModal({ id }) {
    const [amount, setAmount] = useState("")
    const { deposit, isDepositing } = useDeposit()
    

    async function handleDeposit(e) {
      e.preventDefault()
      const response = await deposit({amount})
      
      localStorage.setItem("reference", response?.reference)
      window.location.href = (`${response?.payment_url}`)
      document.getElementById(id).close()
    }

  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 text-slate-800">
        <div 
        className="flex items-center justify-between pb-6">
            <div>
                <h3 
                className="text-lg font-bold text-slate-800" style={bricolage.style}>Deposit Funds</h3>
                <p 
                className="text-xs text-slate-500" style={quicksand.style}>Enter the amount you'd like to add to your wallet</p>
            </div>
      
      <button 
      className="rounded-full p-1.5 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" onClick={()=>document.getElementById(id).close()}>
        <X className="w-4"/>
      </button>
        </div>

        <form  onSubmit={handleDeposit}>
          <div>
            <label style={montserrat.style} className="block text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1.5 outline-none" >
            Amount (NGN)
            </label>
            <div className="relative flex items-center  border-[1.5px] border-slate-600 rounded-xl w-full  bg-[#E6F0FA]/20 py-3.5 pl-10 pr-4 text-2xl font-bold text-black opacity-70 placeholder-slate-300 transition-all focus:border-slate-900 focus:bg-white outline-none" style={bricolage.style}>
            
            <span className="absolute left-4 text-xl font-bold text-black opacity-80 select-none">₦</span>
            <input 
                type="number" 
                placeholder="0.00" 
                min="10" 
                step="any"
                className="border-none outline-none w-full"
                required
                value={(amount)}
                onChange={(e)=>setAmount(e.target.value)}
            />
             
            </div>
            {(amount && Number(amount) < 10) && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  Minimum deposit amount is ₦10.00
                </p>
              )}
          </div>

          <div className="flex my-3.5">
              {suggestedAmount.map(amount=>{
                  return <h2 className="ml-2 px-2.5 py-1 cursor-pointer text-xs font-semibold rounded-full bg-[#E6F0FA] text-[#03457C]/80" key={amount} style={quicksand.style} onClick={()=>setAmount(amount)}>{formatAmount(amount)}</h2>
              })}
          </div>

          <div>
              <button 
              type="submit" 
              style={bricolage.style}
              className="w-full rounded-xl mt-1 cursor-pointer bg-[#03457C] disabled:opacity-70 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all active:scale-[0.99]"
            
              disabled={isDepositing}
              >
            {isDepositing ? <h2><span className="loading loading-spinner loading-xs mr-1"></span>
            <span>Depositing....</span></h2> : "Confirm Deposit"}
              </button>   
          </div>
        </form>

       

      </div>


      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>

      
    </dialog>
  );
}



export default AmountModal;