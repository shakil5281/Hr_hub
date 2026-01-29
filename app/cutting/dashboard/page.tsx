"use client"

import { IconScissors } from "@tabler/icons-react"

export default function CuttingDashboard() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconScissors className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Cutting Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Manage and track textile/material cutting operations.</p>
                </div>
            </div>
            <div className="px-4 lg:px-6">
                <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                    Cutting operations data will appear here.
                </div>
            </div>
        </div>
    )
}
