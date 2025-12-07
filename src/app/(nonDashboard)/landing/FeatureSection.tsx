"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

function FeatureSection() {

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

                <motion.h2
                    variants={ItemVariantes}
                    className='text-3xl font-semibold text-center mb-2'>
                    Encontre rapidamente a sua casa desejada usando nossa procura efetiva
                </motion.h2>

                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12'>
                    {[0, 1, 2].map((index) => (
                        <motion.div

                            variants={ItemVariantes}
                            key={index}
                        >
                            <ComponentsSearch
                                imageSrc={`/landing-search${3 - index}.png`}
                                description={
                                    [
                                        'Descubra as melhores opções de aluguel com avaliações e classificações de usuários.',
                                        'Tenha acesso a avaliações e notas de usuários para entender melhor as opções de aluguel.',
                                        'Encontre listagens de aluguel confiáveis e verificadas para garantir uma experiência sem complicações.'
                                    ][index]
                                }
                                title={
                                    [
                                        'Listagens Confiáveis e Verificadas',
                                        'Navegue por Listagens de Aluguel com Facilidade',
                                        'Simplifique Sua Busca por Aluguel com Recursos Avançados'
                                    ][index]
                                }

                                linkText={
                                    [
                                        'Explorar',
                                        'Buscar',
                                        'Descobrir'
                                    ][index]
                                }
                                linkHref='/a'

                            />
                        </motion.div>
                    ))}
                </div>
            </div>





        </motion.div>
    )
}


const ComponentsSearch = ({
    imageSrc,
    title,
    description,
    linkText,
    linkHref

}: {

    imageSrc: string,
    title: string,
    description: string,
    linkText: string,
    linkHref: string
}) => (

    <div className='text-center'>
        <div className='mb-2 rounded-lg flex justify-center items-center h-48 p-4' >
            <Image className='w-full h-full object-contain' alt={title} src={imageSrc} width={400} height={300} />
        </div>
        <h2 className='font-semibold text-center text-xl mb-2 '>{title}</h2>
        <p className='text-sm mb-4'>{description}</p>
        <Link href={linkHref} className='border border-gray-200 bg-white px-2 py-2 '>{linkText}</Link>
    </div>

)

export default FeatureSection