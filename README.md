# Vector Pay - Version 2
###  Todos
##### Biometrics
##### Theme Change
##### Protected Routes

import { NextResponse } from "next/server"
import { adminAuth } from "./firebase/firebase-admin";
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const token =  req?.cookies?.get("user")?.value
    const publicRoutes = ['/login', '/register', '/reset-password', '/totp']
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log(pathname);
    

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }
    
   
    if (token) {
        try {
            // verify token 
            const isTokenVerified = await adminAuth.verifyIdToken(token)
            if (isTokenVerified) {
                    return NextResponse.next()   
            } else {
                const loginUrl = new URL('/login', req.url);
                return NextResponse.redirect(loginUrl);
            }
        } catch (error) {
            
        }
         
    }
    

    return NextResponse.next()
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
}

BIOMETRICS CODE

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
      
     } else {
      
     }
     
    } else {
      
    }
  }

  biometricRegistration()

  
  return (
    <section data-theme="luxury">
     <h1> Vector Pay</h1><br />
     <Link href="/register">Create an account</Link>
     <br />
     <br />
     <label>
      <span>Enable Biometrics</span>
      <input type="checkbox"  className="toggle border-slate-600 bg-white checked:bg-blue-400 checked:text-blue-600 checked:border-blue-400 " checked={isBiometricsEnabled} onChange={(e)=>setIsBiometricsEnabled(e.target.checked)} />
     </label>
    </ section>
  );
}

