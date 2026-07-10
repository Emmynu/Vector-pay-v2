"use client"

import "../../globals.css"
import { motion } from "motion/react"
import { ArrowLeftRight, Wallet, Shield } from "lucide-react";
import { services } from "../utils/data";


export default function Services() {
    return(
       <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{once:true}} transition={{duration: 0.5}} className=" bg-blue-50">

        <main className="mx-auto max-w-7xl py-20 px-6 md:px-0 min-h-[80vh]" id="services">
           <section>

                <header >
                    <p className="text-[#03457C] font-medium text-lg tracking-tight">Services</p>
                    <h1 className="mt-2 md:mt-0 text-[32px]  md:text-4xl font-bold fonty">Move Capital Globally, Scale seamlessly. </h1>
                    <h6 className="mt-3 text-[13px] l md:text-sm text-[rgb(3,69,124)]">Bypass slow legacy banking infrastructure and replace fragmented merchant providers with a secure, institutional-grade transaction layer engineered to accelerates global cash flow natively across international corridors.</h6>
                </header>

                
                <section className="mt-10 gap-12 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 ">
                    {services.map(service=>{
                        return (
                            <div className="card  card-lg shadow-sm bg-white border border-slate-200 " key={service.title}>
                                <div className="card-body bg-linear-to-tl transition-colors from-white from-75% to-blue-300 hover:shadow-xl shadow cursor-pointer rounded-xl">
                                    <article >
                                        <div className=" p-3 rounded-2xl w-fit bg-linear-to-tl from-35% from-[#013868] to-blue-300">
                                            {service.icon === "p2p" ? <ArrowLeftRight className="text-white"/> : service.icon === "wallet" ? <Wallet className="text-white"/>: <Shield className="text-white"/>}
                                        </div>
                                        <h2 className="mt-5 font-medium text-xl">{service.title}</h2>
                                    </article>
                                    <p className="text-sm text-slate-600">{service.description}</p>
                                </div>
                            </div>
                        )
                    })}

                </section>
           </section>
        </main>

       </motion.div>
    )
}