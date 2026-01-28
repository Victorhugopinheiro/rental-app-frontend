

import { useGetAuthUserQuery } from '@/state/api'
import { Building, FileText, Heart, Menu, Settings, X } from 'lucide-react'
import React, { use } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { usePathname } from 'next/navigation'

function ApiSidebar() {

    const { data: authUser } = useGetAuthUserQuery()
    const { open, toggleSidebar } = useSidebar()
    const page = usePathname()

    const infoSidebar = authUser?.userRole === "manager" ?
        [{
            icon: Building,
            label: "Propriedades",
            href: "/managers/properties"
        },
        {
            icon: FileText,
            label: "Aplicações",
            href: "/managers/applications"
        },
        {
            icon: Settings,
            label: "Configurações",
            href: "/managers/settings"
        }

        ] : [{
            icon: Heart,
            label: "favoritos",
            href: "/tenants/favorites",

        }, {
            icon: FileText,
            label: "Aplicações",
            href: "/tenants/aplications"
        },
        {
            icon: Settings,
            label: "Configurações",
            href: "/tenants/settings"
        },
         {
            icon: Settings,
            label: "Residências",
            href: "/tenants/residences"
        }
        ]

    return (
        <Sidebar collapsible="icon"
            className="fixed left-0 min-w-16 bg-white shadow-lg"
            style={{
                top: `${NAVBAR_HEIGHT}px`,
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            }}>
            <SidebarHeader className=''>
                <SidebarMenu className=''>
                    <SidebarMenuItem className={cn('flex flex-row justify-between px-4 py-2 border-b border-gray-300', open ? 'justify-between' : 'justify-center')}>
                        {open && (
                            <span className='hidden md:block font-bold text-lg text-black'>
                                {authUser?.userRole === "manager" ? "Gerente" : "Inquilino"}
                            </span>
                        )}
                        {open ? (
                            <Button onClick={() => toggleSidebar()}><X/></Button>
                        ) : (
                            <Button onClick={() => toggleSidebar()}><Menu /></Button>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {infoSidebar.map((item) => {
                        const actualPage = item.href === page;

                        return (
                            <SidebarMenuItem className={cn("flex hover:bg-slate-200", actualPage ? "bg-slate-200 font-semibold" : "bg-white", open ? "justify-between" : "justify-center")} key={item.label}>
                                <SidebarMenuButton asChild>
                                    <a href={item.href}>
                                        <item.icon />
                                        <span >{item.label}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )




                    })}
                </SidebarMenu>
            </SidebarContent>

        </Sidebar>
    )
}

export default ApiSidebar