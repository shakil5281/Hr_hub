"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconClock,
    IconSearch,
    IconUser,
    IconCalendar,
    IconDownload,
    IconLoader,
    IconPrinter
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { overtimeService, type DailyOTSheet } from "@/lib/services/overtime"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"

export default function DailyOTSheetPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [designation, setDesignation] = React.useState("all")

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<DailyOTSheet[]>([])
    const [totalOT, setTotalOT] = React.useState(0)
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

    const columns: ColumnDef<DailyOTSheet>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "Employee ID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs leading-none">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase mt-1">{row.original.designation}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.department}</span>
        },
        {
            accessorKey: "inTime",
            header: "In Time",
            cell: ({ row }) => <span className="text-xs text-emerald-600 font-bold">{row.original.inTime || "N/A"}</span>
        },
        {
            accessorKey: "outTime",
            header: "Out Time",
            cell: ({ row }) => <span className="text-xs text-rose-600 font-bold">{row.original.outTime || "N/A"}</span>
        },
        {
            accessorKey: "regularHours",
            header: "Regular Hrs",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.regularHours.toFixed(1)} hrs</span>
        },
        {
            accessorKey: "otHours",
            header: "OT Hours",
            cell: ({ row }) => (
                <Badge variant="default" className="bg-blue-500 text-white text-[10px] font-black">
                    {row.original.otHours.toFixed(1)} hrs
                </Badge>
            )
        },
        {
            accessorKey: "remarks",
            header: "Remarks",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.remarks || "-"}</span>
        }
    ]

    const handleSearch = async () => {
        if (!date) {
            toast.error("Please select a date")
            return
        }

        setIsLoading(true)
        try {
            const params: any = {
                date: format(date, "yyyy-MM-dd")
            }

            if (department !== "all") params.departmentId = parseInt(department)
            if (designation !== "all") params.designationId = parseInt(designation)
            if (empId.trim()) params.searchTerm = empId.trim()

            const data = await overtimeService.getDailyOTSheet(params)

            setFilteredData(data.records)
            setTotalOT(data.totalOTHours)
            setHasSearched(true)

            if (data.records.length === 0) {
                toast.info("No OT records found for this date")
            } else {
                toast.success(`Found ${data.records.length} OT records`)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch OT sheet")
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-100">
                                <IconClock className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Daily OT Sheet</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Overtime Tracking & Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold" disabled={filteredData.length === 0}>
                                <IconPrinter className="mr-2 size-4" />
                                Print Sheet
                            </Button>
                            <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold bg-slate-900" disabled={filteredData.length === 0}>
                                <IconDownload className="mr-2 size-4" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Summary Cards */}
                {hasSearched && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total  OT Hours</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-blue-600">{totalOT.toFixed(1)} hrs</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Employees</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-purple-600">{filteredData.length}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-emerald-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Avg OT/Employee</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-emerald-600">
                                    {filteredData.length > 0 ? (totalOT / filteredData.length).toFixed(1) : "0.0"} hrs
                                </h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconCalendar className="size-5 text-blue-500" />
                            Search Filters
                        </CardTitle>
                        <CardDescription>Select date and filters to view overtime records.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Date</label>
                                <DatePicker
                                    date={date}
                                    setDate={setDate}
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee ID/Name</label>
                                <div className="relative">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search employee"
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

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                                        Generate Sheet
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
                                OT Records for {date && format(date, "dd MMM yyyy")}
                                <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">{filteredData.length} Employees</Badge>
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
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-6 text-blue-200">
                            <IconClock className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">Daily OT Sheet</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2 font-medium">
                            Select a date and apply filters to generate the overtime sheet for your employees.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
