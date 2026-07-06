import { names } from "./data";
import { motion } from "motion/react";

export default function Patners() {
  
    
  return (
   <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{once:true}} transition={{duration: 0.5}}>
       <section className="border border-slate-300 bg-slate-50">
      <div className="mx-auto max-w-7xl px-7 py-10">
        <p className="text-[11px] md:text-xs uppercase tracking-widest  text-gray-700 text-center mb-6">Trusted by category-defining teams</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4">
          {names.map((n) => (
            <span key={n} className="font-display font-semibold text-base cursor-pointer transition-colors md:text-xl text-gray-700/90 hover:text-[#03457C]">{n}</span>
          ))}
        </div>
      </div>
    </section>

   </motion.div>

    
  );
}