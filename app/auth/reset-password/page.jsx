"use client"

import { findUser, updateUser } from "../../../libs/actions/auth/auth";
import { authSchema } from "../../../zod-schema";
import { useState } from "react";


function ResetPassword() {
    const [user, setUser ] = useState(null)
    async function handleSubmit(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        try {
            const userExists = await findUser(data?.email)
            if(!userExists?.error){
                // update user
                setUser(userExists)
                const newData = authSchema.safeParse(data)
               if (!newData?.error) {
                    const { email, password } = newData?.data
                    await updateUser(userExists?.uid, password)
               } else {
                //return xod error
               }
            }
            else{
                console.log(userExists?.error);
                
            }
        } catch (error) {
            
        }
        
    }

    console.log(user);
    
    return ( 
        <form onSubmit={handleSubmit}>

            <section className="my-3">
            <label htmlFor="email">Email*</label>
            <input className="border border-black" type="email" name="email" id="email" />
            </section>

          { user && <section className="my-3">
            <label htmlFor="password">Password*</label>
            <input className="border border-black" type="password" name="password" id="password" />
            </section>}
            
            <button type="submit">Submit</button>
        
    </form>
    );
}

export default ResetPassword;