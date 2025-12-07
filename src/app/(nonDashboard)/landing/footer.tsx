

import Link from 'next/link'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFacebook, faTwitter, faInstagram, faYoutube, faLinkedinIn
} from '@fortawesome/free-brands-svg-icons'

function Footer() {
    return (
        <footer className='h-[300px] py-20 w-full flex justify-center items-center flex-col gap-10 bg-gray-100 px-4'>

            <div className='flex gap-6  max-w-6xl w-full flex-col justify-between md:flex-row items-center'>

                <h1 className='text-2xl font-bold mb-4 md:mb-0'>RentalApp</h1>

                <ul className='flex flex-col md:flex-row gap-4 text-center '>
                    <li className='hover:underline cursor-pointer'>Sobre Nós</li>
                    <li className='hover:underline cursor-pointer'>Contato</li>
                    <li className='hover:underline cursor-pointer'>Política de Privacidade</li>
                    <li className='hover:underline cursor-pointer'>Termos de Serviço</li>
                </ul>

                <nav className='flex gap-4 text-center'>
                    <Link href='https://www.facebook.com' className='mr-4 hover:underline' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faInstagram} className='h-6 w-6' />
                    </Link>
                    <Link href='https://www.twitter.com' className='mr-4 hover:underline' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faFacebook} className='h-6 w-6' />
                    </Link>
                    <Link href='https://www.instagram.com' className='hover:underline' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faLinkedinIn} className='h-6 w-6' />
                    </Link>
                    <Link href='https://www.instagram.com' className='hover:underline' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faYoutube} className='h-6 w-6' />
                    </Link>


                </nav>

            </div>


            <div className=' max-w-6xl text-slate-600 w-full text-center'>
                @2024 RentalApp. Todos os direitos reservados.
            </div>


        </footer>
    )
}

export default Footer