"use client"

import { auth, gitHubProvider } from "../../../firebase/firebase-client-config";
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { signInWithPopup } from "firebase/auth";


function GitHubAuth() {

    async function gitHubAuth() {
        try {
            await signInWithPopup(auth, gitHubProvider)
            const idToken = await auth?.currentUser?.getIdToken()

            if (idToken) {
                const res =  await verifyToken(idToken)
                !res?.error ? console.log("sucess")
                : await removeUser(auth?.currentUser?.uid)
            } else {
                await removeUser(auth?.currentUser?.uid)
            }
      } catch (error) {
              console.log(error);
                
    }
        
    }
    return ( 
         <button onClick={gitHubAuth}>GitHub</button>
     );
}

export default GitHubAuth;