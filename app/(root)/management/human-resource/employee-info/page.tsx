"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    IconUserCircle,
    IconFilter,
    IconPlus,
    IconCircleCheckFilled,
    IconLoader,
    IconClock,
    IconFileSpreadsheet
} from "@tabler/icons-react"
import { type ColumnDef } from "@tanstack/react-table"
import { employeeService, type Employee } from "@/lib/services/employee"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"

const employeeColumns: ColumnDef<Employee>[] = [
    {
        id: "sl",
        header: "SL",
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.index + 1}</span>,
    },
    {
        accessorKey: "employeeId",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.employeeId}</span>,
    },
    {
        accessorKey: "fullNameEn",
        header: "Employee Name",
        cell: ({ row }) => <span className="font-medium">{row.original.fullNameEn}</span>,
    },
    {
        accessorKey: "designationName",
        header: "Designation",
    },
    {
        accessorKey: "departmentName",
        header: "Department",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-normal">
                {row.original.departmentName || 'N/A'}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit font-normal">
                    {status === "Active" ? (
                        <IconCircleCheckFilled className="size-3.5 text-green-500" />
                    ) : status === "On Leave" ? (
                        <IconClock className="size-3.5 text-amber-500" />
                    ) : (
                        <IconLoader className="size-3.5 text-muted-foreground animate-spin-slow" />
                    )}
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "joinDate",
        header: "Join Date",
        cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString(),
    },
    {
        accessorKey: "isOTEnabled",
        header: "OT Status",
        cell: ({ row }) => (
            <Badge variant={row.original.isOTEnabled ? "default" : "secondary"} className="font-normal">
                {row.original.isOTEnabled ? "Enabled" : "Disabled"}
            </Badge>
        ),
    },
]

export default function EmployeeInfoPage() {
    const router = useRouter()

    // Filter States
    const [empIdSearch, setEmpIdSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("Active")
    const [deptFilter, setDeptFilter] = React.useState<number | "All">("All")
    const [sectionFilter, setSectionFilter] = React.useState<number | "All">("All")
    const [designationFilter, setDesignationFilter] = React.useState<number | "All">("All")
    const [lineFilter, setLineFilter] = React.useState<number | "All">("All")
    const [groupFilter, setGroupFilter] = React.useState<number | "All">("All")
    const [shiftFilter, setShiftFilter] = React.useState<number | "All">("All")

    // Data States
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    // Option Lists
    const [departments, setDepartments] = React.useState<any[]>([])
    const [sections, setSections] = React.useState<any[]>([])
    const [designations, setDesignations] = React.useState<any[]>([])
    const [lines, setLines] = React.useState<any[]>([])
    const [groups, setGroups] = React.useState<any[]>([])
    const [shifts, setShifts] = React.useState<any[]>([])

    // Load initial reference data
    React.useEffect(() => {
        const loadRefs = async () => {
            try {
                const [depts, grps, shfts] = await Promise.all([
                    organogramService.getDepartments(),
                    organogramService.getGroups(),
                    organogramService.getShifts()
                ])
                setDepartments(depts)
                setGroups(grps)
                setShifts(shfts)
            } catch (error) {
                console.error("Failed to load reference data", error)
            }
        }
        loadRefs()
    }, [])

    // Cascading dropdowns
    React.useEffect(() => {
        if (deptFilter !== "All") {
            organogramService.getSections(deptFilter as number).then(setSections)
        } else {
            setSections([])
            setSectionFilter("All")
        }
    }, [deptFilter])

    React.useEffect(() => {
        if (sectionFilter !== "All") {
            organogramService.getDesignations(sectionFilter as number).then(setDesignations)
            organogramService.getLines(sectionFilter as number).then(setLines)
        } else {
            setDesignations([])
            setDesignationFilter("All")
            setLines([])
            setLineFilter("All")
        }
    }, [sectionFilter])


    const fetchEmployees = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const params: any = {}
            if (statusFilter !== "All") params.status = statusFilter
            if (deptFilter !== "All") params.departmentId = deptFilter
            if (sectionFilter !== "All") params.sectionId = sectionFilter
            if (designationFilter !== "All") params.designationId = designationFilter
            if (lineFilter !== "All") params.lineId = lineFilter
            if (groupFilter !== "All") params.groupId = groupFilter
            if (shiftFilter !== "All") params.shiftId = shiftFilter
            if (empIdSearch.trim()) params.searchTerm = empIdSearch

            // params.isActive = true // Optional: decide if we always want active only or controlled by status filter

            const data = await employeeService.getEmployees(params)
            setEmployees(data)
        } catch (error) {
            toast.error("Failed to load employees")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [statusFilter, deptFilter, sectionFilter, designationFilter, lineFilter, groupFilter, shiftFilter, empIdSearch])

    React.useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchEmployees()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [fetchEmployees])

    const handleDelete = async (employee: Employee) => {
        try {
            await employeeService.deleteEmployee(employee.id)
            toast.success("Employee deactivated successfully")
            fetchEmployees()
        } catch (error) {
            toast.error("Failed to deactivate employee")
            console.error(error)
        }
    }

    const resetFilters = () => {
        setStatusFilter("Active")
        setDeptFilter("All")
        setSectionFilter("All")
        setDesignationFilter("All")
        setLineFilter("All")
        setGroupFilter("All")
        setShiftFilter("All")
        setEmpIdSearch("")
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <IconUserCircle className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Employee Information</h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="w-fit"
                        onClick={() => router.push("/management/human-resource/employee-info/import")}
                    >
                        <IconFileSpreadsheet className="mr-2 size-4" />
                        Import Data
                    </Button>
                    <Button className="w-fit" onClick={() => router.push("/management/human-resource/employee-info/create")}>
                        <IconPlus className="mr-2 size-4" />
                        New Employee
                    </Button>
                </div>
            </div>

            <div className="px-4 lg:px-6">
                <Card className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconFilter className="size-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-medium">Advanced Filters</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground h-8 text-xs"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="id-search" className="text-[10px] uppercase font-bold text-muted-foreground">Search ID / Name</Label>
                                <Input
                                    id="id-search"
                                    placeholder="Type ID or Name..."
                                    className="h-9 bg-background"
                                    value={empIdSearch}
                                    onChange={(e) => setEmpIdSearch(e.target.value)}
                                />
                            </div>

                            {/* Department */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="dept-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Department</Label>
                                <NativeSelect
                                    id="dept-filter"
                                    value={deptFilter.toString()}
                                    onChange={(e) => setDeptFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                    className="h-9"
                                >
                                    <option value="All">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            {/* Section */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="sec-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Section</Label>
                                <NativeSelect
                                    id="sec-filter"
                                    value={sectionFilter.toString()}
                                    onChange={(e) => setSectionFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                    className="h-9"
                                    disabled={deptFilter === "All"}
                                >
                                    <option value="All">All Sections</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            {/* Designation */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="desig-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Designation</Label>
                                <NativeSelect
                                    id="desig-filter"
                                    value={designationFilter.toString()}
                                    onChange={(e) => setDesignationFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                    className="h-9"
                                    disabled={sectionFilter === "All"}
                                >
                                    <option value="All">All Designations</option>
                                    {designations.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            {/* Line */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="line-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Line</Label>
                                <NativeSelect
                                    id="line-filter"
                                    value={lineFilter.toString()}
                                    onChange={(e) => setLineFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                    className="h-9"
                                    disabled={sectionFilter === "All"}
                                >
                                    <option value="All">All Lines</option>
                                    {lines.map(l => <option key={l.id} value={l.id}>{l.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            {/* Group */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="group-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Group</Label>
                                <NativeSelect
                                    id="group-filter"
                                    value={groupFilter.toString()}
                                    onChange={(e) => setGroupFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                    className="h-9"
                                >
                                    <option value="All">All Groups</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            {/* Shift */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="shift-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Shift</Label>
                                <NativeSelect
                                    id="shift-filter"
                                    value={shiftFilter.toString()}
                                    onChange={(e) => setShiftFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                    className="h-9"
                                >
                                    <option value="All">All Shifts</option>
                                    {shifts.map(s => <option key={s.id} value={s.id}>{s.nameEn} ({s.inTime}-{s.outTime})</option>)}
                                </NativeSelect>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="status-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
                                <NativeSelect
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-9"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Probation">Probation</option>
                                </NativeSelect>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <IconLoader className="size-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable
                    data={employees}
                    columns={employeeColumns}
                    showTabs={false}
                    showActions={true}
                    enableSelection={true}
                    searchKey="fullNameEn"
                    onEditClick={(emp) => router.push(`/management/human-resource/employee-info/edit/${emp.id}`)}
                    onDelete={handleDelete}
                    onDeleteSelected={async (employees) => {
                        try {
                            await Promise.all(employees.map(emp => employeeService.deleteEmployee(emp.id)))
                            fetchEmployees()
                        } catch (error) {
                            toast.error("Failed to delete some employees")
                        }
                    }}
                />
            )}
        </div>
    )
}
