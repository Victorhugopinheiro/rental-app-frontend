"use client"

import React from 'react'
import logo from '../../../../public/landing-splash.jpg'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


function HeroSection() {
  return (
    <div className='relative h-screen min-h-screen  overflow-hidden '>


      <Image alt='background-image' className=' object-cover object-center' src={logo} />



      <div className='absolute inset-0 bg-black opacity-60 ' />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-4'

      >

        <div className='w-full max-w-4xl flex flex-col gap-2 mx-auto md:gap-4'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>Encontre o apartamento perfeito para sua estadia</h1>
          <p className='text-lg md:text-xl mb-8'>Explore nossa plataforma para descobrir apartamentos que atendem às suas necessidades e preferências.</p>
        </div>


        <div className='flex justify-center '>
          <Input type='text' placeholder='Buscar apartamentos por localização, preço...'
            className='w-full max-w-lg rounded-none rounded-l-xl h-12 border-none  bg-white text-black placeholder-gray-500' />
          <Button className='bg-red-500 hover:bg-red-600 text-white  rounded-none rounded-r-xl h-12'>Buscar</Button>
        </div>

      </motion.div>





    </div>
  )
}

export default HeroSection