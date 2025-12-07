"use client"
import { NAVBAR_HEIGHT } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../public/logo.svg'
import { Button } from './ui/button'
import { useAuthenticator } from '@aws-amplify/ui-react'

function Navbar() {

    const { user } = useAuthenticator((context) => [context.user])

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



                <p className='hidden lg:block'>Descubra seu apartamento perfeito para se hospedar com nossa procura avançada</p>


                <div className='flex gap-2'>
                    {user ? (
                        <>
                            <Link href={"/signin"}><Button variant='outline' className='hover:bg-white hover:text-black' size='sm'>Dashboard</Button></Link>
                            <Link href={"/signup"}><Button variant='outline' className='bg-red-400 hover:bg-red-500' size='sm'>Sair</Button></Link>



                        </>
                    ) : (
                        <>
                            <Link href={"/signin"}><Button variant='outline' className='hover:bg-white hover:text-black' size='sm'>Login</Button></Link>
                            <Link href={"/signup"}><Button variant='outline' className='bg-red-400 hover:bg-red-500' size='sm'>Cadastro</Button></Link>

                        </>
                    )}

                </div>
            </div>


        </div>
    )
}

export default Navbar