"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDownLeft,  CheckCircle2, Plus, Users2, Loader2, AlertCircle } from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { useBeneficiary } from "../api/beneficiaries/get-beneficaries";
import { useEffect, useState } from "react";
import AddBeneficiaryModal from "@/app/libs/ui/dashboard/beneficiaries-modal";
import { useTransfer } from "../api/transfer";
import { testAmount } from "@/app/libs/utils/utils";
import { useRequest } from "../api/request/create-request";
import { showToast } from "@/app/libs/toast/sonner";
import RequestSent from "@/app/libs/ui/dashboard/requests-sent";
import { useQueryClient } from "@tanstack/react-query";
import RequestReceived from "@/app/libs/ui/dashboard/requests-received";


export const card = "rounded-2xl bg-[#fff] border border-slate-200 shadow-sm";

function RequestsPage() {
    const { beneficiaries, isLoading } = useBeneficiary()
    const [activeID, setActiveID] = useState(null)
    const [form, setForm] = useState({ accountNumber: "", amount: "", narration: "", recipient: null });
    const { accountLookup, isLookupLoading } = useTransfer()
    const [lookupError, setLookupError] = useState(null);
    const [amountError, setAmountError] = useState(null);
    const { requestMoney, isLoading:isRequestting } = useRequest()
    const queryClient = useQueryClient()


    useEffect(()=>{
       async function lookupAccount() {
      
        if (form.accountNumber.length === 10) {
            setLookupError("")
            try {
                const accountInfo = await accountLookup({ accountNumber: form.accountNumber })

                if(accountInfo?.status === 200){
                    setForm((prv)=>({...prv, recipient: accountInfo.data?.data}))
                }
                else{        
                    setLookupError("Account details could not be found.")
                }
            } 
            catch (error) {
                setForm((v) => ({ ...v, recipient: null }));
                setLookupError(error?.response?.data?.message || "Invalid account number or lookup failed.");
            }
        }
        else{
            setLookupError("")
            setForm((v) => ({ ...v, recipient: null }));
        }
       }
       lookupAccount()
    },[form.accountNumber])


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
    

    async function handleRequest(e) {
        e.preventDefault()
        const formData = {
            account_number: form.accountNumber,
            amount:parseInt(form.amount),
            narration: form.narration.length > 1 ? form.narration : null
        }

        const name = `${form.recipient?.firstName || ""} ${form.recipient?.lastName || ""}`.trim() || "the recipient";

        const response = await requestMoney(formData)

        if(response?.status === 201){
            showToast({ 
                type: "success",   
                title: "Request sent",
                msg: `You requested ₦${formData.amount} from ${name}.`,
            })
            setForm({ accountNumber: "", amount: "", narration: "", recipient: null })
            queryClient.refetchQueries({ queryKey: ["get-requests"] })
        }

      else{
        showToast({type: "error", title:response?.title, msg: response?.msg})
      }
        
        
    }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {/* ───────────── Request form ───────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.35 }}
        className={`lg:col-span-2 p-6 lg:p-8 ${card}`}
      >
        <h2 className="font-display font-bold md:text-lg" style={bricolage.style}>
          Request money
        </h2>
        <p className="opacity-60 text-[13px]" style={quicksand.style}>
          Ask another VectorPay user to send you money.
        </p>

        {/* Quick select */}
        <article>
          <header className="flex justify-between items-center mt-4" style={quicksand.style}>
            <h3 className="flex items-center gap-1 text-xs opacity-90 font-medium">
              <Users2 className="w-3.5 h-3.5" />
              <span>Quick select from beneficiaries</span>
            </h3>
            <Link
              href="/dashboard/beneficiaries"
              style={bricolage.style}
              className="text-xs font-bold text-[#03457c] hover:underline"
            >
              View all →
            </Link>
          </header>

          <div className="flex items-center gap-2.5 mt-2.5 overflow-x-auto pb-2 scrollbar-none">
            {isLoading ? 
            (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-[#03457c]" />
                    <span style={quicksand.style}>Loading beneficiaries...</span>
                </div>
            )
            : 
           (
                beneficiaries?.beneficiaries?.map((item)=>{
                    const name = item?.nickname || item?.beneficiary?.firstName || "User";
                    const initials = name.slice(0, 2).toUpperCase();
                    const accountNumber = item?.beneficiary?.accountNumber;
                    const isActive =  accountNumber === activeID

                    return(
                        <button
                        key={item?.id }
                        type="button"
                        className={`flex items-center gap-2 border text-xs py-1.5 px-3 rounded-full transition-all shrink-0 cursor-pointer group ${
                        isActive 
                            ? "bg-[#E6F0FA] border-[#03457c]" /* selected state */
                            : "bg-[#F4F8FC] hover:bg-[#E6F0FA] border-slate-200"
                        }`}
                        onClick={()=>{
                            if(accountNumber){
                                setForm((prev)=>({...prev, accountNumber}))
                                setActiveID(accountNumber)
                            }
                        }}
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
                    )
                })
            )
            }

            <button
              type="button"
              style={quicksand.style}
              className="flex items-center gap-1.5 bg-white border border-dashed border-[#03457c] text-[#03457c] hover:bg-[#E6F0FA]/50 text-xs py-1.5 px-3 rounded-full transition-all shrink-0 font-medium cursor-pointer"
              onClick={() => {
                document.getElementById("beneficiary-modal").showModal()
            }}
            >
              <span className="bg-[#03457c]/10 rounded-full w-4 h-4 flex items-center justify-center">
                <Plus className="w-3 h-3" />
              </span>
              <span>New</span>
            </button>
          </div>
        </article>

        <form className="mt-4 space-y-4" onSubmit={handleRequest}>
          {/* Account number */}
          <div>
            <label htmlFor="req-account" className="text-xs mb-0.5 font-medium" style={quicksand.style}>
                Account number
            </label>
            <section className="relative flex items-center">
                <input
                id="req-account"
                inputMode="numeric"
                maxLength={10}
                style={quicksand.style}
                className="input bg-white w-full placeholder:opacity-65 mt-1 text-[13px] rounded-xl border border-black font-mono tracking-wider"
                placeholder="0123456789"
                value={form.accountNumber}
                onChange={(e)=>{
                    setActiveID(e.target.value)
                    setForm((prev)=>({...prev, accountNumber:e.target.value}))
                }}
                />

                {isLookupLoading && (
                    <div className="absolute right-3 top-[calc(50%+3px)] -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                    </div>
                )}
            </section>

            {/* Verified state: show once the account lookup succeeds */}
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

          {/* Amount */}
          <div>
            <label htmlFor="req-amount" className="text-xs tracking-wide mb-1 font-medium" style={quicksand.style}>
              Amount (NGN)
            </label>
            <input
              id="req-amount"
              inputMode="numeric"
              style={quicksand.style}
              required
              className={`input input-bordered text-[13px] w-full placeholder:opacity-65 mt-1 rounded-xl border bg-[#fff] transition-colors ${
                  amountError ? "border-rose-500 focus:outline-rose-500" : "border-black"
                }`}
              value={form.amount}
              placeholder="0.00"
              onChange={handleAmountChange}
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

          {/* Reason */}
          <div>
            <label htmlFor="req-note" className="text-xs tracking-wide mb-0.5 font-medium" style={quicksand.style}>
              Reason (optional)
            </label>
            <input
              id="req-note"
              style={quicksand.style}
              className="input input-bordered w-full placeholder:opacity-65 mt-1 text-[13px] rounded-xl border border-black bg-[#fff]"
              placeholder="What's this for?"
              value={form.narration}
              onChange={(e)=>setForm((prev)=>({...prev, narration:e.target.value}))}
            />
          </div>

          <button
            type="submit"
            style={bricolage.style}
            disabled={!form.recipient || isLookupLoading || !form.amount || amountError || isRequestting}
            className="btn border-none outline-none shadow-sm bg-[#03457C] text-white hover:bg-[#02335c] disabled:opacity-60 text-sm rounded-full w-full mt-2 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            { !isRequestting ? <>
                <ArrowDownLeft className="w-4 h-4 -mr-0.5" />
                <p className="text-[13px] mt-0.5">Send request</p>
            </>: <>
                <span className="loading loading-spinner loading-xs mr-0.5"></span>
                <span>Loading....</span>
            </> }
          </button>
        </form>
      </motion.section>

      {/* ───────────── Right column ───────────── */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="space-y-5 min-w-0"
      >
    
        <RequestReceived />
        <RequestSent />
      </motion.div>
      <AddBeneficiaryModal />
    </div>
  );
}

export default RequestsPage;