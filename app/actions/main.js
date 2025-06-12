"use server"

import { adminAuth } from "../../firebase/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUser } from "./auth";
import prisma from "../db";

export default async function logOut(){
    const cookie = await cookies()
    cookie.delete("user")
    cookie.delete("totp")
    cookie.delete("qrcode")
    redirect("/login")
}

export async function updateBalance(amount) {
    const cookie = await cookies()
    const user =  await adminAuth.verifyIdToken(cookie.get("user")?.value)

    if (user) {
        const currentUser = await findUser(user?.uid)
        if (currentUser) {
            // update the balance
            await prisma.user.update({
                where: {
                    uid: currentUser?.uid
                },
                data: {
                    balance: amount
                }
            })
        }else{
            return { error: "Sorry, An error occured."}
        }
    }else{
        return { error: "Sorry, An error occured."}
    }
    
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