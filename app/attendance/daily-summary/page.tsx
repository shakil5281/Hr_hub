"use client"

import * as React from "react"
import { IconListCheck } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function DailySummaryPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "department", header: "Department" },
        { accessorKey: "totalEmployees", header: "Total Employees" },
        { accessorKey: "present", header: "Present" },
        { accessorKey: "absent", header: "Absent" },
        { accessorKey: "late", header: "Late" },
        { accessorKey: "leaves", header: "On Leave" },
    ]

    const data = [
        { id: "1", department: "IT", totalEmployees: 50, present: 45, absent: 2, late: 2, leaves: 1 },
        { id: "2", department: "HR", totalEmployees: 12, present: 10, absent: 1, late: 0, leaves: 1 },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconListCheck className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Daily Summary</h1>
            </div>
            <p className="text-muted-foreground">Summary of attendance status by department.</p>

            <div className="flex gap-4 items-end">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <DataTable columns={columns} data={data} showColumnCustomizer={false} />
                </CardContent>
            </Card>
        </div>
    )
}
