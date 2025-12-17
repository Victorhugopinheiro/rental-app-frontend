"use client"
import Navbar from '@/components/navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect } from 'react'

function layout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthenticator((context) => [context.user]);

    const {data: authUser, isLoading, error, isError, isSuccess} = useGetAuthUserQuery();

    useEffect(() => {
        console.log("=== useGetAuthUserQuery Status ===");
        console.log("hasUser:", Boolean(user));
        console.log("isLoading:", isLoading);
        console.log("isError:", isError);
        console.log("isSuccess:", isSuccess);
        console.log("error:", error);
        console.log("data:", authUser);
        console.log("================================");
    }, [user, isLoading, isError, isSuccess, error, authUser]);

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