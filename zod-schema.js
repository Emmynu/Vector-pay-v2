import { z } from "zod";

export const authSchema = z.object({
    name: z.string().regex(new RegExp(/^[a-zA-Z0-9]*$/), { message: "Must contain only alphanumerical characters"}).min(4,{ message: "Must be 4 or more characters long" }).max(20,{ message: "Must not be greater than 20"}).trim().optional(),
    email: z.string().email({message:"Invalid email address"}).trim(),
    password:z.string().min(6,{ message: "Must be 6 or more characters long" }).max(10,{ message: "Must not be greater than 20"}).trim().
    refine((value)=>/[a-z]/.test(value) ,{message: "Must contain at least one lowercase letter"})
    .refine((value)=>/[A-Z]/.test(value) ,{message: "Must contain at least one uppercase letter"})
    .refine((value)=>/[0-9]/.test(value) ,{message: "Must contain at least one numerical character"})
    .refine((value)=> /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(value) ,{message: "Must contain at least one special character"})
    
})
