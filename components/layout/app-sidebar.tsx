"use client"

import * as React from "react"
import { IconSearch, IconSelector } from "@tabler/icons-react"
import { usePathname, useRouter } from "next/navigation"
import { NavGroup } from "./nav-group"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { sidebarData } from "./data/sidebar-data"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

  // Find the initial active module based on the current URL
  const initialModule = React.useMemo(() => {
    const foundModule = sidebarData.modules.find(module => {
      // Check navMain
      const inNavMain = module.navMain.some(item => pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url)))
      if (inNavMain) return true

      // Check navGroup
      const inNavGroup = module.navGroup.some(group =>
        group.items?.some(item => pathname === item.url || pathname.startsWith(item.url))
      )
      return inNavGroup
    })
    return foundModule || sidebarData.modules[0]
  }, [pathname])

  const [activeModule, setActiveModule] = React.useState(initialModule)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { isMobile } = useSidebar()

  // Update active module ONLY when pathname changes
  React.useEffect(() => {
    const currentPathModule = sidebarData.modules.find(module => {
      // Check navMain
      const inNavMain = module.navMain.some(item =>
        pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url + "/"))
      )
      if (inNavMain) return true

      // Check navGroup
      const inNavGroup = module.navGroup.some(group =>
        group.items?.some(item =>
          pathname === item.url || pathname.startsWith(item.url + "/")
        )
      )
      return inNavGroup
    })

    if (currentPathModule) {
      setActiveModule(currentPathModule)
    }
  }, [pathname])

  const filterNavGroup = (items: any[]) => {
    if (!searchQuery) return items
    return items
      .map((item) => {
        const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase())
        let filteredChildren: any[] = []

        if (item.items) {
          filteredChildren = item.items.filter((child: any) =>
            child.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        if (matchesTitle) {
          return { ...item, isActive: true }
        }

        if (filteredChildren && filteredChildren.length > 0) {
          return { ...item, items: filteredChildren, isActive: true }
        }

        return null
      })
      .filter((item) => item !== null)
  }

  const filterNavItems = (items: any[]) => {
    if (!searchQuery) return items
    return items.filter((item: any) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const filteredNavMain = filterNavItems(activeModule.navMain)
  const filteredNavGroup = filterNavGroup(activeModule.navGroup)
  const filteredNavSecondary = filterNavItems(sidebarData.navSecondary)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeModule.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeModule.name}
                    </span>
                    <span className="truncate text-xs">{activeModule.plan}</span>
                  </div>
                  <IconSelector className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Modules
                </DropdownMenuLabel>
                {sidebarData.modules.map((module) => (
                  <DropdownMenuItem
                    key={module.name}
                    onClick={() => {
                      setActiveModule(module)
                      if (module.navMain?.[0]?.url) {
                        router.push(module.navMain[0].url)
                      }
                    }}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <module.logo className="size-4 shrink-0" />
                    </div>
                    {module.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-2 py-1">
            <div className="relative">
              <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-sm bg-transparent border rounded-md focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/70"
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavMain.length > 0 && <NavMain items={filteredNavMain} />}
        {filteredNavGroup.length > 0 && <NavGroup label="General" items={filteredNavGroup} />}
        {filteredNavSecondary.length > 0 && (
          <NavSecondary items={filteredNavSecondary} className="mt-auto" />
        )}
      </SidebarContent>
    </Sidebar>
  )
}
