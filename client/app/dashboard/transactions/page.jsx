"use client";

import AllTransactions from "@/app/libs/ui/transactions"; 
import { TransactionChart } from "@/app/libs/ui/transactions-chart";
import { motion } from "motion/react";
import { quicksand } from "@/app/libs/utils/font";

function TransactionHistory() {
  return (
    <div className="tabs tabs-border w-full">
      {/* Tab 1: History */}
      <input
        type="radio"
        name="my_tabs_2"
        className="tab text-sm font-semibold outline-none tracking-wide text-slate-500 hover:text-[#03457C] checked:text-[#03457C]  checked:border-b-[#03457C] checked:bg-[#E6F0FA] transition-all duration-200 rounded-t-lg px-4 py-2 mb-6"
        aria-label="History"
        style={quicksand?.style}
        defaultChecked
      />
      <div className="tab-content">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <AllTransactions />
        </motion.div>
      </div>

      {/* Tab 2: Analytics */}
      <input
        type="radio"
        name="my_tabs_2"
        className="tab text-sm font-semibold tracking-wide outline-none text-slate-500 hover:text-[#03457C] checked:text-[#03457C]  checked:border-b-[#03457C] checked:bg-[#E6F0FA] transition-all duration-200 rounded-t-lg px-4 py-2 mb-6"
        aria-label="Analytics"
        style={quicksand?.style}
      />
      <div className="tab-content">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <TransactionChart />
        </motion.div>
      </div>
    </div>
  );
}

export default TransactionHistory;