import "../../globals.css"
import tourImg from "@/app/libs/images/product-tour.gif"
import Image from "next/image";
import { bricolage, montserrat } from "../utils/font";
import { motion } from "motion/react";
function ProductTour() {
    return ( 
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{once:true}} transition={{duration: 0.5}}>
        <div className="hero px-2 pt-10 pb-5 lg:p-8">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse">
            <Image src={tourImg} alt="img" className="w-full lg:h-[53%] lg:w-[60%] block mt-10 lg:mt-0" loading="lazy"/>
            <div>
                <div className="flex items-center mb-1">
                    <h3 className="ml-1 text-[#03457c] font-medium text-sm">Product Tour</h3>
                </div>
                <h1 className={`text-[31px] leading-[2.2rem] lg:leading-none md:text-5xl font-bold ${montserrat.className}`}>Move money in seconds, not steps</h1>
                <p className="text-[13px] md:text-sm text-slate-600 mt-3" >
                        A quick walkthrough of the dashboard — balances, transfers, charts, and real-time settlements in one place.
                
                    Fund your VectorPay wallet with a single tap — instant deposits, live balance updates, zero friction.
                    
                </p>
                    <div>
                    <h2 className={`mt-3 capitalize text-xs font-bold text-[#03457C] ${bricolage.className}`}>Amount <span className="text-[#03457C]">»</span> Deposit <span className="text-[#03457C]">»</span>  Settled</h2>
                    </div>
            {/* <button className="btn btn-primary">Get Started</button> */}
            </div>
        </div>
        </div>
      </motion.div>
     );
}

export default ProductTour;