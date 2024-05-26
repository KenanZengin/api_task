import * as z from "zod"


export const LoginSchema = z.object({
    username: z.string().trim().nonempty({
        message: "Zorunlu alan"
    }),
    password: z.string().trim().nonempty({
        message: "Zorunlu alan"
    }).min(3,{
        message: "Şifre en az 3 karakterden oluşmalıdır"
    })
})