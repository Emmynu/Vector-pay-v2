"use client"

import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "../../globals.css"
import { ArrowRight, RefreshCcw } from "lucide-react"
import { useVerifyOtp } from "../api/verify-otp";
import { useEffect } from "react";
import Cookies from "js-cookie";

function OTPVerification() {
 
    useEffect(()=>{
       const token = Cookies.get("2fa")

       if(!token){
            window.location = "/auth/login"
       }
    }, [Cookies.get("2fa")])


    const { verifyOtp, isLoading } = useVerifyOtp()

    async function handleOtpVerification(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))

        verifyOtp(data)
        
    }


    return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center gap-12">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-3">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-4 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-2xl">Verify your Identity</h2>
                        <p className="text-sm font-thin">Please enter the 6-digit verification code to your mail</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-12">
                       <form onSubmit={handleOtpVerification}  className="flex flex-col items-center my-3" >
                            <label className="otp otp-lg validator">
                                <span className="bg-white border px-4.5 border-slate-700"></span>
                                <span className="bg-white border px-4.5 border-slate-700"></span>
                                <span className="bg-white border px-4.5 border-slate-700"></span>
                                <span className="bg-white border px-4.5 border-slate-700"></span>
                                <span className="bg-white border px-4.5 border-slate-700"></span>
                                <span className="bg-white border px-4.5 border-slate-700"></span>
                                <input type="text" autoComplete="one-time-code" inputMode="numeric" maxLength="6" pattern="[0-9]{6}" required name="code" />
                            </label>
                            <button type="submit" disabled={isLoading}  className="btn outline-none border-none bg-[#03457C] text-base py-6 rounded-full mt-2.5 w-full text-white disabled:bg-[#03457C]/60 ">
                                {isLoading  ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Verifying...</h2> : <p className="flex items-center">Verify Code <span> <ArrowRight className="w-5 mt-1 ml-0.5"/></span></p> }
                            </button>

                        </form>
                         {/* <button type="submit"   className="btn outline-none border-none bg-[#03457C] text-base py-6 rounded-full mb-2.5 w-full text-white disabled:bg-[#03457C]/60 ">
                                {"" ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Verifying...</h2> : <p className="flex items-center">Resend Code <span> <ArrowRight className="w-5 mt-1 ml-0.5"/></span></p> }
                            </button> */}
                <p className="text-sm text-center">Didn't receive a code? Check your spam folder or click <button className="text-[#03457C] font-medium underline underline-offset-2 cursor-pointer italic">resend</button> </p>

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