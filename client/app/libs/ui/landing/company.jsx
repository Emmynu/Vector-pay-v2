"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import creditImg from "../../images/credits.webp";
import { bricolage, montserrat, quicksand } from "../../utils/font";
import "../../../globals.css";

export default function Company() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24" id="company">
      
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
            >
        
            <div className="lg:col-span-7 flex flex-col items-start text-left">

                <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight ${montserrat.className}`}
                >
                Empower Your <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-[#03457C] via-blue-700 to-[#4A90E2] bg-clip-text text-transparent">
                    Financial Future
                </span>
                </h1>

                
                <p
                className="mt-5 text-[13px]  text-slate-600 max-w-2xl md:max-w-lg leading-relaxed"
                style={quicksand.style}
                >
                Send, receive, and manage your funds effortlessly. Transfer money to friends, deposit funds into your account, and withdraw cash whenever you need with <span className="font-semibold text-slate-900">VectorPay</span>.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                    href="/dashboard"
                    className={`group inline-flex items-center justify-center gap-2 bg-[#03457C] hover:bg-[#02335c] text-white px-7 py-3.5 rounded-full font-semibold shadow-lg shadow-[#03457C]/25 transition-all duration-200 active:scale-95  ${bricolage.className}`}
                >
                    <p className="!text-[13px] sm:text-base">Get Started</p>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div
                    className="flex items-center justify-center gap-2 text-xs text-slate-500 px-2 py-2"
                    style={quicksand.style}
                >
                    <ShieldCheck className="w-4 h-4 text-[#03457c] shrink-0" />
                    <span>Bank-Grade Encryption & Verification</span>
                </div>
                </div>
            </div>

    
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-full max-w-md lg:max-w-none hidden lg:block"
                >
              
                <div className="scale-95 pointer-events-none" /> 

                <Image
                    src={creditImg}
                    alt="VectorPay App Preview"
                    width={550}
                    height={550}
                    priority
                    className="duration-500 hover:scale-[1.02]"
                />
                </motion.div>
            </div>
            </motion.div>
        </div>
    </section>
  );
}