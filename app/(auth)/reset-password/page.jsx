"use client"
import "../../styles/auth.css"
import Image from "next/image";
import  credits from "../../images/credits.jpg"
import Logo from  "../../images/logo.png"
import Link from "next/link"
import { poppins, roboto } from "../register/page";
import { emailSchema } from "@/zod-schema";
import { toast, Toaster } from "sonner";
import { findUserInFirebase } from "@/app/actions/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase-client";
import { useRef, useState } from "react";

function ResetPassword() {
    const formRef = useRef()
    const [isLoading, setIsLoading] = useState(false)

   async function handleReset(e) {
        e.preventDefault()
        setIsLoading(true)
        const formData =  Object.fromEntries(new FormData(e.currentTarget))
       if (formData?.email) {
        const result = emailSchema.safeParse(formData)
        if (result?.success) {
            // find account and send  reset password link to mail
            const user = await findUserInFirebase(formData?.email)
            if (user?.error) {
                toast.error(user?.error)
            } else {
                await sendPasswordResetEmail(auth, formData?.email)
                toast.success("Password Reset Link sent to your mail!")
                formRef.current.reset()
            }
            
        } else {
            result.error?.errors?.map(error=>{
                toast.error(error?.message)
            })
        }
       } else {
        toast.error("Invalid Input")
       }
        setIsLoading(false)
    }
    return ( 
        <main className="auth-container">
         
            <section className="auth-form-container">
                <section className="auth-logo-container">
                        <Image src={Logo} width={40} height={40} alt="Logo"/>
                        <h2 className="font-sans font-bold">VectorPay</h2>
                </section>
                    <section className="form-container">
                        <article className="auth-label-container">
                            <h2 className={poppins.className}>Password Recovery</h2>
                            <p className={roboto.className}>Enter your email to recover your password.</p>
                        </article>
                    
                     <article  className="render-container">
                     <form  className="step-container" onSubmit={handleReset} ref={formRef}>
                            <h2 className={roboto.className}>Email Address: </h2>
                            <label className=" flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input type="email" placeholder="Email"  name="email"  />
                            </label>
                             <button type="submit" disabled={isLoading}> <span className={isLoading ? "loading loading-bars loading-sm mr-2": null}></span>{isLoading ? "": "Reset Password"}</button>
                        </form>
                     </article>
                    <article className="auth-footer-container"><h2 >Don't have an account yet? <Link href={"/register"}>Register</Link></h2></article>

                    </section>
           </section>
            
            <section className="auth-img-container">
                <Image src={credits}  alt="auth-image"/>
            </section>
           
            <Toaster richColors closeButton position="bottom-right"/>

        </main>
     );
}

export default ResetPassword;