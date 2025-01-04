"use server"

import { adminAuth } from "../../../firebase/firebase-admin-config"
import { cookies } from "next/headers"

export async function verifyToken( token ) { 
   
   try {
    const isVerified = await adminAuth.verifyIdToken(token) // return the  user if its true
    // console.log(isVerified);
    
    
    if (isVerified) {
       //save token to cookies
      const cookie= await cookies()
      cookie.set("token", token,  {
         secure:process.env.NODE_ENV === "production",
         httpOnly: true,
         sameSite:true,
         path: "/",
         maxAge: 86400,
         
      })
  

      return isVerified
      
    } else {
      return {error: "An error occured"}
      
    }
   } catch (error) {
    return {error: error?.message}
   }
}


export async function removeUser(id){
  const user = await adminAuth.deleteUser(id)
  return user
}

export const findUser = async(email) => {
  try {
    const user = await adminAuth.getUserByEmail(email)

    if(user){
      const data = {
        uid:user?.uid,
        name:user?.displayName,
        email:user?.email,
        photoURL:user?.photoURL,
        phoneNumber:user?.phoneNumber,
        metadata:user?.metadata,
        emailVerified: user?.emailVerified
      }
      return data
    }else{
      return { error: "No user found"}
    }
  } catch (error) {
    return { error:error?.message}
    
  }
  
}


export const updateUser = async(uid, newPassword) =>{
  const cookie = await cookies()
  try {
    const user = await adminAuth.updateUser(uid,{
      password: newPassword
    })
    cookie.delete("token")
    return user
    
  } catch (error) {
    return { error:error?.message}
    
  }
}
