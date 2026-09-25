"use client"

import Link from "next/link";
import Logo from "../logo";
import Image from "next/image";
import image from "../../images/credits.jpg"
import "@/app/globals.css"
import { useForgotPassword } from "@/app/auth/api/forgot-password";
import { usePathname } from "next/navigation";
import { bricolage, quicksand } from "../../utils/font";
import { Mail } from "lucide-react";


function ForgotPassword() {
    const { forgotPassword, isLoading } = useForgotPassword()
    const pathname = usePathname()
    const isAdmin =   pathname.includes("admin")

    async function handleForgotPassword(e){
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        
       forgotPassword({
        ...data,
        role: isAdmin ? "admin" : "user"
       })
        
    }


   return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center ">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-0 lg:mx-3">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-1.5 lg:p-4 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-[21px]" style={bricolage.style}>Password Recovery</h2>
                        <p className={`text-[12.5px] opacity-90 tracking-wide`} style={quicksand.style}>Enter your email to recover your password.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-8">
                       <form action=""  className="flex flex-col" onSubmit={handleForgotPassword}>
                        <div className="mt-2.5 ">
                            <h2 className="text-[12px] tracking-wide mb-1" style={quicksand.style}>Email Address: </h2>
                            <label className="input validator bg-input  w-full">
                               <Mail className="w-3.5 h-3.5 text-gray-600"/>
                                <input type="email" disabled={isLoading} placeholder="mail@site.com" required name="email" />
                            </label>
                            <div className="validator-hint hidden mb-0.5 text-xs" style={quicksand.style}>Enter valid email address</div>
                        </div>

                        <Link href={isAdmin ? "/admin/login" : "/auth/login"} className="text-right hover:underline underline-offset-2 mt-1.5 italic text-[#03457c] font-semibold text-xs" style={quicksand.style}><i>Remember Password?</i></Link>

                        <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-[#fff] py-6 rounded-md my-2.5 w-full disabled:text-white disabled:bg-[#03457C]/60 text-[13px]" style={bricolage.style}>
                            {isLoading ? <h2 className="flex items-center"><span className="loading loading-xs loading-spinner mr-1"></span>Loading...</h2> : "Continue"}
                        </button>
                    </form>
                    </article>
                <h2 className="text-center font-semibold text-[13px]" style={quicksand.style}>Don't have an account yet? <Link href={isAdmin ? "/admin/register" : "/auth/register"} className="italic text-[#03457C] underline-offset-2 underline">Register</Link></h2>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}

export default ForgotPassword;