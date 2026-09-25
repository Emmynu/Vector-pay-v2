import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { motion } from "motion/react";
import { itemVariants } from "../kyc/variants";

export default function UserSummaryCards({ summary, isLoading }) {
  const cards = [
    { 
      label: "Total Users", 
      value:  summary?.totalUsers || 0, 
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "from-blue-500/10 to-transparent",
    },
    { 
      label: "Verified Users", 
      value: summary?.verified ?? 0, 
      icon: UserCheck,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "from-emerald-500/10 to-transparent",
    },
    { 
      label: "Unverified Users", 
      value: summary?.unverified ?? 0, 
      icon: UserX,
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "from-rose-500/10 to-transparent",
    },
    { 
      label: "New Users", 
      value: summary?.newUsers || 0, 
      icon: UserPlus,
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      accent: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      {cards.map((card, index) => {
        const Icon = card.icon;
         if (isLoading) {
            return (
             <SummaryCardSkeleton />
            )
        }
        return (
          <motion.article
          key={card.label}
          variants={itemVariants}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          className={`group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border cursor-pointer transition-all duration-300 flex items-center justify-between relative overflow-hidden border-slate-200 hover:border-[#03457C]/40`}
          >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${card.accent} rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-300`} />

            {/* Card Content */}
            <div className="space-y-1 z-10">
              <p 
                style={quicksand.style} 
                className="text-[13px] font-medium text-slate-500 tracking-wide"
              >
                {card.label}
              </p>
              <h3 
                style={bricolage.style} 
                className="text-2xl sm:text-[27px] font-extrabold text-slate-900 tracking-tight"
              >
                {card.value.toLocaleString()}
              </h3>
            </div>

            {/* Card Icon */}
            <div className={`p-3 rounded-2xl border ${card.iconBg} shrink-0 z-10 transition-transform group-hover:scale-105 duration-200`}>
              <Icon className="w-5 h-5 " />
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}

export function SummaryCardSkeleton() {
  return(
     <div 
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse flex items-center justify-between"
      >
        <div className="space-y-3">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-12 bg-slate-200 rounded" />
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
      </div>
  )
}