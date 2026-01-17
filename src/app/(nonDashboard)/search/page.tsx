"use client"

import { cleanParams } from "@/lib/utils"
import { setFilters } from "@/state"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { NavbarSearch } from "./_components/navbarSearch"
import { NAVBAR_HEIGHT } from "@/lib/constants"
import { Calendar, HomeIcon, Inbox, List, Search, Settings } from "lucide-react"
import Home from "@/app/page"
import { FiltersFull } from "./_components/filtersFull"
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";
import Map from "./_components/map"
import Listings from "./_components/listings"





export default function SearchPage() {



    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()

    const isFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen)


    const searchParamsString = searchParams.toString()

    useEffect(() => {

        const initialFilters = Array.from(searchParams.entries()).reduce((acc: any, [key, value]) => {

            if (key === "priceRange" || key === "squareFeet") {

                acc[key] = value.split(',').map((value) => value === "null" ? null : Number(value))
            }
            else if (key === "coordinates") {
                acc[key] = value.split(',').map((value) => Number(value))
            }
            else if (key === "amenities") {
                acc[key] = value.split(","); // garante array
            }
            else {
                acc[key] = value === "any" ? null : value
            }

            return acc

        }, {})

        const cleanFilters = cleanParams(initialFilters)

        dispatch(setFilters(cleanFilters))
    }, [dispatch, searchParamsString])

    return (
        <div className={` w-full  flex flex-col max-h-[calc(100vh-${NAVBAR_HEIGHT}px)]  transition-all duration-300 ease-in-out overflow-hidden  `} >
            <NavbarSearch />

            <div className="flex w-full h-full justify-between overflow-hidden">
                <div className={`h-[calc(100vh-110px)] transition-all duration-300 ${isFullOpen ? "w-6/12  visible opacity-100" : "w-0 opacity-0 invisible flex-none"} `}>
                    <FiltersFull />
                </div>


                <div className="w-full max-h-[calc(100vh-110px)] ">
                    <Map />
                </div>


                <div className="w-5/12 overflow-y-auto max-h-[calc(100vh-110px)] border-l">
                    <Listings />
                </div>



            </div>
        </div>
    )
}