"use client"

import { useGetAuthUserQuery } from "@/state/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { email, z } from "zod"

export const formSchema = z.object({
    username: z.string().min(2, {
        message: "Usuário deve ter no mínimo 2 caracteres.",
    }),
    phone: z.string().min(10, {
        message: "Número de telefone inválido.",
    }),
    email: z.email({
        message: "Endereço de email inválido.",
    }),
})

export function useManagerForm() {

    const { data: authUser } = useGetAuthUserQuery()
    console.log("authUser in useManagerForm:", authUser)

    const name = authUser?.userInfo.name as string
    const email = authUser?.userInfo.email as string

    return (
        useForm<FormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                username: name || "",
                phone: authUser?.userInfo.phoneNumber|| "",
                email: email || "",
            },
        })
    )


    
}





export type FormValues = z.infer<typeof formSchema>



