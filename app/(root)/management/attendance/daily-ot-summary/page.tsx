"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconChartBar,
    IconSearch,
    IconCalendar,
    IconDownload,
    IconLoader,
    IconTrendingUp
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { overtimeService, type DailyOTSummary } from "@/lib/services/overtime"
import { toast } from "sonner"

export default function DailyOTSummaryPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [isLoading, setIsLoading] = React.useState(false)
    const [summaryData, setSummaryData] = React.useState<DailyOTSummary[]>([])
    const [grandTotal, setGrandTotal] = React.useState(0)
    const [totalEmployees, setTotalEmployees] = React.useState(0)
    const [hasSearched, setHasSearched] = React.useState(false)

    const columns: ColumnDef<DailyOTSummary>[] = [
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => (
                <div className="font-bold text-sm">{row.original.department}</div>
            )
        },
        {
            accessorKey: "employeeCount",
            header: "Employees",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-xs font-bold">
                    {row.original.employeeCount} Emp
                </Badge>
            )
        },
        {
            accessorKey: "totalRegularHours",
            header: "Regular Hours",
            cell: ({ row }) => (
                <span className="text-xs font-medium text-muted-foreground">
                    {row.original.totalRegularHours.toFixed(1)} hrs
                </span>
            )
        },
        {
            accessorKey: "totalOTHours",
            header: "Total OT Hours",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-blue-600">
                        {row.original.totalOTHours.toFixed(1)} hrs
                    </span>
                    <Progress
                        value={(row.original.totalOTHours / grandTotal) * 100}
                        className="h-1 w-32"
                    />
                </div>
            )
        },
        {
            accessorKey: "averageOTPerEmployee",
            header: "Avg OT/Employee",
            cell: ({ row }) => (
                <Badge className="bg-emerald-500 text-white text-xs font-bold">
                    {row.original.averageOTPerEmployee.toFixed(2)} hrs
                </Badge>
            )
        },
        {
            id: "percentage",
            header: "% of Total OT",
            cell: ({ row }) => {
                const percentage = ((row.original.totalOTHours / grandTotal) * 100).toFixed(1)
                return (
                    <div className="flex items-center gap-2">
                        <IconTrendingUp className="size-4 text-blue-500" />
                        <span className="text-xs font-bold">{percentage}%</span>
                    </div>
                )
            }
        }
    ]

    const handleSearch = async () => {
        if (!date) {
            toast.error("Please select a date")
            return
        }

        setIsLoading(true)
        try {
            const data = await overtimeService.getDailyOTSummary(format(date, "yyyy-MM-dd"))

            setSummaryData(data.departmentSummaries)
            setGrandTotal(data.grandTotalOTHours)
            setTotalEmployees(data.totalEmployees)
            setHasSearched(true)

            if (data.departmentSummaries.length === 0) {
                toast.info("No OT summary data found for this date")
            } else {
                toast.success(`Summary generated for ${data.departmentSummaries.length} departments`)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch OT summary")
        } finally {
            setIsLoading(false)
        }
    }

    const avgOTPerEmployee = totalEmployees > 0 ? (grandTotal / totalEmployees).toFixed(2) : "0.00"

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-100">
                                <IconChartBar className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Daily OT Summary</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Department-wise Overtime Analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900" disabled={summaryData.length === 0}>
                                <IconDownload className="mr-2 size-4" />
                                Export Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Summary Cards */}
                {hasSearched && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Grand Total OT</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-purple-600">{grandTotal.toFixed(1)} hrs</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Employees</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-blue-600">{totalEmployees}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-emerald-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Avg OT/Employee</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-emerald-600">{avgOTPerEmployee} hrs</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Departments</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-orange-600">{summaryData.length}</h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconCalendar className="size-5 text-purple-500" />
                            Select Date
                        </CardTitle>
                        <CardDescription>Choose a date to view department-wise OT summary.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end max-w-2xl">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Date</label>
                                <DatePicker
                                    date={date}
                                    setDate={setDate}
                                    className="h-10 rounded-xl w-full"
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <IconLoader className="size-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <IconSearch className="size-5" />
                                        Generate Summary
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Table Content */}
                {hasSearched ? (
                    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                                Department-wise OT Summary for {date && format(date, "dd MMM yyyy")}
                                <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">{summaryData.length} Departments</Badge>
                            </h2>
                        </div>
                        <DataTable
                            columns={columns}
                            data={summaryData}
                            showColumnCustomizer={false}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-accent/5 rounded-3xl border-2 border-dashed border-muted/50">
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-6 text-purple-200">
                            <IconChartBar className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">OT Summary Analysis</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Select a date to view department-wise overtime summary with analytics and insights.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
