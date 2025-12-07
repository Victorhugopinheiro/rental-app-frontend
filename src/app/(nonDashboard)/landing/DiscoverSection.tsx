"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import img1 from '../../../../public/landing-icon-calendar.png'

function DiscoverSection() {

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.8, staggerChildren: 0.2 }
        },

    }


    const ItemVariantes = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, },
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className='py-24 px-6 sm:px-8 lg:px-16 w-full'
        >

            <div className='w-full flex mx-auto flex-col  items-center 
            md:max-w-2xl  lg:max-w-6xl'>


                <h1 className='text-2xl font-bold mb-4'>Descubra</h1>

                <p className='text-xl font-medium'>Alugue sua propriedade dos sonhos</p>

                <p className='my-4 '>Procurar o imóvel dos seus sonhos para alugar nunca foi tão fácil. Com nosso recurso
                    de pesquisa amigável, você pode encontrar rapidamente a casa
                    perfeita que atende a todas as suas necessidades
                    . Comece sua busca hoje e descubra o imóvel dos seus sonhos para alugar!</p>



                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12'>
                    {[

                        {
                            imageSrc: '/landing-icon-wand.png',
                            title: 'Alugue o imóvel dos seus sonhos ',
                            description: 'Navegue por uma vasta seleção de propriedades para alugar, desde apartamentos modernos até casas aconchegantes, todas adaptadas às suas preferências.',
                        },
                        {
                            imageSrc: '/landing-icon-calendar.png',
                            title: 'Reserve com facilidade',
                            description: 'Desfrute de um processo de reserva simples e seguro, garantindo que você possa garantir sua nova casa com confiança e tranquilidade.',
                        },
                        {
                            imageSrc: '/landing-icon-heart.png',
                            title: 'Aproveite Seu Novo Lar',
                            description: 'Mude-se para o seu novo imóvel alugado e comece a desfrutar da casa dos seus sonhos.',
                        }

                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            variants={ItemVariantes}

                        >

                            <Discovercomponent {...item} />
                        </motion.div>
                    ))

                    }
                </div>
            </div>





        </motion.div>
    )
}


const Discovercomponent = ({
    imageSrc,
    title,
    description,


}: {

    imageSrc: string,
    title: string,
    description: string,

}) => (

    <div className='text-center w-full px-6 py-2  shadow-lg shadow-slate-400 
    h-100 flex flex-col justify-center items-center'>
        <div className='mb-2 rounded-full bg-black flex justify-center items-center  p-4' >
            <Image className='' alt={title} src={imageSrc}
                width={20} height={30} />
        </div>
        <h2 className='font-semibold text-center text-xl mb-2 '>{title}</h2>
        <p className='text-sm mb-4'>{description}</p>

    </div>

)

export default DiscoverSection