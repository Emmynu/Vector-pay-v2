"use client"

import "../../globals.css"
import { motion } from "motion/react"
import { ArrowLeftRight, Wallet, Shield } from "lucide-react";
import { services } from "../utils/data";
import { montserrat } from "../utils/font";

export default function Services() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5 }} 
      className="w-full flex justify-center items-center bg-[#eff6ff]/40"
    >
      <main className="flex flex-col items-center justify-center text-left md:text-center py-16 px-6 md:px-15 min-h-[80vh] w-full max-w-7xl md:max-w-7xl" id="services">
        
        {/* Header Section */}
        <header className="flex flex-col items-start md:items-center justify-start max-w-6xl md:max-w-3xl mx-auto">
            <div className="mb-1">
                <h3 className="ml-1 text-[#03457c] text-left font-medium text-sm block md:hidden">Services</h3>
            </div>

          <h1 className={`mt-2 md:mt-0 text-[29px] leading-[2.2rem] md:leading-[normal] md:text-5xl font-bold ${montserrat.className}`}>
            Financial tools built for the speed of your life.
          </h1>
          <h6 className="mt-4 text-xs md:text-sm text-[#03457C] max-w-[none] md:max-w-2xl px-0 md:px-4">
            From zero-fee instant global transfers to intelligent real-time spending insights, our suite of digital services gives you absolute mastery over your everyday finances without the traditional banking headaches.
          </h6>
        </header>

        {/* Services Grid */}
        <section className="mt-10 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
          {services.map((service) => {
            return (
              <div className="card card-md shadow-sm bg-white  w-full h-full flex" key={service.title}>
                <div className="card-body p-6 flex flex-col justify-center items-center text-center bg-linear-to-tr transition-colors from-white from-75% to-blue-200 hover:shadow-xl shadow cursor-pointer rounded-xl w-full">
                  <article className="flex flex-col justify-center items-center">
                    <div className="p-3 rounded-2xl w-fit bg-linear-to-tl from-35% from-[#013868] to-blue-300 flex items-center justify-center">
                      {service.icon === "p2p" ? (
                        <ArrowLeftRight className="text-white" />
                      ) : service.icon === "wallet" ? (
                        <Wallet className="text-white" />
                      ) : (
                        <Shield className="text-white" />
                      )}
                    </div>
                    <h2 className="mt-5 font-medium text-base md:text-xl text-slate-900">{service.title}</h2>
                  </article>
                  <p className="mt-1 md:mt-3 text-xs md:text-sm text-slate-600">{service.description}</p>
                </div>
              </div>
            );
          })}
        </section>

      </main>
    </motion.div>
  );
}