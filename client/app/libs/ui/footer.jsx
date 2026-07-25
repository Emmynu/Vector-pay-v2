import Logo from "./logo";
import { cols } from "../utils/data";
import { montserrat } from "../utils/font";

export default function Footer() {
 

    return(
        <footer className="bg-blue-50 ">  
            <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-5 gap-10">
            <div className="md:col-span-1">
            <Logo />
            {/* <p className="mt-4 text-xs text-slate-600">VectorPay is a financial technology company, not a bank.</p> */}
            </div>
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-10">
            </div>
            {cols.map((c) => (
            <div key={c.title}>
                <h4 className="font-display font-semibold text-sm mb-4">{c.title}</h4>
                <ul className="space-y-2.5">
                {c.links.map((l) => (
                    <li key={l}><a href="#" className="text-xs text-slate-600 hover:text-black transition-colors">{l}</a></li>
                ))}
                </ul>
            </div> 
            ))}
            </div>
            <div className="border-t border-blue-100 text-xs text-[#1F2024] ">
                <div className={`mx-auto max-w-7xl px-6 py-7 flex flex-col md:flex-row justify-between gap-4 ${montserrat.className}`}>
                    <span>© 2026 VectorPay, Inc. All rights reserved.</span>
                    <span>VectorPay is a financial technology company, not a bank.</span>
                </div>
            </div>
    </footer>
    )
}


export function FooterRights() {
    return(
           <div className="border-t border-slate-300 border-border  text-sm  p-7">
               <div className="text-center text-xs opacity-70">
                    <span>© 2026 VectorPay, Inc. All rights reserved.</span>
                </div>
            </div>
    )
}