import "../../globals.css"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react";

export default function CTA() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{once:true}}  transition={{duration: 0.5}}>
      <section className="mx-auto max-w-7xl px-6 py-24 ">
        <div className="rounded-3xl bg-gradient-hero p-12 md:p-20 text-center  relative overflow-hidden">
          <div className="absolute inset-0 hero-img" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto">Ready to move money the modern way?</h2>
            <p className="mt-5 text-lg text-white/75 max-w-xl mx-auto">Join thousands of businesses and individuala moving capital seamlessly with instant wallet transfrs and direct local banking rails.</p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white  font-medium text-[#03457c] hover:bg-white/90 transition-all">
                Create an account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 backdrop-blur transition-all">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}