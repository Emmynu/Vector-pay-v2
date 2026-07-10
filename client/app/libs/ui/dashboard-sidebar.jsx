"use client"
import Link from "next/link";
import Logo from "./logo";
import { X } from "lucide-react"
import { nav } from "../utils/data";
import { usePathname } from "next/navigation";


function Sidebar({ setOpen, user, isLoading }) {
    const pathname = usePathname()
   
    
    return ( 
         <>
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-300">
                <Logo />
            <button className="lg:hidden border-none outline-none btn shadow-none bg-[#03457c] text-white btn-sm btn-square" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
            </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
    
            {nav.map((item) => {
                const active =
                item.to === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                <Link
                    key={item.to}
                    href={item.to}
                    onClick={()=>setOpen(false)}
                    className={`flex items-center gap-3 text-black px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                        ? "bg-[#03457C] text-white"
                        : "hover:bg-[#03457C] hover:text-white transition-colors"
                    }`}
                >
                    <Icon className="w-4 h-4" />
                    {item.label}
                </Link>
                );
            })}
            </nav>
            {/* <div className=""> */}
            {isLoading ? 

            <div className="flex items-center gap-3 mt-auto p-4 border-t border-slate-300">
                <div className="skeleton bg-slate-300 w-9 h-9 rounded-full"></div>
                <div>
                    <div className="skeleton bg-slate-300 h-3 w-24 mb-1.5"></div>
                    <div className="skeleton bg-slate-300 h-3 w-20"></div>
                </div>
            </div>
            
            : 
            
            <div className="flex items-center gap-3 mt-auto p-4 border-t border-slate-300">
                <div className="w-9 h-9 rounded-full text-white bg-[#03457c] flex items-center justify-center font-bold text-sm">
                {`${user?.firstName.split(" ").map((s) => s[0]).join("").toUpperCase()} ${user?.lastName.split(" ").map((s) => s[0]).join("").toUpperCase()}`}
                </div>
                <div className="min-w-0  text-black">
                    <p className="text-sm font-semibold truncate">{
                  `${ user?.firstName.split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1))}
                    ${ user?.lastName.split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1))}
                  `}</p>
                    <p className="text-xs opacity-60 truncate">{user?.userName}</p>
                </div>
            </div>}
            {/* </div> */}
      </>
     );
}

export default Sidebar;