"use client";

import { useState, useEffect } from "react";
import { KeyRound, X, RotateCw, ArrowRight, AlertCircle } from "lucide-react";
import { bricolage, quicksand } from "../../utils/font"; 
import { showToast } from "../../toast/sonner";
import OtpInput from "react-otp-input";
import { usePINReset } from "@/app/dashboard/api/pin/pin-reset";
import { usePINResetRequest } from "@/app/dashboard/api/pin/pin-reset-request";
import { useQueryClient } from "@tanstack/react-query";


export default function PinResetModal({ id = "pin_reset_modal", email }) {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient()
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { resetTransactionPin, isResetting } = usePINReset()
  const { resetTransactionPinRequest, isRequestting} = usePINResetRequest()


  useEffect(() => {
    let timer;

    if (resendTimer > 0) {
        timer = setInterval(() => {
          setResendTimer((prev) => prev - 1);
        }, 1000);
    } 
    else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOtpChange = (value) => {
    setOtp(value);
    if (errorMessage) setErrorMessage("");
  };

  async function resetPin() {
    setErrorMessage("");
    
    try {
      const response = await resetTransactionPin({ code: otp });

      if (response?.status === 200 || response?.data?.status === "success") {
        document.getElementById(id)?.close();
        setOtp("");
        
        showToast({
          type: "success",
          title: response?.data?.msg  || "PIN reset successfully!"
        });
      } 
      else {
        const errorDetail = response?.data?.msg || response?.msg || "Failed to reset PIN. Please try again.";
        setErrorMessage(errorDetail);
      }
    } catch (error) {
      const catchError = error?. error?.response?.data?.msg || error?.message || "An unexpected error occurred.";
      setErrorMessage(catchError);
    }
    finally{
      queryClient.invalidateQueries({ queryKey: ["get-current-user"] })    
    }
  }
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    setOtp(pastedData);
    if (errorMessage) setErrorMessage("");
  };

  const handleResend = async () => {
    if (!canResend || isRequestting) return;
    setErrorMessage("");
    
    try {
      
      resetTransactionPinRequest();
      setCanResend(false);
      setResendTimer(60);
      showToast({ type: "success", title: "A new 6-digit code has been sent!" });

    } catch (error) {

      const resendError = error?.response?.data?.detail?.msg || "Failed to resend code. Please try again.";

      setErrorMessage(resendError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length < 6) {
      setErrorMessage("Please enter all 6 digits.");
      return;
    }

    resetPin();
  };

  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 text-slate-800">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E6F0FA] text-[#03457C]">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-slate-900" style={bricolage.style}>
              Reset PIN
            </h3>
          </div>

          <form method="dialog">
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer !outline-none !border-none">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Content & OTP Form */}
        <form onSubmit={handleSubmit} className="pt-5 space-y-5">
          <div className="text-center space-y-0.5">
            <p className="text-sm font-semibold text-slate-800" style={bricolage.style}>
              Enter Verification Code
            </p>
            <p className="text-xs text-slate-500 leading-relaxed" style={quicksand.style}>
              We sent a 6-digit security code to <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>

          {/* Inline Error Alert Box */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium" style={quicksand.style}>
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 6-Digit OTP Inputs */}
          <div className="flex items-center justify-center py-1" onPaste={handlePaste}>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              shouldAutoFocus
              inputType="number"
              containerStyle="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full"
              renderSeparator={<span className="w-1"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: "100%",
                    ...bricolage.style
                  }}
                  className={`!w-10 !h-12 sm:!w-12 sm:!h-14 text-center text-lg sm:text-xl font-bold rounded-xl outline-none transition-all shadow-xs text-slate-900  md:pl-2 ${
                    errorMessage
                      ? "bg-red-50/50 border border-red-300 focus:border-red-500 focus:bg-white"
                      : "bg-[#E6F0FA]/30 border border-slate-200 focus:border-[#03457C] focus:bg-white"
                  }`}
                />
              )}
            />
          </div>

          {/* Resend Timer & Action */}
          <div className="flex items-center justify-center text-xs text-slate-500 gap-1.5 min-h-[20px]" style={quicksand.style}>
            <span>Didn't receive the code?</span>
            {isRequestting ? (
              <span className="font-bold text-[#03457C] flex items-center gap-1.5">
                <span className="loading loading-spinner loading-xs"></span>
                Sending...
              </span>
            ) : canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isRequestting}
                className="font-bold text-[#03457C] hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className="w-3 h-3" /> Resend Code
              </button>
            ) : (
              <span className="font-semibold text-slate-700">
                Resend in {resendTimer}s
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isResetting || isRequestting || otp.length < 6}
              className="w-full py-3 bg-[#03457C] hover:bg-[#02335c] text-white font-semibold rounded-xl transition-all text-sm shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={quicksand.style}
            >
              {isResetting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-5 mt-1 ml-0.5"/>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}