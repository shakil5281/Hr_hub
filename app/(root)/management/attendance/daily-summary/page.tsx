"use client"

import * as React from "react"
import {
    IconListCheck,
    IconUsers,
    IconUserCheck,
    IconUserOff,
    IconClock,
    IconCalendarEvent,
    IconLoader,
    IconDownload,
    IconFilter,
    IconBuildingCommunity,
    IconBox,
    IconIdBadge2,
    IconLayoutList,
    IconUsersGroup,
    IconChevronDown,
    IconFileTypePdf,
    IconFileTypeXls
} from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { SummaryCard } from "@/components/summary-card"
import { attendanceService, type DepartmentDailySummary, type DailySummaryResponse } from "@/lib/services/attendance"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const chartData = [
    { value: 40 }, { value: 45 }, { value: 42 }, { value: 48 },
    { value: 46 }, { value: 50 }, { value: 48 }, { value: 52 }
]

export default function DailySummaryPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [summaryData, setSummaryData] = React.useState<DailySummaryResponse | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [departments, setDepartments] = React.useState<any[]>([])
    const [deptFilter, setDeptFilter] = React.useState("all")

    const fetchData = React.useCallback(async () => {
        if (!date) return
        setIsLoading(true)
        try {
            const data = await attendanceService.getDailySummary({
                date: format(date, "yyyy-MM-dd"),
                departmentId: deptFilter !== "all" ? parseInt(deptFilter) : undefined
            })
            setSummaryData(data)
        } catch (error) {
            toast.error("Failed to fetch daily summary data")
        } finally {
            setIsLoading(false)
        }
    }, [date, deptFilter])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments)
    }, [])

    const handleExportExcel = async () => {
        if (!date) return
        try {
            await attendanceService.exportDailySummaryExcel({
                date: format(date, "yyyy-MM-dd"),
                departmentId: deptFilter !== "all" ? parseInt(deptFilter) : undefined
            })
            toast.success("Excel exported successfully")
        } catch (error) {
            toast.error("Failed to export Excel")
        }
    }

    const handleExportPdf = async () => {
        if (!date) return
        try {
            await attendanceService.exportDailySummaryPdf({
                date: format(date, "yyyy-MM-dd"),
                departmentId: deptFilter !== "all" ? parseInt(deptFilter) : undefined
            })
            toast.success("PDF exported successfully")
        } catch (error) {
            toast.error("Failed to export PDF")
        }
    }

    const handleExportExcelAll = async () => {
        if (!date) return
        try {
            await attendanceService.exportDailySummaryExcel({
                date: format(date, "yyyy-MM-dd")
            })
            toast.success("Full Excel exported successfully")
        } catch (error) {
            toast.error("Failed to export full Excel")
        }
    }

    const getColumns = (title: string, accessorKey: string): ColumnDef<any>[] => [
        {
            accessorKey: accessorKey,
            header: title,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-indigo-500" />
                    <span className="font-semibold text-sm">{row.original[accessorKey]}</span>
                </div>
            )
        },
        {
            accessorKey: "totalEmployees",
            header: "Total Employees",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-semibold">
                    {row.original.totalEmployees}
                </Badge>
            )
        },
        {
            accessorKey: "present",
            header: "Present",
            cell: ({ row }) => (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-semibold">
                    {row.original.present}
                </Badge>
            )
        },
        {
            accessorKey: "absent",
            header: "Absent",
            cell: ({ row }) => (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 font-semibold">
                    {row.original.absent}
                </Badge>
            )
        },
        {
            accessorKey: "late",
            header: "Late",
            cell: ({ row }) => (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold">
                    {row.original.late}
                </Badge>
            )
        },
        {
            accessorKey: "onLeave",
            header: "On Leave",
            cell: ({ row }) => (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-semibold">
                    {row.original.onLeave}
                </Badge>
            )
        },
        {
            accessorKey: "attendanceRate",
            header: "Attendance Rate",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all",
                                row.original.attendanceRate >= 90 ? "bg-green-500" :
                                    row.original.attendanceRate >= 75 ? "bg-amber-500" :
                                        "bg-red-500"
                            )}
                            style={{ width: `${row.original.attendanceRate}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold min-w-[3rem] text-right">
                        {row.original.attendanceRate}%
                    </span>
                </div>
            )
        }
    ]

    const columns = getColumns("Department", "departmentName")

    return (
        <div className="flex flex-col gap-6 py-6 bg-muted/20 min-h-screen px-4 lg:px-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-primary shadow-sm border border-indigo-500/20">
                        <IconListCheck className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daily Summary</h1>
                        <p className="text-sm text-muted-foreground">Comprehensive attendance analysis by department, section, designation, and line.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
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
                            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary Export</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleExportPdf} className="gap-2 py-2.5 cursor-pointer">
                                <IconFileTypePdf className="size-4 text-red-500" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Download PDF</span>
                                    <span className="text-[10px] text-muted-foreground">Professional summary PDF</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportExcelAll} className="gap-2 py-2.5 cursor-pointer">
                                <IconFileTypeXls className="size-4 text-green-600" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Download Excel</span>
                                    <span className="text-[10px] text-muted-foreground">Full workbook results</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportExcel} className="gap-2 py-2.5 cursor-pointer">
                                <IconDownload className="size-4 text-indigo-500" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Excel (Filtered)</span>
                                    <span className="text-[10px] text-muted-foreground">Current department only</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Summary Cards */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <IconLoader className="size-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard
                            title="Total Workforce"
                            value={summaryData?.overallSummary.totalHeadcount.toString() || "0"}
                            icon={IconUsers}
                            status="primary"
                            chartData={chartData}
                        />
                        <SummaryCard
                            title="Present"
                            value={summaryData?.overallSummary.presentCount.toString() || "0"}
                            icon={IconUserCheck}
                            trend={{
                                value: `${summaryData?.overallSummary.attendanceRate || 0}%`,
                                label: "attendance",
                                isUp: true
                            }}
                            status="success"
                            chartData={chartData.map(d => ({ value: d.value * 0.9 }))}
                        />
                        <SummaryCard
                            title="Absent"
                            value={summaryData?.overallSummary.absentCount.toString() || "0"}
                            icon={IconUserOff}
                            trend={{
                                value: `${summaryData?.overallSummary.leaveCount || 0}`,
                                label: "on leave",
                                isUp: false
                            }}
                            status="error"
                            chartData={chartData.map(d => ({ value: d.value * 0.05 + Math.random() * 2 }))}
                        />
                        <SummaryCard
                            title="Late Entry"
                            value={summaryData?.overallSummary.lateCount.toString() || "0"}
                            icon={IconClock}
                            trend={{
                                value: "Needs review",
                                label: "by supervisor",
                                isUp: false
                            }}
                            status="warning"
                            chartData={chartData.map(d => ({ value: d.value * 0.03 + Math.random() * 2 }))}
                        />
                    </div>

                    {/* Filters */}
                    <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm overflow-hidden">
                        <div className="h-1 bg-indigo-500/30 w-full" />
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                                        <IconCalendarEvent className="inline size-3 mr-1" />
                                        Report Date
                                    </Label>
                                    <div className="relative">
                                        <DatePicker
                                            date={date}
                                            setDate={setDate}
                                            className="h-10 border-none bg-muted/40 focus-visible:ring-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                                        <IconFilter className="inline size-3 mr-1" />
                                        Filter by Department
                                    </Label>
                                    <NativeSelect
                                        value={deptFilter}
                                        onChange={(e) => setDeptFilter(e.target.value)}
                                        className="h-10 border-none bg-muted/40"
                                    >
                                        <option value="all">All Departments</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.nameEn}</option>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchData}
                                        className="w-full h-10 gap-2 border-indigo-500/20 text-primary hover:bg-indigo-50"
                                    >
                                        <IconFilter className="size-4" />
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Breakdowns */}
                    <Tabs defaultValue="department" className="w-full space-y-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <TabsList className="">
                                <TabsTrigger
                                    value="department"
                                    className="rounded-xl px-6 py-3 items-center flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    <IconBuildingCommunity className="size-5" />
                                    Department
                                </TabsTrigger>
                                <TabsTrigger
                                    value="section"
                                    className="rounded-xl px-6 py-3 items-center flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    <IconBox className="size-5" />
                                    Section
                                </TabsTrigger>
                                <TabsTrigger
                                    value="designation"
                                    className="rounded-xl px-6 py-3 items-center flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    <IconIdBadge2 className="size-5" />
                                    Designation
                                </TabsTrigger>
                                <TabsTrigger
                                    value="line"
                                    className="rounded-xl px-6 py-3 items-center flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    <IconLayoutList className="size-5" />
                                    Line
                                </TabsTrigger>
                                <TabsTrigger
                                    value="group"
                                    className="rounded-xl px-6 py-3 items-center flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    <IconUsersGroup className="size-5" />
                                    Group
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="department" className="mt-0">
                            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                                <CardHeader className="border-b bg-muted/30">
                                    <CardTitle className="text-lg font-bold">Department-wise Breakdown</CardTitle>
                                    <CardDescription>
                                        Detailed attendance statistics for each department.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <DataTable
                                        columns={columns}
                                        data={summaryData?.departmentSummaries || []}
                                        showColumnCustomizer={false}
                                        showActions={false}
                                        showTabs={false}
                                        searchKey="departmentName"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="section" className="mt-0">
                            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                                <CardHeader className="border-b bg-muted/30">
                                    <CardTitle className="text-lg font-bold">Section-wise Breakdown</CardTitle>
                                    <CardDescription>
                                        Detailed attendance statistics for each section.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <DataTable
                                        columns={getColumns("Section", "sectionName")}
                                        data={summaryData?.sectionSummaries || []}
                                        showColumnCustomizer={false}
                                        showActions={false}
                                        showTabs={false}
                                        searchKey="sectionName"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="designation" className="mt-0">
                            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                                <CardHeader className="border-b bg-muted/30">
                                    <CardTitle className="text-lg font-bold">Designation-wise Breakdown</CardTitle>
                                    <CardDescription>
                                        Detailed attendance statistics for each designation.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <DataTable
                                        columns={getColumns("Designation", "designationName")}
                                        data={summaryData?.designationSummaries || []}
                                        showColumnCustomizer={false}
                                        showActions={false}
                                        showTabs={false}
                                        searchKey="designationName"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="line" className="mt-0">
                            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                                <CardHeader className="border-b bg-muted/30">
                                    <CardTitle className="text-lg font-bold">Line-wise Breakdown</CardTitle>
                                    <CardDescription>
                                        Detailed attendance statistics for each line.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <DataTable
                                        columns={getColumns("Line", "lineName")}
                                        data={summaryData?.lineSummaries || []}
                                        showColumnCustomizer={false}
                                        showActions={false}
                                        showTabs={false}
                                        searchKey="lineName"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="group" className="mt-0">
                            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                                <CardHeader className="border-b bg-muted/30">
                                    <CardTitle className="text-lg font-bold">Group Summary (Department & Section Breakdown)</CardTitle>
                                    <CardDescription>
                                        Detailed attendance statistics by Department and Section.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <DataTable
                                        columns={[
                                            {
                                                accessorKey: "departmentName",
                                                header: ({ column }: { column: any }) => (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                                        className="font-bold text-muted-foreground hover:bg-transparent px-0"
                                                    >
                                                        Department
                                                        <IconFilter className="ml-2 h-4 w-4" />
                                                    </Button>
                                                ),
                                            },
                                            {
                                                accessorKey: "sectionName",
                                                header: ({ column }: { column: any }) => (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                                        className="font-bold text-muted-foreground hover:bg-transparent px-0"
                                                    >
                                                        Section
                                                        <IconFilter className="ml-2 h-4 w-4" />
                                                    </Button>
                                                ),
                                            },
                                            {
                                                accessorKey: "totalEmployees",
                                                header: "Total",
                                                cell: ({ row }: { row: any }) => <span className="font-semibold">{row.getValue("totalEmployees")}</span>
                                            },
                                            {
                                                accessorKey: "present",
                                                header: "Present",
                                                cell: ({ row }: { row: any }) => <span className="text-green-600 font-medium">{row.getValue("present")}</span>
                                            },
                                            {
                                                accessorKey: "absent",
                                                header: "Absent",
                                                cell: ({ row }: { row: any }) => <span className="text-red-600 font-medium">{row.getValue("absent")}</span>
                                            },
                                            {
                                                accessorKey: "late",
                                                header: "Late",
                                                cell: ({ row }: { row: any }) => <span className="text-amber-600 font-medium">{row.getValue("late")}</span>
                                            },
                                            {
                                                accessorKey: "onLeave",
                                                header: "Leave",
                                                cell: ({ row }: { row: any }) => <span className="text-blue-600 font-medium">{row.getValue("onLeave")}</span>
                                            },
                                            {
                                                accessorKey: "attendanceRate",
                                                header: "Rate (%)",
                                                cell: ({ row }: { row: any }) => {
                                                    const rate = parseFloat(row.getValue("attendanceRate"))
                                                    return (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                    style={{ width: `${rate}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium tabular-nums">{rate}%</span>
                                                        </div>
                                                    )
                                                }
                                            }
                                        ]}
                                        data={summaryData?.deptSectionSummaries || []}
                                        showColumnCustomizer={false}
                                        showActions={false}
                                        showTabs={false}
                                        searchKey="departmentName"
                                    />

                                    {/* Footer Section for User's "Worker Sum" and "Staff Sum" */}
                                    <div className="bg-slate-50 border-t p-4 flex flex-wrap justify-end gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground font-medium">Total Worker:</span>
                                            <span className="text-lg font-bold text-indigo-700">
                                                {summaryData?.groupSummaries?.find(g => g.groupName === 'Worker')?.totalEmployees || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground font-medium">Total Staff:</span>
                                            <span className="text-lg font-bold text-indigo-700">
                                                {summaryData?.groupSummaries?.find(g => g.groupName === 'Staff')?.totalEmployees || 0}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    )
}
