"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

export default function IncrementSheetPage() {
    const columns: ColumnDef<any>[] = [
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
        { accessorKey: "previousSalary", header: "Prev. Salary" },
        { accessorKey: "incrementAmount", header: "Increment", cell: ({ row }) => <span className="text-green-600 font-medium">+{row.original.incrementAmount}</span> },
        { accessorKey: "currentSalary", header: "New Salary", cell: ({ row }) => <span className="font-bold">{row.original.currentSalary}</span> },
        { accessorKey: "effectiveDate", header: "Effective Date" },
        { accessorKey: "type", header: "Type", cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge> },
    ]

    const data = [
        { id: "1", employeeName: "John Doe", employeeId: "EMP001", previousSalary: 50000, incrementAmount: 5000, currentSalary: 55000, effectiveDate: "2024-01-01", type: "Annual" },
        { id: "2", employeeName: "Alice Wonderland", employeeId: "EMP008", previousSalary: 42000, incrementAmount: 3000, currentSalary: 45000, effectiveDate: "2024-04-01", type: "Promotion" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Increment Sheet</h1>
                    <p className="text-muted-foreground">History of salary increments and promotions.</p>
                </div>
            </div>
            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
