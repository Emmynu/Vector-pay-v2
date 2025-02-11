"use client"

import { auth, gitHubProvider } from "../../../firebase/firebase-client-config";
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import GithubImage from "../../images/github.png"
import { Toaster, toast } from "sonner";
import { useState } from "react";

function GitHubAuth() {
    const [isLoading, setIsLoading] = useState(false)
    async function gitHubAuth() {
        setIsLoading(true)
        try {
            const { user } = await signInWithPopup(auth, gitHubProvider)
            const idToken = await auth?.currentUser?.getIdToken()

            if (idToken) {
                const res =  await verifyToken(idToken, user?.displayName)
                !res?.error ? toast.success("Authentication sucessful!")
                : await removeUser(auth?.currentUser?.uid); toast.error(res?.error)
            } else {
                await removeUser(auth?.currentUser?.uid)
                toast.error("An error occured, Please try again!")
            }
      } catch (error) {
        toast.error(error?.message)
    }
    setIsLoading(false)

    }
    return ( 
         <>
         <button onClick={gitHubAuth} disabled={isLoading}>{isLoading ? <span className="loading loading-dots"></span> :<Image src={GithubImage} alt="google-image" width={30} height={30}/>}</button>
         <Toaster position="bottom-right"  closeButton richColors visibleToasts={5}/>
         </>
     );
}

export default GitHubAuth;