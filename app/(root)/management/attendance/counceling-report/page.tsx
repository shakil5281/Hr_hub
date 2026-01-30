"use client"

import * as React from "react"
import {
    IconMessageCircle2,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconDownload,
    IconFilePlus,
    IconHistory,
    IconClock,
    IconAlertCircle,
    IconCircleCheck,
    IconGavel
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

const MOCK_COUNSELING_DATA = [
    { id: "1", date: "2026-01-20", empId: "EMP801", name: "Jessica Alba", department: "production", designation: "Operator", issue: "Continuous Lateness", action: "Verbal Warning", status: "Closed", severity: "Low" },
    { id: "2", date: "2026-01-22", empId: "EMP802", name: "Ryan Gosling", department: "hr", designation: "Officer", issue: "Unprofessional Behavior", action: "Written Warning", status: "In-Progress", severity: "Medium" },
    { id: "3", date: "2026-01-25", empId: "EMP805", name: "Emma Stone", department: "engineering", designation: "Architect", issue: "Policy Violation", action: "Show Cause Notice", status: "Open", severity: "High" },
    { id: "4", date: "2026-01-28", empId: "EMP810", name: "Cillian Murphy", department: "quality", designation: "Inspector", issue: "Absent without Leave", action: "Final Warning", status: "Open", severity: "High" },
]

export default function CounselingReportPage() {
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
            header: "Record Date",
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
            accessorKey: "issue",
            header: "Incident / Issue",
            cell: ({ row }) => <span className="text-xs font-medium max-w-[200px] truncate block">{row.original.issue}</span>
        },
        {
            accessorKey: "severity",
            header: "Severity",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <div className={cn(
                        "size-1.5 rounded-full",
                        row.original.severity === "High" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" :
                            row.original.severity === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                    )} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{row.original.severity}</span>
                </div>
            )
        },
        {
            accessorKey: "action",
            header: "Action Taken",
            cell: ({ row }) => <span className="text-xs text-muted-foreground italic">{row.original.action}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Open" ? "destructive" : row.original.status === "Closed" ? "success" : "secondary"}
                    className="text-[10px] font-black uppercase px-2 h-5"
                >
                    {row.original.status}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Record",
            cell: () => (
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full">
                    <IconHistory className="size-4 text-muted-foreground" />
                </Button>
            )
        }
    ]

    const handleSearch = () => {
        setIsLoading(true)
        setTimeout(() => {
            let results = MOCK_COUNSELING_DATA
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                <IconMessageCircle2 className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Counseling Log</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Disciplinary & Professional Support</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconDownload className="mr-2 size-4" />
                                Export Ledger
                            </Button>
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                                <IconFilePlus className="mr-2 size-4" />
                                New Record
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Statistics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatBox title="Active Cases" value="05" icon={IconAlertCircle} color="text-rose-500" />
                    <StatBox title="In-Progress" value="12" icon={IconClock} color="text-amber-500" />
                    <StatBox title="Resolved" value="84" icon={IconCircleCheck} color="text-emerald-500" />
                    <StatBox title="Grievances" value="03" icon={IconGavel} color="text-indigo-500" />
                </div>

                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-indigo-500" />
                            Audit Filters
                        </CardTitle>
                        <CardDescription>Locate counseling sessions by employee, department, or timeframe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2 lg:col-span-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee Look-up</label>
                                <div className="relative">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="ID or Full Name"
                                        className="pl-10 h-10 rounded-xl"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Units</option>
                                    <option value="engineering">Engineering</option>
                                    <option value="hr">HR & Admin</option>
                                    <option value="production">Production</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Range</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                <IconSearch className="size-5" />
                                {isLoading ? "Searching..." : "Pulse Search"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Section */}
                {hasSearched ? (
                    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter text-indigo-900 dark:text-indigo-200">
                                Counseling Ledger
                                <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200">{filteredData.length} Records</Badge>
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
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-6 text-indigo-200">
                            <IconMessageCircle2 className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">Counseling Audit Explorer</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Use the advanced filters to drill down into disciplinary records, grievances, and professional support logs.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

function StatBox({ title, value, icon: Icon, color }: any) {
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
