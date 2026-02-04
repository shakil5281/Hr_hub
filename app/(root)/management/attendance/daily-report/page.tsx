"use client"

import * as React from "react"
import {
    IconFingerprint,
    IconSearch,
    IconDownload,
    IconCalendarEvent,
    IconUsers,
    IconUserCheck,
    IconUserX,
    IconClockStop,
    IconLoader,
    IconDatabaseImport,
    IconFileTypeXls,
    IconFileDescription,
    IconChevronDown,
    IconFileTypePdf
} from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { attendanceService, type AttendanceRecord, type AttendanceSummary } from "@/lib/services/attendance"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

export default function DailyAttendanceReportPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [records, setRecords] = React.useState<AttendanceRecord[]>([])
    const [summary, setSummary] = React.useState<AttendanceSummary | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [departments, setDepartments] = React.useState<any[]>([])

    // Filters
    const [deptFilter, setDeptFilter] = React.useState("all")
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [search, setSearch] = React.useState("")

    const fetchData = React.useCallback(async () => {
        if (!date) return
        setIsLoading(true)
        try {
            const formattedDate = format(date, "yyyy-MM-dd")
            const [reportData, summaryData] = await Promise.all([
                attendanceService.getDailyReport({
                    date: formattedDate,
                    departmentId: deptFilter !== "all" ? parseInt(deptFilter) : undefined,
                    status: statusFilter,
                    searchTerm: search
                }),
                attendanceService.getSummary(formattedDate)
            ])
            setRecords(reportData)
            setSummary(summaryData)
        } catch (error) {
            toast.error("Failed to fetch attendance data")
        } finally {
            setIsLoading(false)
        }
    }, [date, deptFilter, statusFilter, search])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments)
    }, [])

    const handleSeedMock = async () => {
        if (!date) return
        try {
            const formattedDate = format(date, "yyyy-MM-dd")
            await attendanceService.seedMock(formattedDate)
            toast.success("Mock data seeded successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to seed mock data")
        }
    }

    const handleExportExcel = async () => {
        if (!date) return
        try {
            await attendanceService.exportDailyReportExcel({
                date: format(date, "yyyy-MM-dd"),
                departmentId: deptFilter !== "all" ? parseInt(deptFilter) : undefined,
                status: statusFilter,
                searchTerm: search
            })
            toast.success("Excel report exported successfully")
        } catch (error) {
            toast.error("Failed to export Excel report")
        }
    }

    const handleExportPdf = async () => {
        if (!date) return
        try {
            await attendanceService.exportDailyReportPdf({
                date: format(date, "yyyy-MM-dd"),
                departmentId: deptFilter !== "all" ? parseInt(deptFilter) : undefined,
                status: statusFilter,
                searchTerm: search
            })
            toast.success("PDF report exported successfully")
        } catch (error) {
            toast.error("Failed to export PDF report")
        }
    }

    const handleExportExcelAll = async () => {
        if (!date) return
        try {
            await attendanceService.exportDailyReportExcel({
                date: format(date, "yyyy-MM-dd"),
            })
            toast.success("Full Excel report exported successfully")
        } catch (error) {
            toast.error("Failed to export full Excel report")
        }
    }

    const columns: ColumnDef<AttendanceRecord>[] = [
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{row.original.employeeIdCard}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-sm">{row.original.department}</span>
        },
        {
            accessorKey: "shift",
            header: "Shift",
            cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.original.shift}</Badge>
        },
        {
            accessorKey: "inTime",
            header: "In Time",
            cell: ({ row }) => <span className="text-sm font-mono">{row.original.inTime || "-"}</span>
        },
        {
            accessorKey: "outTime",
            header: "Out Time",
            cell: ({ row }) => <span className="text-sm font-mono">{row.original.outTime || "-"}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge className={cn(
                        "font-medium",
                        status === "Present" && "bg-green-500/10 text-green-600 border-green-500/20",
                        status === "Late" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                        status === "Absent" && "bg-red-500/10 text-red-600 border-red-500/20",
                        status === "On Leave" && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                        status === "Off Day" && "bg-slate-500/10 text-slate-600 border-slate-500/20",
                    )}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "otHours",
            header: "OT (Hrs)",
            cell: ({ row }) => <span className="text-sm font-semibold">{row.original.otHours}</span>
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 bg-muted/20 min-h-screen px-4 lg:px-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-500/20">
                        <IconFingerprint className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daily Attendance Report</h1>
                        <p className="text-sm text-muted-foreground">Comprehensive daily log of employee attendance and movements.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 shadow-sm rounded-xl border-amber-500/20 text-amber-600 hover:bg-amber-50"
                        onClick={handleSeedMock}
                    >
                        <IconDatabaseImport className="size-4" />
                        Seed Mock
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                size="sm"
                                className="gap-2 shadow-lg rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <IconDownload className="size-4" />
                                Export
                                <IconChevronDown className="size-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-indigo-100">
                            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Export Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleExportPdf} className="gap-2 py-2.5 cursor-pointer">
                                <IconFileTypePdf className="size-4 text-red-500" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Download PDF</span>
                                    <span className="text-[10px] text-muted-foreground">Filtered report layout</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportExcelAll} className="gap-2 py-2.5 cursor-pointer">
                                <IconFileTypeXls className="size-4 text-green-600" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Download Excel</span>
                                    <span className="text-[10px] text-muted-foreground">Full data for the date</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportExcel} className="gap-2 py-2.5 cursor-pointer">
                                <IconDownload className="size-4 text-indigo-500" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Excel (Filtered)</span>
                                    <span className="text-[10px] text-muted-foreground">Current view only</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Headcount</CardDescription>
                        <IconUsers className="size-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.totalHeadcount ?? 0}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Across all departments</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider">Present Today</CardDescription>
                        <IconUserCheck className="size-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{summary?.presentCount ?? 0}</div>
                        <p className="text-[10px] text-green-600/70 font-medium mt-1">{summary?.attendanceRate ?? 0}% Attendance rate</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider">Absent / Leave</CardDescription>
                        <IconUserX className="size-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{summary?.absentCount ?? 0}</div>
                        <p className="text-[10px] text-red-600/70 font-medium mt-1">{summary?.absentCount ?? 0} Absent • {summary?.leaveCount ?? 0} Leave</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider">Late Arrivals</CardDescription>
                        <IconClockStop className="size-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{summary?.lateCount ?? 0}</div>
                        <p className="text-[10px] text-amber-600/70 font-medium mt-1">Requires supervisor follow-up</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-indigo-500/30 w-full" />
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Report Date</Label>
                            <DatePicker
                                date={date}
                                setDate={setDate}
                                className="h-10 border-none bg-muted/40"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Department</Label>
                            <NativeSelect
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                                className="h-10 border-none bg-muted/40"
                            >
                                <option value="all">All Departments</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                            </NativeSelect>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Status</Label>
                            <NativeSelect
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 border-none bg-muted/40"
                            >
                                <option value="all">Every Status</option>
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                                <option value="On Leave">On Leave</option>
                            </NativeSelect>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Search Employee</Label>
                            <div className="relative">
                                <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Name or ID..."
                                    className="pl-9 h-10 border-none bg-muted/40 focus-visible:ring-1"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <IconLoader className="size-8 animate-spin text-indigo-500" />
                            <p className="text-sm text-muted-foreground animate-pulse font-medium">Crunching attendance data...</p>
                        </div>
                    ) : (
                        <DataTable
                            data={records}
                            columns={columns}
                            showActions={false}
                            showTabs={false}
                            searchKey="employeeName"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
