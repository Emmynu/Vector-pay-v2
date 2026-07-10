import {Menu, Bell } from "lucide-react";
import {  nav } from "../utils/data";
import { usePathname } from "next/navigation";
import { bricolage } from "../utils/font";


function DashboardHeader({ setOpen, user, isLoading }) {
    const pathname = usePathname()
    const activeLink =  nav.find(link=>link.to === pathname)

    return ( 
         <header className="h-16 sticky top-0 z-20 backdrop-blur-xl border-b border-slate-300 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden btn bg-[#03457c] border-none outline-none btn-sm btn-square" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className={`text-lg lg:text-xl  font-display font-bold  ${bricolage.className}`}>{activeLink ? activeLink.label: "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-black">
              <Bell className="w-4 h-4" />
            </button>
            {isLoading ? 
                <div className="skeleton bg-slate-300 h-4 w-12"></div>
              :
             <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {`Tier ${user?.tier || "1"}`}
            </span>}
          </div>
        </header>
     );
}

export default DashboardHeader;