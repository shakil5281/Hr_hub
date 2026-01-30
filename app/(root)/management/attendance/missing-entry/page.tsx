"use client"

import * as React from "react"
import {
    IconAlertTriangle,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconRotateClockwise,
    IconFileSpreadsheet
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

const MOCK_MISSING_ENTRIES = [
    { id: "1", date: "2024-05-20", empId: "EMP001", name: "John Doe", department: "engineering", designation: "swe", shift: "Morning (08-05)", missing: "Out Time", status: "Pending" },
    { id: "2", date: "2024-05-20", empId: "EMP002", name: "Jane Smith", department: "hr", designation: "mgr", shift: "Evening (02-10)", missing: "In Time", status: "Pending" },
    { id: "3", date: "2024-05-21", empId: "EMP005", name: "Robert Fox", department: "production", designation: "op", shift: "Day (09-06)", missing: "Both (No Punch)", status: "Critical" },
    { id: "4", date: "2024-05-22", empId: "EMP010", name: "Alice Brown", department: "quality", designation: "exec", shift: "Day (09-06)", missing: "Out Time", status: "Pending" },
]

export default function MissingEntryPage() {
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [designation, setDesignation] = React.useState("all")
    const [line, setLine] = React.useState("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2024, 4, 1),
        to: new Date(2024, 4, 30)
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
            header: "ID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.empId}</Badge>
        },
        {
            accessorKey: "name",
            header: "Employee Name",
            cell: ({ row }) => <span className="font-bold text-xs">{row.original.name}</span>
        },
        {
            accessorKey: "shift",
            header: "Shift",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.shift}</span>
        },
        {
            accessorKey: "missing",
            header: "Missing Punch",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-rose-600 font-bold text-xs uppercase tracking-tight">{row.original.missing}</span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Audit Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Critical" ? "destructive" : "secondary"}
                    className="text-[10px] font-black uppercase px-2 h-5"
                >
                    {row.original.status}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Action",
            cell: () => (
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-[10px] font-bold px-3 hover:bg-primary hover:text-white transition-all">
                    FIX PUNCH
                </Button>
            )
        }
    ]

    const handleSearch = () => {
        setIsLoading(true)
        // Simulate API delay
        setTimeout(() => {
            let results = MOCK_MISSING_ENTRIES
            if (empId) results = results.filter(r => r.empId.includes(empId) || r.name.toLowerCase().includes(empId.toLowerCase()))
            if (department !== "all") results = results.filter(r => r.department === department)

            setFilteredData(results)
            setHasSearched(true)
            setIsLoading(false)
        }, 500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200">
                                <IconAlertTriangle className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Missing Entry Log</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Attendance Audit & Correction</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconRotateClockwise className="mr-2 size-4" />
                                Sync Real-time
                            </Button>
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900">
                                <IconFileSpreadsheet className="mr-2 size-4" />
                                Export Missing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-rose-500" />
                            Search Filters
                        </CardTitle>
                        <CardDescription>Filter by department or employee to find missing attendance logs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee ID</label>
                                <div className="relative">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by ID/Name"
                                        className="pl-10 h-10 rounded-xl"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Departments</option>
                                    <option value="engineering">Engineering</option>
                                    <option value="hr">HR & Admin</option>
                                    <option value="production">Production</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Designation</label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Designations</option>
                                    <option value="swe">Developer</option>
                                    <option value="mgr">Manager</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Line / Section</label>
                                <NativeSelect value={line} onChange={(e) => setLine(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Sections</option>
                                    <option value="platform">Platform</option>
                                    <option value="assembly">Assembly</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Range</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                <IconSearch className="size-5" />
                                {isLoading ? "Searching..." : "Search Entry"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table Section */}
                {hasSearched ? (
                    <div className="bg-card border rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                                Showing Results
                                <Badge variant="secondary" className="rounded-full px-2">{filteredData.length}</Badge>
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
                            <IconAlertTriangle className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">Missing Logic Analysis</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Set your filters and date range to identify employees with missing punch-in or punch-out records.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
