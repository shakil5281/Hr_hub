"use client"

import * as React from "react"
import { IconClock } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

export default function DailyOTSheetPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "shiftEnd", header: "Shift End" },
        { accessorKey: "outTime", header: "Out Time" },
        { accessorKey: "otHours", header: "OT Hours", cell: ({ row }) => <span className="font-bold text-green-600">{row.original.otHours}</span> },
    ]

    const data = [
        { id: "1", employeeName: "John Doe", shiftEnd: "05:00 PM", outTime: "07:00 PM", otHours: "02:00" },
        { id: "2", employeeName: "Jane Smith", shiftEnd: "05:00 PM", outTime: "08:30 PM", otHours: "03:30" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconClock className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Daily OT Sheet</h1>
            </div>
            <p className="text-muted-foreground">Daily overtime calculations.</p>

            <div className="grid gap-2 max-w-sm">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
            </div>

            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
