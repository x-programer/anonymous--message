import {z} from 'zod';

export const messageSchema = z.object({
    content: z
        .string()
        .min(10 , "Content must be atleast 10 character")
        .max(300 , "Content must be no longer then 300 character")
})