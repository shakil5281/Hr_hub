"use client"

import * as React from "react"
import { IconAlertTriangle } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

export default function MissingEntryPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "shift", header: "Shift" },
        { accessorKey: "missing", header: "Missing Punch", cell: ({ row }) => <span className="text-red-500 font-medium">{row.original.missing}</span> },
        {
            id: "actions",
            cell: () => <Button size="sm" variant="outline">Fix</Button>
        }
    ]

    const data = [
        { id: "1", date: "2024-05-20", employeeName: "John Doe", shift: "Morning", missing: "Out Time" },
        { id: "2", date: "2024-05-20", employeeName: "Jane Smith", shift: "Evening", missing: "In Time" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconAlertTriangle className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Missing Entry</h1>
            </div>
            <p className="text-muted-foreground">Manage missed attendance punches/logs.</p>
            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
