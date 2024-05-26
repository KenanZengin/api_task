import * as z from "zod"
import { LoginSchema } from "../schema"
import { LoginReturnType } from "../types";



export async function login(values: z.infer<typeof LoginSchema> ): Promise<LoginReturnType>{
    
   const validateFields = LoginSchema.safeParse(values);

   if(!validateFields.success){
    return { message: "Geçersiz giriş bilgisi", messageType: "error"}
   }

   const { username, password } = validateFields.data;
    
   if(username === "Postter1" && password === "KLM1234567"){
    return{ message: "Giriş başarılı, ana sayfaya yönlendiriliyorsunuz", messageType: "success" }
   }
   
   return { message: "Kullanıcı adı veya şifreniz hatalı", messageType: "error"}

}