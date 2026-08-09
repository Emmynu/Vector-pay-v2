"use client";

import { ArrowUpRight, Wallet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/app/auth/api/profile";
import { formatAmount } from "@/app/libs/utils/utils";
import { bricolage, montserrat } from "@/app/libs/utils/font";
import { motion, AnimatePresence } from "motion/react";
import { useTransfer } from "../api/transfer";
import { PinModal } from "@/app/libs/ui/pin-payment-modal";

export default function TransferPage() {
  const { data: user } = useUser();
  const [form, setForm] = useState({ account: "", amount: "", note: "", recipient: null });
  const [lookupError, setLookupError] = useState("");


  const { accountLookup, isLookupLoading } = useTransfer();

  useEffect(() => {
    async function fetchAccountDetails() {
      if (form.account.length === 10) {
        setLookupError("");
        try {
          const lookupData = { accountNumber: form.account };
          const res = await accountLookup(lookupData);
          
         
          const recipientData = res?.data?.data || res?.data;

          if (recipientData) {
            setForm((v)=>({...v, recipient:recipientData}));
          } else {
            setLookupError("Account details could not be found.");
          }
        } catch (err) {
          setForm((v)=>({...v, recipient:null}));
          setLookupError(err?.response?.data?.message || "Invalid account number or lookup failed.");
        }
      } else {

        setForm((v)=>({...v, recipient:null}));
        setLookupError("");
      }
    }

    fetchAccountDetails();
  }, [form.account]);



  function handleTransfer() {
    if (!form.recipient) return;
    document.getElementById("my-modal-4").showModal()
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
          <h2 className="font-display font-bold text-base" style={montserrat.style}>
            Send money
          </h2>
          <p className="opacity-60 text-[13px] md:text-sm">
            Instant peer-to-peer transfers with zero fees.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTransfer();
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm font-medium">
                Account number
              </label>
              <div className="relative flex items-center">
                <input
                  required
                  inputMode="numeric"
                  maxLength={10}
                  minLength={10}
                  value={form.account}
                  onChange={(e) =>
                    setForm({ ...form, account: e.target.value.replace(/\D/g, "") })
                  }
                  className="input bg-white w-full placeholder:opacity-65 mt-1.5 rounded-xl border border-black font-mono tracking-wider pr-10"
                  placeholder="0123456789"
                />
                {isLookupLoading && (
                  <div className="absolute right-3 top-[calc(50%+3px)] -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                  </div>
                )}
              </div>

  
              <AnimatePresence>
                {(form.recipient && !lookupError) && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2.5 text-emerald-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider">
                        {`${form.recipient?.firstName} ${form.recipient?.lastName}`|| "Recipient Verified"}
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

            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm font-medium">
                Amount (NGN)
              </label>
              <input
                required
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={`input input-bordered w-full placeholder:opacity-65 mt-1.5 rounded-xl border bg-[#fff] ${form.amount && Number(form.amount) < 10
                  ? "border-rose-500 focus:outline-rose-500"
                  : "border-black"
              }`}
                placeholder="0.00"
              />
              {form.amount && Number(form.amount) < 10 && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  Minimum transfer amount is ₦10.00
                </p>
              )}
            </div>

            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm font-medium">
                Narration (optional)
              </label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="input input-bordered w-full placeholder:opacity-65 mt-1.5 rounded-xl border border-black bg-[#fff]"
                placeholder="What's this for?"
                minLength={3}
              />
            </div>

            <button
              disabled={!form.recipient || isLookupLoading}
              className="btn border-none outline-none shadow-sm bg-[#03457C] text-white hover:bg-[#02335c] disabled:opacity-60  rounded-full w-full mt-2 transition-all"
              type="submit"
            >
              <ArrowUpRight className="w-4 h-4" />
              Send transfer
            </button>
          </form>
        </section>
      </motion.div>

      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <aside className="rounded-2xl bg-[#fff] border border-slate-200 p-6 shadow-sm h-fit">
          <p className="text-xs md:text-sm opacity-60 flex items-center">
            <Wallet className="w-3.5 mr-1" /> Available balance
          </p>
          <p
            className="text-[30px] font-display font-bold mt-1"
            style={bricolage.style}
          >
            {formatAmount(user?.balance) || "₦0.00"}
          </p>
          <div className="mt-2 pt-3 border-t border-slate-300 text-[11px] md:text-xs space-y-1 opacity-70">
            <p>· Transfers are processed instantly, 24/7.</p>
            <p>· No fees on VectorPay-to-VectorPay transfers.</p>
            <p>· Interbank transfers may incur a ₦25 fee.</p>
          </div>
        </aside>
      </motion.div>
      <PinModal id={"my-modal-4"} formData={form} setForm={setForm}/>
    </div>
  );
}