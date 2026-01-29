"use client"

import * as React from "react"
import { IconActivity } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function ContinuousStatusPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "status", header: "Status" },
        { accessorKey: "consecutiveDays", header: "Consecutive Days" },
        { accessorKey: "since", header: "Since" },
    ]

    const data = [
        { id: "1", employeeName: "Alice Wonderland", status: "Absent", consecutiveDays: 3, since: "2024-05-18" },
        { id: "2", employeeName: "Bob Builder", status: "Late", consecutiveDays: 4, since: "2024-05-17" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconActivity className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Continuous Status</h1>
            </div>
            <p className="text-muted-foreground">Monitor employees with continuous absence or lateness.</p>
            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
