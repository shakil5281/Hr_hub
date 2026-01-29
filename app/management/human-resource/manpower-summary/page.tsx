"use client"

import * as React from "react"
import {
    IconReport,
    IconUsers,
    IconUserCheck,
    IconUserOff,
    IconChartPie,
    IconTrendingUp,
    IconCurrencyDollar,
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCard } from "@/components/summary-card"
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

const chartData = [
    { value: 10 }, { value: 25 }, { value: 15 }, { value: 35 },
    { value: 25 }, { value: 45 }, { value: 30 }, { value: 55 }
]

export default function ManpowerSummaryPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-4 px-4 py-4 lg:px-6 mb-4 border-b border-muted/40 bg-muted/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <IconReport className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manpower Summary</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of employee distribution and daily checking stats.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
                <SummaryCard
                    title="Total Employees"
                    value="147"
                    icon={IconUsers}
                    trend={{ value: "4", label: "since last month", isUp: true }}
                    status="primary"
                    chartData={chartData}
                />
                <SummaryCard
                    title="Present Today"
                    value="133"
                    icon={IconUserCheck}
                    trend={{ value: "90.5%", label: "attendance rate", isUp: true }}
                    status="success"
                    chartData={chartData.map(d => ({ value: d.value + Math.random() * 20 }))}
                />
                <SummaryCard
                    title="On Leave"
                    value="9"
                    icon={IconUserOff}
                    trend={{ value: "3", label: "sick leaves", isUp: false }}
                    status="warning"
                    chartData={chartData.map(d => ({ value: d.value * 0.5 + Math.random() * 10 }))}
                />
                <SummaryCard
                    title="Avg. Efficiency"
                    value="94%"
                    icon={IconChartPie}
                    trend={{ value: "2%", label: "since last week", isUp: true }}
                    status="info"
                    chartData={chartData.map(d => ({ value: d.value > 30 ? d.value : 30 + Math.random() * 10 }))}
                />
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
