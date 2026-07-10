"use client"

import { useEffect, useState } from "react";
import Sidebar from "./dashboard-sidebar";
import DashboardHeader from "./dashboard-header";
import { useUser } from "@/app/auth/api/profile";
import Cookies from "js-cookie";


export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading} = useUser()

  useEffect(()=>{
    Cookies.remove("2fa")
  },[])

  return (
    <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-40 bg-white h-screen w-72 border-r border-slate-300 flex-col transition-transform lg:flex ${
            open ? "flex translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
            <Sidebar setOpen={()=>setOpen((prev)=> !prev)} user={data} isLoading={isLoading}/>
        </aside>
        {open && (
        <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
        />
        )}
        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader setOpen={()=>setOpen((prev)=> !prev)} user={data} isLoading={isLoading}/>
            <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
    </div>
  );
}