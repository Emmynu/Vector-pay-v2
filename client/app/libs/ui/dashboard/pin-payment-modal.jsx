"use client";

import { Lock, X, AlertCircle } from "lucide-react";
import { quicksand, montserrat, bricolage } from "@/app/libs/utils/font";
import { formatAmount } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useTransfer } from "@/app/dashboard/api/transfer";
import { useWithdraw } from "@/app/dashboard/api/withdraw";
import CustomOTPInput from "../custom/custom-otp-input";
import { useRequestsAction } from "@/app/dashboard/api/request/requests-action";
import { useQueryClient } from "@tanstack/react-query";

export function PinModal({ id = "my-modal-4", formData, setForm, type }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { transfer, isTransferLoading } = useTransfer();
  const { isProcessing, withdraw } = useWithdraw();
  const { action, isLoading:isPending } = useRequestsAction()
  const queryClient = useQueryClient()


  const isLoading = isProcessing || isTransferLoading || isPending

  async function handlePayment() {
    if (!pin || isLoading) return;

    setError("");
    let response;

    const payload = {
        account_number: formData?.accountNumber,
        amount: parseInt(formData?.amount),
        narration: formData?.narration || null,
        pin: pin,
      };


    try {
      if (type === "transfer") {
        response = await transfer(payload);
      }

      if (type === "withdraw") {

        const withdrawPayload = {
          ...payload,
          bank_code: formData?.code,
        };

        response = await withdraw(withdrawPayload);
      }

      if(type === "request"){
        response = await action({ actionType: formData?.actionType, requestId: formData?.requestId, data: { pin } })   
      }

      if (response?.status === 200 ) {

          if(type !== "request"){
            setForm({});
            window.location = "/dashboard";
          }

          queryClient.refetchQueries({ queryKey: ["get-requests"] })
          closeModal()
      } else {
        setError(
          response?.msg ||
            "Transaction failed. Please check your PIN and try again."
        );
      }
    } catch (err) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    }finally{
      setPin(""); 
    }

    
  }

  useEffect(() => {
    if (pin.length === 4) {
      handlePayment();
    }
  }, [pin]);

  const closeModal = () => {
    if (isLoading) return;
    setError("");
    setPin("");
    document.getElementById(id)?.close();
  };

  return (
    <dialog id={id} className="modal backdrop-blur-xs">
      <div className="modal-box bg-white shadow-xl rounded-3xl w-full max-w-sm p-8 relative border border-slate-100">
        <button
          type="button"
          onClick={closeModal}
          disabled={isLoading}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-blue-50/50 transition-colors absolute right-4 top-4 cursor-pointer disabled:opacity-50 !outline-none !border-none"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#E6F0FA] border border-slate-100 flex items-center justify-center text-[#4A90E2] mb-3 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900" style={montserrat.style}>
            Enter Transaction PIN
          </h3>
          <p className="text-xs text-slate-500 mt-1" style={quicksand.style}>
            Authorize transfer of{" "}
            <span className="font-semibold text-slate-800">
              {formatAmount(formData?.amount || 0)}
            </span>
          </p>
        </div>

      
        {error && (
          <div
            className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-200"
            style={quicksand.style}
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 p-3 bg-[#E6F0FA] rounded-2xl border border-blue-200 flex items-center justify-between text-xs gap-2">
          <span className="text-slate-700" style={quicksand.style}>
            To:
          </span>
          <span className="font-medium text-slate-800 text-[10px]" style={bricolage.style}>
            {`${formData?.accountName || ""} • ${formData?.accountNumber || ""}`}
          </span>
        </div>

        <div className="flex flex-col justify-center items-center my-6">
          <h2 className="text-xs text-slate-600 mb-2" style={quicksand.style}>
            Enter transaction pin:
          </h2>

          <CustomOTPInput 
          numInputs={4}
          value={pin}
          handleChange={setPin}
          className={"bg-blue-50/50 border border-slate-300 !w-12 !h-12 focus:bg-[#FFF]"}
          />
        </div>

        <button
          type="button"
          disabled={isLoading || pin.length < 4}
          style={bricolage.style}
          className="btn border-none outline-none bg-[#03457C] text-white hover:bg-[#02335c] disabled:opacity-60 rounded-full w-full mt-2 shadow-md shadow-[#03457C]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          onClick={handlePayment}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Processing...
            </>
          ) : (
            "Confirm Payment"
          )}
        </button>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button disabled={isLoading} onClick={closeModal}>
          close
        </button>
      </form>
    </dialog>
  );
}