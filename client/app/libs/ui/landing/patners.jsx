"use client";

import { names } from "../../utils/data";
import { motion } from "framer-motion";
import { bricolage, quicksand } from "../../utils/font";
import "@/app/globals.css"

export default function Partners() {
  
  const duplicatedNames = [...names, ...names];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-y border-slate-200/80 bg-slate-50/60 py-10 relative overflow-hidden backdrop-blur-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <p
          className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-slate-500 text-center mb-8"
          style={quicksand.style}
        >
          Trusted by category-defining teams & financial leaders
        </p>

        {/* Marquee Wrapper with Gradient Edge Fades */}
        <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max items-center gap-10 md:gap-16 animate-marquee hover:[animation-play-state:paused]">
            {duplicatedNames.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="font-bold text-lg md:text-xl text-slate-400 hover:text-[#03457C] transition-colors duration-200 cursor-pointer whitespace-nowrap select-none tracking-tight"
                style={bricolage.style}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}