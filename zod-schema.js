import { z } from "zod"

export const emailSchema = z.object({
    email: z.string().email({message: "Invalid email address"}).trim(),
})

export const passwordSchema = z.object({
    password: z.string().regex(new RegExp(/^[0-9]{6,6}$/), { message: "Invalid Password" }).min(6,{message: "Password should atleast contain 6 characters"}).max(6, { message: "Password should not be more than 6 characters"}).trim(),
    
})

export const updatePasswordSchema = z.object({
    newPassword: z.string().regex(new RegExp(/^[0-9]{6,6}$/), { message: "Invalid Password" }).min(6,{message: "Password should atleast contain 6 characters"}).max(6, { message: "Password should not be more than 6 characters"}).trim(),
    confirmPassword: z.string().regex(new RegExp(/^[0-9]{6,6}$/), { message: "Invalid Password" }).min(6,{message: "Password should atleast contain 6 characters"}).max(6, { message: "Password should not be more than 6 characters"}).trim()
    
})


export const pinSchema = z.object({
    oldPin: z.string().regex(new RegExp(/^[0-9]{4,4}$/), { message: "Invalid Transaction Pin" }).min(4,{message: "Transaction Pin should atleast contain 4 numerical characters(numbers)"}).max(4, { message: "Transaction Pin should not be more than 4 numerical characters(numbers)"}).trim(),
    newPin: z.string().regex(new RegExp(/^[0-9]{4,4}$/), { message: "Invalid Transaction Pin" }).min(4,{message: "Transaction Pin should atleast contain 4 numerical characters(numbers)"}).max(4, { message: "Transaction Pin should not be more than 4 numerical characters(numbers)"}).trim(),
    confirmPin: z.string().regex(new RegExp(/^[0-9]{4,4}$/), { message: "Invalid Transaction Pin" }).min(4,{message: "Transaction Pin should atleast contain 4 numerical characters(numbers)"}).max(4, { message: "Transaction Pin should not be more than 4 numerical characters(numbers)"}).trim(),
    
})

export const nameSchema = z.object({
    firstName: z.string().regex(new RegExp(/^[a-zA-Z\s']{1,20}$/), { message: "Invalid Name"}).min(2, { message: "Name should contain atleast 2 characters"}).max(15, {message: "Name should not be more than 15 characters"}),
    lastName: z.string().regex(new RegExp(/^[a-zA-Z\s']{1,20}$/), { message: "Invalid Name"}).min(2, { message: "Name should contain atleast 2 characters"}).max(15, {message: "Name should not be more than 15 characters"})
})