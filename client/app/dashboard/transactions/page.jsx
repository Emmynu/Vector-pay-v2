"use client";

import Transactions from "@/app/libs/ui/transactions";
import { motion } from "motion/react";


function TransactionHistory() {

  return (
    <div>
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            <Transactions />
        </motion.div>
    </div>
  );
}

export default TransactionHistory;