"use client";

import { X, AlertCircle } from "lucide-react";
import { bricolage, montserrat, quicksand } from "../../utils/font";
import { suggestedAmount } from "../../utils/data";
import { formatAmount, testAmount } from "../../utils/utils";
import { useState } from "react";
import { useDeposit } from "@/app/dashboard/api/deposit";
import { motion, AnimatePresence } from "motion/react";

function AmountModal({ id }) {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const { deposit, isDepositing } = useDeposit();

  function closeModal() {
    document.getElementById(id)?.close();
    setAmount("");
    setAmountError("");
  }

  function handleAmountChange(e) {
    const rawAmount = e.target.value;


    const formattedAmount = rawAmount.replace(/\D/g, "");
    setAmount(formattedAmount);

    if (!formattedAmount) {
      setAmountError("");
      return;
    }

    const isValidFormat =  testAmount(formattedAmount) 
    if (!isValidFormat) {
      setAmountError("Amount must be a valid integer");
      return;
    }

    const numValue = Number(formattedAmount);
    if (numValue < 10) {
      setAmountError("Minimum deposit amount is ₦10.00");
      return;
    }

    // 5. Clear error when checks pass
    setAmountError("");
  }

  function handleSuggestedClick(suggestedVal) {
    const valString = String(suggestedVal);
    setAmount(valString);
    if (Number(valString) >= 10) {
      setAmountError("");
    }
  }

  async function handleDeposit(e) {
    e.preventDefault();

    if (!amount || amountError || Number(amount) < 10) {
      return;
    }

    const response = await deposit({ amount });

    if (response?.status === "success") {
      localStorage.setItem("reference", response?.reference);
      window.location.href = `${response?.payment_url}`;
    }
    closeModal();
  }

  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 text-slate-800">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800" style={bricolage.style}>
              Deposit Funds
            </h3>
            <p className="text-xs text-slate-500" style={quicksand.style}>
              Enter the amount you'd like to add to your wallet
            </p>
          </div>

          <button
            className="rounded-full p-1.5 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors outline-none border-none"
            disabled={isDepositing}
            onClick={closeModal}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleDeposit}>
          <div>
            <label
              style={montserrat.style}
              className="block text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1.5 outline-none"
            >
              Amount (NGN)
            </label>
            <div
              className={`relative flex items-center border-[1.5px] rounded-xl w-full bg-[#E6F0FA]/20 py-3.5 pl-10 pr-4 text-2xl font-bold text-black transition-all focus-within:bg-white outline-none ${
                amountError
                  ? "border-rose-500 focus-within:border-rose-500"
                  : "border-slate-600 focus-within:border-slate-900"
              }`}
              style={bricolage.style}
            >
              <span className="absolute left-4 text-xl font-bold text-black opacity-80 select-none">₦</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0.00"
                className="border-none outline-none w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                required
                value={amount}
                onChange={handleAmountChange}
              />
            </div>

            <AnimatePresence>
              {amountError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1"
                  style={quicksand.style}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{amountError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex my-3.5 flex-wrap gap-2">
            {suggestedAmount?.map((sAmount) => {
              return (
                <button
                  type="button"
                  key={sAmount}
                  onClick={() => handleSuggestedClick(sAmount)}
                  className="px-2.5 py-1 cursor-pointer text-xs font-semibold rounded-full bg-[#E6F0FA]/50 text-[#03457C]/80 hover:bg-[#03457C] hover:text-white transition-colors outline-none border-none"
                  style={quicksand.style}
                >
                  {formatAmount(sAmount)}
                </button>
              );
            })}
          </div>

          <div>
            <button
              type="submit"
              style={bricolage.style}
              className="w-full rounded-xl mt-1 cursor-pointer bg-[#03457C] disabled:opacity-60 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              disabled={isDepositing || !amount || !!amountError}
            >
              {isDepositing ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-1"></span>
                  <span>Depositing....</span>
                </>
              ) : (
                "Confirm Deposit"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={closeModal}>
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AmountModal;