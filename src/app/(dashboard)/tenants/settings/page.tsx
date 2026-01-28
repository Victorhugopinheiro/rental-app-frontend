"use client"

import React, { useEffect } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { Settings } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { formSchema, FormValues } from '../../_components/managersComponents.tsx/formManager'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useManagerForm } from '../../_components/managersComponents.tsx/formManager'
import { useGetAuthUserQuery } from '@/state/api'

function ManagerSettings() {


    const { data: authUser } = useGetAuthUserQuery()

    const form = useManagerForm()

    useEffect(() => {

        if (authUser) {
            form.reset({
                username: authUser.userInfo.name || "",
                phone: authUser.userInfo.phoneNumber || "",
                email: authUser.userInfo.email || "",
            })
        }

    }, [authUser])





    const onSubmit = (data: FormValues) => {
        console.log(data)
        alert("Formulário enviado com sucesso!")
    }

    return (
        <div className={`w-full min-h-[calc(100svh-50px)]  flex justify-center items-center`}>

            <Card className="w-5/6 h-5/6 md:w-4/6 md:h-3/6 max-w-[800px] max-h-[800px">
                <CardHeader  >
                    <CardTitle className='flex items-center gap-2 font-bold text-xl'>
                        <span>Configurações</span>
                        <span><Settings size={16} /></span>

                    </CardTitle>
                    <CardDescription>Gerencie suas informaçoes de Usuário aqui.</CardDescription>
                </CardHeader>

                <CardContent className='flex flex-col gap-4 mt-4'>


                    <Form {...form}>
                        <form

                            onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField

                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite seu nome" {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@exemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="(00) 00000-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className='bg-black text-white hover:bg-black cursor-pointer' type="submit">Concluir</Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>


        </div>
    )
}

export default ManagerSettings