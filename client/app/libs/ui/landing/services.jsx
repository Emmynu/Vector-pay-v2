"use client";

import "../../../globals.css";
import { motion } from "framer-motion";
import { ArrowLeftRight, Wallet, Shield, Sparkles } from "lucide-react";
import { services } from "../../utils/data";
import { montserrat, quicksand, bricolage } from "../../utils/font";

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
//bg-slate-50/70 
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="services">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[200px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
       
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start md:items-center text-left md:text-center max-w-3xl"
        >
    
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-[1.2] tracking-tight ${montserrat.className}`}
          >
            Financial tools built for the{" "}
            <span className="bg-gradient-to-r from-[#03457C] via-[#4A90E2] to-[#03457C] bg-clip-text text-transparent">
              speed of your life.
            </span>
          </h1>

          <p
            className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed"
            style={quicksand.style}
          >
            From zero-fee instant transfers to intelligent real-time account tracking, our suite of digital services gives you complete mastery over your everyday finances.
          </p>
        </motion.header>

        {/* Services Grid with Staggered Animations */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
             
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#03457C] to-blue-600 flex items-center justify-center text-white shadow-md shadow-[#03457C]/20 mb-6 group-hover:scale-105 transition-transform duration-300">
                  {service.icon === "p2p" ? (
                    <ArrowLeftRight className="w-6 h-6" />
                  ) : service.icon === "wallet" ? (
                    <Wallet className="w-6 h-6" />
                  ) : (
                    <Shield className="w-6 h-6" />
                  )}
                </div>

                {/* Service Title */}
                <h3
                  className="text-lg md:text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-[#03457C] transition-colors"
                  style={bricolage.style}
                >
                  {service.title}
                </h3>

               
                <p
                  className="text-xs md:text-sm text-slate-600 leading-relaxed"
                  style={quicksand.style}
                >
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </section>
  );
}