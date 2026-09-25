"use client"

import Link from "next/link";
import Logo from "../logo";
import Image from "next/image";
import image from "../../images/credits.jpg"
import "../../../globals.css"
import { useLogin } from "@/app/auth/api/login";
import CustomPasswordInput from "./customInput";
import { useState } from "react";
import { usePathname } from "next/navigation"
import { bricolage, quicksand } from "../../utils/font";





function Login() {
   const { login, isLoading } = useLogin()
   const [isPasswordVisible, setIsPasswordVisible] = useState(false)
   const pathname = usePathname()

   const isAdmin = pathname.includes("/admin")

    async function handleLogin(e) {
        e.preventDefault()

        
        const { email, password } =  Object.fromEntries(new FormData(e.currentTarget))

        const data = {
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role: isAdmin ? "admin": "user"
        }

        login(data)
    }

   return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center gap-0">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-0 md:mx-3">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-1.5 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-xl" style={bricolage.style}>Account Login</h2>
                        <p className="text-[12.5px] opacity-90 tracking-wide" style={quicksand.style}>Welcome back! Enter your login details.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-8">
                       <form action=""  className="flex flex-col" onSubmit={handleLogin}>
                        <div className="mt-2.5 ">
                            <h2 className="text-[12px]  mb-1 " style={quicksand.style}>Email Address: </h2>
                            <label className="input focus:bg-[#03457c] validator bg-input  w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input type="email" disabled={isLoading} placeholder="mail@site.com" required name="email" className="text-[13px]" style={quicksand.style}/>
                            </label>
                            <div className="validator-hint text-xs hidden mb-0.5" style={quicksand.style}>Enter valid email address</div>
                        </div>

                        <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} isLoading={isLoading} />

                        <Link href={isAdmin ? "/admin/forgot-password" : "/auth/forgot-password"} className="text-right hover:underline underline-offset-2 mt-1.5 italic text-[#03457c] font-semibold  text-[12px]" style={quicksand.style}><i>Forgot Password?</i></Link>

                    <button type="submit" disabled={isLoading} className={`btn outline-none border-none bg-[#03457C] text-[12.5px] py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60`} style={bricolage.style}>
                        {isLoading ? <h2 className="flex items-center" ><span className="loading loading-xs loading-spinner mr-1"></span>Loading...</h2> : "Continue"}
                    </button>

                    </form>
                    </article>
                <h2 className="text-center font-semibold text-[13px]" style={quicksand.style}>Don't have an account yet? <Link href={isAdmin ? "/admin/register" : "/auth/register"} className="italic text-[#03457C] underline-offset-2 underline"><b>Register</b></Link></h2>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}

export default Login;