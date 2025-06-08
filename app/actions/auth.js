"use server"

import { adminAuth } from "../../firebase/firebase-admin"
import { cookies } from "next/headers"
import prisma from "../db"
import speakeasy from "speakeasy"
import QRcode from "qrcode"
import { randomBytes } from "crypto"


export async function verifyToken(token, firstName, lastName) {
    try {
        const user = await adminAuth.verifyIdToken(token)
        if (user?.uid) {
            await saveCookie("user", token)
           
            const res =  await findUser(user?.uid)
            if (res?.uid) {
                await saveCookie("totp", res?.totpCode)
                await saveCookie("qrcode", res?.totpQrCode)
            } else {
                const secret = await generateSecretKey()
                const  data =  {
                    firstName,
                    lastName,
                    email: user?.email,
                    verified: user?.email_verified,
                    uid: user?.uid,
                    totpCode: secret?.base32,
                    totpQrCode: secret?.otpauth_url
               } 
               await saveUserToDB(data)
            }
         return user
        } else {
         return { error: "Unauthorized - Authentication failed"}
        }
    } catch (error) {
        console.log(error);
        return { error: error?.message}
    }
}


async function saveCookie(name, value) {
    const cookie =  await cookies()
     //save token to cookies
     cookie.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ,
     
        sameSite: true,
        path: "/"
    })
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
                verified: user?.verified,
                totpCode: user?.totpCode,
                totpQrCode: user?.totpQrCode,
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export async function findUser(userId) {
    try {
       const user =  await prisma.user.findUnique({
            where: {
                uid: userId
            }
        })

        return user
    } catch (error) {
        console.log(error?.message);  
    }
}

export async function findUserInFirebase(email) {
    try {
        const user = await adminAuth.getUserByEmail(email)
        if (user?.uid) {
            return {
                uid:user?.uid,
            }
        } else {
            return null
        }
    } catch (error) {
        return { error: error?.message}
    }

}

export async function generateSecretKey() {
    const secret =  speakeasy.generateSecret({ length: 20})
   return secret  
}

export async function generateQrCode() {
    const cookie =  await cookies()
    const qrcode = await QRcode.toDataURL(cookie.get("qrcode")?.value)
    return {
        code: cookie.get("totp")?.value, 
        qrcode}
}


export async function verifyCode(code) {
    const cookie =  await cookies()
    const res =   speakeasy.totp.verify({
        secret:cookie.get("totp")?.value,
        encoding: "base32",
        token: code
    })
    return res
}


export async function generateChallenge() {
    const cookie = await cookies()
    const user = await adminAuth.verifyIdToken(cookie.get("user")?.value)
    const challenge =  randomBytes(32).toString("base64")

    return { challenge, user }
}