import { AlertColor } from "@mui/material";

export interface PostType{
    userId:number,
    id:number,
    title:string,
    body:string
}

export interface PostDetailType{
    postId:number,
    id:number,
    name:string,
    email:string,
    body:string
}

export interface LoginReturnType{
    message: string,
    messageType: AlertColor | undefined
}

export interface UpdateMode{
    update: boolean,
    updateId: string
}