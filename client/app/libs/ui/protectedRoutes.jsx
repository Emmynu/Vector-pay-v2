"use client";

import { useUser } from "@/app/auth/api/profile";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { bricolage, quicksand } from "../utils/font";

export default function ProtectedRoute({ role, children }) {
  const { data: user, isLoading, isError, refetch } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isError) {
      if (!user) {
        const redirectURL = pathname.includes("admin") ? "/admin/login" : "/auth/login";
        router.replace(redirectURL);
        return;
      }

      if (role && role !== user?.role) {
        const redirectURL = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";
        router.replace(redirectURL);
      }
    }
  }, [user, isLoading, isError, role, pathname, router]);


  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xs p-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-xs w-full text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="relative flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#03457C]"></span>
            {/* <div className="absolute w-3 h-3 bg-sky-400 rounded-full animate-ping opacity-75" /> */}
          </div>

          <div className="space-y-1">
            <h3 className="text-slate-900 font-bold text-base tracking-tight" style={bricolage.style}>
              Authenticating session
            </h3>
            <p className="text-xs text-slate-500 font-medium" style={quicksand.style}>
              Verifying access permissions...
            </p>
          </div>
        </div>
      </div>
    );
  }

 
  if (isError) {
    const loginPath = pathname.includes("admin") ? "/admin/login" : "/auth/login";

    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xs p-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-xl border border-rose-100 max-w-sm w-full text-center">
          
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-slate-900 font-bold text-base tracking-tight" style={bricolage.style}>
              Authentication Failed
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed" style={quicksand.style}>
              Unable to verify your session right now. Please try again or log in to continue.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full mt-2">
            <button
              onClick={() => refetch()}
              className="btn btn-outline border-slate-200 hover:border-slate-300 text-slate-700 btn-sm flex-1 font-medium rounded-xl text-xs gap-1.5 hover:bg-transparent hover:shadow-xs"
              style={bricolage.style}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>

            <button
              onClick={() => router.replace(loginPath)}
              className="btn bg-[#03457C] hover:bg-[#02335c] text-white btn-sm flex-1 font-medium rounded-xl text-xs border-none"
              style={bricolage.style}

            >
              Go to Login
            </button>
          </div>

        </div>
      </div>
    );
  }


  if (!user || (role && role !== user?.role)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xs p-4">
        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-xs w-full text-center">
          <span className="loading loading-dots loading-md text-[#03457C]"></span>
          <p className="text-[13px] text-[#03457C] font-medium skeleton skeleton-text" style={bricolage.style}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return children;
}