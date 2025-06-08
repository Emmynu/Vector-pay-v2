"use client"

import Image from "next/image";
import Logo from "../../images/logo.png"
import "../../styles/auth.css"
import { Poppins, Roboto } from "next/font/google";
import credits from "../../images/credits.jpg"
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import eye from "../../images/eye.png"
import invisble from "../../images/invisible.png"
import { emailSchema, passwordSchema } from "../../../zod-schema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase-client";
import { verifyToken } from "../../actions/auth";



const poppins = Poppins({
    subsets: ["latin"],
    weight: "800"
})

const roboto = Roboto({
    subsets: ["latin"],
    weight: "300"
})





 function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setisLoading] = useState(false)
   


   async function handleLogin(e) {
      setisLoading(true)
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.currentTarget))
        const result = emailSchema.safeParse(formData)// email

        if (!result?.success ) {
            result.error.errors.map(error=>{
                toast.error(error?.message)
            })
        } else {
            const res = passwordSchema.safeParse(formData)// password
            if (!res?.success) {
                res.error.errors.map(error=>{
                    toast.error(error?.message)
                })
            } else {
               try {
                    // logic for the login
                    const { user } = await signInWithEmailAndPassword(auth, formData?.email, formData.password)
                    const token = await user.getIdToken()
                    const result =  await verifyToken(token)
    
                    if (result?.error) {
                        toast.error(result?.error)
                    } else { 
                        toast.success("Authentication successful")
                        setTimeout(() => {
                            window.location = "/totp"   
                        }, 1000);
                    }
               } catch (error) {
                toast.error(error?.message)
               }
            }
        }
        setisLoading(false)
    }


   



    return ( 
        <main className="auth-container">
        {/* logo section */}
       <section className="auth-form-container">
        <section className="auth-logo-container">
                <Image src={Logo} width={40} height={40} alt="Logo"/>
                <h2 className="font-sans font-bold">VectorPay</h2>
            </section>
            <section className="form-container">
            <article className="auth-label-container">
                    <h2 className={poppins.className}>Account Login</h2>
                    <p className={roboto.className}>Welcome back! Enter your login details.</p>
                </article>
               
                <article className="render-container">
                    <form onSubmit={handleLogin}> 
                        <div className="step-container">
                            <h2 className={roboto.className} >Email Address: </h2>
                            <label className=" flex items-center gap-2 -mt-1">
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
                    
                        </div>

                        <div className="step-container mt-4">         
                            <h2>Password: </h2>
                            <label className=" flex items-center gap-2 -mt-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                                </svg>
                                <input type={!showPassword ? "password": "text"} className="grow" placeholder="Password" name="password"/>
                                <Image src={!showPassword ? eye : invisble} alt="eye" className="w-4 cursor-pointer" onClick={()=>setShowPassword(!showPassword)}/>
                            </label>
                            <h3 className="text-right mt-3 -mb-2 font-medium text-[14px] text-main hover:underline"><Link href={"reset-password"}>Forgot Password?</Link></h3>
                            <button disabled={isLoading}><span className={isLoading ? "loading loading-bars loading-sm mr-2" : ""}></span>{isLoading ? "" : "Login to account"}</button>

            
                        </div>
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

export default Login;