"use client"

import * as React from "react"
import { IconReportAnalytics, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

export default function MonthlyLeaveReportPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "employeeId", header: "Emp ID" },
        { accessorKey: "employeeName", header: "Employee Name" },
        { accessorKey: "department", header: "Department" },
        { accessorKey: "totalLeaves", header: "Total Leaves" },
        { accessorKey: "cl", header: "CL" },
        { accessorKey: "sl", header: "SL" },
        { accessorKey: "el", header: "EL" },
        { accessorKey: "lwp", header: "LWP" }, // Leave Without Pay
    ]

    const data = [
        { id: "1", employeeId: "EMP001", employeeName: "John Doe", department: "IT", totalLeaves: 3, cl: 1, sl: 0, el: 2, lwp: 0 },
        { id: "2", employeeId: "EMP002", employeeName: "Jane Smith", department: "HR", totalLeaves: 1, cl: 0, sl: 1, el: 0, lwp: 0 },
        { id: "3", employeeId: "EMP003", employeeName: "Bob Johnson", department: "Sales", totalLeaves: 5, cl: 1, sl: 0, el: 0, lwp: 4 },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconReportAnalytics className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Monthly Leave Report</h1>
                    </div>
                    <p className="text-muted-foreground">Consolidated leave data for the selected month.</p>
                </div>
                <Button variant="outline">
                    <IconDownload className="size-4 mr-2" />
                    Export Excel
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Criteria</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4 items-end">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Month</label>
                        <Input type="month" defaultValue="2024-05" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Department</label>
                        <NativeSelect>
                            <option>All Departments</option>
                            <option>IT</option>
                            <option>HR</option>
                            <option>Sales</option>
                        </NativeSelect>
                    </div>
                    <Button>Generate Report</Button>
                </CardContent>
            </Card>

            <DataTable columns={columns} data={data} showColumnCustomizer={false} searchKey="employeeName" />
        </div>
    )
}
