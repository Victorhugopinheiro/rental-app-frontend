"use client";

import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';

import { Authenticator, Heading, Radio, RadioGroupField, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Footer from '../(nonDashboard)/landing/footer';
import { usePathname, useRouter } from 'next/navigation';
import path from 'path';


Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_CLIENT_ID!,
        }
    }
});

const components = {
    Header() {
        return (
            <View className='mt-2 mb-6'>
                <Heading level={3} className="text-2xl font-bold">
                    RENT
                    <span className='text-red-400 font-light hover:text-red-500'>FULL</span>

                </Heading>

                <p className='text-muted-foreground mt-2'>
                    <span>Bem-vindo!</span> Faça login para continuar!
                </p>
            </View>
        )
    },
    SignIn: {
        Footer() {
            const { toSignUp } = useAuthenticator();

            return (
                <View className='mt-6'>
                    <p className='text-center text-sm text-gray-600'>
                        Don't have an account?{' '}
                        <button
                            className='text-slate-800 font-medium hover:text-slate-900'
                            onClick={toSignUp}
                        >
                            Sign Up
                        </button>
                    </p>
                </View>
            )
        }
    },
    SignUp: {
        FormFields() {
            const { validationErrors } = useAuthenticator();

            return (
                <>
                    <Authenticator.SignUp.FormFields />
                    <RadioGroupField
                        legend="Role"
                        name='custom:role'
                        errorMessage={validationErrors['custom:role']}
                        hasError={!!validationErrors['custom:role']}
                        isRequired
                    >

                        <Radio value='tenant'>Inquilino</Radio>
                        <Radio value='manager'>Proprietário</Radio>

                    </RadioGroupField>


                </>
            )
        },

        Footer() {
            const { toSignIn } = useAuthenticator();

            return (
                <View className='mt-6'>
                    <p className='text-center text-sm text-gray-600'>
                        Já tem uma conta?{' '}
                        <button
                            className='text-slate-800 font-medium hover:text-slate-900'
                            onClick={toSignIn}
                        >
                            Entrar
                        </button>
                    </p>
                </View>
            )
        }
    }

}

const FormField = {
    signIn: {
        username: { label: 'Endereço de email', placeholder: 'Digite seu email', type: 'email' },
        password: { label: 'Senha', placeholder: 'Digite sua senha', type: 'password' }
    },
    signUp: {
        username: { label: 'Nome', placeholder: 'Digite seu nome', isRequired: true, type: 'text' },
        email: { label: 'Email Address', placeholder: 'Digite se endereço de email', isRequired: true, type: 'email' },
        password: { label: 'Senha', placeholder: 'Digite sua senha', isRequired: true, type: 'password' },
        confirm_password: { label: 'Confirm Password', placeholder: 'Digite sua senha novamente', isRequired: true, type: 'password' }
    }
}

const Auth = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    const {user} = useAuthenticator((context) => [context.user])
    const router = useRouter();


    const pageAuth = pathName.match(/^\/(signin|signup)$/);
    const isDashboard = pathName.startsWith("/manager") || pathName.startsWith("/tenants");


    useEffect(() => {
        if(user && pageAuth){
            router.push("/")
        }
    }, [user, pageAuth, router]);


    if(!isDashboard && !pageAuth){
        return <>{children}</>
    }


    return (
        <div className='h-full'>
            <Authenticator initialState={pathName.includes("signup") ? "signUp" : "signIn"} components={components} formFields={FormField}>
                {({ signOut, user }) => (
                    <>
                        {children}
                    </>
                )}
            </Authenticator>
        </div>
    );
}

export default Auth;