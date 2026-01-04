import { de } from "zod/v4/locales"
import { NavbarSearch } from "./_components/navbarSearch"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { NAVBAR_HEIGHT } from "@/lib/constants"


const SearchLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`h-[calc(100vh-${NAVBAR_HEIGHT}px)] w-full flex flex-col `}>
                <main>
                    {children}
                </main>
            
        </div>
    )
}

export default SearchLayout