"use server"

import prisma from "../../../app/db";
import { cookies } from "next/headers";
import { adminAuth } from "../../../firebase/firebase-admin-config";


export const currentUser = async ()=>{
    const cookie =  await  cookies()
    const token  =  cookie.get("token")?.value
    const user = await adminAuth.verifyIdToken(token) // return the  user if its true
    return user
}

export async function saveTodo(todo) {
    const user = await currentUser()

    try {
        await prisma.todo.create({
            data: {
                title: todo,
                user: {
                    connect: {
                        uid: user?.uid
                    }
                }
            }
        })
    } catch (error) { 
        return {error: error?.message}
    }
}

export async function getTodos(){
    const user = await currentUser()
    try {
       const todos = await prisma.todo.findMany({
        where: {
            userId: user?.uid.toString(),
        },
        include: {
            user:true
        }
       })
        return todos
    } catch (error) {
        return { error: error?.message}
    }
}