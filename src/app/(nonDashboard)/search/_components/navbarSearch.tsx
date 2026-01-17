"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ArrowDownUp, ArrowRightToLine, Grid, List, Search } from "lucide-react"
import { FiltersState, initialState, setFilters, toggleFiltersFullOpen } from "@/state"
import { useSidebar } from "@/components/ui/sidebar"
import { setViewMode } from "@/state"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PropertyTypeIcons } from "@/lib/constants"
import { useState } from "react"
import { debounce, filter } from "lodash"
import { cleanParams } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"


export const NavbarSearch = () => {

    const dispach = useAppDispatch()
    const filters = useAppSelector((state) => state.global.filters)
    const [inputValue, setInputValue] = useState(initialState.filters.location || "")
    const router = useRouter()
    const pathName = usePathname()
    const isFullopen = useAppSelector((state) => state.global.isFiltersFullOpen)
    const viewMode = useAppSelector((state) => state.global.viewMode)







    function handleToggleFilters() {

        dispach(toggleFiltersFullOpen())

    }

    const updateUrl = debounce((newValues: FiltersState) => {

        const cleanFilter = cleanParams(newValues)
        const queryParams = new URLSearchParams()

        Object.entries(cleanFilter).forEach(([key, value]) => {

            queryParams.set(
                key,
                Array.isArray(value) ? value.join(',') : value.toString()
            )

        })

        router.push(`${pathName}?${queryParams.toString()}`)

    })


    const handleLocationSearch = async () => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    inputValue
                )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
                }&fuzzyMatch=true`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                dispach(
                    setFilters({
                       location: inputValue,
                       coordinates: [lat, lng],
                    })
                )
            }
        } catch (err) {
            console.error("Error search location:", err);
        }
    };


    function handleFilterChange({ key, value, isMin }: { key?: string, value?: any, isMin: boolean | null }) {
        let newValue = value

        if (key === "priceRange" || key === "squareFeet") {
            let currentValue = [...filters[key]]

            if (isMin !== null) {
                const index = isMin ? 0 : 1
                currentValue[index] = value === "any" ? null : Number(value)
            }
            newValue = currentValue
        } else if (key === "coordinates") {
            newValue = value === "any" ? [0, 0] : value.map(Number)
        } else {
            newValue = value === "any" ? null : value
        }

        const newFilters = { ...filters, [key as string]: newValue }
        dispach(setFilters(newFilters))
        updateUrl(newFilters)
        console.log("Filters updated:", newValue);
    }

    return (
        <div className="w-full h-20 flex items-center bg-white shadow-md p-4 rounded-md">
            <div className="w-full flex justify-between">
                <div className="flex justify-center items-center gap-2">

                    <Button className={`${!isFullopen ? "bg-black text-white hover:bg-black hover:text-white" : "bg-white text-black"}`}
                        onClick={() => handleToggleFilters()} variant="outline">Todos os filtros</Button>

                    <div className="flex justify-center items-center">
                        <Input value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            type="text" placeholder="Search properties..." className="w-64  rounded-r-none border-gray-400" />
                        <Search className=" h-9  right-10  border rounded-r border-gray-400  " />
                    </div>

                    <Select
                        value={filters.priceRange[0]?.toString() || "any"}
                        onValueChange={(value) => {
                            handleFilterChange({ key: "priceRange", value, isMin: true })
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Preço mínimo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="any">Preço mínimo</SelectItem>

                            {[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000].map((price) => (
                                <SelectItem key={price} value={price.toString()}>{`R$${price}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Select
                        value={filters.priceRange[1]?.toString() || "any"}
                        onValueChange={(value) => {
                            handleFilterChange({ key: "priceRange", value, isMin: false })
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Preço máximo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="any">Preço máximo</SelectItem>

                            {[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000].map((price) => (
                                <SelectItem key={price} value={price.toString()}>{`R$${price}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Select
                        value={filters.beds}
                        onValueChange={(value) => {
                            handleFilterChange({ key: "beds", value, isMin: null })
                        }}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Quartos" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="any">Quantidade de Quartos</SelectItem>
                            <SelectItem value="1">1+ Quarto</SelectItem>
                            <SelectItem value="2">2+ Quartos</SelectItem>
                            <SelectItem value="3">3+ Quartos</SelectItem>
                            <SelectItem value="4">4+ Quartos</SelectItem>

                        </SelectContent>
                    </Select>


                    <Select
                        onValueChange={(value) => {
                            handleFilterChange({ key: "baths", value, isMin: null })
                        }}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Banheiros" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="any">Quantidade de Banheiros</SelectItem>
                            <SelectItem value="1">1+ Banheiro</SelectItem>
                            <SelectItem value="2">2+ Banheiros</SelectItem>
                            <SelectItem value="3">3+ Banheiros</SelectItem>
                            <SelectItem value="4">4+ Banheiros</SelectItem>

                        </SelectContent>
                    </Select>


                    <Select
                        onValueChange={(value) => {
                            handleFilterChange({ key: "propertyType", value, isMin: null })
                        }}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Propriedade" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
                                <div key={type} className="flex gap-1">
                                    <span><Icon className="w-6 h-6" /></span>
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                </div>
                            ))}

                        </SelectContent>
                    </Select>

                </div>


                <div className="flex gap-2 justify-center items-center rounded border border-gray-200">
                    <Button onClick={() => dispach(setViewMode("list"))} variant="ghost" className={`hover:bg-black hover:text-white ${viewMode === "list" ? "bg-black text-white" : ""}`} >

                        <List className="ml-2" />
                    </Button>


                    <Button onClick={() => dispach(setViewMode("grid"))} variant="ghost" className={`hover:bg-black hover:text-white ${viewMode === "grid" ? "bg-black text-white" : ""}`} >

                        <Grid className="ml-2" />
                    </Button>



                </div>

            </div>
        </div>
    )
}