"use client";

import { useEffect, useState } from "react";
import Sidebar from "./dashboard-sidebar";
import DashboardHeader from "./dashboard-header";
import { useUser } from "@/app/auth/api/profile";
import Cookies from "js-cookie";
import KYCModal from "../profile/kyc-modal";
import TransactionPinModal from "./pin-setup-modal";
import PinSetupBanner from "./pin-setup-banner";
import { usePathname } from "next/navigation";
import EditProfileModal from "../profile/profile-edit";

export default function DashboardLayout({ isAdmin, children }) {
  const [open, setOpen] = useState(false);
  const { data:user, isLoading } = useUser();
  const pathname = usePathname()

  const role = user ? user?.role : (isAdmin ? "admin" : "user")

  useEffect(() => {
    Cookies.remove("2fa");
  }, []);


  const paths = ["/transfer", "/withdraw","/profile"]
  const hasPin = Boolean(user?.transactionPin);
  const showBanner =  (role ==="user" && paths.some(path=>pathname.includes(path)) && !hasPin &&  !isLoading)

  const props = {
      setOpen: () => setOpen((prev) => !prev),
      user,
      isLoading,
      role,
      isAdmin
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
     
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 bg-white h-screen w-80 lg:w-68 border-r border-slate-200 flex-col transition-transform duration-300 ease-in-out lg:flex ${
          open ? "translate-x-0 flex" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
        {...props}
        />
      </aside>

      
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

  
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <DashboardHeader
          {...props}
        />

        <main className={`flex-1  bg-[#E6F0FA]/20 space-y-4 ${showBanner ? "px-4 pt-3": "p-4 sm:p-6 lg:p-8"}`}>
          { showBanner && <PinSetupBanner />}

          <div className={`w-full`}>{children}</div>
        </main>
      </div>

      
      <KYCModal id="my-modal-3" />
      <TransactionPinModal id="my_modal_1" hasPin={hasPin} />
      <EditProfileModal id="my-modal-2" user={user}/>
      
    </div>
  );
}