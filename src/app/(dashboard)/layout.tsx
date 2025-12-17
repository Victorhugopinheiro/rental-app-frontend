"use client"
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect } from 'react'

function layout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthenticator((context) => [context.user]);


    return (
        <SidebarProvider>
            <div className='h-full w-full flex flex-col'>

                <Navbar />

                <main style={{ paddingTop: 50 }} className={`h-full flex w-full flex-row gap-4 `}>

                    <div>
                        <Sidebar />
                    </div>

                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

export default layout