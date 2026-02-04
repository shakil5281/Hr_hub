"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconAlertTriangle,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconRotateClockwise,
    IconFileSpreadsheet,
    IconLoader,
    IconEdit
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
import { missingEntryService, type MissingEntry, type MissingEntrySummary } from "@/lib/services/missingEntry"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function MissingEntryPage() {
    const router = useRouter()
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [designation, setDesignation] = React.useState("all")
    const [section, setSection] = React.useState("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 0, 31)
    })

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<MissingEntry[]>([])
    const [summary, setSummary] = React.useState<MissingEntrySummary | null>(null)
    const [hasSearched, setHasSearched] = React.useState(false)

    const [departments, setDepartments] = React.useState<any[]>([])
    const [designations, setDesignations] = React.useState<any[]>([])
    const [sections, setSections] = React.useState<any[]>([])

    // Fetch filter options
    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [depts, desigs, sects] = await Promise.all([
                    organogramService.getDepartments(),
                    organogramService.getDesignations(),
                    organogramService.getSections()
                ])
                setDepartments(depts)
                setDesignations(desigs)
                setSections(sects)
            } catch (error) {
                console.error("Failed to fetch filters", error)
            }
        }
        fetchFilters()
    }, [])

    const columns: ColumnDef<MissingEntry>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <span className="font-bold text-xs">{format(new Date(row.original.date), "dd MMM yyyy")}</span>
        },
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee Name",
            cell: ({ row }) => <span className="font-bold text-xs">{row.original.employeeName}</span>
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.department}</span>
        },
        {
            accessorKey: "shift",
            header: "Shift",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.shift || "N/A"}</span>
        },
        {
            accessorKey: "missingType",
            header: "Missing Punch",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-rose-600 font-bold text-xs uppercase tracking-tight">{row.original.missingType}</span>
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
            cell: ({ row }) => (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-lg text-[10px] font-bold px-3 hover:bg-primary hover:text-white transition-all"
                    onClick={() => router.push(`/management/attendance/manual-entry?employeeId=${row.original.employeeId}&date=${format(new Date(row.original.date), "yyyy-MM-dd")}`)}
                >
                    <IconEdit className="size-3 mr-1" />
                    FIX PUNCH
                </Button>
            )
        }
    ]

    const handleSearch = async () => {
        if (!dateRange?.from || !dateRange?.to) {
            toast.error("Please select a date range")
            return
        }

        setIsLoading(true)
        try {
            const params: any = {
                fromDate: format(dateRange.from, "yyyy-MM-dd"),
                toDate: format(dateRange.to, "yyyy-MM-dd")
            }

            if (department !== "all") params.departmentId = parseInt(department)
            if (designation !== "all") params.designationId = parseInt(designation)
            if (section !== "all") params.sectionId = parseInt(section)
            if (empId.trim()) params.searchTerm = empId.trim()

            const data = await missingEntryService.getMissingEntries(params)

            setFilteredData(data.entries)
            setSummary(data.summary)
            setHasSearched(true)

            if (data.entries.length === 0) {
                toast.success("No missing entries found!")
            } else {
                toast.info(`Found ${data.entries.length} missing entries`)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch missing entries")
        } finally {
            setIsLoading(false)
        }
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
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full h-8 px-4 text-xs font-bold"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                <IconRotateClockwise className="mr-2 size-4" />
                                Sync Real-time
                            </Button>
                            <Button
                                size="sm"
                                className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900"
                                disabled={filteredData.length === 0}
                            >
                                <IconFileSpreadsheet className="mr-2 size-4" />
                                Export Missing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-in slide-in-from-top duration-500">
                        <Card className="border-l-4 border-l-rose-500">
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground mb-1">Total Missing</p>
                                <p className="text-2xl font-bold text-rose-600">{summary.totalMissing}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-amber-500">
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground mb-1">Missing In</p>
                                <p className="text-2xl font-bold text-amber-600">{summary.missingInTime}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground mb-1">Missing Out</p>
                                <p className="text-2xl font-bold text-orange-600">{summary.missingOutTime}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground mb-1">No Punch</p>
                                <p className="text-2xl font-bold text-red-600">{summary.missingBoth}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground mb-1">Critical</p>
                                <p className="text-2xl font-bold text-purple-600">{summary.criticalCount}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

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
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Designation</label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Designations</option>
                                    {designations.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Section</label>
                                <NativeSelect value={section} onChange={(e) => setSection(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Sections</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
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
                                {isLoading ? (
                                    <>
                                        <IconLoader className="size-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <IconSearch className="size-5" />
                                        Search Entry
                                    </>
                                )}
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
                            searchKey="employeeName"
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
