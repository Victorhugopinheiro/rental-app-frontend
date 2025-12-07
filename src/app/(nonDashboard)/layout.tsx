import Navbar from '@/components/navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-full w-full'>

            <Navbar />

            <main style={{ paddingTop: 40}} className={`h-full flex w-full flex-col`}>
                {children}
            </main>
        </div>
    )
}

export default layout