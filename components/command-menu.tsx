"use client"

import * as React from "react"
import {
    IconCalculator,
    IconCalendar,
    IconCreditCard,
    IconSettings,
    IconMoodSmile,
    IconUser,
    IconLayoutDashboard,
    IconUsers,
    IconReceipt,
    IconBuildingFactory2,
    IconPackages,
    IconScissors
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useSearch } from "@/components/search-context"

export function CommandMenu() {
    const router = useRouter()
    const { open, setOpen } = useSearch()

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [setOpen])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={() => runCommand(() => router.push("/management/human-resource/employee-info"))}>
                        <IconUsers className="mr-2 h-4 w-4" />
                        <span>Employee List</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/production/daily-report"))}>
                        <IconLayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Daily Production</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/store/inventory"))}>
                        <IconPackages className="mr-2 h-4 w-4" />
                        <span>Inventory Stock</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Modules">
                    <CommandItem onSelect={() => runCommand(() => router.push("/management"))}>
                        <IconUser className="mr-2 h-4 w-4" />
                        <span>HR Management</span>
                        <CommandShortcut>⌘H</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/production/dashboard"))}>
                        <IconBuildingFactory2 className="mr-2 h-4 w-4" />
                        <span>Production</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/cutting/dashboard"))}>
                        <IconScissors className="mr-2 h-4 w-4" />
                        <span>Cutting</span>
                        <CommandShortcut>⌘C</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                    <CommandItem onSelect={() => runCommand(() => router.push("/management/human-resource/employee-info/create"))}>
                        <IconUser className="mr-2 h-4 w-4" />
                        <span>Add Employee</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
                        <IconSettings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/help"))}>
                        <IconMoodSmile className="mr-2 h-4 w-4" />
                        <span>Help Center</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
