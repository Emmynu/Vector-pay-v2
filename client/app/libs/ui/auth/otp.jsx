"use client"

import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "@/app/globals.css"
import { ArrowRight, RefreshCcw } from "lucide-react"
import { useVerifyOtp } from "@/app/auth/api/verify-otp";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import OtpInput  from "react-otp-input"
import { usePathname } from "next/navigation";

function OTPVerification() {
    const { verifyOtp, isLoading, resendOtp, isPending } = useVerifyOtp()
    const [code, setCode] = useState(undefined)
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const pathname = usePathname()
    const isAdmin = pathname.includes("/admin") 
    const path = isAdmin ? "/admin/dashboard": "/dashboard"
    
    

    useEffect(() => {
        let timer;

        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);

        } 
        else {
        setCanResend(true);
        }
        return () => clearInterval(timer);

  }, [resendTimer]);

    useEffect(()=>{
       const token = Cookies.get("2fa")

       if(!token){
            window.location = isAdmin ? "/admin/login" : "/auth/login"
       }
    }, [Cookies.get("2fa")])


    function handleOtpPaste(e) {
        const pastedOtpCode =  e.clipboardData.getData("text").trim().replace(/\D/g, '')
        setCode(pastedOtpCode)
        verifyOtp({code:pastedOtpCode, path})
    }

    async function handleOtpVerification(e) {
        e.preventDefault()
        
        verifyOtp({code, path })   
    }

    async function handleResend() {
        const response = await resendOtp()
        if(response?.status === 200){
            setResendTimer(30)
            setCanResend(false)
        }
    }

    return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center gap-12">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-3">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-4 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-xl" style={bricolage.style}>Verify your Identity</h2>
                        <p className={`text-[12px] opacity-90 tracking-wide`} style={quicksand.style}>Please enter the 6-digit verification code to your mail</p>
                    </article>
                   
                    <article className="mt-2.5  ">
                       <form onSubmit={handleOtpVerification}  className="flex flex-col items-center my-3" >
                            <OtpInput
                            value={code}
                            onChange={setCode}
                            numInputs={6}
                            onPaste={handleOtpPaste}
                            shouldAutoFocus
                            inputType="number"
                            containerStyle="flex items-center justify-center text-center gap-1 w-full"
                            renderSeparator={<span className=""></span>}
                            renderInput={(props) => (
                            <input
                                {...props}
                                style={{
                                ...bricolage.style,
                                width: "100%",
                                }}
                                className={`!w-10 !h-12 sm:!w-12 sm:!h-14 text-center text-xl sm:text-2xl font-bold rounded-xl outline-none transition-all shadow-xs text-slate-900 bg-transparent border border-black focus:border-[#03457C] focus:bg-white md:pl-2`}
                            />
                            )}
                            />
                            <button type="submit" disabled={isPending || isLoading}  className="btn outline-none border-none bg-[#03457C] text-sm py-6 rounded-full mt-3.5 w-full text-white disabled:bg-[#03457C]/60 " style={bricolage.style}>
                                {isLoading  ? <h2 className="flex items-center"><span  className="loading loading-xs loading-spinner mr-1"></span>Verifying...</h2> : <h2 className="flex items-center" >Verify Code <span> <ArrowRight className="w-5 mt-1 ml-0.5"/></span></h2> }
                            </button>

                        </form>
                        <div className="text-center px-8">
                            <p className="text-xs text-black leading-relaxed" style={quicksand.style}>
                                Didn't receive a code? Check your spam folder or{" "}
                                {canResend ? (
                                <button
                                    type="button"
                                    className="text-[#03457C] font-semibold hover:underline underline-offset-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                                    onClick={handleResend}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Resending...
                                    </>
                                    ) : (
                                    "Resend code"
                                    )}
                                </button>
                                ) : (
                                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                                    Resend in {resendTimer}s
                                </span>
                                )}
                            </p>
                        </div>

                    </article>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
     );
}

export default OTPVerification;