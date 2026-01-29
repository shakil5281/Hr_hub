"use client"

import { IconBell, IconSearch, IconSettings } from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

export function SiteHeader() {
  const notifications = [
    {
      id: 1,
      title: "New Leave Request",
      description: "John Doe has requested 2 days of sick leave.",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payroll Processed",
      description: "January 2026 payroll has been successfully processed.",
      time: "2h ago",
      unread: false,
    },
    {
      id: 3,
      title: "System Update",
      description: "New features have been added to the dashboard.",
      time: "1d ago",
      unread: false,
    },
  ]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Search Bar */}
        <div className="ml-4 flex flex-1 items-center max-w-md relative">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9 bg-muted/50 focus-visible:bg-background transition-colors"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          <div className="hidden items-center gap-1 sm:flex">
            {/* Notifications Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 relative">
                  <IconBell className="size-5" />
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent">
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex flex-col gap-1 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${notif.unread ? "bg-primary/5" : ""
                        }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium text-sm">{notif.title}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notif.description}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <Button variant="ghost" className="w-full text-xs h-8">
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                  <IconSettings className="size-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>System Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Appearance
                    <span className="ml-auto text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Alt+A</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Language
                    <span className="ml-auto text-[10px] text-muted-foreground">English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Permissions</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>API Keys</DropdownMenuItem>
                <DropdownMenuItem>Audit Logs</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator
            orientation="vertical"
            className="h-6 mx-1 hidden sm:block"
          />

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/team">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/data-process">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  New Team
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
