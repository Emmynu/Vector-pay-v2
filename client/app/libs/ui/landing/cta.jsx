import "../../../globals.css"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react";
import { bricolage, montserrat, quicksand } from "../../utils/font";

export default function CTA() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{once:true}}  transition={{duration: 0.5}}>
      <section className="mx-auto max-w-7xl p-2 md:px-6 py-24 ">
        <div className="rounded-3xl bg-gradient-hero py-12 px-8 md:p-20 text-center  relative overflow-hidden">
          <div className="absolute inset-0 hero-img" />
          <div className="relative">
            <h2 className="text-[31px] leading-[2.2rem] md:leading-[normal] md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto" style={montserrat.style}>Start managing your money smarter.</h2>
            <p className="mt-5 text-[15px] md:text-lg text-white/75 max-w-xl mx-auto" style={quicksand.style}>Join thousands of businesses and individuala moving capital seamlessly with instant wallet transfrs and direct local banking rails.</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link href="/auth/register" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white  font-medium text-[#03457c] hover:bg-white/90 transition-all ${bricolage.className}`}>
                Create an account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="https://vector-pay.onrender.com/redoc" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 backdrop-blur transition-all ${bricolage.className}`}>
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}