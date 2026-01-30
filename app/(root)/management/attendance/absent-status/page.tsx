"use client"

import * as React from "react"
import {
    IconUserX,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconDownload,
    IconFileSpreadsheet,
    IconPhone,
    IconMail,
    IconArrowUpRight,
    IconArrowDownRight
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
import { format } from "date-fns"

// --- Mock Data ---

const MOCK_ABSENT_DATA = [
    { id: "1", date: "2026-01-30", empId: "EMP501", name: "David Miller", department: "production", designation: "Operator", shift: "Day (09-06)", supervisor: "James Bond", contact: "+880 1711-223344", status: "Uninformed" },
    { id: "2", date: "2026-01-30", empId: "EMP502", name: "Linda Gray", department: "hr", designation: "Executive", shift: "Day (09-06)", supervisor: "Sarah Connor", contact: "+880 1711-556677", status: "On Leave" },
    { id: "3", date: "2026-01-30", empId: "EMP505", name: "Paul Walker", department: "engineering", designation: "Lead Engineer", shift: "Day (09-06)", supervisor: "Tony Stark", contact: "+880 1711-889900", status: "Uninformed" },
    { id: "4", date: "2026-01-30", empId: "EMP510", name: "Emma Watson", department: "quality", designation: "QC Inspector", shift: "Night (08-05)", supervisor: "Bruce Wayne", contact: "+880 1711-112233", status: "Medical Leave" },
]

export default function AbsentStatusPage() {
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date()
    })

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<any[]>([])
    const [hasSearched, setHasSearched] = React.useState(false)

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Absent Date",
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
                    <span className="text-[10px] text-muted-foreground uppercase mt-1 tracking-tighter">{row.original.designation}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Unit",
            cell: ({ row }) => <span className="text-xs uppercase font-medium">{row.original.department}</span>
        },
        {
            accessorKey: "status",
            header: "Type",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Uninformed" ? "destructive" : "secondary"}
                    className="text-[10px] font-black uppercase px-2 h-5"
                >
                    {row.original.status}
                </Badge>
            )
        },
        {
            accessorKey: "supervisor",
            header: "Reporting To",
            cell: ({ row }) => <span className="text-xs font-medium text-muted-foreground">{row.original.supervisor}</span>
        },
        {
            id: "actions",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="size-8 rounded-full text-emerald-600 hover:bg-emerald-50">
                        <IconPhone className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8 rounded-full text-blue-600 hover:bg-blue-50">
                        <IconMail className="size-4" />
                    </Button>
                </div>
            )
        }
    ]

    const handleSearch = () => {
        setIsLoading(true)
        setTimeout(() => {
            let results = MOCK_ABSENT_DATA
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-100 dark:shadow-none">
                                <IconUserX className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Absenteeism Record</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Workforce Availability Audit</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconDownload className="mr-2 size-4" />
                                Export PDF
                            </Button>
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900">
                                <IconFileSpreadsheet className="mr-2 size-4" />
                                Download CSV
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Insights Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InsightCard title="Total Absent" value="12" subValue="+2 from yesterday" trend="up" />
                    <InsightCard title="Uninformed" value="08" subValue="Wait list active" trend="up" />
                    <InsightCard title="Availability" value="94.2%" subValue="Target: 98%" trend="down" />
                </div>

                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-orange-500" />
                            Report Filter
                        </CardTitle>
                        <CardDescription>Retrieve absenteeism data by department or date range.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2 lg:col-span-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search Personnel</label>
                                <div className="relative">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Name or ID"
                                        className="pl-10 h-10 rounded-xl"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit / Dept</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">Everywhere</option>
                                    <option value="engineering">Engineering</option>
                                    <option value="hr">HR & Admin</option>
                                    <option value="production">Production</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Period Selection</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                <IconSearch className="size-5" />
                                {isLoading ? "Fetching..." : "View Report"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Table Content */}
                {hasSearched ? (
                    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                                Absenteeism Log
                                <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20">{filteredData.length} Personnel</Badge>
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
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-6 text-orange-200">
                            <IconUserX className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">Absent Data Analysis</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Configure the Unit and Date Range to generate the absenteeism and availability report for your workforce.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

function InsightCard({ title, value, subValue, trend }: any) {
    return (
        <Card className="border shadow-none">
            <CardContent className="pt-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
                <div className="mt-2 flex items-baseline justify-between">
                    <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                        trend === "up" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                        {trend === "up" ? <IconArrowUpRight className="size-3" /> : <IconArrowDownRight className="size-3" />}
                        {subValue}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
