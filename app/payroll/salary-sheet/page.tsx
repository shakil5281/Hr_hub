"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { IconCash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type SalaryRecord = {
    id: string
    employeeName: string
    employeeId: string
    department: string
    basic: number
    allowances: number
    deductions: number
    netSalary: number
    status: "Paid" | "Pending"
}

const data: SalaryRecord[] = [
    { id: "1", employeeName: "John Doe", employeeId: "EMP001", department: "IT", basic: 50000, allowances: 10000, deductions: 2000, netSalary: 58000, status: "Paid" },
    { id: "2", employeeName: "Jane Smith", employeeId: "EMP002", department: "HR", basic: 45000, allowances: 8000, deductions: 1500, netSalary: 51500, status: "Pending" },
    { id: "3", employeeName: "Robert Fox", employeeId: "EMP003", department: "Sales", basic: 40000, allowances: 15000, deductions: 1000, netSalary: 54000, status: "Paid" },
    { id: "4", employeeName: "Emily Davis", employeeId: "EMP004", department: "Marketing", basic: 42000, allowances: 9000, deductions: 1200, netSalary: 49800, status: "Pending" },
]

const columns: ColumnDef<SalaryRecord>[] = [
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
    { accessorKey: "department", header: "Dept", cell: ({ row }) => <Badge variant="outline">{row.getValue("department")}</Badge> },
    { accessorKey: "basic", header: "Basic", cell: ({ row }) => row.original.basic.toLocaleString() },
    { accessorKey: "allowances", header: "Allowances", cell: ({ row }) => row.original.allowances.toLocaleString() },
    { accessorKey: "deductions", header: "Deductions", cell: ({ row }) => row.original.deductions.toLocaleString() },
    {
        accessorKey: "netSalary",
        header: "Net Salary",
        cell: ({ row }) => <span className="font-bold">{row.original.netSalary.toLocaleString()}</span>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === "Paid" ? "default" : "secondary"}>
                {row.original.status}
            </Badge>
        )
    }
]

export default function SalarySheetPage() {
    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Salary Sheet</h1>
                    <p className="text-muted-foreground">Monthly salary statement for all employees.</p>
                </div>
                <Button>
                    <IconCash className="mr-2 size-4" /> Export CSV
                </Button>
            </div>
            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
