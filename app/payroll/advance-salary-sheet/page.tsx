"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

export default function AdvanceSalarySheetPage() {
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
        { accessorKey: "amount", header: "Amount", cell: ({ row }) => row.original.amount.toLocaleString() },
        { accessorKey: "requestDate", header: "Request Date" },
        { accessorKey: "repaymentMonth", header: "Repayment Month" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "Approved" ? "default" : "secondary"}>
                    {row.original.status}
                </Badge>
            )
        },
        {
            id: "actions",
            cell: () => <Button size="sm" variant="ghost">Edit</Button>
        }
    ]

    const data = [
        { id: "1", employeeName: "Sarah Connor", employeeId: "EMP012", amount: 15000, requestDate: "2024-05-10", repaymentMonth: "June 2024", status: "Approved" },
        { id: "2", employeeName: "Mike Ross", employeeId: "EMP015", amount: 5000, requestDate: "2024-05-18", repaymentMonth: "June 2024", status: "Pending" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Advance Salary Management</h1>
                    <p className="text-muted-foreground">Manage employee salary advance requests and approvals.</p>
                </div>
                <Button>
                    <IconPlus className="mr-2 size-4" /> New Request
                </Button>
            </div>
            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
