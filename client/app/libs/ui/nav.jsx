import { ArrowRight } from "lucide-react"
import "../../globals.css"
import Link from "next/link"
import { motion } from "motion/react"
import Logo from "./logo"


export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200 select-none">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <motion.div initial={{opacity:0 , scale: 0}} animate={{opacity:1 , scale: 1}} transition={{duration: 0.3}}>
          <Logo />
        </motion.div>

        <motion.div initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration: 0.3}}>
          <nav className="hidden md:flex items-center gap-6 text-[15px] leading-1" >
            <a href="#services" className="text-gray-600 hover:text-black transition-colors">Services</a>
            {/* <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a> */}
            <a href="#" className="text-gray-600 hover:text-black transition-colors">Documentation</a>
            <a href="#company" className="text-gray-600 hover:text-black transition-colors">Company</a>
          </nav>
        </motion.div>
       
       
       <motion.div initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration: 0.3}}>
         <div className="flex items-center gap-2 ">
            <Link href="/auth/login" className="hidden md:inline-flex text-sm font-medium shadow-none border-2 border-[#03457C] text-[#03457C] px-5 py-2 rounded-full transition-colors transition-[all 2s linear] hover:bg-[#03457C] hover:text-white">Sign in</Link>
            <Link href="/auth/register" className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full bg-[#03457C] text-white hover:opacity-90 transition-colors">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
       </motion.div>
      </div>
    </header>
  );
}