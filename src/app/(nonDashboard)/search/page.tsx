"use client"

import { cleanParams } from "@/lib/utils"
import { setFilters } from "@/state"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { NavbarSearch } from "./_components/navbarSearch"
import { NAVBAR_HEIGHT } from "@/lib/constants"
import { Calendar, HomeIcon, Inbox, Search, Settings } from "lucide-react"
import Home from "@/app/page"
import { FiltersFull } from "./_components/filtersFull"
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";





export default function SearchPage() {

   

    const searchParams = useSearchParams()
    const dispach = useAppDispatch()

    const isFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen)


    useEffect(() => {

        const initialFilters = Array.from(searchParams.entries()).reduce((acc: any, [key, value]) => {

            if (key === "priceRange" || key === "squareFeet") {

                acc[key] = value.split(',').map((value) => value === "null" ? null : Number(value))
            }
            else if (key === "coordinates") {
                acc[key] = value.split(',').map((value) => Number(value))
            } else {
                acc[key] = value === "any" ? null : value
            }

            return acc

        }, {})

        const cleanFilters = cleanParams(initialFilters)



        dispach(setFilters(cleanFilters))


    })

    return (
        <div className={` w-full sticky flex flex-col h-[calc(100vh-${NAVBAR_HEIGHT}px)]  transition-all duration-300 ease-in-out overflow-hidden  `} >
            <NavbarSearch />

            <div className="flex w-full h-full justify-between overflow-hidden">
                <div className={`h-[calc(100vh-110px)] transition-all duration-300 ${isFullOpen ? "w-3/12  visible opacity-100" : "w-0 opacity-0 invisible flex-none"} `}>
                    <FiltersFull />
                </div>


            </div>
        </div>
    )
}