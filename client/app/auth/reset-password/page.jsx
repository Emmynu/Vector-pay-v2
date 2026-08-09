"use client"

import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "../../globals.css"
import { Key, RefreshCcw } from "lucide-react"
import { showToast } from "@/app/libs/toast/sonner";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "../api/reset-password";
import { Suspense, useState } from "react";
import CustomPasswordInput from "@/app/libs/ui/customInput";


function ResetPassword() {
    const params = useSearchParams()
    const token = params?.get("token")
    const { resetPassword, isLoading } = useResetPassword()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    

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
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-0 ">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-1.5 lg:p-4 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-2xl">Password Recovery</h2>
                        <p className="text-[14px] " style={{fontWeight: 350}}>Enter your new password to proceed.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-8">
                       <form onSubmit={handlePasswordReset}  className="flex flex-col">
                        
                       <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} isLoading={isLoading}/>

                       <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} name={"passwordConfirm"} placeholder={"Confirm password"} isLoading={isLoading}/>

                        
                    <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-white py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60 ">
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