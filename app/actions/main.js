"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logOut(){
    const cookie = await cookies()
    cookie.delete("user")
    cookie.delete("totp")
    cookie.delete("qrcode")
    redirect("/login")
}