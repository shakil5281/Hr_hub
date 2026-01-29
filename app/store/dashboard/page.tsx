"use client"

import { IconPackages } from "@tabler/icons-react"

export default function StoreDashboard() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconPackages className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Store Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Inventory management and warehouse tracking.</p>
                </div>
            </div>
            <div className="px-4 lg:px-6">
                <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                    Store and inventory data will appear here.
                </div>
            </div>
        </div>
    )
}
