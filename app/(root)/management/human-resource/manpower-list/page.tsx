"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconUsers,
    IconFilter,
    IconSearch,
    IconChevronDown,
    IconLoader,
    IconCircleCheckFilled,
    IconClock,
    IconUserCircle
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { employeeService, type Employee } from "@/lib/services/employee"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ManpowerListPage() {
    const router = useRouter()

    // Data states
    const [manpower, setManpower] = React.useState<Employee[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isExporting, setIsExporting] = React.useState(false)

    // Filter states
    const [searchTerm, setSearchTerm] = React.useState("")
    const [departmentId, setDepartmentId] = React.useState<string>("all")
    const [sectionId, setSectionId] = React.useState<string>("all")
    const [designationId, setDesignationId] = React.useState<string>("all")
    const [status, setStatus] = React.useState<string>("all")

    // Dropdown options
    const [departments, setDepartments] = React.useState<any[]>([])
    const [sections, setSections] = React.useState<any[]>([])
    const [designations, setDesignations] = React.useState<any[]>([])

    // Fetch initial data
    React.useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const depts = await organogramService.getDepartments()
                setDepartments(depts)
            } catch (error) {
                console.error("Failed to load departments", error)
            }
        }
        fetchInitialData()
    }, [])

    // Fetch sections when department changes
    React.useEffect(() => {
        if (departmentId !== "all") {
            organogramService.getSections(parseInt(departmentId))
                .then(setSections)
                .catch(console.error)
        } else {
            setSections([])
            setSectionId("all")
        }
    }, [departmentId])

    // Fetch designations when section changes
    React.useEffect(() => {
        if (sectionId !== "all") {
            organogramService.getDesignations(parseInt(sectionId))
                .then(setDesignations)
                .catch(console.error)
        } else {
            setDesignations([])
            setDesignationId("all")
        }
    }, [sectionId])

    const fetchManpower = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const params: any = {}
            if (departmentId !== "all") params.departmentId = parseInt(departmentId)
            if (sectionId !== "all") params.sectionId = parseInt(sectionId)
            if (designationId !== "all") params.designationId = parseInt(designationId)
            if (status !== "all") params.status = status
            if (searchTerm.trim()) params.searchTerm = searchTerm

            const data = await employeeService.getManpower(params)
            setManpower(data)
        } catch (error) {
            toast.error("Failed to load manpower data")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [departmentId, sectionId, designationId, status, searchTerm])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchManpower()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [fetchManpower])

    const columns: ColumnDef<Employee>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.index + 1}</span>,
        },
        {
            accessorKey: "employeeId",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs font-semibold text-primary">
                    {row.original.employeeId}
                </span>
            ),
        },
        {
            accessorKey: "fullNameEn",
            header: "Employee Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <IconUserCircle className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{row.original.fullNameEn}</span>
                        <span className="text-[10px] text-muted-foreground">{row.original.phoneNumber || row.original.email || 'No contact'}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "designationName",
            header: "Designation",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-sm">{row.original.designationName}</span>
                    <span className="text-[10px] text-muted-foreground">{row.original.sectionName}</span>
                </div>
            )
        },
        {
            accessorKey: "departmentName",
            header: "Department",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-normal bg-muted/50">
                    {row.original.departmentName}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const st = row.original.status
                return (
                    <Badge variant="outline" className="flex items-center gap-1.5 w-fit font-normal">
                        {st === "Active" ? (
                            <IconCircleCheckFilled className="size-3.5 text-green-500" />
                        ) : st === "On Leave" ? (
                            <IconClock className="size-3.5 text-amber-500" />
                        ) : (
                            <div className="size-2 rounded-full bg-muted-foreground/50" />
                        )}
                        {st}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "joinDate",
            header: "Join Date",
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.joinDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            ),
        },
    ]

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-muted/20 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <IconUsers className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manpower List</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-[#108545]" />
                            Total {manpower.length} Employees Active
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-4 lg:px-8">
                <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm overflow-hidden">
                    <div className="h-1 bg-primary/20 w-full" />
                    <CardHeader className="pb-3 border-b bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconFilter className="size-4 text-primary" />
                                <CardTitle className="text-sm font-medium uppercase tracking-wider">Dynamic Filters</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-muted-foreground hover:text-primary"
                                onClick={() => {
                                    setSearchTerm("")
                                    setDepartmentId("all")
                                    setSectionId("all")
                                    setDesignationId("all")
                                    setStatus("all")
                                }}
                            >
                                Reset All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Search Employee</Label>
                                <div className="relative">
                                    <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Name, ID, Phone..."
                                        className="pl-9 h-10 bg-muted/30 border-none transition-all focus-visible:ring-1"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Department</Label>
                                <NativeSelect
                                    className="h-10 bg-muted/30 border-none"
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map((d: any) => (
                                        <option key={d.id} value={d.id}>{d.nameEn}</option>
                                    ))}
                                </NativeSelect>
                            </div>

                            {/* Section */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Section</Label>
                                <NativeSelect
                                    className="h-10 bg-muted/30 border-none"
                                    value={sectionId}
                                    onChange={(e) => setSectionId(e.target.value)}
                                    disabled={departmentId === "all"}
                                >
                                    <option value="all">All Sections</option>
                                    {sections.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.nameEn}</option>
                                    ))}
                                </NativeSelect>
                            </div>

                            {/* Designation */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Designation</Label>
                                <NativeSelect
                                    className="h-10 bg-muted/30 border-none"
                                    value={designationId}
                                    onChange={(e) => setDesignationId(e.target.value)}
                                    disabled={sectionId === "all"}
                                >
                                    <option value="all">All Designations</option>
                                    {designations.map((d: any) => (
                                        <option key={d.id} value={d.id}>{d.nameEn}</option>
                                    ))}
                                </NativeSelect>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Status</Label>
                                <NativeSelect
                                    className="h-10 bg-muted/30 border-none"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Probation">Probation</option>
                                    <option value="Resigned">Resigned</option>
                                </NativeSelect>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table Section */}
            <div className="px-4 lg:px-8 pb-8">
                <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-background">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="relative">
                                    <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <IconUsers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground animate-pulse">Refining manpower list...</p>
                            </div>
                        ) : (
                            <DataTable
                                data={manpower}
                                columns={columns}
                                addLabel="New Employee"
                                onAddClick={() => router.push("/management/human-resource/employee-info/create")}
                                onEditClick={(emp) => router.push(`/management/human-resource/employee-info/edit/${emp.id}`)}
                                showTabs={false}
                                showActions={true}
                                enableSelection={true}
                                searchKey="fullNameEn"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
