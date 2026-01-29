"use client"

import * as React from "react"
import {
    IconMoonStars,
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

type NightBillRecord = {
    id: number
    employeeId: string
    employeeName: string
    department: string
    date: string
    shift: string
    inTime: string
    outTime: string
    nightHours: string
    amount: number
    status: "Approved" | "Pending" | "Rejected"
}

// --- Mock Data ---

const nightBillData: NightBillRecord[] = [
    {
        id: 1,
        employeeId: "EMP005",
        employeeName: "Chris Wilson",
        department: "Engineering",
        date: "2026-01-28",
        shift: "Night Shift",
        inTime: "08:00 PM",
        outTime: "04:00 AM",
        nightHours: "8h",
        amount: 500,
        status: "Approved",
    },
    {
        id: 2,
        employeeId: "EMP008",
        employeeName: "Sarah Connor",
        department: "Security",
        date: "2026-01-28",
        shift: "Night Shift",
        inTime: "09:00 PM",
        outTime: "05:00 AM",
        nightHours: "8h",
        amount: 500,
        status: "Pending",
    },
    {
        id: 3,
        employeeId: "EMP012",
        employeeName: "Robert Paulson",
        department: "Support",
        date: "2026-01-27",
        shift: "C Shift",
        inTime: "06:00 PM",
        outTime: "02:00 AM",
        nightHours: "4h",
        amount: 250,
        status: "Approved",
    },
    {
        id: 4,
        employeeId: "EMP015",
        employeeName: "Jessica Jones",
        department: "Engineering",
        date: "2026-01-27",
        shift: "Night Shift",
        inTime: "08:00 PM",
        outTime: "04:00 AM",
        nightHours: "8h",
        amount: 500,
        status: "Rejected",
    },
]

// --- Columns ---

const columns: ColumnDef<NightBillRecord>[] = [
    {
        accessorKey: "employeeId",
        header: "Employee ID",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("employeeId")}</span>,
    },
    {
        accessorKey: "employeeName",
        header: "Name",
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
        accessorKey: "shift",
        header: "Shift",
    },
    {
        accessorKey: "inTime",
        header: "In Time",
        cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.getValue("inTime")}</span>,
    },
    {
        accessorKey: "outTime",
        header: "Out Time",
        cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.getValue("outTime")}</span>,
    },
    {
        accessorKey: "nightHours",
        header: "Night Hrs",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("nightHours")}</span>,
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <span className="font-bold text-green-600">৳{row.getValue("amount")}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let className = ""

            switch (status) {
                case "Approved":
                    variant = "default"
                    className = "bg-green-100 text-green-700 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400"
                    break
                case "Pending":
                    variant = "secondary"
                    className = "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none dark:bg-yellow-900/30 dark:text-yellow-400"
                    break
                case "Rejected":
                    variant = "destructive"
                    break
            }

            return <Badge variant={variant} className={className}>{status}</Badge>
        },
    },
]

export default function NightBillPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconMoonStars className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Night Bill Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Track and manage night shift allowances and bills.
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
                            <Label>Date Range</Label>
                            <Calendar23 />
                        </div>

                        <div className="grid gap-2">
                            <Label>Department</Label>
                            <NativeSelect defaultValue="all">
                                <option value="all">All Departments</option>
                                <option value="eng">Engineering</option>
                                <option value="hr">Human Resources</option>
                                <option value="support">Support</option>
                                <option value="security">Security</option>
                            </NativeSelect>
                        </div>

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <NativeSelect defaultValue="all">
                                <option value="all">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </NativeSelect>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-2 flex-1">
                                <IconFilter className="size-4" />
                                Filter
                            </Button>
                            <Button className="gap-2 flex-1 bg-green-600 text-white hover:bg-green-700 hover:text-white" onClick={() => toast.success("Exported night bill report")}>
                                <IconFileTypeXls className="size-4" />
                                Excel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                data={nightBillData}
                columns={columns}
                showActions={true}
                showTabs={true}
                addLabel="Add Record"
                onAddClick={() => toast.info("Add Night Bill Record")}
                onEditClick={(row) => toast.info(`Edit ${row.employeeName}'s record`)}
                onDelete={(row) => toast.success("Record deleted")}
            />
        </div>
    )
}
