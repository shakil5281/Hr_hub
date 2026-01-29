"use client"

import * as React from "react"
import { IconCalendar, IconUser, IconInfoCircle, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// Types
type LeaveHistory = {
    id: string
    type: string
    startDate: string
    endDate: string
    days: number
    reason: string
    status: "Approved" | "Rejected" | "Pending"
    appliedOn: string
}

const leaveHistoryData: LeaveHistory[] = [
    { id: "1", type: "Sick Leave", startDate: "2024-05-10", endDate: "2024-05-12", days: 3, reason: "Fever", status: "Approved", appliedOn: "2024-05-09" },
    { id: "2", type: "Casual Leave", startDate: "2024-04-20", endDate: "2024-04-20", days: 1, reason: "Personal work", status: "Approved", appliedOn: "2024-04-18" },
    { id: "3", type: "Earned Leave", startDate: "2024-06-01", endDate: "2024-06-05", days: 5, reason: "Vacation", status: "Pending", appliedOn: "2024-05-20" },
]

export default function LeaveDetailsPage() {
    const columns: ColumnDef<LeaveHistory>[] = [
        { accessorKey: "type", header: "Leave Type" },
        { accessorKey: "startDate", header: "From" },
        { accessorKey: "endDate", header: "To" },
        { accessorKey: "days", header: "Days" },
        { accessorKey: "reason", header: "Reason" },
        { accessorKey: "appliedOn", header: "Applied On" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge variant={status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"}>
                        {status}
                    </Badge>
                )
            }
        },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <IconInfoCircle className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Leave Details & Balance</h1>
                </div>
                <p className="text-muted-foreground">Detailed overview of leave usage and remaining balances.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Casual Leave (CL)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8 / 12</div>
                        <Progress value={(8 / 12) * 100} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">4 remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Sick Leave (SL)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 / 14</div>
                        <Progress value={(12 / 14) * 100} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">2 remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Earned Leave (EL)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5 / 20</div>
                        <Progress value={(5 / 20) * 100} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">15 remaining</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Usage History</h2>
                    <Button variant="outline" size="sm">
                        <IconRefresh className="size-4 mr-2" /> Refresh
                    </Button>
                </div>
                <DataTable columns={columns} data={leaveHistoryData} showColumnCustomizer={false} />
            </div>
        </div>
    )
}
