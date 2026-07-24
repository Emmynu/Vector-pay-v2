"use client"

import Link from "next/link"
import "../../globals.css"
import { motion } from "motion/react"
import creditImg  from "../images/credits.webp"
import Image from "next/image"
import { bricolage, montserrat } from "../utils/font"
export default function Company(){
    return (
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{duration: 0.5}} >

        <main className="hero my-[-20vh] md:my-[-12vh] min-h-screen" id="company">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <Image src={creditImg} alt="img" className="h-[53%] w-[53%] hidden lg:block" loading="eager"/>
                <section>
                 <h1 className={`text-5xl md:text-6xl leading-[1.2] font-bold ${montserrat.className}`}> Your <span className="text-[#05365e]">Financial</span> Future!</h1>
                <p className="py-4">
                    Send, receive and manage your funds effortlessly . Transfer money to friends, deposit funds into your account and withdraw cash whenever with VectorPay.</p>
                <Link href={"/dashboard"} className={`btn bg-linear-to-br outline-none border-none from-blue-900 from-70% to-blue-500 p-6 w-fit flex items-center  hover:scale-97 rounded-md ${bricolage.className}`}>Get Started <span className="text-xl mt-[-2.5px]">»</span></Link>
                </section>
            </div>
        </main>

       </motion.div>
    )
}