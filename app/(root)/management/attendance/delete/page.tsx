"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconArrowLeft,
    IconCalendar,
    IconTrash,
    IconUsers,
    IconAlertTriangle,
    IconLoader,
    IconPlus,
    IconCheck
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { employeeService, type Employee } from "@/lib/services/employee"
import { organogramService } from "@/lib/services/organogram"
import { attendanceService } from "@/lib/services/attendance"
import { toast } from "sonner"
import { format } from "date-fns"

export default function AttendanceDeletePage() {
    const router = useRouter()
    const [isLoadingEmployees, setIsLoadingEmployees] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Filter options
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [departments, setDepartments] = React.useState<any[]>([])
    const [sections, setSections] = React.useState<any[]>([])

    // Selection/Form states
    const [selectedEmployees, setSelectedEmployees] = React.useState<Employee[]>([])
    const [fromDate, setFromDate] = React.useState(format(new Date(), "yyyy-MM-dd"))
    const [toDate, setToDate] = React.useState(format(new Date(), "yyyy-MM-dd"))
    const [departmentId, setDepartmentId] = React.useState<string>("all")
    const [sectionId, setSectionId] = React.useState<string>("all")

    React.useEffect(() => {
        fetchInitialData()
        fetchEmployees()
    }, [])

    const fetchInitialData = async () => {
        try {
            const depts = await organogramService.getDepartments()
            setDepartments(depts)
        } catch (error) {
            console.error(error)
        }
    }

    React.useEffect(() => {
        if (departmentId !== "all") {
            organogramService.getSections(parseInt(departmentId)).then(setSections)
        } else {
            setSections([])
            setSectionId("all")
        }
    }, [departmentId])

    const fetchEmployees = async () => {
        setIsLoadingEmployees(true)
        try {
            const data = await employeeService.getEmployees({})
            setEmployees(data)
        } catch (error) {
            toast.error("Failed to load employees")
        } finally {
            setIsLoadingEmployees(false)
        }
    }

    const handleDelete = async () => {
        const confirmMsg = "Are you sure you want to delete these attendance records? This action cannot be undone."
        if (!confirm(confirmMsg)) return

        setIsDeleting(true)
        try {
            const result = await attendanceService.deleteAttendance({
                fromDate,
                toDate,
                employeeIds: selectedEmployees.length > 0 ? selectedEmployees.map(e => e.id) : undefined,
                departmentId: departmentId !== "all" ? parseInt(departmentId) : undefined,
                sectionId: sectionId !== "all" ? parseInt(sectionId) : undefined
            })
            toast.success(result.message || "Attendance records deleted successfully")
            router.push("/management/attendance")
        } catch (error) {
            toast.error("Failed to delete attendance records")
        } finally {
            setIsDeleting(false)
        }
    }

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: "employeeId",
            header: "ID",
            cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.employeeId}</span>,
        },
        {
            accessorKey: "fullNameEn",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.fullNameEn}</span>,
        },
        {
            accessorKey: "departmentName",
            header: "Department",
            cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.original.departmentName}</Badge>,
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <IconArrowLeft className="size-5" />
                    </Button>
                    <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                        <IconTrash className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-destructive">Delete logs</h1>
                        <p className="text-muted-foreground text-sm">Permanently remove attendance records</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push("/management/attendance/manual-entry")}
                    >
                        <IconPlus className="size-4" />
                        Manual Entry
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
                {/* Configuration Card */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <IconCalendar className="h-4 w-4 text-primary" />
                            Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fromDate" className="text-sm font-semibold">From Date</Label>
                                <Input
                                    id="fromDate"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="toDate" className="text-sm font-semibold">To Date</Label>
                                <Input
                                    id="toDate"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department" className="text-sm font-semibold">Department (Optional)</Label>
                            <NativeSelect
                                id="department"
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="h-11 rounded-xl"
                            >
                                <option value="all">All Departments</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                            </NativeSelect>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="section" className="text-sm font-semibold">Section (Optional)</Label>
                            <NativeSelect
                                id="section"
                                value={sectionId}
                                onChange={(e) => setSectionId(e.target.value)}
                                disabled={departmentId === "all"}
                                className="h-11 rounded-xl"
                            >
                                <option value="all">All Sections</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                            </NativeSelect>
                        </div>

                        <div className="pt-2 space-y-4">
                            <Card className="bg-destructive/5 border-destructive/10">
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <div className="size-8 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                                            <IconAlertTriangle className="size-4 text-destructive" />
                                        </div>
                                        <p className="text-[11px] text-destructive font-medium leading-relaxed pt-0.5">
                                            Warning: This will permanently delete records for the {selectedEmployees.length > 0 ? "selected employees" : "entire scope"}.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                variant="destructive"
                                className="w-full h-11 gap-2 font-bold shadow-lg shadow-destructive/20"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <IconLoader className="animate-spin h-4 w-4" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <IconTrash className="h-4 w-4" />
                                        Delete Selected Logs
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Selection Section */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-base font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconUsers className="h-4 w-4 text-primary" />
                                <span>Employee Selection</span>
                            </div>
                            <Badge variant="outline" className="font-semibold bg-primary/5 text-primary border-primary/20">
                                {selectedEmployees.length} Employees Selected
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoadingEmployees ? (
                            <div className="h-[500px] flex flex-col items-center justify-center gap-3">
                                <IconLoader className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground animate-pulse">Loading employee data...</p>
                            </div>
                        ) : (
                            <DataTable
                                data={employees}
                                columns={columns}
                                enableSelection={true}
                                showActions={false}
                                showTabs={false}
                                searchKey="fullNameEn"
                                onSelectionChange={(rows) => setSelectedEmployees(rows)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
