"use client"

import Logo from "../logo";
import Image from "next/image";
import image from "../../images/credits.jpg"
import "@/app/globals.css"
import { showToast } from "@/app/libs/toast/sonner";
import { useSearchParams, usePathname } from "next/navigation";
import { useResetPassword } from "@/app/auth/api/reset-password";
import { Suspense, useState } from "react";
import CustomPasswordInput from "./customInput";
import { bricolage, quicksand } from "../../utils/font";


function ResetPassword() {
    const params = useSearchParams()
    const token = params?.get("token")
    const { resetPassword, isLoading } = useResetPassword()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const pathname = usePathname()
    const isAdmin = pathname.includes("admin")
    

    function handlePasswordReset(e) {
        e.preventDefault()
        const {password, passwordConfirm} =  Object.fromEntries(new FormData(e.currentTarget))

        if (password === passwordConfirm) {
            
           const data = {
                token,
                password,
                role: isAdmin ? "admin" : "user"
           }

           resetPassword(data)
        }
        else{
            showToast({ type: "error", title: "Validation Error!", msg: "ERR_Validation_Error_422: Passwords do not match" })
        }
        
    }


   return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-0 ">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-1.5 lg:p-4 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-xl" style={bricolage.style}>Password Recovery</h2>
                        <p className={`text-[12.5px] opacity-90 tracking-wide`} style={quicksand.style}>Enter your new password to proceed.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-8">
                       <form onSubmit={handlePasswordReset}  className="flex flex-col">
                        
                       <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} isLoading={isLoading}/>

                       <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} name={"passwordConfirm"} placeholder={"Confirm password"} isLoading={isLoading}/>

                        
                    <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-white py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60 " style={bricolage.style}>
                            {isLoading ? <h2 className="flex items-center"><span className="loading loading-xs loading-spinner mr-1"></span>Loading...</h2> : "Continue"}
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