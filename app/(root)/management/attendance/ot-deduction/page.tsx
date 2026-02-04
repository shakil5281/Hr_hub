"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconMinus,
    IconSearch,
    IconPlus,
    IconEdit,
    IconTrash,
    IconEye,
    IconLoader,
    IconDownload,
    IconUser,
    IconX,
    IconClock
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { otDeductionService, type OTDeduction, type OTDeductionSummary } from "@/lib/services/otDeduction"
import { organogramService } from "@/lib/services/organogram"
import { employeeService } from "@/lib/services/employee"
import { toast } from "sonner"

const DEDUCTION_REASONS = ["Early Exit", "Extended Break", "Performance Deduction", "Policy Non-compliance", "Other"]
const STATUS_OPTIONS = ["Approved", "Pending", "Rejected"]

export default function OTDeductionLogPage() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
    })
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [status, setStatus] = React.useState("all")

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<OTDeduction[]>([])
    const [summary, setSummary] = React.useState<OTDeductionSummary | null>(null)
    const [hasSearched, setHasSearched] = React.useState(false)

    const [departments, setDepartments] = React.useState<any[]>([])
    const [employees, setEmployees] = React.useState<any[]>([])

    // Form states
    const [showCreateDialog, setShowCreateDialog] = React.useState(false)
    const [showViewDialog, setShowViewDialog] = React.useState(false)
    const [showEditDialog, setShowEditDialog] = React.useState(false)
    const [selectedRecord, setSelectedRecord] = React.useState<OTDeduction | null>(null)
    const [formData, setFormData] = React.useState({
        employeeId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        deductionHours: "1",
        reason: "Early Exit",
        remarks: "",
        status: "Approved"
    })

    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [depts, emps] = await Promise.all([
                    organogramService.getDepartments(),
                    employeeService.getEmployees()
                ])
                setDepartments(depts)
                setEmployees(emps || [])
            } catch (error) {
                console.error("Failed to fetch filters", error)
            }
        }
        fetchFilters()
        handleSearch() // Initial search
    }, [])

    const columns: ColumnDef<OTDeduction>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <span className="font-bold text-xs">{format(new Date(row.original.date), "dd MMM yyyy")}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <Badge variant="outline" className="text-[10px] font-bold w-fit">{row.original.employeeIdCard}</Badge>
                    <span className="text-xs font-medium mt-1">{row.original.employeeName}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.department}</span>
        },
        {
            accessorKey: "deductionHours",
            header: "Deduction (Hrs)",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-rose-600 font-bold">
                    <IconMinus className="size-3" />
                    <span>{row.original.deductionHours} hr</span>
                </div>
            )
        },
        {
            accessorKey: "reason",
            header: "Reason",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-[10px] font-bold">
                    {row.original.reason}
                </Badge>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const colors = {
                    "Approved": "bg-emerald-100 text-emerald-600 border-emerald-200",
                    "Pending": "bg-amber-100 text-amber-600 border-amber-200",
                    "Rejected": "bg-rose-100 text-rose-600 border-rose-200"
                }
                return (
                    <Badge variant="outline" className={`${colors[row.original.status as keyof typeof colors]} text-[10px] font-bold`}>
                        {row.original.status}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleView(row.original)}
                    >
                        <IconEye className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-amber-600 hover:bg-amber-50"
                        onClick={() => handleEdit(row.original)}
                    >
                        <IconEdit className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <IconTrash className="size-4" />
                    </Button>
                </div>
            )
        }
    ]

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params: any = {}

            if (dateRange?.from) params.fromDate = format(dateRange.from, "yyyy-MM-dd")
            if (dateRange?.to) params.toDate = format(dateRange.to, "yyyy-MM-dd")
            if (department !== "all") params.departmentId = parseInt(department)
            if (status !== "all") params.status = status
            if (empId.trim()) params.searchTerm = empId.trim()

            const data = await otDeductionService.getOTDeductions(params)

            setFilteredData(data.records)
            setSummary(data.summary)
            setHasSearched(true)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch deduction records")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formData.employeeId || !formData.deductionHours || !formData.reason) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            const payload = {
                ...formData,
                employeeId: parseInt(formData.employeeId),
                deductionHours: parseFloat(formData.deductionHours)
            }
            await otDeductionService.createOTDeduction(payload)
            toast.success("OT Deduction record created successfully")
            setShowCreateDialog(false)
            resetForm()
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create deduction record")
        }
    }

    const handleEdit = (record: OTDeduction) => {
        setSelectedRecord(record)
        setFormData({
            employeeId: record.employeeId.toString(),
            date: format(new Date(record.date), "yyyy-MM-dd"),
            deductionHours: record.deductionHours.toString(),
            reason: record.reason,
            remarks: record.remarks || "",
            status: record.status
        })
        setShowEditDialog(true)
    }

    const handleUpdate = async () => {
        if (!selectedRecord) return

        try {
            const payload = {
                ...formData,
                employeeId: parseInt(formData.employeeId),
                deductionHours: parseFloat(formData.deductionHours)
            }
            await otDeductionService.updateOTDeduction(selectedRecord.id, payload)
            toast.success("OT Deduction record updated successfully")
            setShowEditDialog(false)
            resetForm()
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update deduction record")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this deduction record?")) return

        try {
            await otDeductionService.deleteOTDeduction(id)
            toast.success("OT Deduction record deleted successfully")
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete deduction record")
        }
    }

    const handleView = (record: OTDeduction) => {
        setSelectedRecord(record)
        setShowViewDialog(true)
    }

    const resetForm = () => {
        setFormData({
            employeeId: "",
            date: format(new Date(), "yyyy-MM-dd"),
            deductionHours: "1",
            reason: "Early Exit",
            remarks: "",
            status: "Approved"
        })
        setSelectedRecord(null)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-100">
                                <IconClock className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">OT Deduction Log</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Adjust employee overtime hours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-full h-8 px-4 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-100">
                                        <IconPlus className="mr-2 size-4" />
                                        Add Deduction
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Add OT Deduction</DialogTitle>
                                        <DialogDescription>Fill in the details to deduct overtime hours from an employee.</DialogDescription>
                                    </DialogHeader>
                                    <OTDeductionForm formData={formData} setFormData={setFormData} employees={employees} onSubmit={handleCreate} onCancel={() => setShowCreateDialog(false)} />
                                </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" className="rounded-full h-8 px-4 text-xs font-bold" disabled={filteredData.length === 0}>
                                <IconDownload className="mr-2 size-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-orange-500 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Deducted Hours</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-rose-600">-{summary.totalDeductedHours}h</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Employees Affected</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-blue-600">{summary.totalEmployeesAffected}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-amber-500 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pending Requests</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-amber-600">{summary.pendingRequests}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Average Deduction</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-purple-600">{summary.averageDeduction.toFixed(1)}h</h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Search & Filter</CardTitle>
                        <CardDescription>Filter deduction records by various criteria.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee</label>
                                <Input
                                    placeholder="ID or Name"
                                    className="h-10 rounded-xl"
                                    value={empId}
                                    onChange={(e) => setEmpId(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</label>
                                <NativeSelect value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All Status</option>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date Range</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                    className="h-10 rounded-xl"
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-5 animate-spin" /> : <IconSearch className="size-5" />}
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Table */}
                <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-tighter">
                            Deduction History
                            {hasSearched && <Badge className="ml-2 bg-orange-100 text-orange-600 border-orange-200">{filteredData.length} Records</Badge>}
                        </h2>
                    </div>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                    />
                </div>
            </main>

            {/* View Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Deduction Details</DialogTitle>
                    </DialogHeader>
                    {selectedRecord && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                    <IconUser className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{selectedRecord.employeeName}</p>
                                    <p className="text-xs text-muted-foreground">{selectedRecord.employeeIdCard} • {selectedRecord.department}</p>
                                </div>
                                <Badge variant="outline" className="ml-auto bg-emerald-50 text-emerald-600 border-emerald-200 font-bold">{selectedRecord.status}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 p-3 border rounded-xl bg-card shadow-sm">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Date</Label>
                                    <p className="text-sm font-medium">{format(new Date(selectedRecord.date), "dd MMM yyyy")}</p>
                                </div>
                                <div className="space-y-1 p-3 border rounded-xl bg-card shadow-sm">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Deduction</Label>
                                    <p className="text-sm font-bold text-rose-600">{selectedRecord.deductionHours} Hours</p>
                                </div>
                            </div>

                            <div className="space-y-2 p-3 border rounded-xl bg-card shadow-sm">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Reason</Label>
                                <p className="text-sm font-medium">{selectedRecord.reason}</p>
                            </div>

                            <div className="space-y-2 p-3 border rounded-xl bg-card shadow-sm">
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Remarks</Label>
                                <p className="text-sm text-muted-foreground italic">
                                    {selectedRecord.remarks || "No additional remarks provided."}
                                </p>
                            </div>

                            <div className="text-[10px] text-muted-foreground text-center pt-2">
                                Record created on {format(new Date(selectedRecord.createdAt), "dd MMM yyyy HH:mm")}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Deduction Record</DialogTitle>
                    </DialogHeader>
                    <OTDeductionForm formData={formData} setFormData={setFormData} employees={employees} onSubmit={handleUpdate} onCancel={() => setShowEditDialog(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function OTDeductionForm({ formData, setFormData, employees, onSubmit, onCancel }: any) {
    return (
        <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight">Employee *</Label>
                    <NativeSelect
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        className="rounded-xl h-10"
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp: any) => (
                            <option key={emp.id} value={emp.id}>{emp.employeeId} - {emp.fullNameEn}</option>
                        ))}
                    </NativeSelect>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight">Date *</Label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="rounded-xl h-10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight">Deduction Hours *</Label>
                    <Input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={formData.deductionHours}
                        onChange={(e) => setFormData({ ...formData, deductionHours: e.target.value })}
                        className="rounded-xl h-10 font-bold text-rose-600"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight">Reason *</Label>
                    <NativeSelect
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="rounded-xl h-10"
                    >
                        {DEDUCTION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </NativeSelect>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight">Status *</Label>
                    <NativeSelect
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="rounded-xl h-10"
                    >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </NativeSelect>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Remarks</Label>
                <Textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="rounded-xl min-h-[100px] bg-muted/20"
                    placeholder="Additional details regarding the deduction..."
                />
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={onCancel} className="rounded-xl px-6">
                    <IconX className="mr-2 size-4" />
                    Cancel
                </Button>
                <Button onClick={onSubmit} className="rounded-xl bg-orange-600 hover:bg-orange-700 font-bold px-8 shadow-lg shadow-orange-100 text-white">
                    <IconClock className="mr-2 size-4" />
                    Save Record
                </Button>
            </div>
        </div>
    )
}
