"use client"

import * as React from "react"
import { IconSum } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function DailyOTSummaryPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "department", header: "Department" },
        { accessorKey: "totalEmployees", header: "Employees" },
        { accessorKey: "employeesOnOT", header: "Employees on OT" },
        { accessorKey: "totalOTHours", header: "Total OT Hours" },
    ]

    const data = [
        { id: "1", department: "Production", totalEmployees: 50, employeesOnOT: 20, totalOTHours: "40:00" },
        { id: "2", department: "Logistics", totalEmployees: 15, employeesOnOT: 5, totalOTHours: "12:30" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconSum className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Daily OT Summary</h1>
            </div>
            <p className="text-muted-foreground">Summary of overtime hours by department.</p>

            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
