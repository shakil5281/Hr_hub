"use client"

import * as React from "react"
import {
    IconFileAnalytics,
    IconDownload,
    IconFilter,
    IconLoader,
    IconCalendarMonth,
    IconPrinter
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { leaveService } from "@/lib/services/leave"
import { toast } from "sonner"

const MONTHS = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 }
]

export default function MonthlyLeaveReportPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [reportData, setReportData] = React.useState<any[]>([])

    const loadReport = async () => {
        setIsLoading(true)
        try {
            const data = await leaveService.getMonthlyReport({ year, month })
            setReportData(data)
        } catch (error) {
            toast.error("Failed to generate leave report")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        loadReport()
    }, [])

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <span className="font-black text-xs">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{row.original.department}</span>
                </div>
            )
        },
        {
            accessorKey: "sickLeave",
            header: "Sick",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.sickLeave || 0}</span>
        },
        {
            accessorKey: "casualLeave",
            header: "Casual",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.casualLeave || 0}</span>
        },
        {
            accessorKey: "earnedLeave",
            header: "Earned",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.earnedLeave || 0}</span>
        },
        {
            accessorKey: "otherLeave",
            header: "Other",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.otherLeave || 0}</span>
        },
        {
            accessorKey: "totalDays",
            header: "Total Taken",
            cell: ({ row }) => <Badge className="bg-slate-900 text-white border-none">{row.original.totalDays} Days</Badge>
        }
    ]

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                        <IconFileAnalytics className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900">Monthly Leave Insight</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Aggregated Leave Utilization Report</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full h-10 px-6 gap-2 border-2">
                        <IconDownload className="size-4" /> Export CSV
                    </Button>
                    <Button variant="outline" className="rounded-full h-10 px-6 gap-2 border-2">
                        <IconPrinter className="size-4" /> Print Report
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b pb-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <IconFilter className="size-4 text-slate-400" />
                        Report Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-1">Report Month</label>
                            <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-12 rounded-2xl border-2 font-bold">
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-1">Fiscal Year</label>
                            <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-12 rounded-2xl border-2 font-bold">
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </NativeSelect>
                        </div>
                        <Button
                            className="h-12 rounded-full font-black bg-slate-900 text-white gap-2 w-full md:w-auto"
                            onClick={loadReport}
                            disabled={isLoading}
                        >
                            {isLoading ? <IconLoader className="size-5 animate-spin" /> : <IconCalendarMonth className="size-5" />}
                            Generate Analysis
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Report Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="border-b flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle className="text-base font-black text-slate-900">Summary Ledger</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase">Activity for {MONTHS.find(m => m.value === month)?.label} {year}</CardDescription>
                    </div>
                    <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-1.5 font-bold">
                        {reportData.length} Employees with Leaves
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={reportData}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
