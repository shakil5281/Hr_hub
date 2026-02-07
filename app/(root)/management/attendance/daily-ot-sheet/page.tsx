"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconClock,
    IconSearch,
    IconUser,
    IconDownload,
    IconRefresh,
    IconPrinter,
    IconActivity,
    IconArrowLeft
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { overtimeService, type DailyOTSheet } from "@/lib/services/overtime"
import { organogramService } from "@/lib/services/organogram"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function DailyOTSheetPage() {
    const router = useRouter()
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
                console.error("Filter sync failed")
            }
        }
        fetchFilters()
    }, [])

    const columns: ColumnDef<DailyOTSheet>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-left font-medium">{row.index + 1}</div>,
        },
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <span className="text-sm font-medium">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{row.original.employeeName}</span>
                    <span className="text-xs text-gray-500">{row.original.designation}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-xs">{row.original.department}</span>
        },
        {
            accessorKey: "inTime",
            header: "In Time",
            cell: ({ row }) => <span className="text-xs">{row.original.inTime || "--:--"}</span>
        },
        {
            accessorKey: "outTime",
            header: "Out Time",
            cell: ({ row }) => <span className="text-xs">{row.original.outTime || "--:--"}</span>
        },
        {
            accessorKey: "otHours",
            header: "OT Hours",
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                    {row.original.otHours.toFixed(1)} hrs
                </Badge>
            )
        }
    ]

    const handleSearch = async () => {
        if (!date) {
            toast.error("Date required")
            return
        }

        setIsLoading(true)
        try {
            const params: any = { date: format(date, "yyyy-MM-dd") }
            if (department !== "all") params.departmentId = parseInt(department)
            if (designation !== "all") params.designationId = parseInt(designation)
            if (empId.trim()) params.searchTerm = empId.trim()

            const data = await overtimeService.getDailyOTSheet(params)
            setFilteredData(data.records)
            setTotalOT(data.totalOTHours)
            setHasSearched(true)
        } catch (error: any) {
            toast.error("Generation failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-md">
                        <IconArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Daily OT Sheet</h1>
                        <p className="text-sm text-gray-500">Overtime records and worker movement synchronization</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()} disabled={filteredData.length === 0}>
                        <IconPrinter className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm" disabled={filteredData.length === 0}>
                        <IconDownload className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="border shadow-none">
                    <CardHeader className="bg-gray-50 border-b py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <IconSearch size={18} />
                            Search Filters
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-gray-400">Date</Label>
                                <DatePicker date={date} setDate={setDate} className="w-full" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-gray-400">Employee ID / Name</Label>
                                <Input placeholder="Type to search..." value={empId} onChange={(e) => setEmpId(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-gray-400">Department</Label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="all">Every Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-gray-400">Role / Designation</Label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)}>
                                    <option value="all">All Roles</option>
                                    {designations.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto px-10">
                                {isLoading ? <IconRefresh className="mr-2 h-4 w-4 animate-spin" /> : <IconActivity className="mr-2 h-4 w-4" />}
                                Generate Sheet
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {hasSearched && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total OT Hours</p>
                                <h3 className="text-2xl font-bold mt-1 text-primary">{totalOT.toFixed(1)} hrs</h3>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workers Count</p>
                                <h3 className="text-2xl font-bold mt-1">{filteredData.length}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Per Person</p>
                                <h3 className="text-2xl font-bold mt-1">{filteredData.length > 0 ? (totalOT / filteredData.length).toFixed(1) : "0.0"} hrs</h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {hasSearched ? (
                    <Card className="border shadow-none overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">OT Data Sheet</CardTitle>
                                <Badge variant="outline" className="font-medium bg-white">
                                    {filteredData.length} records found
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={columns} data={filteredData} showColumnCustomizer={false} showActions={false} showTabs={false} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-gray-50 text-gray-400">
                        <IconClock size={48} stroke={1.5} />
                        <p className="mt-4 font-medium">Select parameters and click 'Generate Sheet' to view records</p>
                    </div>
                )}
            </div>
        </div>
    )
}
