"use client"

import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "../../globals.css"
import { Key, RefreshCcw } from "lucide-react"
import { showToast } from "@/app/libs/toast/sonner";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "../api/reset-password";
import { Suspense } from "react";


function ResetPassword() {
    const params = useSearchParams()
    const token = params?.get("token")
    const { resetPassword, isLoading } = useResetPassword()

    function handlePasswordReset(e) {
        e.preventDefault()
        const {password, passwordConfirm} =  Object.fromEntries(new FormData(e.currentTarget))

        if (password === passwordConfirm) {
           const data = {
                token,
                password
           }

           resetPassword(data)
        }
        else{
            showToast({ type: "error", title: "Oops...something went wrong!", msg: "ERR_Validation_Error_422: Passwords do not match" })
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
                        <h2 className="font-semibold text-2xl">Password Recovery</h2>
                        <p className="text-sm font-thin">Enter your new password to proceed.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-12">
                       <form onSubmit={handlePasswordReset}  className="flex flex-col">
                        
                         <div className="mt-2.5">
                            <h2 className="font-thin mb-1 text-sm">New Password: </h2>
                            <label className="input validator bg-input w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                                >
                                <path
                                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                ></path>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                required
                                name="password"
                                placeholder="Password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                            />
                            </label>
                            <p className="validator-hint hidden mb-0.5">Must be more than 8 characters, including<br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter</p>
                        </div>


                         <div className="mt-2.5">
                            <h2 className="font-thin mb-1 text-sm">Confirm password: </h2>
                            <label className="input validator bg-input w-full">
                                <Key className="text-slate-600 w-4"/>
                                <input
                                    type="password"
                                    required
                                    name="passwordConfirm"
                                    placeholder="Confirm password"
                                    minLength="8"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                />
                            </label>
                            <p className="validator-hint hidden mb-0.5">Must be more than 8 characters, including<br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter</p>
                        </div>

                        
                    <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-base py-6 rounded-md my-2.5 w-full disabled:text-white disabled:bg-[#03457C]/60 ">
                            {isLoading ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Loading...</h2> : "Continue"}
                        </button>
                    </form>
                    </article>
    
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}




export default function ResetPasswordPage() {
   return <Suspense fallback={<h2>Loading...</h2>}>
        <ResetPassword />
    </Suspense>
} 