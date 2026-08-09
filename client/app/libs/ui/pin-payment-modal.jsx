"use client";

import { Lock, X } from "lucide-react";
import { quicksand, montserrat, bricolage } from "@/app/libs/utils/font";
import { formatAmount } from "../utils/utils";
import { useState } from "react";
import { useTransfer } from "@/app/dashboard/api/transfer";

export function PinModal({ id, formData, setForm }) {
  const [pin, setPin] = useState("");
  const { transfer, isTransferLoading } = useTransfer();

  async function handleTransfer() {
    if (!pin || isTransferLoading) return;

    const data = {
      recipient_account_number: formData?.account,
      amount: formData.amount,
      narration: formData.note || null,
      pin: pin,
    };

    const response = await transfer(data);

    
    if(response.status === 200){
       setForm({ account: "", amount: "", note: "", recipient: null })
       setPin("")

       window.location = "/dashboard"
    }
    else{
       setPin("")
    }
  }

  return (
    <dialog id={id} className="modal backdrop-blur-xs">
      <div className="modal-box bg-white shadow-xl rounded-3xl w-full max-w-sm p-10 relative border border-slate-100">
        
        <form method="dialog">
          <button 
            disabled={isTransferLoading}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-500 hover:text-slate-700 bg-transparent border-none shadow-none outline-none disabled:bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#E6F0FA] border border-slate-100 flex items-center justify-center text-[#4A90E2] mb-3 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900" style={montserrat.style}>
            Enter Transaction PIN
          </h3>
          <p className="text-xs text-slate-500 mt-1" style={quicksand.style}>
            Authorize transfer of <span className="font-semibold text-slate-800">{formatAmount(formData.amount)}</span>
          </p>
        </div>

  
        <div className="mt-4 p-3 bg-[#E6F0FA] rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">To:</span>
          <span className="font-medium text-slate-800">
            {`${formData.recipient?.firstName} ${formData.recipient?.lastName}`} • {formData.account}
          </span>
        </div>

        <div className="flex flex-col justify-center items-center my-6">
          <h2 className="text-xs" style={quicksand.style}>Enter transaction pin:</h2>

          <label className="otp otp-md mt-2 validator" style={bricolage.style}>
            <span className="bg-slate-100 border px-4.5 border-slate-700"></span>
            <span className="bg-slate-100 border px-4.5 border-slate-700"></span>
            <span className="bg-slate-100 border px-4.5 border-slate-700"></span>
            <span className="bg-slate-100 border px-4.5 border-slate-700"></span>
            <input 
              type="text" 
              autoComplete="one-time-code" 
              inputMode="numeric" 
              maxLength="4" 
              pattern="[0-9]{4}" 
              required 
              name="pin" 
              disabled={isTransferLoading}
              onChange={(e) => setPin(e.target.value)} 
              value={pin}
            />
          </label>
        </div>

        <button
          type="button"
          disabled={isTransferLoading || pin.length < 4}
          className="btn border-none outline-none bg-[#03457C] text-white hover:bg-[#02335c] disabled:opacity-60 rounded-full w-full mt-4 shadow-md shadow-[#03457C]/20 flex items-center justify-center gap-2 transition-all"
          onClick={handleTransfer}
        >
          {isTransferLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : (
            "Confirm Transfer"
          )}
        </button>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button disabled={isTransferLoading}>close</button>
      </form>
    </dialog>
  );
}