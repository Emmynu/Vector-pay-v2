"use client"

import { auth } from "../../../firebase/firebase-client-config";
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { authSchema } from "../../../zod-schema";
import { createUserWithEmailAndPassword, getIdToken, sendEmailVerification, updateProfile } from "firebase/auth";
import { Toaster } from "sonner";



function CredentialsAuth() {

    async function handleSubmit(e) {
        e.preventDefault()
        const data  = Object.fromEntries(new FormData(e.currentTarget))
        const newData = authSchema.safeParse(data)
        if(newData?.success){
          try {
            const { user } = await createUserWithEmailAndPassword(auth,newData?.data?.email, newData?.data?.password)    
            const updateName = await updateProfile(user,{ displayName: newData?.data?.name })
            const token = await getIdToken(user)
            if (token) {
                const authUser =   await verifyToken(token)
                authUser ? await sendEmailVerification(user)
                 : await removeUser(user?.uid)
               
            } else {
                // idToken is not gotten
                await removeUser(user?.uid)
            }
          } catch (error) {
            console.log(error);
            
            // await removeUser(user)
          }
            
        }
        else{
            newData?.error?.errors?.forEach(error=>{
                let formError = `${error?.path[0]}: ${error?.message}} `
                console.log(`zod: ${formError}`);   
        });
    }
    // data = {}
}


    return ( 
    <form onSubmit={handleSubmit}>
        
       <section className="my-3">
        <label htmlFor="name">Username*</label>
        <input className="border border-black" type="text" name="name" id="name" />
       </section>
       
       <section className="my-3">
        <label htmlFor="email">Email*</label>
        <input className="border border-black" type="email" name="email" id="email" />
       </section>

       <section className="my-3">
        <label htmlFor="password">Password*</label>
        <input className="border border-black" type="password" name="password" id="password" />
       </section>
       <button type="submit">Submit</button>
       <Toaster position="bottom-right" expand richColors/>
    </form>);
}

export default CredentialsAuth;

