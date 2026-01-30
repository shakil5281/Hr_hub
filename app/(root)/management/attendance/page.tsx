"use client"

import * as React from "react"
import {
    IconFingerprint,
    IconSearch,
    IconFilter,
    IconFileTypeXls,
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    NativeSelect,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Calendar23 from "@/components/calendar-23"
import { toast } from "sonner"

// --- Types ---

type AttendanceRecord = {
    id: number
    employeeId: string
    employeeName: string
    department: string
    date: string
    checkIn: string
    checkOut: string
    status: "Present" | "Late" | "Absent" | "Half Day" | "On Leave"
    workingHours: string
}

// --- Mock Data ---

const attendanceData: AttendanceRecord[] = [
    {
        id: 1,
        employeeId: "EMP001",
        employeeName: "John Doe",
        department: "Engineering",
        date: "2026-01-28",
        checkIn: "09:00 AM",
        checkOut: "06:00 PM",
        status: "Present",
        workingHours: "9h 0m",
    },
    {
        id: 2,
        employeeId: "EMP002",
        employeeName: "Jane Smith",
        department: "HR",
        date: "2026-01-28",
        checkIn: "09:15 AM",
        checkOut: "06:00 PM",
        status: "Late",
        workingHours: "8h 45m",
    },
    {
        id: 3,
        employeeId: "EMP003",
        employeeName: "Michael Brown",
        department: "Product",
        date: "2026-01-28",
        checkIn: "-",
        checkOut: "-",
        status: "On Leave",
        workingHours: "0h",
    },
    {
        id: 4,
        employeeId: "EMP004",
        employeeName: "Emily Davis",
        department: "Design",
        date: "2026-01-28",
        checkIn: "08:50 AM",
        checkOut: "05:50 PM",
        status: "Present",
        workingHours: "9h 0m",
    },
    {
        id: 5,
        employeeId: "EMP005",
        employeeName: "Chris Wilson",
        department: "Engineering",
        date: "2026-01-28",
        checkIn: "10:30 AM",
        checkOut: "06:30 PM",
        status: "Half Day",
        workingHours: "4h 0m",
    },
]

// --- Columns ---

const columns: ColumnDef<AttendanceRecord>[] = [
    {
        accessorKey: "employeeId",
        header: "Employee ID",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("employeeId")}</span>,
    },
    {
        accessorKey: "employeeName",
        header: "Employee Name",
        cell: ({ row }) => <span className="font-medium">{row.getValue("employeeName")}</span>,
    },
    {
        accessorKey: "department",
        header: "Department",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "checkIn",
        header: "Check In",
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("checkIn")}</span>,
    },
    {
        accessorKey: "checkOut",
        header: "Check Out",
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("checkOut")}</span>,
    },
    {
        accessorKey: "workingHours",
        header: "Work Hrs",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("workingHours")}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let className = ""

            switch (status) {
                case "Present":
                    variant = "default" // or success color
                    className = "bg-green-100 text-green-700 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400"
                    break
                case "Late":
                    variant = "secondary"
                    className = "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none dark:bg-yellow-900/30 dark:text-yellow-400"
                    break
                case "Absent":
                    variant = "destructive"
                    break
                case "On Leave":
                    variant = "outline"
                    className = "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                    break
                default:
                    variant = "secondary"
            }

            return <Badge variant={variant} className={className}>{status}</Badge>
        },
    },
]

export default function AttendancePage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconFingerprint className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Attendance</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor daily attendance records and working hours.
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-4 lg:px-6">
                <Card className="rounded-xl border shadow-sm">
                    <CardContent className="p-4 grid gap-4 md:grid-cols-3 items-end">
                        <div className="grid gap-2">
                            <Label>Search Employee</Label>
                            <div className="relative">
                                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Name or ID..." />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            {/* Reusing the Calendar23 component as requested for date range */}
                            <Label>Date Range</Label>
                            <Calendar23 />
                        </div>

                        <div className="grid gap-2">
                            <Label>Department</Label>
                            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" defaultValue="all">
                                <option value="all">All Departments</option>
                                <option value="eng">Engineering</option>
                                <option value="hr">Human Resources</option>
                                <option value="prod">Product</option>
                                <option value="design">Design</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Section</Label>
                            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" defaultValue="all">
                                <option value="all">All Sections</option>
                                <option value="a">Section A</option>
                                <option value="b">Section B</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Designation</Label>
                            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" defaultValue="all">
                                <option value="all">All Designations</option>
                                <option value="se">Software Engineer</option>
                                <option value="pm">Product Manager</option>
                                <option value="hr">HR Executive</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Line</Label>
                            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" defaultValue="all">
                                <option value="all">All Lines</option>
                                <option value="1">Line 1</option>
                                <option value="2">Line 2</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" defaultValue="all">
                                <option value="all">All Status</option>
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                                <option value="leave">On Leave</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-2 flex-1">
                                <IconFilter className="size-4" />
                                Filter
                            </Button>
                            <Button className="gap-2 flex-1 bg-green-600 text-white hover:bg-green-700 hover:text-white" onClick={() => toast.success("Exported attendance report")}>
                                <IconFileTypeXls className="size-4" />
                                Excel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                data={attendanceData}
                columns={columns}
                showActions={false}
                showTabs={true}
            />
        </div>
    )
}
