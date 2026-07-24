import Logo from "./logo";
import { cols } from "../utils/data";

export default function Footer() {
 

    return(
        <footer className="bg-blue-50 ">  
            <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-5 gap-10">
            <div className="md:col-span-1">
            <Logo />
            <p className="ml-10 text-sm text-slate-500">Your Financial Future!.</p>
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
            <div className="border-t border-blue-100 font-bold text-sm text-slate-600 ">
                <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-between gap-3 ">
                    <span>© 2026 VectorPay, Inc. All rights reserved.</span>
                    <span>VectorPay is a financial technology company, not a bank.</span>
                </div>
            </div>
    </footer>
    )
}


export function FooterRights() {
    return(
           <div className="border-t border-slate-300 border-border font-bold text-sm  p-7">
               <div className="text-center text-xs opacity-70">
                    <span>© 2026 VectorPay, Inc. All rights reserved.</span>
                </div>
            </div>
    )
}