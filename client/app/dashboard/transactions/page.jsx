"use client";

import AllTransactions from "@/app/libs/ui/transactions";
import { motion } from "motion/react";


function TransactionHistory() {

  return (
    <div>
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            <AllTransactions />
        </motion.div>
    </div>
  );
}

export default TransactionHistory;