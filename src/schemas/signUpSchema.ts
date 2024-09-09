import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2 , "Username must be at least 2 character")
    .max(20 , "Can't have more then 20 character")
    .regex( /^[a-zA_Z0-9_]+$/ , "Username must not contain any special character");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6 , {message: "Password must be atleast 6 character"}) 
})

