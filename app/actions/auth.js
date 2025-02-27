"use server"

import { adminAuth } from "@/firebase/firebase-admin"
import { cookies } from "next/headers"
import prisma from "../db"

export async function verifyToken(token, firstName, lastName) {
    const cookie =  await cookies()
    try {
        const user = await adminAuth.verifyIdToken(token)
        if (user?.uid) {
            //save token to cookies
            cookie.set("user", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ,
                maxAge: 600, // 10mins
                sameSite: true,
                path: "/"
            })
           
           const  data =  {
                firstName,
                lastName,
                email: user?.email,
                verified: user?.email_verified,
                uid: user?.uid
           } 
           await saveUserToDB(data)
         return user
        } else {
         return { error: "Unauthorized - Authentication failed"}
        }
    } catch (error) {
        console.log(error);
        return { error: error?.message}
    }
}


export async function saveUserToDB(user) {
    try {
        await prisma.user.create({
            data: {
                uid: user?.uid,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                avatarUrl: "",
                verified: user?.verified
            }
        })
    } catch (error) {
        console.log(error);
        
    }
}