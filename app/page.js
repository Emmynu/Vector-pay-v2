"use client"
import Link from "next/link"
import { useState } from "react";
import { generateChallenge } from "./actions/auth";

export default function Home() {
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)

 
  
  async function biometricRegistration() {
    if (isBiometricsEnabled) {
      // register the user  biometrics
     const result =  await generateChallenge()
     if (result?.challenge) {
      const res = await navigator.credentials.create({
        publicKey:{
          challenge: Uint8Array.from(atob(result?.challenge), c=>c.charCodeAt(0)),
          rp:{
            name: "Vector Pay",
            id: window.location.hostname,
          },
          user: {
            id: Uint8Array.from(atob(result?.user?.uid), c=>c.charAt(0)),
            name: result?.user?.email,
            displayName: result?.user?.uid
          },
          pubKeyCredParams: [{type: "public-key", alg: -7}]
        }
      }) 
      console.log(res);
       alert(res)
     } else {
      
     }
     
    } else {
      
    }
  }

  biometricRegistration()

  
  return (
    <>
     <h1> Vector Pay</h1><br />
     <Link href="/register">Create an account</Link>
     <br />
     <br />
     <label>
      <span>Enable Biometrics</span>
      <input type="checkbox"  className="toggle border-slate-600 bg-white checked:bg-blue-400 checked:text-blue-600 checked:border-blue-400 " checked={isBiometricsEnabled} onChange={(e)=>setIsBiometricsEnabled(e.target.checked)} />
     </label>
    </>
  );
}
