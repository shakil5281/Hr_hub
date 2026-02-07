"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconChartBar,
    IconSearch,
    IconDownload,
    IconRefresh,
    IconActivity,
    IconClock,
    IconArrowLeft,
    IconUsers
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { overtimeService, type DailyOTSummary } from "@/lib/services/overtime"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function DailyOTSummaryPage() {
    const router = useRouter()
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [isLoading, setIsLoading] = React.useState(false)
    const [summaryData, setSummaryData] = React.useState<DailyOTSummary[]>([])
    const [grandTotal, setGrandTotal] = React.useState(0)
    const [totalEmployees, setTotalEmployees] = React.useState(0)
    const [hasSearched, setHasSearched] = React.useState(false)

    const columns: ColumnDef<DailyOTSummary>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-left font-medium">{row.index + 1}</div>,
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => (
                <div className="font-semibold text-sm text-gray-900">{row.original.department}</div>
            )
        },
        {
            accessorKey: "employeeCount",
            header: "Employee Count",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium bg-gray-50 text-gray-700">
                    {row.original.employeeCount} Personnel
                </Badge>
            )
        },
        {
            accessorKey: "totalOTHours",
            header: "Total OT Hours",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                            {row.original.totalOTHours.toFixed(1)} <span className="text-xs font-normal text-gray-500">hrs</span>
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                            {grandTotal > 0 ? ((row.original.totalOTHours / grandTotal) * 100).toFixed(1) : "0.0"}%
                        </span>
                    </div>
                    <Progress value={grandTotal > 0 ? (row.original.totalOTHours / grandTotal) * 100 : 0} className="h-1.5" />
                </div>
            )
        },
        {
            accessorKey: "averageOTPerEmployee",
            header: "Avg OT / Person",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-900">
                    {row.original.averageOTPerEmployee.toFixed(2)} <span className="text-xs text-gray-500 font-normal">hrs</span>
                </span>
            )
        }
    ]

    const handleSearch = async () => {
        if (!date) {
            toast.error("Date required")
            return
        }

        setIsLoading(true)
        try {
            const data = await overtimeService.getDailyOTSummary(format(date, "yyyy-MM-dd"))
            setSummaryData(data.departmentSummaries)
            setGrandTotal(data.grandTotalOTHours)
            setTotalEmployees(data.totalEmployees)
            setHasSearched(true)
        } catch (error: any) {
            toast.error("Analysis failed")
        } finally {
            setIsLoading(false)
        }
    }

    const avgOTPerEmployee = totalEmployees > 0 ? (grandTotal / totalEmployees).toFixed(2) : "0.00"

    return (
        <div className="flex flex-col gap-6 p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-md">
                        <IconArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Daily OT Summary</h1>
                        <p className="text-sm text-gray-500">Department-wise overtime distribution and trends</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" disabled={summaryData.length === 0}>
                        <IconDownload className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="border shadow-none">
                    <CardHeader className="bg-gray-50 border-b py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <IconSearch size={18} />
                            Search Parameters
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-gray-400">Analysis Date</Label>
                                <DatePicker date={date} setDate={setDate} className="w-full" />
                            </div>
                            <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto px-10">
                                {isLoading ? <IconRefresh className="mr-2 h-4 w-4 animate-spin" /> : <IconActivity className="mr-2 h-4 w-4" />}
                                Analyze Distribution
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {hasSearched && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grand Total OT</p>
                                <h3 className="text-2xl font-bold mt-1 text-primary">{grandTotal.toFixed(1)} hrs</h3>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Employees</p>
                                <h3 className="text-2xl font-bold mt-1">{totalEmployees}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg OT / Person</p>
                                <h3 className="text-2xl font-bold mt-1">{avgOTPerEmployee} hrs</h3>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Departments</p>
                                <h3 className="text-2xl font-bold mt-1">{summaryData.length}</h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {hasSearched ? (
                    <Card className="border shadow-none overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">Department Distribution</CardTitle>
                                <Badge variant="outline" className="font-medium bg-white">
                                    Summary Generated
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={columns} data={summaryData} showColumnCustomizer={false} showActions={false} showTabs={false} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-gray-50 text-gray-400">
                        <IconChartBar size={48} stroke={1.5} />
                        <p className="mt-4 font-medium">Select a date and click 'Analyze' to view departmental breakdown</p>
                    </div>
                )}
            </div>
        </div>
    )
}
