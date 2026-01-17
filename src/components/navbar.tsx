"use client"
import { NAVBAR_HEIGHT } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../public/logo.svg'
import { Button } from './ui/button'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'aws-amplify/auth'
import { useGetAuthUserQuery } from '@/state/api'
import { Bell, MessageCircle, Plus, Search } from 'lucide-react'
import { DropdownMenu } from './ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

function Navbar() {
    const { data: authUser, isLoading: isAuthUserLoading } = useGetAuthUserQuery();
    const router = useRouter();
    const { user } = useAuthenticator((context) => [context.user])
    const path = usePathname();


    const isDashboard = path.includes("/managers") || path.includes("/tenants");

    const handleSignOut = async () => {
        await signOut();
        window.location.href = '/';
    }

    return (
        <div className={`fixed top-0 left-0 w-full shadow-xl z-50`}>

            <div className={`flex w-full text-white py-2 bg-slate-900 items-center justify-between h-full max-h-[${NAVBAR_HEIGHT}] px-4`}>
                <div className='flex items-center gap-2 '>
                    <Link className='' href='/' >
                        <div className='flex w-full items-center gap-6'>
                            <Image alt='logo' src={logo} width={20} height={20} />

                            <p className='text-white font-bold'>RENT <span className='text-red-300 font-medium'>| FULL</span></p>

                        </div>

                    </Link>
                </div>



                {!isDashboard && (
                    <p className='hidden lg:block'>Descubra seu apartamento perfeito para se hospedar com nossa procura avançada</p>
                )}

                {isDashboard && authUser && (
                    <Button
                        onClick={() => router.push(
                            authUser.userRole?.toLowerCase() === "manager" ? "/managers/newProperty" : "/search"
                        )}
                        variant={"outline"} className=' hover:bg-white hover:text-black'>
                        {authUser.userRole?.toLowerCase() === "manager"
                            ?
                            (
                                <>
                                    <Plus className='w-4 h-4' />
                                    <span className='hidden md:block ml-2'>Adicionar Propriedade</span>


                                </>
                            ) : (
                                <>

                                    <Search className='w-4 h-4' />
                                    <span className='hidden md:block ml-2'>Procurar Propriedade</span>
                                </>
                            )}
                    </Button>
                )}

                <div className='flex items-center gap-4'>
                    {authUser ? (
                        <>

                            <div className='relative hidden w-full md:block'>
                                <MessageCircle className='w-6 h-6 cursor-pointer hover:text-gray-300' />
                                <span className='absolute top-0 right-0 w-2 h-2 rounded-full bg-red-400' ></span>
                            </div>

                            <div className='hidden relative md:block'>
                                <Bell className='w-6 h-6 cursor-pointer hover:text-gray-300' />
                                <span className='absolute top-0 right-0 w-2 h-2 rounded-full bg-red-400' ></span>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger className=''>
                                    <Avatar >
                                        <AvatarImage src={authUser?.userInfo?.image || ""} alt="User Avatar" />
                                        <AvatarFallback>{authUser?.userRole[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    <span className='hidden md:block'>{authUser?.userInfo?.name ?? ""}</span>

                                </DropdownMenuTrigger>


                                <DropdownMenuContent className='bg-slate-100 gap-2 flex flex-col p-2 text-black  rounded '>

                                    <DropdownMenuItem className='cursor-pointer p-1 font-bold' onClick={() => router.push(
                                        authUser.userRole === "manager"
                                            ? "/managers/properties"
                                            : "/tanants/favorites",
                                        { scroll: false }
                                    )}>
                                        Dashboard
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className='cursor-pointer p-1 ' onClick={() => router.push(
                                        authUser.userRole === "manager"
                                            ? "/managers/settings"
                                            : "/tanants/settings",
                                        { scroll: false }
                                    )}>
                                        Configuraçoes
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className='cursor-pointer p-1' onClick={() => handleSignOut()}>
                                        Sair
                                    </DropdownMenuItem>


                                </DropdownMenuContent>


                            </DropdownMenu>

                        </>
                    ) :

                        <>
                            {isAuthUserLoading && user ? (
                                <span className='text-sm text-gray-200'>Carregando...</span>
                            ) : null}
                            <Link href={"/signin"}><Button variant='outline' className='hover:bg-white hover:text-black' size='sm'>Login</Button></Link>
                            <Link href={"/signup"}><Button variant='outline' className='bg-red-400 hover:bg-red-500' size='sm'>Cadastro</Button></Link>
                        </>


                    }

                </div>
            </div>


        </div>
    )
}

export default Navbar