"use client";

import { X, Loader2, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { bricolage, quicksand } from "../../utils/font";
import { useTransfer } from "@/app/dashboard/api/transfer";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBeneficiary } from "@/app/dashboard/api/beneficiaries/add-beneficiaries";
import { useQueryClient } from "@tanstack/react-query";


function AddBeneficiaryModal({ id = "beneficiary-modal",  }) {
  const [form, setForm] = useState({ account_number: "", nickname: "" });
  const [recipient, setRecipient] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [error, setError] = useState("");
  const { addBeneficiary, isSubmitting } = useBeneficiary()
  const { accountLookup, isLookupLoading } = useTransfer();
  const queryClient = useQueryClient()


  useEffect(() => {
    async function fetchAccountDetails() {
      setError("")
      if (form.account_number.length === 10) {
        setLookupError("");
        try {
          const res = await accountLookup({ accountNumber: form.account_number });
          const recipientData = res?.data?.data || res?.data;

          if (recipientData) {
            setRecipient(recipientData);
          } else {
            setRecipient(null);
            setLookupError("Account details could not be found.");
          }
        } catch (err) {
          setRecipient(null);
          setLookupError(
            err?.response?.data?.message || "Invalid account number or lookup failed."
          );
        }
      } else {
        setRecipient(null);
        setLookupError("");
      }
    }

    fetchAccountDetails();
  }, [form.account_number]);

  function closeModal() {
    setForm({ account_number: "", nickname: "" });
    setRecipient(null);
    setLookupError("");
    setError("")
    document.getElementById(id)?.close();
  }

  async function handleBeneficiary(e) {
    e.preventDefault();
    if (!recipient || isSubmitting) return;

    try {
        const response = await addBeneficiary(form)

        if(response?.status !== 201){
            setError(response?.msg)
            return;
        }
        queryClient.refetchQueries({ queryKey:["get-beneficiaries"] })
        closeModal();
    } 
    catch (err) {
      setLookupError(err?.response?.data?.message || "Failed to save beneficiary.");
    }
  }

  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 relative border border-slate-100 text-slate-800">
        {/* Header */}
        <div className={`flex items-center justify-between ${!error && "pb-6"}`}>
          <div>
            <h3 className="text-lg font-bold text-slate-800" style={bricolage.style}>
              Add beneficiary
            </h3>
            <p className="text-xs text-slate-500" style={quicksand.style}>
              Enter an account number to save a new recipient
            </p>
          </div>

          <button
            className="rounded-full p-1.5 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors outline-none border-none"
            onClick={closeModal}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div
            className="my-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-200"
            style={quicksand.style}
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleBeneficiary} >
          {/* Account Number Field */}
          <div>
            <label
              style={bricolage.style}
              className="block text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1.5 outline-none"
            >
              Account number
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                name="account_number"
                id="account_number"
                required
                inputMode="numeric"
                maxLength={10}
                minLength={10}
                value={form.account_number}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setForm((prev) => ({ ...prev, account_number: val }));
                }}
                placeholder="0123456789"
                style={quicksand.style}
                className="input bg-white w-full placeholder:opacity-50 text-[13px] rounded-xl border border-slate-300 focus:border-[#03457c] focus:outline-none font-mono tracking-wider py-2.5 px-3.5 pr-10 transition-colors"
              />
              {isLookupLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              )}
            </div>

            {/* Account Lookup Verification & Error Badges */}
            <AnimatePresence>
              {recipient && !lookupError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs font-semibold uppercase tracking-wider" style={bricolage.style}>
                    {`${recipient?.firstName || ""} ${recipient?.lastName || ""}`.trim() || "Account Verified"}
                  </p>
                </motion.div>
              )}

              {lookupError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span style={quicksand.style}>{lookupError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nickname Field */}
          <div className="my-4">
            <label
              style={bricolage.style}
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              Nickname <span className="font-normal opacity-60 lowercase">(optional)</span>
            </label>

            <input
              type="text"
              name="nickname"
              id="nickname"
              placeholder="e.g. Landlord, Mum"
              style={quicksand.style}
              value={form.nickname}
              onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
              className="input bg-white w-full placeholder:opacity-50 text-[13px] rounded-xl border border-slate-300 focus:border-[#03457c] focus:outline-none py-2.5 px-3.5 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!recipient || isLookupLoading || isSubmitting}
            style={bricolage.style}
            className="w-full rounded-xl mt-2 cursor-pointer bg-[#03457C] disabled:opacity-50 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Save Beneficiary</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Backdrop for click-outside close */}
      <form method="dialog" className="modal-backdrop" onClick={closeModal}>
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AddBeneficiaryModal;