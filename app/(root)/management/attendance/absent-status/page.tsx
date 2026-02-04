"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconUserX,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconDownload,
    IconFileSpreadsheet,
    IconLoader
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
import { absenteeismService, type AbsenteeismRecord, type AbsenteeismSummary } from "@/lib/services/absenteeism"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"

export default function AbsentStatusPage() {
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [designation, setDesignation] = React.useState("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 0, 31)
    })

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<AbsenteeismRecord[]>([])
    const [summary, setSummary] = React.useState<AbsenteeismSummary | null>(null)
    const [hasSearched, setHasSearched] = React.useState(false)

    const [departments, setDepartments] = React.useState<any[]>([])
    const [designations, setDesignations] = React.useState<any[]>([])

    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [depts, desigs] = await Promise.all([
                    organogramService.getDepartments(),
                    organogramService.getDesignations()
                ])
                setDepartments(depts)
                setDesignations(desigs)
            } catch (error) {
                console.error("Failed to fetch filters", error)
            }
        }
        fetchFilters()
    }, [])

    const columns: ColumnDef<AbsenteeismRecord>[] = [
        {
            accessorKey: "date",
            header: "Absent Date",
            cell: ({ row }) => <span className="font-bold text-xs">{format(new Date(row.original.date), "dd MMM yyyy")}</span>
        },
        {
            accessorKey: "employeeIdCard",
            header: "UID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs leading-none">{row.original.employeeName}</span>
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
            accessorKey: "consecutiveDays",
            header: "Consecutive Days",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.consecutiveDays >= 3 ? "destructive" : "secondary"}
                    className="text-[10px] font-black uppercase px-2 h-5"
                >
                    {row.original.consecutiveDays} {row.original.consecutiveDays === 1 ? "Day" : "Days"}
                </Badge>
            )
        },
        {
            accessorKey: "status",
            header: "Type",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Absent" ? "destructive" : "secondary"}
                    className="text-[10px] font-black uppercase px-2 h-5"
                >
                    {row.original.status}
                </Badge>
            )
        },
        {
            accessorKey: "remarks",
            header: "Remarks",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.remarks || "N/A"}</span>
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
            if (empId.trim()) params.searchTerm = empId.trim()

            const data = await absenteeismService.getAbsenteeismRecords(params)

            setFilteredData(data.records)
            setSummary(data.summary)
            setHasSearched(true)

            if (data.records.length === 0) {
                toast.success("No absenteeism records found!")
            } else {
                toast.info(`Found ${data.records.length} absence records`)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch absenteeism records")
        } finally {
            setIsLoading(false)
        }
    }

    const availability = summary ? ((1 - (summary.totalAbsent / 100)) * 100).toFixed(1) : "0.0"

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
                                Export  PDF
                            </Button>
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900" disabled={filteredData.length === 0}>
                                <IconFileSpreadsheet className="mr-2 size-4" />
                                Download CSV
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-orange-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Absent</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-orange-600">{summary.totalAbsent}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Absent (No Leave)</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-red-600">{summary.absentWithoutLeave}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">On Leave</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-blue-600">{summary.onLeave}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Critical (3+ Days)</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-purple-600">{summary.criticalCases}</h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2">
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
                                {isLoading ? (
                                    <>
                                        <IconLoader className="size-5 animate-spin" />
                                        Fetching...
                                    </>
                                ) : (
                                    <>
                                        <IconSearch className="size-5" />
                                        View Report
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
                                Absenteeism Log
                                <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20">{filteredData.length} Personnel</Badge>
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
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-6 text-orange-200">
                            <IconUserX className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">Absent Data Analysis</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Configure the Department and Date Range to generate the absenteeism and availability report for your workforce.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
