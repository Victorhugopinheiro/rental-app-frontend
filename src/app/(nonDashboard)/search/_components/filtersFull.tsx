"use client"

import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants"
import { FiltersState, initialState, setFilters } from "@/state"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Input } from "@aws-amplify/ui-react"
import { Slider } from "@/components/ui/slider"
import { Span } from "next/dist/trace"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { debounce } from "lodash";
import { cleanParams } from "@/lib/utils"
import { Search } from "lucide-react"


export const FiltersFull = () => {

    const dispach = useAppDispatch()

    const router = useRouter()
    const filterAppSelector = useAppSelector((state) => state.global.filters)
    const filterFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen)
    const [localFilters, setLocalFilters] = useState(initialState.filters)


    const updateURL = debounce(
        (newFilter: FiltersState) => {

            const clearUrl = cleanParams(newFilter)
            const queryParams = new URLSearchParams()

            Object.entries(clearUrl).forEach((key, value) => {

                queryParams.set(
                    String(key),
                    Array.isArray(value) ? value.join(",") : String(value)
                )

                router.push(`/search?${queryParams.toString()}`)

            })



        }
    )

    function handleSubmit() {
        dispach(setFilters(localFilters))
        updateURL(localFilters)
    }

    function resetFilters() {
        setLocalFilters(initialState.filters)
        dispach(setFilters(initialState.filters))
        updateURL(initialState.filters)
    }





    function changeAmenities(amenitie: AmenityEnum) {

        setLocalFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenitie)
                ? prev.amenities.filter((values) => values !== amenitie)
                : [...prev.amenities, amenitie]
        }))
    }


    const handleLocationSearch = async () => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    localFilters.location
                )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
                }&fuzzyMatch=true`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                setLocalFilters((prev) => ({
                    ...prev,
                    coordinates: [lng, lat],
                }));
            }
        } catch (err) {
            console.error("Error search location:", err);
        }
    };



    if (!filterFullOpen) return null


    return (
        <div className="flex flex-col border w-full h-full px-2 overflow-auto justify-center items-center">
            <div className="flex gap-6 h-full w-full flex-col py-6">

                <div>
                    <p className="font-medium">Localizaçao</p>

                    <div className="flex">
                        <Input className="rounded-r-none" value={localFilters.location}
                            onChange={(e) => {
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    location: e.target.value
                                }))
                            }}
                            type="text" placeholder="Onde quer sua porpriedade?" />
                        <Search className="h-12   border rounded-r border-gray-400  " />
                    </div>
                </div>

                <div>
                    <p className="font-medium">Tipos de propriedade</p>

                    <div className="grid grid-cols-2 ">

                        {Object.entries(PropertyTypeIcons).map(([key, Icon]) => (

                            <div key={key} className={`flex flex-col justify-center items-center m-2 p-2 border border-slate-400 
                            rounded-lg cursor-pointer hover:bg-gray-200 ${localFilters.propertyType === key ? "bg-black text-white hover:bg-black" : "bg-white"}`}
                                onClick={() => {
                                    setLocalFilters((prev) => ({
                                        ...prev,
                                        propertyType: key as PropertyTypeEnum
                                    }))
                                }}
                            >
                                <span className="mb-2">{<Icon className="w-6 h-6" />}</span>
                                <span className="text-sm">{key}</span>
                            </div>

                        ))}

                    </div>

                </div>


                <div className="flex flex-col gap-2">
                    <p className="font-medium">Selecione o valor</p>

                    <Slider
                        defaultValue={[50]}
                        min={0}
                        max={10000}
                        step={100}
                        value={[
                            localFilters.priceRange[0] ?? 0,
                            localFilters.priceRange[1] ?? 10000
                        ]}
                        className={"w-full bg-black"}
                        onValueChange={(value) => {
                            setLocalFilters((prev) => ({
                                ...prev,
                                priceRange: value as [number, number],
                            }))
                        }}

                    />

                    <div className="w-full flex justify-between">
                        <span>R${localFilters.priceRange[0] ?? 0}</span>
                        <span>R${localFilters.priceRange[1] ?? 10.000}</span>
                    </div>
                </div>


                <div className="flex justify-between gap-6 w-full">

                    <div className="w-full">
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Quartos" />
                            </SelectTrigger>

                            <SelectContent className="bg-white">
                                <SelectGroup>

                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="w-full">
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Banheiros" />
                            </SelectTrigger>

                            <SelectContent className="bg-white">
                                <SelectGroup>


                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                </div>


                <div className="flex flex-col gap-2">
                    <p className="font-medium">Metros quadrados</p>

                    <Slider
                        value={[
                            localFilters.squareFeet[0] ?? 0,
                            localFilters.squareFeet[1] ?? 5000
                        ]}
                        min={0}
                        max={5000}
                        step={100}
                        onValueChange={(value) => {
                            setLocalFilters((prev) => ({
                                ...prev,
                                squareFeet: value as [number, number]
                            }))
                        }}
                        className="bg-black w-full"

                    />

                </div>

                <div className="">
                    <p className="font-medium">Comodidades</p>

                    <div className="grid grid-cols-2">
                        {Object.entries(AmenityIcons).map(([key, Icon]) => (
                            <div key={key} className={`flex justify-center items-center m-2 p-2 border border-slate-400 
                            rounded-lg cursor-pointer hover:bg-gray-200 ${localFilters.amenities.includes(key) ? "bg-black text-white" : "bg-white"}`}
                                onClick={() => changeAmenities(key as AmenityEnum)}

                            >

                                <span className="mr-2">{<Icon className="w-6 h-6" />}</span>
                                <span className="text-sm">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-medium">Disponivel a partir de:</p>

                    <Input
                        onChange={(e) => {
                            setLocalFilters((prev) => ({
                                ...prev,
                                availableFrom: e.target.value,
                            }))
                        }}
                        value={localFilters.availableFrom}
                        type="date" className="w-full" />
                </div>

                <div className="flex justify-between w-full mb-10">

                    <Button onClick={() => resetFilters()} className="bg-red-500 hover:bg-red-600" variant={"outline"}>Deletar</Button>


                    <Button onClick={() => handleSubmit()} className="bg-black text-white  " variant={"outline"}>Aplicar</Button>


                </div>



            </div>


        </div>
    )
}

