"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AllTransactions from "@/app/libs/ui/transactions/transactions"; 
import { TransactionChart } from "@/app/libs/ui/transactions/transactions-chart";
import { quicksand } from "@/app/libs/utils/font";

function TransactionHistory() {
  const [activeTab, setActiveTab] = useState("history");

  const tabs = [
    { id: "history", label: "History" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-2 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={quicksand?.style}
              className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 rounded-lg cursor-pointer ${
                isActive
                  ? "text-[#03457C] bg-[#E6F0FA]"
                  : "text-slate-500 hover:text-[#03457C] hover:bg-slate-50"
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#03457C] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

    
      <AnimatePresence mode="wait">
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <AllTransactions />
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <TransactionChart />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default TransactionHistory;