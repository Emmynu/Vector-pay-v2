"use client"

import { auth } from "../../../firebase/firebase-client-config";
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { authSchema } from "../../../zod-schema";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export function LoginAuth() {


    async function handleSubmit(e) {
        e.preventDefault()
        const data =  Object.fromEntries(new FormData(e.currentTarget))
        const newData = authSchema?.safeParse(data)
        if (!newData?.error) {
            try {
                const { email, password } =  newData?.data
                const { user } = await signInWithEmailAndPassword(auth,email,password)
                const idToken =  await getIdToken(user)
                if (idToken) {
                    const authUser = await verifyToken(idToken)
                    
                } else {
                    await removeUser(user?.uid)
                }
            } catch (error) {
                console.log(error);
                
            }
            
        } else {
            
        }
        
    }

    return ( 
        <form onSubmit={handleSubmit}>

            <section className="my-3">
            <label htmlFor="email">Email*</label>
            <input className="border border-black" type="email" name="email" id="email" />
            </section>

            <section className="my-3">
            <label htmlFor="password">Password*</label>
            <input className="border border-black" type="password" name="password" id="password" />
            </section>
            <h6><Link href={"/auth/reset-password"}>Forgot Password?</Link></h6>
            <button type="submit">Submit</button>
         
        </form>
    );
}

export default LoginAuth;