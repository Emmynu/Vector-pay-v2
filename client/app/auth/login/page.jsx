"use client"

import Link from "next/link";
import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "../../globals.css"
import { useLogin } from "../api/login";
import { RefreshCcw } from "lucide-react"
import CustomPasswordInput from "@/app/libs/ui/customInput";
import { useState } from "react";





function Login() {
   const { login, isLoading } = useLogin()
   const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()

        const { email, password } =  Object.fromEntries(new FormData(e.currentTarget))

        const data = {
            email: email.trim().toLowerCase(),
            password: password.trim()
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
                        <h2 className="font-semibold text-2xl">Account Login</h2>
                        <p className="text-[14px] " style={{fontWeight: 350}}>Welcome back! Enter your login details.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-8">
                       <form action=""  className="flex flex-col" onSubmit={handleLogin}>
                        <div className="mt-2.5 ">
                            <h2 className="text-[12px] tracking-wide mb-1 text-sm">Email Address: </h2>
                            <label className="input validator bg-input  w-full">
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
                                <input type="email" disabled={isLoading} placeholder="mail@site.com" required name="email" />
                            </label>
                            <div className="validator-hint hidden mb-0.5">Enter valid email address</div>
                        </div>

                        <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} isLoading={isLoading}/>

                        <Link href={"/auth/forgot-password"} className="text-right hover:underline mt-1.5 italic text-[#03457c] font-medium  text-sm">Forgot Password?</Link>

                    <button type="submit" disabled={isLoading} className={`btn outline-none border-none bg-[#03457C] text-base py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60`}>
                        {isLoading ? <h2 className="flex items-center"><span className="loading loading-xs loading-spinner mr-1"></span>Loading...</h2> : "Continue"}
                    </button>

                    </form>
                    </article>
                <h2 className="text-center font-medium mt-0.5">Don't have an account yet? <Link href={"/auth/register"} className="italic text-[#03457C] underline-offset-2 underline">Register</Link></h2>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}

export default Login;