"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconNote,
    IconSearch,
    IconPlus,
    IconEdit,
    IconTrash,
    IconEye,
    IconLoader,
    IconDownload,
    IconUser,
    IconX
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
import { counselingService, type CounselingRecord, type CounselingSummary } from "@/lib/services/counseling"
import { organogramService } from "@/lib/services/organogram"
import { employeeService } from "@/lib/services/employee"
import { toast } from "sonner"

const ISSUE_TYPES = ["Absenteeism", "Late Coming", "Performance", "Behavior", "Policy Violation", "Other"]
const SEVERITY_LEVELS = ["Low", "Medium", "High"]
const STATUS_OPTIONS = ["Open", "Closed", "Follow-up Required"]

export default function CounselingReportPage() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
    const [empId, setEmpId] = React.useState("")
    const [department, setDepartment] = React.useState("all")
    const [issueType, setIssueType] = React.useState("all")
    const [status, setStatus] = React.useState("all")

    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredData, setFilteredData] = React.useState<CounselingRecord[]>([])
    const [summary, setSummary] = React.useState<CounselingSummary | null>(null)
    const [hasSearched, setHasSearched] = React.useState(false)

    const [departments, setDepartments] = React.useState<any[]>([])
    const [employees, setEmployees] = React.useState<any[]>([])

    // Form states
    const [showCreateDialog, setShowCreateDialog] = React.useState(false)
    const [showViewDialog, setShowViewDialog] = React.useState(false)
    const [showEditDialog, setShowEditDialog] = React.useState(false)
    const [selectedRecord, setSelectedRecord] = React.useState<CounselingRecord | null>(null)
    const [formData, setFormData] = React.useState({
        employeeId: "",
        counselingDate: format(new Date(), "yyyy-MM-dd"),
        issueType: "Absenteeism",
        description: "",
        actionTaken: "",
        followUpNotes: "",
        status: "Open",
        severity: "Low",
        followUpDate: ""
    })

    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [depts, empsResponse] = await Promise.all([
                    organogramService.getDepartments(),
                    employeeService.getEmployees()
                ])
                setDepartments(depts)
                setEmployees(empsResponse || [])
            } catch (error) {
                console.error("Failed to fetch filters", error)
            }
        }
        fetchFilters()
    }, [])

    const columns: ColumnDef<CounselingRecord>[] = [
        {
            accessorKey: "counselingDate",
            header: "Date",
            cell: ({ row }) => <span className="font-bold text-xs">{format(new Date(row.original.counselingDate), "dd MMM yyyy")}</span>
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
            accessorKey: "issueType",
            header: "Issue Type",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-[10px] font-bold">
                    {row.original.issueType}
                </Badge>
            )
        },
        {
            accessorKey: "severity",
            header: "Severity",
            cell: ({ row }) => {
                const colors = {
                    "Low": "bg-blue-100 text-blue-600",
                    "Medium": "bg-amber-100 text-amber-600",
                    "High": "bg-red-100 text-red-600"
                }
                return (
                    <Badge className={`${colors[row.original.severity as keyof typeof colors]} text-[10px] font-bold`}>
                        {row.original.severity}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const colors = {
                    "Open": "bg-rose-100 text-rose-600",
                    "Closed": "bg-emerald-100 text-emerald-600",
                    "Follow-up Required": "bg-orange-100 text-orange-600"
                }
                return (
                    <Badge className={`${colors[row.original.status as keyof typeof colors]} text-[10px] font-bold`}>
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
            if (issueType !== "all") params.issueType = issueType
            if (status !== "all") params.status = status
            if (empId.trim()) params.searchTerm = empId.trim()

            const data = await counselingService.getCounselingRecords(params)

            setFilteredData(data.records)
            setSummary(data.summary)
            setHasSearched(true)

            toast.success(`Found ${data.records.length} counseling records`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch counseling records")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formData.employeeId || !formData.description) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            const payload = {
                ...formData,
                employeeId: parseInt(formData.employeeId)
            }
            await counselingService.createCounselingRecord(payload)
            toast.success("Counseling record created successfully")
            setShowCreateDialog(false)
            resetForm()
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create counseling record")
        }
    }

    const handleEdit = (record: CounselingRecord) => {
        setSelectedRecord(record)
        setFormData({
            employeeId: record.employeeId.toString(),
            counselingDate: format(new Date(record.counselingDate), "yyyy-MM-dd"),
            issueType: record.issueType,
            description: record.description,
            actionTaken: record.actionTaken || "",
            followUpNotes: record.followUpNotes || "",
            status: record.status,
            severity: record.severity,
            followUpDate: record.followUpDate ? format(new Date(record.followUpDate), "yyyy-MM-dd") : ""
        })
        setShowEditDialog(true)
    }

    const handleUpdate = async () => {
        if (!selectedRecord) return

        try {
            const payload = {
                ...formData,
                employeeId: parseInt(formData.employeeId)
            }
            await counselingService.updateCounselingRecord(selectedRecord.id, payload)
            toast.success("Counseling record updated successfully")
            setShowEditDialog(false)
            resetForm()
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update counseling record")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this counseling record?")) return

        try {
            await counselingService.deleteCounselingRecord(id)
            toast.success("Counseling record deleted successfully")
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete counseling record")
        }
    }

    const handleView = (record: CounselingRecord) => {
        setSelectedRecord(record)
        setShowViewDialog(true)
    }

    const resetForm = () => {
        setFormData({
            employeeId: "",
            counselingDate: format(new Date(), "yyyy-MM-dd"),
            issueType: "Absenteeism",
            description: "",
            actionTaken: "",
            followUpNotes: "",
            status: "Open",
            severity: "Low",
            followUpDate: ""
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-100">
                                <IconNote className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Counseling Log</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Employee Counseling & Performance Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-full h-8 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700">
                                        <IconPlus className="mr-2 size-4" />
                                        New Record
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create Counseling Record</DialogTitle>
                                        <DialogDescription>Fill in the details to create a new counseling record.</DialogDescription>
                                    </DialogHeader>
                                    <CounselingForm formData={formData} setFormData={setFormData} employees={employees} onSubmit={handleCreate} onCancel={() => setShowCreateDialog(false)} />
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <Card className="border-l-4 border-l-indigo-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Records</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-indigo-600">{summary.totalRecords}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-rose-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Open Cases</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-rose-600">{summary.openCases}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-emerald-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Closed Cases</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-emerald-600">{summary.closedCases}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">High Severity</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-red-600">{summary.highSeverity}</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Follow-ups</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-2 text-orange-600">{summary.requiringFollowUp}</h3>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Search & Filter</CardTitle>
                        <CardDescription>Filter counseling records by various criteria.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
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
                                    <option value="all">All</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue Type</label>
                                <NativeSelect value={issueType} onChange={(e) => setIssueType(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All</option>
                                    {ISSUE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</label>
                                <NativeSelect value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">All</option>
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
                                className="h-10 rounded-xl gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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
                    <div className="p-6 border-b bg-muted/20">
                        <h2 className="text-sm font-bold uppercase tracking-tighter">
                            Counseling Records
                            {hasSearched && <Badge className="ml-2 bg-indigo-100 text-indigo-600">{filteredData.length}</Badge>}
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Counseling Record Details</DialogTitle>
                    </DialogHeader>
                    {selectedRecord && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Employee</Label>
                                    <p className="font-bold">{selectedRecord.employeeName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRecord.employeeIdCard}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Department</Label>
                                    <p className="font-medium">{selectedRecord.department}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Date</Label>
                                    <p className="font-medium">{format(new Date(selectedRecord.counselingDate), "dd MMM yyyy")}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Issue Type</Label>
                                    <p className="font-medium">{selectedRecord.issueType}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Severity</Label>
                                    <p className="font-medium">{selectedRecord.severity}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <p className="text-sm border rounded-lg p-3 bg-muted/20">{selectedRecord.description}</p>
                            </div>
                            {selectedRecord.actionTaken && (
                                <div>
                                    <Label className="text-xs text-muted-foreground">Action Taken</Label>
                                    <p className="text-sm border rounded-lg p-3 bg-muted/20">{selectedRecord.actionTaken}</p>
                                </div>
                            )}
                            {selectedRecord.followUpNotes && (
                                <div>
                                    <Label className="text-xs text-muted-foreground">Follow-up Notes</Label>
                                    <p className="text-sm border rounded-lg p-3 bg-muted/20">{selectedRecord.followUpNotes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Counseling Record</DialogTitle>
                    </DialogHeader>
                    <CounselingForm formData={formData} setFormData={setFormData} employees={employees} onSubmit={handleUpdate} onCancel={() => setShowEditDialog(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CounselingForm({ formData, setFormData, employees, onSubmit, onCancel }: any) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Employee *</Label>
                    <NativeSelect
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        className="rounded-xl"
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp: any) => (
                            <option key={emp.id} value={emp.id}>{emp.employeeId} - {emp.fullNameEn}</option>
                        ))}
                    </NativeSelect>
                </div>
                <div className="space-y-2">
                    <Label>Counseling Date *</Label>
                    <Input
                        type="date"
                        value={formData.counselingDate}
                        onChange={(e) => setFormData({ ...formData, counselingDate: e.target.value })}
                        className="rounded-xl"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Issue Type *</Label>
                    <NativeSelect
                        value={formData.issueType}
                        onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                        className="rounded-xl"
                    >
                        {ISSUE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </NativeSelect>
                </div>
                <div className="space-y-2">
                    <Label>Severity *</Label>
                    <NativeSelect
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="rounded-xl"
                    >
                        {SEVERITY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </NativeSelect>
                </div>
                <div className="space-y-2">
                    <Label>Status *</Label>
                    <NativeSelect
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="rounded-xl"
                    >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </NativeSelect>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-xl min-h-[100px]"
                    placeholder="Describe the issue..."
                />
            </div>

            <div className="space-y-2">
                <Label>Action Taken</Label>
                <Textarea
                    value={formData.actionTaken}
                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                    className="rounded-xl min-h-[80px]"
                    placeholder="What actions were taken..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Follow-up Notes</Label>
                    <Textarea
                        value={formData.followUpNotes}
                        onChange={(e) => setFormData({ ...formData, followUpNotes: e.target.value })}
                        className="rounded-xl"
                        placeholder="Additional notes..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>Follow-up Date</Label>
                    <Input
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                        className="rounded-xl"
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={onCancel} className="rounded-xl">
                    <IconX className="mr-2 size-4" />
                    Cancel
                </Button>
                <Button onClick={onSubmit} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                    <IconNote className="mr-2 size-4" />
                    Save Record
                </Button>
            </div>
        </div>
    )
}
