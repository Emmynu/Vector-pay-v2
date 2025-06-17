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



//increment
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

//decrement
export async function updateBalanceDecrement(uid, amount) {
    try {
        const balance = await prisma.user.update({
            where: {
                uid: uid
            },
            data: { 
                balance: {
                    decrement: amount
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

export async function saveTransaction(uid, amount, type, status, reference, recipientId, recipientName, recipientAccountNumber) {
    try {
        const transactions = await prisma.transactions.create({
            data: {
                userId: uid,
                amount,
                type,
                status,
                reference,
                recipientId,
                recipientName,
                recipientAccountNumber
            }
        })
        return transactions
    } catch (error) {
        console.log(error);
        
        return { error: "Sorry, An error occured."}
        
    }
}

export async function getTransactions(uid) {
    try {
        const transactions = await prisma.transactions.findMany({
           where: {
            OR: [
                { userId: uid },
                { recipientId: uid }
            ]
           },
           orderBy: {
            createdAt: "desc"
           },
           take: 4
        })
        return transactions
    } catch (error) {
        console.log(error);
        
        return { error:  "Sorry, Could not fetch transaction history."}
       
    }
}

export async function saveBeneficiary(uid, beneficiaryId, beneficiaryName, beneficiaryAccountNumber) {
    try {
        const beneficiaries = await prisma.beneficiaries.create({
            data: {
                userId:uid,
                beneficiaryId,
                beneficiaryName,
                beneficiaryAccountNumber
            }
        })
        return beneficiaries
    } catch (error) {
        return { error: "Sorry, Could not fetch beneficiaries"}
    }
}

export async function getBeneficiary(uid, take) {
    try {
        const beneficiaries = await prisma.beneficiaries.findMany({
            where: {
                userId:uid,
            },
            orderBy: {
                createdAt: "desc"
            },
            take,
        })
        return beneficiaries
    } catch (error) {
        return { error: "Sorry, Could not fetch beneficiaries"}
    }
}


export async function removeBeneficiary(beneficiaryAccountNumber) {
    try {
        const beneficiary = await prisma.beneficiaries.delete({
            where: {
                beneficiaryAccountNumber,
            }
        })
        console.log(beneficiary);
        return beneficiary
    } catch (error) {
        return { error: "Sorry, Could not remove beneficiary"}
    }
}