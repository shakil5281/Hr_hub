"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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
import { toast } from "sonner"

const employeeColumns: ColumnDef<Employee>[] = [
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
]

export default function EmployeeInfoPage() {
    const router = useRouter()
    const [statusFilter, setStatusFilter] = React.useState("All")
    const [deptFilter, setDeptFilter] = React.useState<number | "All">("All")
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [departments, setDepartments] = React.useState<{ id: number; name: string }[]>([])

    const fetchEmployees = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const params: any = {}
            if (statusFilter !== "All") params.status = statusFilter
            if (deptFilter !== "All") params.departmentId = deptFilter
            params.isActive = true

            const data = await employeeService.getEmployees(params)
            setEmployees(data)

            // Extract unique departments
            const uniqueDepts = Array.from(
                new Map(
                    data
                        .filter(emp => emp.departmentId && emp.departmentName)
                        .map(emp => [emp.departmentId, { id: emp.departmentId, name: emp.departmentName! }])
                ).values()
            )
            setDepartments(uniqueDepts)
        } catch (error) {
            toast.error("Failed to load employees")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [statusFilter, deptFilter])

    React.useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const handleDelete = async (employee: Employee) => {
        if (!confirm(`Are you sure you want to deactivate ${employee.fullNameEn}?`)) return

        try {
            await employeeService.deleteEmployee(employee.id)
            toast.success("Employee deactivated successfully")
            fetchEmployees()
        } catch (error) {
            toast.error("Failed to deactivate employee")
            console.error(error)
        }
    }

    const filteredData = React.useMemo(() => {
        return employees
    }, [employees])

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
                        <div className="flex items-center gap-2">
                            <IconFilter className="size-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col gap-1.5 w-full sm:w-48">
                                <Label htmlFor="dept-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Department</Label>
                                <NativeSelect
                                    id="dept-filter"
                                    value={deptFilter.toString()}
                                    onChange={(e) => setDeptFilter(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                                >
                                    <option value="All">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </NativeSelect>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full sm:w-48">
                                <Label htmlFor="status-filter" className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
                                <NativeSelect
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Probation">Probation</option>
                                </NativeSelect>
                            </div>
                            <div className="flex items-end mt-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={() => {
                                        setStatusFilter("All")
                                        setDeptFilter("All")
                                    }}
                                >
                                    Reset Filters
                                </Button>
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
                    data={filteredData}
                    columns={employeeColumns}
                    showTabs={false}
                    showActions={true}
                    enableSelection={true}
                    addLabel="New Employee"
                    searchKey="fullNameEn"
                    onAddClick={() => router.push("/management/human-resource/employee-info/create")}
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
