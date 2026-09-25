"use client";

import { useSummary } from "@/app/admin/api/summary";
import { quicksand, bricolage, montserrat } from "@/app/libs/utils/font";
import { motion } from "motion/react";
import {
  Users,
  UserPlus,
  Clock,
  RotateCw,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { containerVariants, itemVariants } from "../kyc/variants";
import { formatAmountShort, formatNumber } from "@/app/libs/utils/utils";
import { SummaryCardSkeleton } from "../users/user-summary";
import { useAnalytics } from "@/app/admin/api/transactions/get-transactions-analytics";
import { useKYC } from "@/app/admin/api/kyc/get-kycs";

export default function DashboardSummary() {
  const { summary, isLoading, fetchSummary, isRefetching } = useSummary();
  const { fetchAnalytics } = useAnalytics();
  const { fetchKYC } = useKYC();

  const cards = [
    {
      label: "Total Inflow",
      value: formatAmountShort(summary?.inflow || 0),
      icon: ArrowDownLeft,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    },
    {
      label: "Total Outflow",
      value: formatAmountShort(summary?.outflow || 0),
      icon: ArrowUpRight,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      accent: "from-rose-500/10 via-rose-500/5 to-transparent",
    },
    {
      label: "Total Users",
      value: formatNumber(summary?.totalUsers || 0),
      icon: Users,
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      accent: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    },
    {
      label: "Pending KYC",
      value: formatNumber(summary?.pendingKYC || 0),
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      accent: "from-amber-500/10 via-amber-500/5 to-transparent",
    },
    {
      label: "New Users",
      value: formatNumber(summary?.newUsers || 0),
      icon: UserPlus,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
      accent: "from-purple-500/10 via-purple-500/5 to-transparent",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Metrics Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-lg sm:text-xl font-bold text-slate-900"
            style={bricolage.style}
          >
            Metrics Overview
          </h2>
          <p className="text-xs text-slate-500" style={quicksand.style}>
            Real-time platform performance metrics
          </p>
        </div>

        <button
          onClick={() => {
            fetchSummary();
            fetchAnalytics();
            fetchKYC();
          }}
          disabled={isLoading || isRefetching}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs sm:text-[13px] text-gray-600 h-full flex items-center gap-1 cursor-pointer group hover:bg-gray-50/50 transition-colors w-fit"
          style={montserrat.style}
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${
              isLoading || isRefetching ? "animate-spin" : ""
            }`}
          />
          <span style={bricolage.style}>Refresh</span>
        </button>
      </div>

      {/* Grid configuration optimized for 5 items */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          if (isLoading) {
            return <SummaryCardSkeleton key={card.label} />;
          }

          return (
            <motion.article
              key={card.label}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md border cursor-pointer transition-all duration-300 flex items-center justify-between relative overflow-hidden border-slate-200 hover:border-[#03457C]/40 min-h-[105px]"
            >
              <div className="space-y-1 z-10 min-w-0 flex-1 mr-2">
                <h2
                  style={quicksand.style}
                  className="text-xs sm:text-[13px] font-medium text-slate-500 group-hover:text-slate-800 transition-colors truncate"
                >
                  {card.label}
                </h2>
                <p
                  style={bricolage.style}
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate"
                >
                  {card.value}
                </p>
              </div>

              <div
                className={`${card.accent} bg-gradient-to-br blur-xl absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none`}
              />
              <div
                className={`p-2.5 sm:p-3 rounded-xl transition-transform duration-300 group-hover:scale-105 z-10 shrink-0 ${card.iconBg}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </motion.article>
          );
        })}
      </motion.section>
    </div>
  );
}