"use client";

import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/app/auth/api/profile";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { motion, AnimatePresence } from "motion/react";
import AddOns from "@/app/libs/ui/dashboard/add-ons";
import { showToast } from "@/app/libs/toast/sonner";
import { PinModal } from "@/app/libs/ui/dashboard/pin-payment-modal";
import Select from "react-select";
import { useBanks } from "../api/banks";
import { testAmount } from "@/app/libs/utils/utils";

export default function Withdraw() {
  const { data: user, isLoading } = useUser();
  const [form, setForm] = useState({
    accountNumber: "",
    amount: "",
    note: "",
    accountName: null,
    lookUpError: null,
  });
  const [amountError, setAmountError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const { banks, isFetchingBanks, fetchBankDetails, isFetchingDetails, isProcessing, isError } = useBanks();

  const options = banks?.map((bank) => ({
    value: bank?.code,
    label: bank?.bank_name,
  }));

  const payload = {
    ...form,
    code: selectedOption?.value,
  };

  if (isError) {
    showToast({ type: "error", title: "Failed to fetch banks" });
  }

  useEffect(() => {
    async function getBankDetails() {
      if (selectedOption && form?.accountNumber?.length === 10) {
        try {
          const data = {
            account_number: form.accountNumber,
            bank_code: selectedOption?.value,
          };
          const details = await fetchBankDetails(data);

          if (details) {
            setForm((v) => ({
              ...v,
              accountName: details?.account_name || "Account Resolved",
              lookUpError: null,
            }));
          } else {
            setForm((v) => ({
              ...v,
              accountName: null,
              lookUpError: "Account details could not be found.",
            }));
          }
        } catch (error) {
          setForm((v) => ({
            ...v,
            accountName: null,
            lookUpError: error?.response?.data?.message || "Account details could not be found.",
          }));
        }
      } else {
        setForm((v) => ({ ...v, accountName: null, lookUpError: null }));
      }
    }
    getBankDetails();
  }, [form.accountNumber, selectedOption]);

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;


    const sanitizedValue = rawValue.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, amount: sanitizedValue }));

    if (!sanitizedValue) {
      setAmountError("");
      return;
    }

    

    const numValue = Number(sanitizedValue);
    if (numValue < 100) {
      setAmountError("Minimum withdrawal amount is ₦100.00");
      return;
    }

    const isValidFormat = testAmount(sanitizedValue)
    if (!isValidFormat) {
      setAmountError("Amount must be a valid integer");
      return;
    }

    setAmountError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption || form.accountNumber.length !== 10 || !form.accountName) {
      return;
    }

    if (!form.amount || !!amountError || Number(form.amount) < 100) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        msg: amountError || "Minimum withdrawal amount is ₦100.00",
      });
      return;
    }

    if (!user?.transactionPin) {
      showToast({
        type: "error",
        title: "Transaction PIN Required",
        msg: "You need to set up a transaction PIN before making transfers.",
      });
      return;
    }

    const modal = document.getElementById("my-modal-4") 
    modal?.showModal();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.35 }}
        className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 lg:p-8 shadow-sm"
      >
        <section>
          <h2 className="font-display font-bold text-base" style={bricolage.style}>
            Withdraw to bank
          </h2>
          <p className="opacity-60 text-[13px]" style={quicksand.style}>
            Move money from your wallet to your bank account.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Select Bank */}
            <div>
              <label className="text-[12px] tracking-wide mb-1 block" style={quicksand.style}>
                Select Bank
              </label>
              <div className="relative">
                <Select
                  options={options}
                  isSearchable
                  value={selectedOption}
                  onChange={setSelectedOption}
                  instanceId="bank-select"
                  placeholder={isFetchingBanks ? "Loading banks..." : "Choose a bank"}
                  className={`${quicksand.className} !border-black outline-black`}
                  classNames={{
                    control: () =>
                      `w-full text-[13px] rounded-xl border-2 transition-colors !border-black !rounded-xl`,
                    valueContainer: () => "px-3 py-1",
                    input: () => "text-[13px]",
                    placeholder: () => "text-[13px]",
                    option: (state) =>
                      `hover:!bg-[#E6F0FA] ${
                        state.isSelected &&
                        "!bg-[#03457C] !text-white hover:!text-black focus:!text-black"
                      } ${state.isFocused && "!bg-[#E6F0FA] !text-black"}`,
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      boxShadow: "none",
                      cursor: "pointer",
                    }),
                    option: (base) => ({
                      ...base,
                      background: "none",
                      color: "undefined",
                      fontSize: "13px",
                      cursor: "pointer",
                    }),
                  }}
                />
                {isFetchingBanks && (
                  <span className="loading loading-spinner loading-xs absolute right-11 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
              </div>
            </div>

            {/* Account Number Input */}
            <div>
              <label className="text-[12px] tracking-wide mb-1 block" style={quicksand.style}>
                Account number
              </label>
              <div className="relative">
                <input
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={form.accountNumber}
                  disabled={isFetchingDetails || isFetchingBanks}
                  onChange={(e) =>
                    setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, "") })
                  }
                  className="input input-bordered bg-white w-full placeholder:opacity-65 rounded-xl border-black font-mono tracking-wider text-sm pr-10 disabled:text-black"
                  placeholder="0123456789"
                />
                {isFetchingDetails && (
                  <span className="loading loading-spinner loading-xs absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {form.accountName && !form.lookUpError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-1.5 text-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={bricolage.style}>
                      {`${form.accountName}` || "Recipient Verified"}
                    </p>
                  </div>
                </motion.div>
              )}

              {form.lookUpError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{form.lookUpError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Amount Field */}
            <div>
              <label className="text-[12px] tracking-wide mb-1 block" style={quicksand.style}>
                Amount (NGN)
              </label>
              <input
                required
                inputMode="numeric"
                value={form.amount}
                onChange={handleAmountChange}
                disabled={isFetchingDetails || isFetchingBanks}
                className={`input input-bordered placeholder:opacity-65 w-full rounded-xl bg-white text-sm transition-colors ${
                  amountError ? "border-rose-500 focus:outline-rose-500" : "border-black"
                }`}
                placeholder="0.00"
              />
              <AnimatePresence>
                {amountError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={quicksand.style}
                    className="validation-hint text-[11px] text-rose-600 mt-1.5 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{amountError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Narration Input */}
            <div>
              <label className="text-[12px] tracking-wide mb-1 block" style={quicksand.style}>
                Narration (optional)
              </label>
              <input
                value={form.note}
                disabled={isFetchingDetails || isFetchingBanks}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="input input-bordered w-full placeholder:opacity-65 rounded-xl border-black bg-white text-sm"
                placeholder="What's this for?"
                style={quicksand.style}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isProcessing ||
                isFetchingDetails ||
                !form.accountName ||
                !form.amount ||
                !!amountError ||
                Number(form.amount) < 100
              }
              className="btn border-none shadow-sm py-3 bg-[#03457C] hover:bg-[#02335c] text-white rounded-full w-full mt-2 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              style={bricolage.style}
            >
              <Send className="w-4 h-4 -mr-0.5" />
              <span className="text-[13px] mt-0.5">Withdraw now</span>
            </button>
          </form>
        </section>
      </motion.div>

      {/* Add-ons Section */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <AddOns balance={user?.balance} loading={isLoading} />
      </motion.div>
      <PinModal id={"my-modal-4"} formData={payload} setForm={setForm} type="withdraw" />
    </div>
  );
}