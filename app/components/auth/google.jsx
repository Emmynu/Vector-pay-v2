"use client"
import { auth, provider } from "../../../firebase/firebase-client-config"
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "sonner";


function GoogleAuth() {
        const [isLoading, setIsLoading] = useState(false)
    
   async function signInWithGoogle() {
        setIsLoading(true)
        try {
            const user =  await signInWithPopup(auth, provider)
            const credentials = await GoogleAuthProvider.credentialFromResult(user)
            const idToken =  await auth.currentUser?.getIdToken()
            
            
            if (idToken) {
               const isVerified =  await verifyToken(idToken) 
               !isVerified?.error ? toast.success("Authentication sucessful!")
               : await  removeUser(user?.user?.uid); toast.error(isVerified?.error)
            }
             else {
                  // idToken is not gotten
                  await removeUser(user?.user?.uid)
                  toast.error("An error occured, Please try again!")
            }
        } catch (error) {
           toast.error(error?.message);

        }
        setIsLoading(false)
   }
    return ( 
        <>
       <button onClick={signInWithGoogle} disabled={isLoading}>{isLoading ? <span className="loading loading-dots"></span> :<Image src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj" alt="google-image" width={30} height={30}/>}</button>
        <Toaster position="bottom-right"  closeButton richColors visibleToasts={5}/>
        </>
     );
}//

export default GoogleAuth;
