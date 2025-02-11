"use client"

import { auth } from "../../../firebase/firebase-client-config";
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { authSchema } from "../../../zod-schema";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import "../../styles/auth.css"
import AuthHeader from "./auth-header";
import AuthButton from "./button";
import { toast, Toaster } from "sonner";
import { useState } from "react";



export function LoginAuth() {
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        const data =  Object.fromEntries(new FormData(e.currentTarget))
        const newData = authSchema?.safeParse(data)
        setIsLoading(true)
        if (!newData?.error) {
            try {
                const { email, password } =  newData?.data
                const { user } = await signInWithEmailAndPassword(auth,email,password)
                const idToken =  await getIdToken(user)
                if (idToken) {
                    const authUser = await verifyToken(idToken, "")
                    if (!authUser?.error) {
                        window.location = "/"
                        toast.success("Sucessfully loggedIn!")
                    } else {
                        toast.error(authUser?.error)
                    }
                } else {
                    await removeUser(user?.uid)
                    toast.error("An error occured, Please try again!")
                }
            } catch (error) {
                    toast.error(error?.message);
                
            }
            
        } else {
            newData?.error?.errors.forEach(err=>{
                let formError = `${err?.path[0]}: ${err?.message} `
                toast.error(formError)
            })
        }
        setIsLoading(false)
    }

    return ( 
       <main>
            <section className="flex items-center flex-col">
                <AuthHeader />
                <Link className="auth-link" href={"/auth/register"}> Don't have an account &rarr;</Link>
            </section>
            <form onSubmit={handleSubmit} className="main-form">

                <section className="my-3">
                <label htmlFor="email">Email*</label>
                <input className="border border-black" type="email" name="email" id="email" />
                </section>

                <section className="my-3">
                <label htmlFor="password">Password*</label>
                <input className="border border-black" type="password" name="password" id="password" />
                </section>
                <Link href={"/auth/reset-password"} className="auth-link">Forgot Password?</Link>
                <AuthButton loading={isLoading}/>
                <Toaster position="bottom-right"  closeButton richColors visibleToasts={5}/>
            </form>
       </main>
    );
}

export default LoginAuth;