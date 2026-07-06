"use client"

import { useQuery } from "@tanstack/react-query"
import { useVerify } from "../../api/verify"
import { useParams } from "next/navigation"
import Logo from "@/app/libs/ui/logo"
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from "lucide-react";
import Link from "next/link"
import { FooterRights } from "@/app/libs/ui/footer"


export default function VerifyAccount(){
    const { verifyAccount } =  useVerify()
    const { uid: token } = useParams()

    const { data, isLoading } =  useQuery({
        queryKey: ["verify user's account"],
        queryFn: async () => {
          return await verifyAccount(token)   
        },
        retry: 1
    })

    
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
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                  <Loader2 className="w-7 h-7  animate-spin" />
                </div>
                <h1 className="text-2xl font-bold font-display tracking-tight">
                  Verifying your account
                </h1>
                <p className="text-sm opacity-70 mt-2 max-w-xs mx-auto">
                  Please wait while we confirm your email address and activate your account.
                </p>
              </>
            )}

            {data?.data?.status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold font-display tracking-tight">
                  Account verified
                </h1>
                <p className="text-sm opacity-70 mt-2 max-w-xs mx-auto">
                  Your email has been confirmed and your VectorPay account is now active.
                </p>
                <div className="mt-6 flex flex-col gap-3 w-full">
                  <Link
                    href="/app"
                    className="btn border-none outline-none bg-[#03457C] rounded-full"
                  >
                    Go to dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/"
                    className="btn btn-ghost hover:text-white text-black btn-sm"
                  >
                    Back to home
                  </Link>
                </div>
              </>
            )}

            {data?.status === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
                  <XCircle className="w-8 h-8 text-error" />
                </div>
                <h1 className="text-2xl font-bold font-display tracking-tight">
                  Verification failed
                </h1>
                <p className="text-sm opacity-70 mt-2 max-w-xs mx-auto">
        
                  We could not verify your account. The link may be expired or invalid.
                </p>
                <div className="mt-6 flex flex-col gap-3 w-full">
                  <Link
                    href="/"
                    className="btn bg-[#03457c] rounded-full outline-none border-none"
                  >
                    Back to home
                    <ArrowRight />
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