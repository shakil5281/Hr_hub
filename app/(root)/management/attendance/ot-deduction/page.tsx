"use client"

import * as React from "react"
import {
    IconMinus,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconDownload,
    IconClockCheck,
    IconClockStop,
    IconClockPause,
    IconClockEdit,
    IconTrash,
    IconCircleCheck
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// --- Mock Data ---

const MOCK_OT_DEDUCTION = [
    { id: "1", date: "2026-01-20", empId: "EMP901", name: "Tom Hardy", department: "production", calculatedOT: "04:30", deducted: "00:30", finalOT: "04:00", reason: "Lunch overlap", status: "Approved" },
    { id: "2", date: "2026-01-22", empId: "EMP905", name: "Charlize Theron", department: "engineering", calculatedOT: "02:00", deducted: "01:00", finalOT: "01:00", reason: "Buffer deduction", status: "Pending" },
    { id: "3", date: "2026-01-25", empId: "EMP910", name: "Nicholas Hoult", department: "quality", calculatedOT: "03:15", deducted: "00:15", finalOT: "03:00", reason: "Manual adjustment", status: "Approved" },
    { id: "4", date: "2026-01-28", empId: "EMP912", name: "Zoë Kravitz", department: "production", calculatedOT: "05:00", deducted: "02:30", finalOT: "02:30", reason: "Late out only", status: "Disputed" },
]

export default function OTDeductionPage() {
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 0, 31)
    })

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<any[]>([])
    const [hasSearched, setHasSearched] = React.useState(false)

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <span className="font-bold text-xs">{row.original.date}</span>
        },
        {
            accessorKey: "empId",
            header: "UID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.empId}</Badge>
        },
        {
            accessorKey: "name",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs leading-none">{row.original.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase mt-1 tracking-tighter">{row.original.department}</span>
                </div>
            )
        },
        {
            accessorKey: "calculatedOT",
            header: "Calc. OT",
            cell: ({ row }) => <span className="text-xs font-bold text-slate-500 tabular-nums">{row.original.calculatedOT}h</span>
        },
        {
            accessorKey: "deducted",
            header: "Deduction",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-rose-500 font-black tabular-nums">
                    <IconMinus className="size-3" />
                    <span className="text-xs">{row.original.deducted}h</span>
                </div>
            )
        },
        {
            accessorKey: "finalOT",
            header: "Final OT",
            cell: ({ row }) => <span className="text-xs font-black text-emerald-600 tabular-nums">{row.original.finalOT}h</span>
        },
        {
            accessorKey: "reason",
            header: "Deduction Reason",
            cell: ({ row }) => <span className="text-xs text-muted-foreground italic truncate max-w-[150px] block">{row.original.reason}</span>
        },
        {
            accessorKey: "status",
            header: "Audit",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Approved" ? "success" : row.original.status === "Pending" ? "secondary" : "destructive"}
                    className="text-[10px] font-black uppercase px-2 h-5"
                >
                    {row.original.status}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: () => (
                <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="size-8 rounded-full text-slate-400">
                        <IconClockEdit className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8 rounded-full text-rose-400">
                        <IconTrash className="size-4" />
                    </Button>
                </div>
            )
        }
    ]

    const handleSearch = () => {
        setIsLoading(true)
        setTimeout(() => {
            let results = MOCK_OT_DEDUCTION
            if (empId) results = results.filter(r => r.empId.includes(empId) || r.name.toLowerCase().includes(empId.toLowerCase()))
            if (department !== "all") results = results.filter(r => r.department === department)

            setFilteredData(results)
            setHasSearched(true)
            setIsLoading(false)
        }, 600)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-100 dark:shadow-none">
                                <IconMinus className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">OT Deduction Log</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Overtime Adjustment & Audit</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconDownload className="mr-2 size-4" />
                                Export Review
                            </Button>
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900">
                                <IconClockPause className="mr-2 size-4" />
                                New Deduction
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <MetricCard title="Gross OT" value="42.5h" icon={IconClockCheck} color="text-emerald-500" />
                    <MetricCard title="Total Deducted" value="12.0h" icon={IconClockStop} color="text-rose-500" />
                    <MetricCard title="Payable OT" value="30.5h" icon={IconCircleCheck} color="text-indigo-500" />
                    <MetricCard title="Pending Review" value="08" icon={IconClockPause} color="text-amber-500" />
                </div>

                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-rose-500" />
                            Audit Scope
                        </CardTitle>
                        <CardDescription>Filter OT records by employee, unit, or month to review deductions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2 lg:col-span-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Personnel Look-up</label>
                                <div className="relative">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="ID or Name"
                                        className="pl-10 h-10 rounded-xl"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit / Section</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">Entire Plant</option>
                                    <option value="engineering">Engineering</option>
                                    <option value="hr">HR & Admin</option>
                                    <option value="production">Production</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Log Period</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                <IconSearch className="size-5" />
                                {isLoading ? "Auditing..." : "Execute Search"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Ledger Section */}
                {hasSearched ? (
                    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter text-rose-950 dark:text-rose-200">
                                OT Adjustment Ledger
                                <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">{filteredData.length} Records</Badge>
                            </h2>
                        </div>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            showColumnCustomizer={false}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-accent/5 rounded-3xl border-2 border-dashed border-muted/50">
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-6 text-rose-200">
                            <IconMinus className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">OT Deduction Explorer</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Set employee or unit filters to analyze overtime deductions before finalize the payroll cycle.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card className="border shadow-none hover:bg-muted/10 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center bg-background border shadow-sm", color)}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-black tabular-nums tracking-tighter leading-none mt-1">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
