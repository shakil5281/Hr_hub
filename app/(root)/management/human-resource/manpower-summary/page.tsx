"use client"

import * as React from "react"
import {
    IconReport,
    IconUsers,
    IconUserCheck,
    IconUserOff,
    IconChartPie,
    IconTrendingUp,
    IconUserExclamation,
    IconBuildingSkyscraper,
    IconBriefcase,
    IconLoader
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SummaryCard } from "@/components/summary-card"
import { toast } from "sonner"
import { employeeService, type ManpowerSummary, type SummaryItem } from "@/lib/services/employee"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ManpowerSummaryPage() {
    const [summary, setSummary] = React.useState<ManpowerSummary | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchSummary = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await employeeService.getManpowerSummary()
            setSummary(data)
        } catch (error) {
            console.error("Failed to load manpower summary", error)
            toast.error("Failed to load manpower summary data")
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    const departmentColumns: ColumnDef<SummaryItem>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.index + 1}</span>,
        },
        {
            accessorKey: "name",
            header: "Department",
            cell: ({ row }) => <span className="font-semibold">{row.getValue("name")}</span>,
        },
        {
            accessorKey: "count",
            header: "Headcount",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{row.getValue("count")}</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1">
                        {row.original.percentage}%
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "percentage",
            header: "Distribution",
            cell: ({ row }) => {
                const val = row.getValue("percentage") as number
                return (
                    <div className="flex items-center gap-3 w-full max-w-[200px]">
                        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${val}%` }}
                            />
                        </div>
                    </div>
                )
            },
        },
    ]

    const designationColumns: ColumnDef<SummaryItem>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.index + 1}</span>,
        },
        {
            accessorKey: "name",
            header: "Designation",
            cell: ({ row }) => <span className="text-sm">{row.getValue("name")}</span>,
        },
        {
            accessorKey: "count",
            header: "Count",
            cell: ({ row }) => <span className="font-medium">{row.getValue("count")}</span>,
        },
        {
            accessorKey: "percentage",
            header: "Share",
            cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.getValue("percentage")}%</span>,
        },
    ]

    if (isLoading && !summary) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <IconLoader className="size-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Analyzing workforce data...</p>
            </div>
        )
    }

    const chartDataBase = [
        { value: 10 }, { value: 25 }, { value: 15 }, { value: 35 },
        { value: 25 }, { value: 45 }, { value: 30 }, { value: 55 }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 bg-muted/20 min-h-screen px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
                        <IconChartPie className="size-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manpower Analytics</h1>
                        <p className="text-sm text-muted-foreground">
                            Deep dive into workforce distribution and employee status.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border shadow-sm">
                        <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Feed Active
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Employees"
                    value={summary?.totalEmployees.toString() || "0"}
                    icon={IconUsers}
                    trend={{ value: "Live", label: "registered in system", isUp: true }}
                    status="primary"
                    chartData={chartDataBase}
                />
                <SummaryCard
                    title="Active Manpower"
                    value={summary?.activeEmployees.toString() || "0"}
                    icon={IconUserCheck}
                    trend={{
                        value: `${summary ? Math.round((summary.activeEmployees / summary.totalEmployees) * 100) : 0}%`,
                        label: "of total workforce",
                        isUp: true
                    }}
                    status="success"
                    chartData={chartDataBase.map(d => ({ value: d.value + 5 }))}
                />
                <SummaryCard
                    title="Absence/Leave"
                    value={summary?.onLeaveEmployees.toString() || "0"}
                    icon={IconUserExclamation}
                    trend={{
                        value: summary?.onLeaveEmployees.toString() || "0",
                        label: "awaiting return",
                        isUp: false
                    }}
                    status="warning"
                    chartData={chartDataBase.map(d => ({ value: d.value * 0.3 }))}
                />
                <SummaryCard
                    title="Inactive Profile"
                    value={summary?.inactiveEmployees.toString() || "0"}
                    icon={IconUserOff}
                    trend={{ value: "N/A", label: "archived records", isUp: false }}
                    status="error"
                    chartData={chartDataBase.map(d => ({ value: 10 }))}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background/60 backdrop-blur-sm">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <IconBuildingSkyscraper className="size-5 text-primary" />
                            <div>
                                <CardTitle className="text-base">By Department</CardTitle>
                                <CardDescription className="text-xs">Headcount distribution across sections.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            data={summary?.departmentSummary || []}
                            columns={departmentColumns}
                            showActions={false}
                            showTabs={false}
                            searchKey="name"
                        />
                    </CardContent>
                </Card>

                {/* Status distribution */}
                <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background/60 backdrop-blur-sm">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <IconTrendingUp className="size-5 text-primary" />
                            <div>
                                <CardTitle className="text-base">By Status</CardTitle>
                                <CardDescription className="text-xs">Employee current lifecycle status.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {(summary?.statusSummary || []).map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "size-2 rounded-full",
                                                item.name === "Active" ? "bg-green-500" :
                                                    item.name === "On Leave" ? "bg-amber-500" : "bg-muted-foreground/30"
                                            )} />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-muted-foreground">{item.count} Employees ({item.percentage}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000",
                                                item.name === "Active" ? "bg-green-500" :
                                                    item.name === "On Leave" ? "bg-amber-500" : "bg-primary"
                                            )}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Designations */}
                <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background/60 backdrop-blur-sm lg:col-span-2">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <IconBriefcase className="size-5 text-primary" />
                            <div>
                                <CardTitle className="text-base">Top 10 Designations</CardTitle>
                                <CardDescription className="text-xs">Most common roles within the organization.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            data={summary?.designationSummary || []}
                            columns={designationColumns}
                            showActions={false}
                            showTabs={false}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
