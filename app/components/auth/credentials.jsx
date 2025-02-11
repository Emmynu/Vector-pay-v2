"use client"

import { auth } from "../../../firebase/firebase-client-config";
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { authSchema } from "../../../zod-schema";
import { createUserWithEmailAndPassword, getIdToken, sendEmailVerification, updateProfile } from "firebase/auth";
import { toast, Toaster } from "sonner";
import "../../styles/auth.css"
import AuthHeader from "../../components/auth/auth-header"
import AuthButton from "../../components/auth/button"
import Link from "next/link";
import { useState } from "react";


function CredentialsAuth() {
   const [status, setStatus] = useState(null)
   const [isLoading, setIsLoading] = useState(false)
  

  async function handleSubmit(e) {
          e.preventDefault()
          const data  = Object.fromEntries(new FormData(e.currentTarget))
          const newData = authSchema.safeParse(data)
          setIsLoading(true)
          if(newData?.success){
            try {
          
              const { user } = await createUserWithEmailAndPassword(auth,newData?.data?.email, newData?.data?.password)    
              const updateName = await updateProfile(user,{ displayName: newData?.data?.name })
              const token = await getIdToken(user)
              if (token) {
                  const authUser =   await verifyToken(token, data?.name)
                  if (!authUser?.error ) {
                    await sendEmailVerification(user);
                    setStatus("We sent a verfication link to your email!")
                    toast.success("Sucessfully created an account!")
                  } else {
                    await removeUser(user?.uid); 
                    toast.error(authUser?.error)
                  } 
                
              } else {
                  // idToken is not gotten
                  await removeUser(user?.uid)
                  toast.error("An error occured, Please try again!")
              }
            } catch (error) {
             toast.error(error?.message)
            }
              
          }
          else{ 
              newData?.error?.errors?.forEach(error=>{
                  let formError = `${error?.path[0]}: ${error?.message} `
                toast.error(formError)
          });
      }
      setIsLoading(false)
  }


  
    return ( 
      <main>
        <section className="flex items-center flex-col">
          <AuthHeader />
          <Link className="auth-link" href={"/auth/login"}>Already have an account &rarr;</Link>
        </section>
        <form onSubmit={handleSubmit} className="main-form">
          
          <section className="my-3">
            <label htmlFor="name">Username*</label>
            <input className="border border-black" type="text" name="name" id="name" placeholder="John Doe"/>
          </section>
          
          <section className="my-3">
            <label htmlFor="email">Email*</label>
            <input className="border border-black" type="email" name="email" id="email" placeholder="example@gmail.com"/>
          </section>
  
          <section className="my-3">
            <label htmlFor="password">Password*</label>
            <input className="border border-black" type="password" name="password" id="password" placeholder="*******"/>
          </section>

          {status && <h2 className="status">{status}</h2>}

          <AuthButton loading={isLoading}/>
          <Toaster position="bottom-right"  closeButton richColors visibleToasts={5}/>
        </form>
      </main>    
  );
}

export default CredentialsAuth;

