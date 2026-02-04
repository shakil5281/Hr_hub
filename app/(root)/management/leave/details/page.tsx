"use client"

import * as React from "react"
import {
    IconUserCircle,
    IconSearch,
    IconLoader,
    IconChartBar,
    IconHistory,
    IconCalendarCheck,
    IconClock
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
            cell: ({ row }) => <Badge variant="secondary" className="font-bold">{row.original.leaveTypeName}</Badge>
        },
        {
            accessorKey: "startDate",
            header: "Duration",
            cell: ({ row }) => (
                <div className="text-[10px] font-medium">
                    {format(new Date(row.original.startDate), "dd MMM")} - {format(new Date(row.original.endDate), "dd MMM yyyy")}
                    <span className="ml-2 text-emerald-600">({row.original.totalDays} days)</span>
                </div>
            )
        },
        {
            accessorKey: "appliedDate",
            header: "Applied On",
            cell: ({ row }) => format(new Date(row.original.appliedDate), "dd MMM yyyy")
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                const variant = status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"
                return <Badge variant={variant} className="text-[10px] font-black uppercase">{status}</Badge>
            }
        }
    ]

    return (
        <div className="p-6 space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-700">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                        <IconUserCircle className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900">Leave Ledger</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Employee Balance & History</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full md:w-[400px]">
                    <Input
                        placeholder="Search by ID or Name..."
                        className="h-10 border-none bg-transparent focus-visible:ring-0 font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-slate-900"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                    </Button>
                </div>
            </div>

            {employee ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Employee Profile Card */}
                    <Card className="lg:col-span-1 border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                        <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800" />
                        <CardContent className="relative pt-0">
                            <div className="absolute -top-10 left-6 h-20 w-20 rounded-2xl bg-white p-1 shadow-xl">
                                <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center">
                                    <IconUserCircle className="size-10 text-slate-400" />
                                </div>
                            </div>
                            <div className="pt-12 pb-6 px-6">
                                <h2 className="text-xl font-black text-slate-900">{employee.fullNameEn}</h2>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{employee.designation?.nameEn}</p>

                                <div className="mt-8 space-y-4">
                                    <ProfileItem label="Employee ID" value={employee.employeeId} icon={IconClock} />
                                    <ProfileItem label="Department" value={employee.department?.nameEn} icon={IconCalendarCheck} />
                                    <ProfileItem label="Joining Date" value={format(new Date(employee.joinDate), "dd MMM yyyy")} icon={IconCalendarCheck} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balances & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {balances.map(b => (
                                <Card key={b.leaveTypeId} className="border-none shadow-lg bg-white rounded-2xl">
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{b.leaveTypeName}</p>
                                            <Badge className="bg-slate-100 text-slate-900 border-none">{b.balance} Left</Badge>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-black">
                                                <span>{b.totalTaken} Taken</span>
                                                <span>{b.totalAllocated} Total</span>
                                            </div>
                                            <Progress value={(b.totalTaken / b.totalAllocated) * 100} className="h-2 bg-slate-100" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* History Table */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <IconHistory className="size-4" />
                                    Application Trail
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
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <IconChartBar className="size-10 text-slate-200" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">No Data Selected</h3>
                        <p className="text-xs text-muted-foreground max-w-xs">Search for an employee above to view their leave balance and historical journey.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function ProfileItem({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon className="size-4 text-slate-400" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{label}</p>
                <p className="text-xs font-bold text-slate-900">{value}</p>
            </div>
        </div>
    )
}
