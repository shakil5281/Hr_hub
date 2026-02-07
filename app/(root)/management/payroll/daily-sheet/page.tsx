"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconCash,
    IconSearch,
    IconLoader,
    IconDownload,
    IconCalendar,
    IconTrendingUp,
    IconUsers,
    IconAddressBook,
    IconFilter
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { payrollService, type DailySalarySheet } from "@/lib/services/payroll"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

export default function DailySalarySheetPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [departmentId, setDepartmentId] = React.useState("all")
    const [searchTerm, setSearchTerm] = React.useState("")

    const [isLoading, setIsLoading] = React.useState(false)
    const [records, setRecords] = React.useState<DailySalarySheet[]>([])
    const [departments, setDepartments] = React.useState<any[]>([])
    const [hasSearched, setHasSearched] = React.useState(false)

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments)
        handleSearch()
    }, [])

    const handleSearch = async () => {
        if (!date) return
        setIsLoading(true)
        try {
            const data = await payrollService.getDailySheet({
                date: format(date, "yyyy-MM-dd"),
                departmentId: departmentId === "all" ? undefined : parseInt(departmentId),
                searchTerm: searchTerm.trim() || undefined
            })
            setRecords(data)
            setHasSearched(true)
        } catch (error) {
            toast.error("Failed to load daily salary data")
        } finally {
            setIsLoading(false)
        }
    }

    const columns: ColumnDef<DailySalarySheet>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <span className="font-medium">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.employeeName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.department}</span>
                </div>
            )
        },
        {
            accessorKey: "perDaySalary",
            header: "Daily Base",
            cell: ({ row }) => <span className="text-xs font-medium">৳{row.original.perDaySalary.toLocaleString()}</span>
        },
        {
            accessorKey: "attendanceStatus",
            header: "Status",
            cell: ({ row }) => {
                const isPresent = row.original.attendanceStatus === "Present"
                return (
                    <Badge variant={isPresent ? "secondary" : "destructive"} className="font-normal text-xs">
                        {row.original.attendanceStatus}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "otAmount",
            header: "OT Pay",
            cell: ({ row }) => (
                <div className="flex flex-col text-xs">
                    <span className="font-medium">৳{row.original.otAmount.toLocaleString()}</span>
                    <span className="text-muted-foreground text-[10px]">{row.original.otHours}h</span>
                </div>
            )
        },
        {
            accessorKey: "deduction",
            header: "Deduction",
            cell: ({ row }) => <span className="text-xs font-medium text-rose-600">-৳{row.original.deduction.toLocaleString()}</span>
        },
        {
            accessorKey: "netPayable",
            header: "Days Payable",
            cell: ({ row }) => <span className="font-bold text-emerald-700">৳{row.original.netPayable.toLocaleString()}</span>
        }
    ]

    const totalPayable = records.reduce((sum, r) => sum + r.netPayable, 0)

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-1 px-6">
                <h1 className="text-2xl font-bold tracking-tight">Daily Salary Sheet</h1>
                <p className="text-muted-foreground text-sm">View daily prorated earnings and attendance impact</p>
            </div>

            {/* Metrics */}
            {hasSearched && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                    <KPICard title="Total Payable" value={`৳${totalPayable.toLocaleString()}`} icon={IconTrendingUp} />
                    <KPICard title="Active Employees" value={records.length.toString()} icon={IconUsers} />
                    <KPICard title="Date" value={date ? format(date, "dd MMM yyyy") : "-"} icon={IconCalendar} />
                </div>
            )}

            {/* Filters */}
            <div className="px-6">
                <Card className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <IconFilter className="size-4 opacity-70" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Date</Label>
                                <DatePicker date={date} setDate={setDate} className="h-9 w-full" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Department</Label>
                                <NativeSelect value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="h-9">
                                    <option value="all">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Search</Label>
                                <Input
                                    placeholder="Search by ID or Name"
                                    className="h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                className="h-9 gap-2 w-full"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                                Search Records
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="px-6">
                <Card>
                    <DataTable
                        columns={columns}
                        data={records}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                    />
                </Card>
            </div>
        </div>
    )
}

function KPICard({ title, value, icon: Icon }: any) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="size-5" />
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-xl font-bold">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
