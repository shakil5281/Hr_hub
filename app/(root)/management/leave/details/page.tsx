"use client"

import * as React from "react"
import {
    IconUserCircle,
    IconSearch,
    IconLoader,
    IconHistory,
    IconCalendar,
    IconBuilding,
    IconId
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { leaveService, type LeaveBalance, type LeaveApplication } from "@/lib/services/leave"
import { employeeService } from "@/lib/services/employee"
import { toast } from "sonner"
import { format } from "date-fns"

export default function LeaveDetailsPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [employee, setEmployee] = React.useState<any>(null)
    const [balances, setBalances] = React.useState<LeaveBalance[]>([])
    const [history, setHistory] = React.useState<LeaveApplication[]>([])

    const handleSearch = async () => {
        if (!searchTerm) return
        setIsLoading(true)
        try {
            // Find employee by ID Card or Name
            const employees = await employeeService.searchEmployees(searchTerm.trim())
            if (employees.length === 0) {
                toast.error("Employee not found")
                setEmployee(null)
            } else {
                const emp = employees[0]
                setEmployee(emp)

                // Fetch balance and history
                const [balData, histData] = await Promise.all([
                    leaveService.getBalance(emp.id),
                    leaveService.getApplications({ employeeId: emp.id })
                ])
                setBalances(balData)
                setHistory(histData)
            }
        } catch (error) {
            toast.error("Failed to fetch employee details")
        } finally {
            setIsLoading(false)
        }
    }
    const columns: ColumnDef<LeaveApplication>[] = [
        {
            accessorKey: "leaveTypeName",
            header: "Leave Type",
            cell: ({ row }) => (
                <button
                    onClick={() => window.location.href = `/management/leave/application/${row.original.id}`}
                    className="font-medium hover:underline text-primary text-left"
                >
                    <Badge variant="secondary" className="font-normal cursor-pointer">{row.original.leaveTypeName}</Badge>
                </button>
            )
        },
        {
            accessorKey: "startDate",
            header: "Duration",
            cell: ({ row }) => (
                <div className="text-xs">
                    {format(new Date(row.original.startDate), "dd MMM")} - {format(new Date(row.original.endDate), "dd MMM yyyy")}
                    <span className="ml-2 text-muted-foreground">({row.original.totalDays} days)</span>
                </div>
            )
        },
        {
            accessorKey: "appliedDate",
            header: "Applied On",
            cell: ({ row }) => <span className="text-xs">{format(new Date(row.original.appliedDate), "dd MMM yyyy")}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                const variant = status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"
                return <Badge variant={variant} className="font-normal text-xs">{status}</Badge>
            }
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leave Ledger</h1>
                    <p className="text-sm text-muted-foreground">View employee leave balance and history</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-[400px]">
                    <Input
                        placeholder="Search by ID or Name..."
                        className="h-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                        size="sm"
                        className="h-9"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                    </Button>
                </div>
            </div>

            {employee ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
                    {/* Employee Profile Card */}
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-base font-semibold">Employee Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-center mb-6">
                                <div className="h-20 w-20 mx-auto bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-3">
                                    <IconUserCircle className="size-10" />
                                </div>
                                <h2 className="text-lg font-bold">{employee.fullNameEn}</h2>
                                <p className="text-sm text-muted-foreground">{employee.designation?.nameEn}</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <ProfileItem label="Employee ID" value={employee.employeeId} icon={IconId} />
                                <ProfileItem label="Department" value={employee.department?.nameEn} icon={IconBuilding} />
                                <ProfileItem label="Joining Date" value={format(new Date(employee.joinDate), "dd MMM yyyy")} icon={IconCalendar} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balances & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {balances.map(b => (
                                <Card key={b.leaveTypeId}>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-medium text-muted-foreground">{b.leaveTypeName}</p>
                                            <Badge variant="secondary" className="font-normal">{b.balance} Left</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                <span>{b.totalTaken} Taken</span>
                                                <span>{b.totalAllocated} Allocated</span>
                                            </div>
                                            <Progress value={(b.totalTaken / b.totalAllocated) * 100} className="h-1.5" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* History Table */}
                        <Card>
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <IconHistory className="size-4 opacity-70" />
                                    Application History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <DataTable
                                    columns={columns}
                                    data={history}
                                    showColumnCustomizer={false}
                                    searchKey="leaveTypeName"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4 border mx-6 rounded-lg border-dashed bg-muted/10">
                    <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center">
                        <IconSearch className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold">No Employee Selected</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mt-1">Search for an employee above to view their leave balance and application history.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function ProfileItem({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground">
                <Icon className="size-4" />
            </div>
            <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    )
}
