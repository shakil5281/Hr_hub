"use client"

import * as React from "react"
import {
    IconReport,
    IconUsers,
    IconUserCheck,
    IconUserOff,
    IconChartPie,
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// --- Data & Types ---

type DepartmentSummary = {
    id: number
    department: string
    totalStaff: number
    present: number
    onLeave: number
    absent: number
    efficiency: number
}

const summaryData: DepartmentSummary[] = [
    { id: 1, department: "Engineering", totalStaff: 45, present: 40, onLeave: 3, absent: 2, efficiency: 88 },
    { id: 2, department: "Human Resources", totalStaff: 12, present: 11, onLeave: 1, absent: 0, efficiency: 92 },
    { id: 3, department: "Product", totalStaff: 20, present: 18, onLeave: 1, absent: 1, efficiency: 90 },
    { id: 4, department: "Design", totalStaff: 15, present: 14, onLeave: 1, absent: 0, efficiency: 93 },
    { id: 5, department: "Marketing", totalStaff: 25, present: 22, onLeave: 2, absent: 1, efficiency: 88 },
    { id: 6, department: "Sales", totalStaff: 30, present: 28, onLeave: 1, absent: 1, efficiency: 93 },
]

const columns: ColumnDef<DepartmentSummary>[] = [
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => <span className="font-semibold">{row.getValue("department")}</span>,
    },
    {
        accessorKey: "totalStaff",
        header: "Total Staff",
    },
    {
        accessorKey: "present",
        header: "Present",
        cell: ({ row }) => <span className="text-green-600 font-medium">{row.getValue("present")}</span>,
    },
    {
        accessorKey: "onLeave",
        header: "On Leave",
        cell: ({ row }) => <span className="text-amber-600 font-medium">{row.getValue("onLeave")}</span>,
    },
    {
        accessorKey: "absent",
        header: "Absent",
        cell: ({ row }) => <span className="text-red-600 font-medium">{row.getValue("absent")}</span>,
    },
    {
        accessorKey: "efficiency",
        header: "Efficiency",
        cell: ({ row }) => {
            const val = row.getValue("efficiency") as number
            return (
                <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-xs font-medium">{val}%</span>
                </div>
            )
        },
    },
]

export default function ManpowerSummaryPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconReport className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Manpower Summary</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of employee distribution and daily checking stats.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <IconUsers className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">147</div>
                        <p className="text-xs text-muted-foreground">+4 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <IconUserCheck className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">133</div>
                        <p className="text-xs text-muted-foreground">90.5% Attendance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <IconUserOff className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">9</div>
                        <p className="text-xs text-muted-foreground">6 Planned, 3 Sick</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Efficiency</CardTitle>
                        <IconChartPie className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                        <p className="text-xs text-muted-foreground">+2% from last week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4">
                <div className="px-4 lg:px-6">
                    <h3 className="text-lg font-semibold">Department Breakdown</h3>
                    <p className="text-sm text-muted-foreground mb-4">Detailed view of manpower status by department.</p>
                </div>
                <DataTable
                    data={summaryData}
                    columns={columns}
                    showActions={false}
                    showTabs={false}
                />
            </div>
        </div>
    )
}
