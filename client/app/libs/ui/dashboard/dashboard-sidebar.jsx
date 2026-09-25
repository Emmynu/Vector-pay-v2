"use client"
import Link from "next/link";
import Logo from "../logo";
import { X } from "lucide-react"
import { nav } from "../../utils/data";
import { usePathname } from "next/navigation";
import { bricolage, montserrat, quicksand } from "../../utils/font";


function Sidebar({ setOpen, user, isLoading, role, isAdmin }) {
    const pathname = usePathname()
 
    return ( 
         <>
            <div className="h-15 flex items-center justify-between px-5 border-b border-slate-200">
                <Logo />
            <button className="lg:hidden border-none outline-none btn shadow-none bg-[#03457c] text-white btn-sm btn-square" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
            </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

            {(
                nav[role]?.map(link=>{
                    const Icon = link?.icon;
                    const active = (!isAdmin && link?.to === "/dashboard") || (isAdmin && link?.to === "/admin/dashboard")
                    ? pathname === link.to
                    : Boolean(link.to && pathname.startsWith(link.to));
                                    
                
                    return (
                        <Link key={link?.to} 
                        href={link?.to}
                        onClick={()=>setOpen(false)}
                        className={`flex items-center gap-3 text-black px-3 py-2.5 rounded-lg text-xs font-medium transition-colors  ${
                        active
                            ? "bg-[#03457C] text-white"
                            : "hover:bg-[#03457C] hover:text-white transition-colors"}`}
                        style={montserrat.style}
                        >
                        <Icon className="w-4 h-4"/>
                        {link?.label}
                        </Link>
                    )
                })
            )}

            </nav>
            {isLoading ? 

            <div className="flex items-center gap-3 mt-auto p-4 border-t border-slate-300">
                <div className="skeleton bg-slate-300 w-9 h-9 rounded-full"></div>
                <div>
                    <div className="skeleton bg-slate-300 h-3 w-24 mb-1.5"></div>
                    <div className="skeleton bg-slate-300 h-3 w-20"></div>
                </div>
            </div>
            
            : 
            
            <div className="flex items-center gap-3 mt-auto p-4 border-t border-slate-200">
               {!user?.photoURL ? <div className="w-9 h-9 rounded-full text-white bg-[#03457c] flex items-center justify-center font-bold text-sm">
                    <span>{user?.firstName.split(" ").map((s) => s[0]).join("").toUpperCase()}</span>
                   <span>{user?.lastName.split(" ").map((s) => s[0]).join("").toUpperCase()}</span>
                </div>: <img src={user?.photoURL} alt={user?.firstName} className="w-9 h-9 rounded-full"/>}
                <div className="min-w-0  text-black" style={bricolage.style}>
                    <p className="text-[13px] font-semibold truncate capitalize">
                        {user?.firstName} {user?.lastName}
                  </p>
                    <p className="text-xs opacity-60 truncate -mt-0.5" style={quicksand.style}>{user?.userName}</p>
                </div>
            </div>}
         
      </>
     );
}



export default Sidebar;
