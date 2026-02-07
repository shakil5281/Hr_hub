"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconAlertTriangle,
    IconSearch,
    IconDownload,
    IconRefresh,
    IconEdit,
    IconArrowLeft,
    IconActivity
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
import { attendanceService } from "@/lib/services/attendance"
import { toast } from "sonner"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function MissingEntryPage() {
    const router = useRouter()
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [designation, setDesignation] = React.useState("all")
    const [section, setSection] = React.useState("all")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
    })

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<MissingEntry[]>([])
    const [summary, setSummary] = React.useState<MissingEntrySummary | null>(null)
    const [hasSearched, setHasSearched] = React.useState(false)
    const [selectedRows, setSelectedRows] = React.useState<MissingEntry[]>([])
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingEntry, setEditingEntry] = React.useState<MissingEntry | null>(null)
    const [manualInTime, setManualInTime] = React.useState("")
    const [manualOutTime, setManualOutTime] = React.useState("")
    const [manualStatus, setManualStatus] = React.useState("Present")
    const [manualReason, setManualReason] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

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
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-left font-medium">{row.index + 1}</div>,
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <span className="text-sm">{format(new Date(row.original.date), "dd MMM yyyy")}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{row.original.employeeName}</span>
                    <span className="text-xs text-gray-500">{row.original.employeeIdCard}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-xs">{row.original.department}</span>
        },
        {
            accessorKey: "missingType",
            header: "Missing Punch",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-red-600">{row.original.missingType}</span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Critical" ? "destructive" : "secondary"}
                    className="font-medium"
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
                    className="h-8"
                    onClick={() => {
                        setEditingEntry(row.original)
                        setManualInTime(row.original.inTime || "")
                        setManualOutTime(row.original.outTime || "")
                        setManualStatus("Present")
                        setManualReason("Missing punch correction")
                        setIsSheetOpen(true)
                    }}
                >
                    <IconEdit size={16} className="mr-2" />
                    Fix Punch
                </Button>
            )
        }
    ]

    const handleManualSubmit = async () => {
        if (!editingEntry) return

        setIsSubmitting(true)
        try {
            await attendanceService.createManualEntry({
                employeeId: editingEntry.employeeId,
                date: editingEntry.date,
                inTime: manualInTime,
                outTime: manualOutTime,
                status: manualStatus,
                reason: manualReason
            })
            toast.success("Punch fixed successfully")
            setIsSheetOpen(false)
            handleSearch()
        } catch (error: any) {
            toast.error("Failed to fix punch")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBulkSubmit = async () => {
        if (selectedRows.length === 0) return

        setIsSubmitting(true)
        try {
            await attendanceService.bulkManualEntry({
                employeeIds: selectedRows.map(r => r.employeeId),
                date: selectedRows[0].date,
                inTime: manualInTime,
                outTime: manualOutTime,
                status: manualStatus,
                reason: manualReason
            })
            toast.success(`Bulk fix completed for ${selectedRows.length} employees`)
            setSelectedRows([])
            setIsSheetOpen(false)
            handleSearch()
        } catch (error: any) {
            toast.error("Bulk submission failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSearch = async () => {
        if (!dateRange?.from || !dateRange?.to) {
            toast.error("Date range required")
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
        } catch (error: any) {
            toast.error("Failed to fetch records")
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
                        <h1 className="text-2xl font-bold">Missing Entry Log</h1>
                        <p className="text-sm text-gray-500">Audit and fix missing employee punch records</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {selectedRows.length > 0 && (
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                                setEditingEntry(null)
                                setManualInTime("")
                                setManualOutTime("")
                                setManualStatus("Present")
                                setManualReason("Bulk fix")
                                setIsSheetOpen(true)
                            }}
                        >
                            <IconEdit size={18} className="mr-2" />
                            Fix Selected ({selectedRows.length})
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleSearch} disabled={isLoading}>
                        <IconRefresh size={18} className={cn("mr-2", isLoading && "animate-spin")} /> Refresh
                    </Button>
                    <Button variant="outline" size="sm" disabled={filteredData.length === 0}>
                        <IconDownload className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card className="border shadow-none">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Missing</p>
                                <p className="text-2xl font-bold mt-1 text-red-600">{summary.totalMissing}</p>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Missing In</p>
                                <p className="text-2xl font-bold mt-1 text-orange-600">{summary.missingInTime}</p>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Missing Out</p>
                                <p className="text-2xl font-bold mt-1 text-orange-600">{summary.missingOutTime}</p>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Punch</p>
                                <p className="text-2xl font-bold mt-1 text-red-600">{summary.missingBoth}</p>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Critical</p>
                                <p className="text-2xl font-bold mt-1 text-purple-600">{summary.criticalCount}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card className="border shadow-none">
                    <CardHeader className="bg-gray-50 border-b py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <IconSearch size={18} />
                            Search Filters
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
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
                                <Label className="text-xs uppercase font-bold text-gray-400">Section</Label>
                                <NativeSelect value={section} onChange={(e) => setSection(e.target.value)}>
                                    <option value="all">Every Section</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-gray-400">Date Range</Label>
                                <DateRangePicker date={dateRange} setDate={setDateRange} />
                            </div>
                            <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                                {isLoading ? <IconRefresh size={18} className="animate-spin" /> : <IconActivity size={18} />}
                                Generate List
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {hasSearched ? (
                    <Card className="border shadow-none overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">Missing Records</CardTitle>
                                <Badge variant="outline" className="bg-white font-medium">
                                    {filteredData.length} records found
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                showColumnCustomizer={false}
                                searchKey="employeeName"
                                enableSelection={true}
                                onSelectionChange={setSelectedRows}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-gray-50 text-gray-400">
                        <IconAlertTriangle size={48} stroke={1.5} />
                        <p className="mt-4 font-medium">Define parameters and click 'Generate' to see missing entry logs</p>
                    </div>
                )}

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>{editingEntry ? "Fix Punch Record" : `Bulk Fix (${selectedRows.length} Records)`}</SheetTitle>
                            <SheetDescription>Manually adjust attendance times for correction</SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>In Time</Label>
                                    <Input
                                        type="time"
                                        step="1"
                                        value={manualInTime}
                                        onChange={(e) => setManualInTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Out Time</Label>
                                    <Input
                                        type="time"
                                        step="1"
                                        value={manualOutTime}
                                        onChange={(e) => setManualOutTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <NativeSelect
                                    value={manualStatus}
                                    onChange={(e) => setManualStatus(e.target.value)}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Late">Late</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Off Day">Off Day</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <Label>Reason for Adjustment</Label>
                                <Input
                                    placeholder="Brief explanation..."
                                    value={manualReason}
                                    onChange={(e) => setManualReason(e.target.value)}
                                />
                            </div>
                        </div>

                        <SheetFooter className="gap-2">
                            <SheetClose asChild>
                                <Button variant="outline" className="flex-1">Cancel</Button>
                            </SheetClose>
                            <Button
                                className="flex-1"
                                onClick={editingEntry ? handleManualSubmit : handleBulkSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <IconRefresh size={18} className="animate-spin" /> : "Save Changes"}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
