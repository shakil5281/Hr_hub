"use client"

import * as React from "react"
import { IconMinus } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

export default function OTDeductionPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "calculatedOT", header: "Calculated OT" },
        { accessorKey: "deducted", header: "Deduction" },
        { accessorKey: "finalOT", header: "Final OT" },
        { accessorKey: "reason", header: "Reason" },
    ]

    const data = [
        { id: "1", date: "2024-05-20", employeeName: "John Doe", calculatedOT: "03:00", deducted: "00:30", finalOT: "02:30", reason: "Lunch Break Adjustment" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconMinus className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">OT Deduction</h1>
            </div>
            <p className="text-muted-foreground">Manage deductions from calculated overtime.</p>

            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
