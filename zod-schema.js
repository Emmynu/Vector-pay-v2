import { z } from "zod"

export const authSchema = z.object({
    email: z.string().email({message: "Invalid email address"}).trim(),
    password: z.string().regex(new RegExp(/^[0-9]{6,6}$/), { message: "Invalid Password" }).min(6,{message: "Password should atleast contain 6 characters"}).max(6, { message: "Password should not be more than 6 characters"}).trim()
})
