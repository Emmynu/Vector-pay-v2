"use client"

import { findUser, updateUser } from "../../../libs/actions/auth/auth";
import { authSchema } from "../../../zod-schema";
import { useState } from "react";
import AuthHeader from "../../components/auth/auth-header";
import Link from "next/link";
import AuthButton from "../../components/auth/button";
import { toast, Toaster } from "sonner";


function ResetPassword() {
    const [user, setUser ] = useState(null)
    
    async function handleSubmit(e) {

        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        try {
            const userExists = await findUser(data?.email)
            if(!userExists?.error){
                // update user
                setUser(userExists)
                const newData = authSchema.safeParse(data)
               if (!newData?.error) {
                    const { email, password } = newData?.data
                    const user = await updateUser(userExists?.uid, password)
                    !user.error ?  
                        // toast.success("Update Sucessful!")
                        window.location = "/auth/login" 
                        : 
                        toast.error(user?.error)
               } else {
                    newData?.error?.errors.forEach(err=>{
                        let formError = `${err?.path[0]}: ${err?.message} `
                        toast.error(formError)
                    })
                }
            }
            else{
               toast.error(userExists?.error);  
            }
        } catch (error) {
            toast.success("Update Sucessful!")
            window.location = "/auth/login"
        }
        
    }
    
    return ( 
    <main className="main-form-container">
        <header className="flex items-center flex-col">
            <AuthHeader />
          <Link className="auth-link" href={"/auth/login"}>Remember password &rarr;</Link>
        </header>
        <form onSubmit={handleSubmit} className="main-form">
            <section className="my-3">
            <label htmlFor="email">Email*</label>
            <input className="border border-black" type="email" name="email" id="email" />
            </section>

            { user && <section className="my-3">
            <label htmlFor="password">Password*</label>
            <input className="border border-black" type="password" name="password" id="password" />
            </section>}

            <AuthButton />
        </form>
        <Toaster position="bottom-right"  closeButton richColors visibleToasts={5} />
    </main>
    );
}

export default ResetPassword;