"use server"

// import { adminAuth } from "../../firebase/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { findUser } from "./auth";
import prisma from "../db";


export default async function logOut(){
    const cookie = await cookies()
    cookie.delete("user")
    cookie.delete("totp")
    cookie.delete("qrcode")
    redirect("/login")
}

export async function updateTransactionPin(uid, pin) {
    try {
        await prisma.user.update({
            where: {
                uid,
            },
            data: {
                transactionPin: pin
            }
        })
    } catch (error) {
        return {error: error?.message}
    }
}

 export async function generateAccountNumber() {
    let accountNumber =  ""
    for (let i = 0; i < 10; i++) {
        accountNumber += Math.floor(Math.random()* 10)
    }
    return accountNumber
}


export async function handleAccountNumber(formData) {
    const { accountNumber } = Object.fromEntries(formData) 

    //  find the user by accountNumber 
    try {
        const user = await prisma.user.findUnique({
            where: {
                accountNumber
            } 
        })        
        return user
    } catch (error) {
        return { error: "User not Found"}
    }
    
}