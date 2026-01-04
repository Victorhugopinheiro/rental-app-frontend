"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ArrowDownUp, ArrowRightToLine, Grid, List, Search } from "lucide-react"
import { toggleFiltersFullOpen } from "@/state"
import { useSidebar } from "@/components/ui/sidebar"


export const NavbarSearch = () => {

    const dispach = useAppDispatch()

    const isFullopen =  useAppSelector((state) => state.global.isFiltersFullOpen)




  

    function handleToggleFilters() {
 
        dispach(toggleFiltersFullOpen())
       
    }

    return (
        <div className="w-full h-20 flex items-center bg-white shadow-md p-4 rounded-md">
            <div className="w-full flex justify-between">
                <div className="flex justify-center items-center gap-2">

                    <Button className={`${!isFullopen ? "bg-black text-white hover:bg-black hover:text-white" : "bg-white text-black"}`} onClick={() => handleToggleFilters()} variant="outline">Todos os filtros</Button>

                    <div className="flex justify-center items-center">
                        <Input type="text" placeholder="Search properties..." className="w-64  rounded-r-none border-gray-400" />
                        <Search className=" h-9  right-10  border rounded-r border-gray-400  " />
                    </div>

                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"><span>Qualquer valor</span> <ArrowDownUp /> </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="flex transition-all duration-200 mt-2 bg-white w-40 border border-slate-300 " >

                            <DropdownMenuGroup className="flex flex-col justify-center w-full">
                                <DropdownMenuItem className="w-full border-b p-2 cursor-pointer hover:bg-gray-200" >
                                    Até R$500

                                </DropdownMenuItem>
                                <DropdownMenuItem className="w-full border-b p-2 cursor-pointer hover:bg-gray-200">
                                    Até R$1.000

                                </DropdownMenuItem>
                                <DropdownMenuItem className="w-full border-b p-2 cursor-pointer hover:bg-gray-200">
                                    Até R$2.000

                                </DropdownMenuItem>

                            </DropdownMenuGroup>

                            <DropdownMenuGroup></DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>


                <div className="flex justify-center items-center rounded border border-gray-200">
                    <Button variant="ghost" className="hover:bg-black hover:text-white">

                        <List className="ml-2" />
                    </Button>


                    <Button variant="ghost" className="hover:bg-black hover:text-white">

                        <Grid className="ml-2" />
                    </Button>



                </div>

            </div>
        </div>
    )
}