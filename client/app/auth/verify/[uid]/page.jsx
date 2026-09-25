"use client"

import { useVerify } from "../../api/verify"
import { useParams } from "next/navigation"
import Logo from "@/app/libs/ui/logo"
import { CheckCircle, XCircle, Loader2, ArrowRight, Home } from "lucide-react";
import Link from "next/link"
import { FooterRights } from "@/app/libs/ui/landing/footer"
import { useEffect, useState } from "react"
import { bricolage, quicksand } from "@/app/libs/utils/font";


export default function VerifyAccount(){
    const { verifyAccount, isLoading } =  useVerify()
    const { uid: token } = useParams()
    const [status, setStatus] = useState(null)

    
    useEffect(()=>{
      async function verify() {
         const data =   await verifyAccount(token)
        setStatus(data)
      }
      verify()
    },[token])
    
    return (
         <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="navbar px-6 border border-slate-200">
                <Logo />
            </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="card border border-slate-300 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center py-12">
            
            {isLoading && (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-3">
                  <Loader2 className="w-9 h-9  animate-spin" />
                </div>
                <h1 className="text-[22px] font-bold font-display " style={bricolage.style}>
                  Verifying your account
                </h1>
                <p className="text-[13px] opacity-70 max-w-xs mx-auto" style={quicksand.style}>
                  Please wait while we confirm your email address and activate your account.
                </p>
              </>
            )}

            {status?.data?.status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold font-display" style={bricolage.style}>
                  Account verified
                </h1>
                <p className="text-[13px] opacity-70 max-w-xs mx-auto" style={quicksand.style}>
                  Your email has been confirmed and your VectorPay account is now active.
                </p>
                <div className="mt-3 flex flex-col gap-3 w-full">
                  <Link
                    href="/dashboard"
                    className="btn border-none outline-none flex items-center bg-[#03457C] rounded-full text-[13px]"
                    style={bricolage.style}
                  >
                    <h2>Go to dashboard</h2> <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="btn bg-[#E6F0FA] shadow-xs border-none flex items-center  text-black  rounded-full text-[13px]"
                    style={bricolage.style}
                  >
                    <h2 className="mt-1">Back to home</h2>
                    <Home className="w-4 h-4"/>
                  </Link>
                </div>
              </>
            )}

            {status?.status === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-3">
                  <XCircle className="w-8 h-8 text-error" />
                </div>
                <h1 className="text-2xl font-bold font-display" style={bricolage.style}>
                  Verification failed
                </h1>
                <p className="text-[13px] opacity-70 max-w-xs mx-auto" style={quicksand.style}>
        
                  We could not verify your account. The link may be expired or invalid.
                </p>
                <div className="mt-3 flex flex-col gap-1 w-full">
                  <Link
                    href="/auth/login"
                    className="btn bg-[#03457c] rounded-full outline-none border-none"
                    style={bricolage.style}
                  >
                   
                    <Home className="w-4 h-4"/>
                    <h2> Back to home</h2>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterRights />
    </div>
  );
}