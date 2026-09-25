"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Wallet, Zap, ShieldCheck } from "lucide-react";
import tourImg from "@/app/libs/images/product-tour.gif";
import { bricolage, montserrat, quicksand } from "../../utils/font";
import "../../../globals.css";

export default function ProductTour() {
  const steps = [
    {
      title: "Enter Amount",
      desc: "Specify exact transfer or deposit funds instantly.",
      icon: Wallet,
    },
    {
      title: "One-Tap Deposit",
      desc: "Seamless wallet funding with live balance updates.",
      icon: Zap,
    },
    {
      title: "Instant Settlement",
      desc: "Zero waiting time with automated settlement confirmation.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="w-full py-10 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden" id="product-tour">

        <div className="absolute top-1/2 -left-15 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
         
          <div className="lg:col-span-6 flex flex-col items-start">

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-[1.18] tracking-tight ${montserrat.className}`}
            >
              Move money in{" "}
              <span className="bg-gradient-to-r from-[#03457C] to-[#03457C] bg-clip-text text-transparent">
                seconds, not steps.
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="mt-4 text-slate-600 text-sm max-w-2xl md:max-w-lg  leading-relaxed"
              style={quicksand.style}
            >
              Take a quick walkthrough of your VectorPay workspace — manage live balances, execute transfers, track analytical charts, and view real-time settlements all in one cohesive view.
            </p>

            {/* Workflow Step Indicators */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full cursor-pointer">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#03457C]/10 text-[#03457C] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3
                      className="text-sm font-bold text-slate-900 group-hover:text-[#03457C] transition-colors"
                      style={bricolage.style}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[11px] text-slate-500 mt-1 leading-normal"
                      style={quicksand.style}
                    >
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full rounded-3xl p-2 sm:p-3 bg-slate-900/5 border border-slate-200/80 shadow-2xl backdrop-blur-md">
              {/* Product Tour Image/GIF Container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/10]">
                <Image
                  src={tourImg}
                  alt="VectorPay Interactive Product Tour"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}