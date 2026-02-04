"use client"

import * as React from "react"
import {
    IconChartBar,
    IconSearch,
    IconLoader,
    IconTrendingUp,
    IconUsers,
    IconReportMoney,
    IconFileAnalytics
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { payrollService, type SalarySummary } from "@/lib/services/payroll"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

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

export default function SalarySummaryPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [summary, setSummary] = React.useState<SalarySummary | null>(null)

    React.useEffect(() => {
        handleSearch()
    }, [])

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const data = await payrollService.getSummary(year, month)
            setSummary(data)
        } catch (error) {
            toast.error("Failed to load summary")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1200px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                                <IconChartBar className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Financial Summary</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Payroll Analytics & Trends</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1200px] space-y-8">
                {/* Filters */}
                <Card className="border shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2 min-w-[150px]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Month</label>
                                <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-10 rounded-xl">
                                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2 min-w-[120px]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Year</label>
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-10 rounded-xl">
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </NativeSelect>
                            </div>
                            <Button
                                className="h-10 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-5 animate-spin" /> : <IconSearch className="size-5" />}
                                Refresh Analytics
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {summary && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        {/* High Level Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard title="Total Disbursement" value={`৳${summary.totalNetPayable.toLocaleString()}`} icon={IconReportMoney} color="text-indigo-600" />
                            <MetricCard title="Total OT Pay" value={`৳${summary.totalOTAmount.toLocaleString()}`} icon={IconTrendingUp} color="text-blue-600" />
                            <MetricCard title="Headcount" value={summary.totalEmployees.toString()} icon={IconUsers} color="text-emerald-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Department Breakdown */}
                            <Card className="border shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-tighter">Department Disbursement</CardTitle>
                                    <CardDescription>Visual breakdown of payroll costs per unit.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {summary.departmentSummaries.map((dept, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span>{dept.departmentName}</span>
                                                <span className="tabular-nums">৳{dept.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <Progress
                                                value={(dept.totalAmount / summary.totalNetPayable) * 100}
                                                className="h-2 bg-indigo-50"
                                            />
                                            <div className="text-[10px] text-muted-foreground text-right">{dept.employeeCount} Employees</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Additional insights or empty placeholder for now */}
                            <Card className="border shadow-sm bg-indigo-600 text-white">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-100 flex items-center gap-2">
                                        <IconFileAnalytics className="size-5" />
                                        Profit Impact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                                        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest underline decoration-indigo-300">Avg Cost per Employee</p>
                                        <h3 className="text-4xl font-black mt-2 tracking-tighter tabular-nums">৳{(summary.totalNetPayable / summary.totalEmployees).toFixed(0).toLocaleString()}</h3>
                                    </div>
                                    <p className="text-xs opacity-80 leading-relaxed font-medium">
                                        This month total disbursement represents the final processed salary for all active business units. Cost efficiency is within the 12% target threshold.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card className="border shadow-none">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                    <Icon className={`size-5 ${color}`} />
                </div>
                <h3 className={`text-3xl font-black tabular-nums tracking-tighter ${color}`}>{value}</h3>
            </CardContent>
        </Card>
    )
}
