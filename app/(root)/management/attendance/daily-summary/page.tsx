"use client"

import * as React from "react"
import { IconListCheck, IconUsers, IconUserCheck, IconUserOff, IconClock } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SummaryCard } from "@/components/summary-card"

const chartData = [
    { value: 40 }, { value: 45 }, { value: 42 }, { value: 48 },
    { value: 46 }, { value: 50 }, { value: 48 }, { value: 52 }
]

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
        <div className="p-0 space-y-6 w-full">
            <div className="flex items-center gap-4 px-4 py-4 lg:px-6 mb-2 border-b border-muted/40 bg-muted/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <IconListCheck className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Daily Summary</h1>
                    <p className="text-sm text-muted-foreground">Summary of attendance status by department.</p>
                </div>
            </div>

            <div className="px-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Total Workforce"
                        value="62"
                        icon={IconUsers}
                        status="primary"
                        chartData={chartData}
                    />
                    <SummaryCard
                        title="Present"
                        value="55"
                        icon={IconUserCheck}
                        trend={{ value: "88.7%", label: "attendance", isUp: true }}
                        status="success"
                        chartData={chartData.map(d => ({ value: d.value * 0.9 }))}
                    />
                    <SummaryCard
                        title="Absent"
                        value="3"
                        icon={IconUserOff}
                        trend={{ value: "4.8%", label: "rate", isUp: false }}
                        status="error"
                        chartData={chartData.map(d => ({ value: d.value * 0.05 + Math.random() * 2 }))}
                    />
                    <SummaryCard
                        title="Late Entry"
                        value="2"
                        icon={IconClock}
                        trend={{ value: "1", label: "less than yesterday", isUp: true }}
                        status="warning"
                        chartData={chartData.map(d => ({ value: d.value * 0.03 + Math.random() * 2 }))}
                    />
                </div>

                <div className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl border border-muted/40">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Select Date</label>
                        <Input type="date" className="bg-background w-48" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <DataTable columns={columns} data={data} showColumnCustomizer={false} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
