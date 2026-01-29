"use client"

import * as React from "react"
import { IconCalendarEvent, IconPlus, IconCheck, IconX, IconEye, IconFilter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// --- Types ---
type LeaveApplication = {
    id: string
    employeeName: string
    type: string
    startDate: string
    endDate: string
    days: number
    reason: string
    status: "Approved" | "Rejected" | "Pending"
}

// --- Mock Data ---
const mockApplications: LeaveApplication[] = [
    { id: "1", employeeName: "Alice Wonderland", type: "Sick Leave", startDate: "2024-05-20", endDate: "2024-05-22", days: 3, reason: "Viral fever", status: "Pending" },
    { id: "2", employeeName: "Bob Builder", type: "Casual Leave", startDate: "2024-05-25", endDate: "2024-05-25", days: 1, reason: "Family event", status: "Approved" },
    { id: "3", employeeName: "Charlie Chaplin", type: "Earned Leave", startDate: "2024-06-01", endDate: "2024-06-10", days: 10, reason: "Europe trip", status: "Rejected" },
]

export default function LeaveManagementPage() {
    const [data, setData] = React.useState<LeaveApplication[]>(mockApplications)

    const handleStatusChange = (id: string, newStatus: "Approved" | "Rejected") => {
        setData(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app))
        toast.success(`Leave request ${newStatus.toLowerCase()}.`)
    }

    const columns: ColumnDef<LeaveApplication>[] = [
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "type", header: "Type" },
        {
            accessorKey: "startDate",
            header: "Duration",
            cell: ({ row }) => (
                <div className="text-sm">
                    <div>{row.original.startDate} <span className="text-muted-foreground">to</span> {row.original.endDate}</div>
                    <div className="text-xs text-muted-foreground">{row.original.days} day(s)</div>
                </div>
            )
        },
        { accessorKey: "reason", header: "Reason", cell: ({ row }) => <div className="truncate max-w-[200px]">{row.original.reason}</div> },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "Approved" ? "default" : row.original.status === "Rejected" ? "destructive" : "secondary"}>
                    {row.original.status}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 justify-end">
                    {row.original.status === "Pending" && (
                        <>
                            <Button size="icon" variant="ghost" className="size-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange(row.original.id, "Approved")}>
                                <IconCheck className="size-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(row.original.id, "Rejected")}>
                                <IconX className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconCalendarEvent className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
                    </div>
                    <p className="text-muted-foreground">Manage ongoing leave applications and approvals.</p>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="gap-2">
                            <IconPlus className="size-4" /> Apply for Leave
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>New Leave Application</SheetTitle>
                            <SheetDescription>Submit a new leave request for approval.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Leave Type</Label>
                                <NativeSelect>
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Earned Leave</option>
                                    <option>Maternity/Paternity Leave</option>
                                </NativeSelect>
                            </div>
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Reason</Label>
                                <Textarea placeholder="Briefly describe why you need this leave..." />
                            </div>
                            <Button onClick={() => toast.success("Application submitted successfully!")}>Submit Request</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.filter(d => d.status === "Pending").length}</div>
                        <p className="text-xs text-muted-foreground">Needs attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Employees absent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Approved (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Total applications processed</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>A list of recent leave requests from all employees.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={data}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
