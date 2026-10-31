"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle, Users2, Plus } from "lucide-react";
import { useUser } from "@/app/auth/api/profile";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { motion, AnimatePresence } from "motion/react";
import { useTransfer } from "../api/transfer";
import { PinModal } from "@/app/libs/ui/dashboard/pin-payment-modal";
import { showToast } from "@/app/libs/toast/sonner";
import AddOns from "@/app/libs/ui/dashboard/add-ons";
import { testAmount } from "@/app/libs/utils/utils";
import { useBeneficiary } from "../api/beneficiaries/get-beneficaries";
import Link from "next/link";
import AddBeneficiaryModal from "@/app/libs/ui/dashboard/beneficiaries-modal";

function TransferFormContent() {
  const { data: user } = useUser();
  const [form, setForm] = useState({ account: "", amount: "", note: "", recipient: null });
  const [lookupError, setLookupError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [activeID, setActiveID] = useState(null);
  
  const { beneficiaries, isLoading } = useBeneficiary();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname()

  const { accountLookup, isLookupLoading } = useTransfer();

  
  useEffect(() => {
    const account = searchParams.get("to");
    if (account) {
      setForm((v) => ({ ...v, account }));
    }
  }, [searchParams]);

 
  useEffect(() => {
    async function fetchAccountDetails() {
      if (form.account.length === 10) {
        setLookupError("");
        try {
          const lookupData = { accountNumber: form.account };
          const res = await accountLookup(lookupData);
          const recipientData = res?.data?.data 

          if (recipientData) {
            setForm((v) => ({ ...v, recipient: recipientData }));
          } else {
            setLookupError("Account details could not be found.");
          }
        } catch (err) {
          setForm((v) => ({ ...v, recipient: null }));
          setLookupError(err?.response?.data?.message || "Invalid account number or lookup failed.");
        }
      } else {
        setForm((v) => ({ ...v, recipient: null }));
        setLookupError("");
      }
    }

    fetchAccountDetails();
  }, [form.account]);

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    const sanitizedValue = rawValue.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, amount: sanitizedValue }));

    if (!sanitizedValue) {
      setAmountError("");
      return;
    }

    const numValue = Number(sanitizedValue);
    if (numValue < 10) {
      setAmountError("Minimum transfer amount is ₦10.00");
      return;
    }

    const isValidFormat = testAmount(sanitizedValue);
    if (!isValidFormat) {
      setAmountError("Amount must be a valid integer");
      return;
    }

    setAmountError("");
  };

  function handleTransfer() {
    if (!form.recipient) return;

    if (!form.amount || amountError) {
      showToast({ type: "error", title: "Invalid Amount", msg: amountError || "Please enter a valid amount." });
      return;
    }

    if (!user?.transactionPin) {
      showToast({ type: "error", title: "Transaction PIN Required", msg: "You need to set up a transaction PIN before making transfers." });
      return;
    }

    document.getElementById("my-modal-4").showModal();
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.35 }}
        className="lg:col-span-2 rounded-2xl bg-[#fff] border border-slate-200 p-6 lg:p-8 shadow-sm"
      >
        <section>
          <h2 className="font-display font-bold md:text-lg" style={bricolage.style}>
            Send money
          </h2>
          <p className="opacity-60 text-[13px]" style={quicksand.style}>
            Instant peer-to-peer transfers with zero fees.
          </p>

          <article>
            <header className="flex justify-between items-center mt-4" style={quicksand.style}>
              <h2 className="flex items-center gap-1 text-xs opacity-90 font-medium">
                <Users2 className="w-3.5 h-3.5" />
                <span>Quick select from beneficiaries</span>
              </h2>
              <Link href={"/dashboard/beneficiaries"} style={bricolage.style} className="text-xs font-bold text-[#03457c] hover:underline">
                View all →
              </Link>
            </header>

            <div className="flex items-center gap-2.5 mt-2.5 overflow-x-auto pb-2 scrollbar-none">
              {isLoading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-[#03457c]" />
                  <span style={quicksand.style}>Loading beneficiaries...</span>
                </div>
              ) : (
                <>
                  {beneficiaries?.beneficiaries?.map((item) => {
                    const name = item?.nickname || item?.beneficiary?.firstName || "User";
                    const initials = name.slice(0, 2).toUpperCase();
                    const accountNumber = item?.beneficiary?.accountNumber;
                    const isActive = (activeID || searchParams.get("to")) === accountNumber;

                    return (
                      <button
                        key={item?.id || accountNumber}
                        type="button"
                        onClick={() => {
                          router.replace(pathname, { scroll: false });

                          if (accountNumber) {
                            setForm((prev) => ({ ...prev, account: accountNumber }));
                            setActiveID(accountNumber);
                          }
                        }}
                        className={`flex items-center gap-2 border text-xs py-1.5 px-3 rounded-full transition-all shrink-0 cursor-pointer group ${
                        isActive 
                            ? "bg-[#E6F0FA] border-[#03457c]"
                            : "bg-[#F4F8FC] hover:bg-[#E6F0FA] border-slate-200"
                        }`}
                      >
                        <span
                          style={bricolage.style}
                          className="uppercase bg-[#03457c] rounded-full w-5 h-5 flex items-center justify-center text-[#fff] text-[10px] font-bold"
                        >
                          {initials}
                        </span>
                        <span style={quicksand.style} className="text-[#03457c] font-semibold group-hover:text-[#022f54]">
                          {name}
                        </span>
                      </button>
                    );
                  })}

                  {/* + New Button */}
                  <button
                    onClick={() => {
                      document.getElementById("beneficiary-modal").showModal();
                    }}
                    style={quicksand.style}
                    className="flex items-center gap-1.5 bg-white border border-dashed border-[#03457c] text-[#03457c] hover:bg-[#E6F0FA]/50 text-xs py-1.5 px-3 rounded-full transition-all shrink-0 font-medium cursor-pointer"
                  >
                    <span className="bg-[#03457c]/10 rounded-full w-4 h-4 flex items-center justify-center text-[#03457c]">
                      <Plus className="w-3 h-3" />
                    </span>
                    <span>New</span>
                  </button>
                </>
              )}
            </div>
          </article>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTransfer();
            }}
            className="mt-4 space-y-4"
          >
            {/* Account Number Input */}
            <div>
              <label className="text-xs mb-0.5 font-medium" style={quicksand.style}>
                Account number
              </label>
              <div className="relative flex items-center">
                <input
                  required
                  inputMode="numeric"
                  maxLength={10}
                  minLength={10}
                  value={form.account}
                  onChange={(e) =>{
                    setActiveID(e.target.value)
                    setForm({ ...form, account: e.target.value.replace(/\D/g, "") })
                  }
                  }
                  style={quicksand.style}
                  className="input bg-white w-full placeholder:opacity-65 mt-1 text-[13px] rounded-xl border border-black font-mono tracking-wider pr-10"
                  placeholder="0123456789"
                />
                {isLookupLoading && (
                  <div className="absolute right-3 top-[calc(50%+3px)] -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {form.recipient && !lookupError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-1.5 text-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={bricolage.style}>
                        {`${form.recipient?.firstName || ""} ${form.recipient?.lastName || ""}`.trim() || "Recipient Verified"}
                      </p>
                    </div>
                  </motion.div>
                )}

                {lookupError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{lookupError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-xs tracking-wide mb-1 font-medium" style={quicksand.style}>
                Amount (NGN)
              </label>
              <input
                required
                inputMode="numeric"
                value={form.amount}
                onChange={handleAmountChange}
                style={quicksand.style}
                className={`input input-bordered text-[13px] w-full placeholder:opacity-65 mt-1 rounded-xl border bg-[#fff] transition-colors ${
                  amountError ? "border-rose-500 focus:outline-rose-500" : "border-black"
                }`}
                placeholder="0.00"
              />
              <AnimatePresence>
                {amountError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={quicksand.style}
                    className=" text-[11px] text-rose-600 mt-1.5 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{amountError}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Narration Input */}
            <div>
              <label className="text-xs tracking-wide mb-0.5 font-medium" style={quicksand.style}>
                Narration (optional)
              </label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="input input-bordered w-full placeholder:opacity-65 mt-1 text-[13px] rounded-xl border border-black bg-[#fff]"
                placeholder="What's this for?"
                style={quicksand.style}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={!form.recipient || isLookupLoading || !!amountError || !form.amount}
              className="btn border-none outline-none shadow-sm bg-[#03457C] text-white hover:bg-[#02335c] disabled:opacity-60 text-sm rounded-full w-full mt-2 transition-all flex items-center justify-center gap-1 cursor-pointer"
              type="submit"
              style={bricolage.style}
            >
              <ArrowUpRight className="w-4 h-4 -mr-0.5" />
              <p className="text-[13px] mt-0.5">Send transfer</p>
            </button>
          </form>
        </section>
      </motion.div>

      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <AddOns balance={user?.balance} />
      </motion.div>

      <PinModal 
      id={"my-modal-4"} 
      formData={
       { accountNumber: form.account,
        accountName: `${form?.recipient?.firstName?.toUpperCase()} ${form?.recipient?.lastName?.toUpperCase()}`,
        amount:form.amount,
        narration:form?.note
       }
      } 
      setForm={setForm} type="transfer" />
      <AddBeneficiaryModal id="beneficiary-modal" />
    </div>
  );
}


export default function TransferPage() {
  return (
    <Suspense
      fallback={null}
    >
      <TransferFormContent />
    </Suspense>
  );
}