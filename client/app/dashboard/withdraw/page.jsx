"use client";

import { Wallet, Banknote } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/app/auth/api/profile";
import { formatAmount } from "@/app/libs/utils/utils";
import { bricolage, montserrat } from "@/app/libs/utils/font";
import { motion } from "motion/react";

export default function Withdraw() {
    const { data:user } = useUser()
  const [form, setForm] = useState({ account: "", amount: "", note: "" });

  return (
      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.35 }}   className="lg:col-span-2 rounded-2xl bg-[#fff] border border-slate-200 p-6 lg:p-8 shadow-sm">
          <section >
          <h2 className="font-display font-bold text-base" style={montserrat.style}>Withdraw to bank</h2>
          <p className="opacity-60 text-[13px] md:text-sm">Move money from your wallet to your bank account.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              
            }}
            className="mt-4 space-y-4"
          >
         <label className="text-[12px] tracking-wide mb-1 text-sm">Select Bank</label>
            <select
                // value={account}
                // onChange={(e) => setAccount(e.target.value)}
                className="select select-bordered w-full bg-input mt-1.5 rounded-xl placeholder:opacity-65"
              >
                <option value="gtb-4521">GTBank ****4521 · Ada Okonkwo</option>
                <option value="acc-9982">Access Bank ****9982 · Ada Okonkwo</option>
            </select>
            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm">Account number</label>
              <input
                required
                inputMode="numeric"
                maxLength={10}
                value={form.account}
                onChange={(e) => setForm({ ...form, account: e.target.value.replace(/\D/g, "") })}
                className="input bg-white w-full placeholder:opacity-65 mt-1.5 rounded-xl border border-black font-mono tracking-wider"
                placeholder="0123456789"
              />
            </div>
            <div>
              <label className="text-[12px] tracking-wide  mb-1 text-sm">Amount (NGN)</label>
              <input
                required
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input input-bordered placeholder:opacity-65 w-full mt-1.5 rounded-xl border border-black bg-[#fff]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm">Narration (optional)</label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="input input-bordered w-full mt-1.5 placeholder:opacity-65 rounded-xl border border-black bg-[#fff]"
                placeholder="What's this for?"
              />
            </div>
            <button className="btn outline-none border-none shadow-sm py-4 bg-[#03457C] rounded-full w-full mt-2">
              <Banknote className="w-4 h-4" />
              Withdraw now
            </button>
          </form>
          </section>
        </motion.div>

        <motion.div initial={{ x : 80, opacity: 0}}  animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} >
          <aside className="rounded-2xl bg-[#fff] border border-slate-200 p-6 shadow-sm h-fit">
            <p className="text-xs md:text-sm opacity-60 flex items-center"><Wallet className="w-3.5 mr-1"/> Available balance</p>
            <p className="text-[30px] font-display font-bold mt-1" style={bricolage.style}>{formatAmount(user?.balance) || "₦0.00"}</p>
          <div className="mt-2 pt-3 border-t border-slate-300 text-[11px] md:text-xs  space-y-1 opacity-70">
            <p>· Transfers are processed instantly, 24/7.</p>
            <p>· No fees on VectorPay-to-VectorPay transfers.</p>
            <p>· Interbank transfers may incur a ₦25 fee.</p>
          </div>
        </aside>
        </motion.div>
      </div>
  );
}
