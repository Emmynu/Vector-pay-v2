import { Menu, LogOut, UserCircle2, User2, RotateCcw } from "lucide-react";
import {  nav } from "../utils/data";
import { usePathname } from "next/navigation";
import { bricolage, quicksand } from "../utils/font";
import { useUser } from "@/app/auth/api/profile";
import Link from "next/link";
import { useForgotPassword } from "@/app/auth/api/forgot-password";


function DashboardHeader({ setOpen, user, isLoading }) {
    const pathname = usePathname()
    const activeLink =  nav.find(link=>link.to === pathname)
    const  { logout, isLogginOut } = useUser()
    const { forgotPassword, isLoading:isResetting } = useForgotPassword()

    function handleResetPassword(){
      const data = {
        email: user?.email
      }

      forgotPassword(data)
  }

    return ( 
         <header className="h-15 sticky top-0 z-20 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden btn bg-[#03457c] border-none outline-none btn-sm btn-square" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5 text-white" />
            </button>
            <h1 className={`text-lg lg:text-xl  font-display font-bold  ${bricolage.className}`}>{activeLink ? activeLink.label: "Dashboard"}</h1>
          </div>


          <div className="flex items-center gap-0">

            <section className="menu menu-horizontal px-0 ">
              <li className="dropdown dropdown-center ">
                <details>
                  <summary tabIndex={0} role="button" className="mt-1 cursor-pointer focus:bg-transparent">
                    <UserCircle2 className="w-4.5 h-4.5"/>
                  </summary>
                
                <ul tabIndex="-1" className="dropdown-content border border-slate-200 bg-white rounded-box z-1 w-52 p-2 shadow-sm ">

                  <li className="focus:bg-transparent "><Link href={"/dashboard/profile"} className="flex items-center gap-1 hover:opacity:80 focus:bg-transparent  mt-1"><User2 className="w-3.5 h-3.5"/> <h2 className={`${quicksand.className} tracking-wide font-medium text-xs md:text-[13px]`}>Profile</h2></Link></li>

                  <li className="focus:bg-transparent ">
                   <button  onClick={handleResetPassword} className={`${quicksand.className} tracking-wide font-medium text-xs md:text-[13px] focus:bg-transparent hover:opacity-80 disabled:opacity-80 my-1`} disabled={isResetting || isLogginOut}>
                      {isResetting ? (
                        <div className="flex items-center">
                          <span className="loading loading-spinner loading-xs mr-1"></span>
                          <h2>Sending...</h2>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                         <RotateCcw className="w-3.5 h-3.5"/> <h2 className={`${quicksand.className} tracking-wide font-medium text-xs md:text-[13px]`} onClick={handleResetPassword}>Change Password</h2>
                        </div>
                      )}
                  </button>
                  </li>

                  <div className="divider bg-slate-300 h-[1px] my-2"></div>

                  <li className="focus:bg-transparent">
                    <button  onClick={logout} className={`${quicksand.className} tracking-wide font-medium text-xs md:text-[13px] hover:opacity-80 disabled:opacity-80 focus:bg-transparent`} disabled={isLogginOut || isResetting}>
                      {isLogginOut ? (
                        <div className="flex items-center">
                          <span className="loading loading-spinner loading-xs mr-1"></span>
                          <h2>Signing out</h2>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <LogOut className="w-3.5 h-3.5"/> <h2 className={``}>Sign out</h2>
                        </div>
                      )}
                  </button>
                  </li>

                </ul>
              </details></li>
            </section>

            {isLoading ? 
                <div className="skeleton bg-slate-300 h-4 w-12"></div>
              :
             <span className="inline-flex items-center px-2.5 py-1 mt-1 rounded-full bg-[#E6F0FA] text-[#4A90E2] text-xs font-semibold" style={quicksand.style}>
              {`Tier ${user?.tier || "1"}`}
            </span>
            }
          
          </div>
        </header>
     );
}

export default DashboardHeader;