"use client";

import { Wallet, Banknote } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/app/auth/api/profile";
import { formatNumber } from "@/app/libs/utils/utils";
import { bricolage, montserrat } from "@/app/libs/utils/font";

export default function Withdraw() {
    const { data:user } = useUser()
  const [form, setForm] = useState({ account: "", amount: "", note: "" });

  return (
      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-2xl bg-[#fff] border border-slate-200 p-6 lg:p-8 shadow-sm">
          <h2 className="font-display font-bold text-base" style={montserrat.style}>Withdraw to bank</h2>
          <p className="opacity-60 text-[13px] md:text-sm">Move money from your wallet to your bank account.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              
            }}
            className="mt-6 space-y-4"
          >
         
            <select
                // value={account}
                // onChange={(e) => setAccount(e.target.value)}
                className="select select-bordered w-full bg-input mt-1.5 rounded-xl"
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
                className="input bg-white w-full mt-1.5 rounded-xl border border-black font-mono tracking-wider"
                placeholder="0123456789"
              />
            </div>
            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm">Amount (NGN)</label>
              <input
                required
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input input-bordered w-full mt-1.5 rounded-xl border border-black bg-[#fff]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-[12px] tracking-wide mb-1 text-sm">Narration (optional)</label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="input input-bordered w-full mt-1.5 rounded-xl border border-black bg-[#fff]"
                placeholder="What's this for?"
              />
            </div>
            <button className="btn btn-primary bg-[#03457C] rounded-full w-full mt-2">
              <Banknote className="w-4 h-4" />
              Withdraw now
            </button>
          </form>
        </section>

        <aside className="rounded-2xl bg-[#fff] border border-slate-200 p-6 shadow-sm h-fit">
          <p className="text-sm opacity-60 flex items-center"><Wallet className="w-3.5 mr-1"/> Available balance</p>
          <p className="text-[30px] font-display font-bold mt-1" style={bricolage.style}>{formatNumber(user?.balance)}</p>
          <div className="mt-2 pt-3 border-t border-slate-300 text-xs space-y-1 opacity-80">
            <p>· Transfers are processed instantly, 24/7.</p>
            <p>· No fees on VectorPay-to-VectorPay transfers.</p>
            <p>· Interbank transfers may incur a ₦25 fee.</p>
          </div>
        </aside>
      </div>
  );
}
