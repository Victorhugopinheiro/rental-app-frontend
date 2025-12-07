'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

function CallingForAction() {
    return (
        <div className='relative py-24  '>


            <Image className=' object-center object-cover'
                fill
                src={'/landing-call-to-action.jpg'} alt='Background image' />

            <div className='absolute inset-0 bg-black opacity-60 ' />


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='relative  flex flex-col justify-between items-center text-center gap-6 px-4'
            >

                <div>
                    <h2 className='text-3xl md:text-4xl font-semibold text-center text-white px-6 sm:px-8 lg:px-16'>
                        Encontre seu apartamento dos sonhos!
                    </h2>
                </div>

                <p className='text-white'>Descubra diversos apartamento em seu local desejado</p>

                <div>
                    <button onClick={() => window.scrollTo({top:0, behavior:"smooth"})} className='bg-white px-6 py-2 rounded hover:bg-slate-300'>Buscar</button>

                    <Link href='/register' className='ml-4 text-white  inline-block bg-red-400 hover:bg-red-500
                     px-6 py-2 rounded ' scroll={false}>
                        Cadastre-se
                    </Link>
                </div>

            </motion.div>

        </div>
    )
}

export default CallingForAction