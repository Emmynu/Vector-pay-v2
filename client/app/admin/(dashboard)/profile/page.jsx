"use client";

import { useState } from "react";
import { bricolage } from "@/app/libs/utils/font";
import ProfileHeaderCard from "@/app/libs/ui/admin/profile/profile-header";
import SecurityTabContent from "@/app/libs/ui/admin/profile/profile-security";
import ProfileTabContent from "@/app/libs/ui/admin/profile/profile-info";
import { useUser } from "@/app/auth/api/profile";

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data:adminData, isLoading, logout, isLogginOut } = useUser()

  return (
    <div className="max-w-auto space-y-3 pb-10">
  
      <ProfileHeaderCard adminData={adminData} isLoading={isLoading}/>

  
      <div className="space-y-3">
        
        <div role="tablist" className="tabs tabs-boxed flex w-full p-0.5 bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs">
            <button
                role="tab"
                style={bricolage.style}
                onClick={() => setActiveTab("profile")}
                className={`tab flex-1 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "profile" 
                    ? "tab-active bg-[#03457C] !text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
            >
                Personal Info
            </button>
            
            <button
                role="tab"
                style={bricolage.style}
                onClick={() => setActiveTab("security")}
                className={`tab flex-1 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "security" 
                    ? "tab-active bg-[#03457C] !text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
            >
                Security
            </button>
        </div>


        <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80  shadow-xs">
          {activeTab === "profile" ? (
            <ProfileTabContent adminData={adminData} isLoading={isLoading}/>
          ) : (
            <SecurityTabContent 
              isLogginOut={isLogginOut}
              onSignOut={()=>logout("/admin/login")} 
              adminData={adminData}
            />
          )}
        </div>
      </div>
    </div>
  );
}