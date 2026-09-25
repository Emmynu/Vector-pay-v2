import { quicksand, bricolage} from "@/app/libs/utils/font"
import { motion } from "motion/react"
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react"
import { itemVariants } from "./variants"
import { SummaryCardSkeleton } from "../users/user-summary";

export default function KYCSummary({ kyc, isLoading }) {

    const cards = [
  { 
    label: "Total Document", 
    value: kyc?.total ?? 0, 
    icon: FileText,
    iconBg: "bg-blue-50 text-[#03457C]",
    accent: "from-[#03457C]/10 to-transparent",
  },
  { 
    label: "Pending", 
    value: kyc?.pending ?? 0, 
    icon: Clock,
    iconBg: "bg-amber-50 text-amber-600",
    accent: "from-amber-500/10 to-transparent",
  },
  { 
    label: "Approved", 
    value: kyc?.verified ?? 0,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50 text-emerald-600",
    accent: "from-emerald-500/10 to-transparent",
  },
  { 
    label: "Rejected", 
    value: kyc?.declined ?? 0, 
    filter: "declined",
    icon: XCircle,
    iconBg: "bg-rose-50 text-rose-600",
    accent: "from-rose-500/10 to-transparent",
  },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon
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
                        className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border cursor-pointer transition-all duration-300 flex items-center justify-between relative overflow-hidden border-slate-200 hover:border-[#03457C]/40"
                    >
                        <div className="space-y-1">
                            <h2 style={quicksand.style} className="text-[13px] font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
                                {card.label}
                            </h2>
                            <p style={bricolage.style} className="text-2xl sm:text-[27px] font-extrabold text-slate-900 tracking-tight">
                                {card.value}
                            </p>
                        </div>

                        <div className={`${card.accent}  bg-gradient-to-br blur-xl absolute -right-4 -bottom-4 w-24 h-24`}/>
                        <div className={`p-3 rounded-xl transition-transform duration-300  ${card.iconBg}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    </motion.article>
                )
            })}
    </section>
    )
}