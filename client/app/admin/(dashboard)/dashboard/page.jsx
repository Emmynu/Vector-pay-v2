"use client";

import { motion } from "motion/react"; // Or "framer-motion"
import DashboardSummary from "@/app/libs/ui/admin/dashboard/summary";
import AdminTransactionsChart from "@/app/libs/ui/admin/transactions/transactions-chart";
import AdminKYC from "@/app/libs/ui/admin/dashboard/kyc";

function Dashboard() {
  return (
    <main className="space-y-5">
      <DashboardSummary />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        <AdminTransactionsChart />
      </motion.div>

      <AdminKYC />
    </main>
  );
}

export default Dashboard;