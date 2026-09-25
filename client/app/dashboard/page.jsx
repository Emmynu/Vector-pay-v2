"use client";

import DashboardWallet from "../libs/ui/dashboard/wallet";
import DashboardTier from "../libs/ui/dashboard/tier";
import RecentTransactions from "../libs/ui/dashboard/dashboard-transactions";
import { DashboardTransactionChart } from "../libs/ui/dashboard/dashboard-chart";
import { bricolage, montserrat, quicksand } from "../libs/utils/font";
import { useUser } from "../auth/api/profile";
import { motion } from "motion/react";

function Dashboard() {
  const { data: user, isLoading } = useUser();

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "tween", duration: 0.25 }}
      >
        <section className="flex justify-between items-center">
          {isLoading ? (
            <div className="skeleton h-4 bg-slate-300 w-40"></div>
          ) : (
            <h1 className={`${bricolage.className} text-xl md:text-2xl`}>
              Welcome {`${user?.firstName} ${user?.lastName.slice(0, 1).toUpperCase()},`}
            </h1>
          )}
        </section>
      </motion.div>

      <section className="grid grid-cols-1 md:grid-cols-5 items-start gap-3 md:gap-5 mt-4 md:mt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "tween", duration: 0.25 }}
          className="md:col-span-3"
        >
          <DashboardWallet />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "tween", duration: 0.35 }}
          className="md:col-span-2"
        >
          <DashboardTier />
        </motion.div>
      </section>

  
      <section className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 mt-3 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: +8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: +8 }}
          transition={{ type: "tween", duration: 0.45 }}
          className="md:col-span-3 flex flex-col h-full"
        >
          <RecentTransactions />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: +8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: +8 }}
          transition={{ type: "tween", duration: 0.55 }}
          className="md:col-span-2 flex flex-col h-full"
        >
          <section className="shadow-md bg-white rounded-2xl border border-slate-200 px-5 py-8 h-full flex flex-col justify-between mt-2">
            <DashboardTransactionChart />
          </section>
        </motion.div>
      </section>
    </main>
  );
}

export default Dashboard;