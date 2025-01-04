"use client"
import { auth, provider } from "../../../firebase/firebase-client-config"
import { removeUser, verifyToken } from "../../../libs/actions/auth/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function GoogleAuth() {

   async function signInWithGoogle() {
        try {
            const user =  await signInWithPopup(auth, provider)
            const credentials = await GoogleAuthProvider.credentialFromResult(user)
            const idToken =  await auth.currentUser?.getIdToken()
            
            
            if (idToken) {
               const isVerified =  await verifyToken(idToken) 
               !isVerified?.error ? console.log("sucess man!")
               : await  removeUser(user?.user?.uid)
            }
             else {
                  // idToken is not gotten
                  await removeUser(user?.user?.uid)
            }
        } catch (error) {
            console.log(error);

        }
   }
    return ( 
        <button onClick={signInWithGoogle}>Google</button>
     );
}//

export default GoogleAuth;
