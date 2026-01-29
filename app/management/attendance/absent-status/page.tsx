"use client"

import * as React from "react"
import { IconUserX } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AbsentStatusPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "department", header: "Department" },
        { accessorKey: "supervisor", header: "Supervisor" },
    ]

    const data = [
        { id: "1", date: "2024-05-20", employeeName: "John Doe", department: "IT", supervisor: "Sarah Connor" },
        { id: "2", date: "2024-05-20", employeeName: "Jane Smith", department: "HR", supervisor: "Mike Ross" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconUserX className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Absent Status</h1>
            </div>
            <p className="text-muted-foreground">List of employees absent on a specific date.</p>

            <div className="flex gap-4 items-end">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                </div>
                <Button variant="outline">Fetch</Button>
            </div>

            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
