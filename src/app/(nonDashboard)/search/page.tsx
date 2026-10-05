"use client"

import { Suspense, useEffect } from "react"
import SerchPageContext from "./_components/SerchPageContext"





export default function SearchPage() {




    return (
         <Suspense fallback={<div>Carregando...</div>}>
            <SerchPageContext />
        </Suspense>
    )
}