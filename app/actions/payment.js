"use server"

import prisma from "../db";
import { findUser } from "./auth";

export async function deposit(uid, amount) {
    try {
        const user = await findUser(uid)

        if (!user?.error) {
            await updateBalance(uid, amount)
        } else {
            return {error: "could not find user"}
        }
    } catch (error) {
       return {error: error?.message}
        
    }
}

export async function updateBalance(uid, amount) {
    try {
        const balance = await prisma.user.update({
            where: {
                uid: uid
            },
            data: { 
                balance: {
                    increment: amount
                }
            }
        })    
        return balance
    } catch (error) {
        return {error: error?.message}

    }
}

export async function getBalance(uid) {
   try {
        const currentBalance = await prisma.user.findUnique({
            where: {
                uid:uid
            },
            select:{
                balance: true
            }
        })
    
        
        return currentBalance
   } catch (error) {
        return { error: "Could not fetch balance, Please try again."}
   }
}

export async function saveTransaction(uid, amount, type) {
    try {
        const transactions = await prisma.transactions.create({
            data: {
                userId: uid,
                amount,
                type,
            }
        })
        return transactions
    } catch (error) {
        return { error: "Sorry, Could not fetch transaction history."}
        
    }
}

export async function getTransactions(uid) {
    try {
        const transactions = await prisma.transactions.findMany({
           where: {
            userId: uid
           },
           orderBy: {
            createdAt: "desc"
           },
           take: 3
        })
        return transactions
    } catch (error) {
        return { error:  "Sorry, Could not fetch transaction history."}
       
    }
}