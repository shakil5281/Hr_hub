"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    IconUserCircle,
    IconSearch,
    IconFilter,
    IconPlus,
    IconCircleCheckFilled,
    IconLoader,
    IconClock
} from "@tabler/icons-react"
import { type ColumnDef } from "@tanstack/react-table"
import employeeData from "./employee-data.json"

interface Employee {
    id: number
    employeeId: string
    name: string
    designation: string
    department: string
    email: string
    joinDate: string
    status: string
}

const employeeColumns: ColumnDef<Employee>[] = [
    {
        accessorKey: "employeeId",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.employeeId}</span>,
    },
    {
        accessorKey: "name",
        header: "Employee Name",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-normal">
                {row.original.department}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit font-normal">
                    {status === "Active" ? (
                        <IconCircleCheckFilled className="size-3.5 text-green-500" />
                    ) : status === "On Leave" ? (
                        <IconClock className="size-3.5 text-amber-500" />
                    ) : (
                        <IconLoader className="size-3.5 text-muted-foreground animate-spin-slow" />
                    )}
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "joinDate",
        header: "Join Date",
    },
]

export default function EmployeeInfoPage() {
    const router = useRouter()
    const [statusFilter, setStatusFilter] = React.useState("All")
    const [deptFilter, setDeptFilter] = React.useState("All")

    const filteredData = React.useMemo(() => {
        return employeeData.filter((emp) => {
            const statusMatch = statusFilter === "All" || emp.status === statusFilter
            const deptMatch = deptFilter === "All" || emp.department === deptFilter
            return statusMatch && deptMatch
        })
    }, [statusFilter, deptFilter])

    const departments = Array.from(new Set(employeeData.map(emp => emp.department)))

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <IconUserCircle className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Employee Information</h1>
                </div>
                <Button className="w-fit" onClick={() => router.push("/human-resource/employee-info/create")}>
                    <IconPlus className="mr-2 size-4" />
                    New Employee
                </Button>
            </div>

            <div className="px-4 lg:px-6">
                <Card className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <IconFilter className="size-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col gap-1.5 w-full sm:w-48">
                                <Label htmlFor="dept-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Department</Label>
                                <NativeSelect
                                    id="dept-filter"
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                >
                                    <option value="All">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </NativeSelect>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full sm:w-48">
                                <Label htmlFor="status-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
                                <NativeSelect
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Inactive">Inactive</option>
                                </NativeSelect>
                            </div>
                            <div className="flex items-end mt-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={() => {
                                        setStatusFilter("All")
                                        setDeptFilter("All")
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                data={filteredData as Employee[]}
                columns={employeeColumns}
                showTabs={false}
                addLabel="New Employee"
                onAddClick={() => router.push("/human-resource/employee-info/create")}
                onEditClick={(emp) => router.push(`/human-resource/employee-info/edit/${emp.id}`)}
            />
        </div>
    )
}
