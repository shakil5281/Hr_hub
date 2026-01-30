"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function DailySalarySheetPage() {
    // Mock reuse
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{row.original.employeeId}</div>
                </div>
            )
        },
        { accessorKey: "designation", header: "Designation" },
        { accessorKey: "dailyRate", header: "Daily Rate" },
        { accessorKey: "hoursWorked", header: "Hours" },
        { accessorKey: "totalPay", header: "Total Pay", cell: ({ row }) => <span className="font-bold">{row.getValue("totalPay")}</span> },
    ]

    const data = [
        { id: "1", date: "2024-05-20", employeeName: "Temp Worker 1", employeeId: "TMP01", designation: "Labor", dailyRate: 800, hoursWorked: 8, totalPay: 800 },
        { id: "2", date: "2024-05-20", employeeName: "Temp Worker 2", employeeId: "TMP02", designation: "Helper", dailyRate: 600, hoursWorked: 9, totalPay: 675 },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Daily Salary Sheet</h1>
                    <p className="text-muted-foreground">Daily wage calculation and records.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <IconCalendar className="mr-2 size-4" /> Pick Date
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
