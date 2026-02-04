"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconCalendarStats,
    IconPlus,
    IconTrash,
    IconFilter,
    IconSearch,
    IconCalendarEvent,
    IconUsersGroup,
    IconLoader,
    IconCircleCheckFilled,
    IconClock,
    IconChevronDown
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { rosterService, type Roster } from "@/lib/services/roster"
import { employeeService } from "@/lib/services/employee"
import { organogramService } from "@/lib/services/organogram"
import { shiftService } from "@/lib/services/shift"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Calendar23 from "@/components/calendar-23"

export default function RosterManagementPage() {
    const [rosters, setRosters] = React.useState<Roster[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    // Filter states
    const [searchTerm, setSearchTerm] = React.useState("")
    const [departmentId, setDepartmentId] = React.useState<string>("all")
    const [fromDate, setFromDate] = React.useState<string>(new Date().toISOString().split('T')[0])
    const [toDate, setToDate] = React.useState<string>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    // UI States
    const [isSingleSheetOpen, setIsSingleSheetOpen] = React.useState(false)
    const [isBulkSheetOpen, setIsBulkSheetOpen] = React.useState(false)

    // Form data
    const [departments, setDepartments] = React.useState<any[]>([])
    const [shifts, setShifts] = React.useState<any[]>([])
    const [allEmployees, setAllEmployees] = React.useState<any[]>([])

    const [singleData, setSingleData] = React.useState({
        employeeId: "",
        date: new Date().toISOString().split('T')[0],
        shiftId: "",
        isOffDay: false
    })

    const [bulkData, setBulkData] = React.useState({
        employeeIds: [] as number[],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shiftId: "",
        isOffDay: false
    })

    const fetchData = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const params: any = {}
            if (departmentId !== "all") params.departmentId = parseInt(departmentId)
            if (searchTerm.trim()) params.searchTerm = searchTerm
            if (fromDate) params.fromDate = fromDate
            if (toDate) params.toDate = toDate

            const data = await rosterService.getRosters(params)
            setRosters(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load rosters")
        } finally {
            setIsLoading(false)
        }
    }, [departmentId, searchTerm, fromDate, toDate])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    React.useEffect(() => {
        const loadInitial = async () => {
            try {
                const [depts, shfts, emps] = await Promise.all([
                    organogramService.getDepartments(),
                    shiftService.getShifts(),
                    employeeService.getEmployees({ isActive: true })
                ])
                setDepartments(depts)
                setShifts(shfts)
                setAllEmployees(emps)
            } catch (error) {
                console.error(error)
            }
        }
        loadInitial()
    }, [])

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!singleData.employeeId || !singleData.shiftId) {
            toast.error("Please fill all required fields")
            return
        }

        try {
            await rosterService.createRoster({
                employeeId: parseInt(singleData.employeeId),
                date: singleData.date,
                shiftId: parseInt(singleData.shiftId),
                isOffDay: singleData.isOffDay
            })
            toast.success("Roster updated successfully")
            setIsSingleSheetOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Failed to update roster")
        }
    }

    const handleBulkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (bulkData.employeeIds.length === 0 || !bulkData.shiftId) {
            toast.error("Please select employees and shift")
            return
        }

        try {
            await rosterService.createBulkRoster({
                employeeIds: bulkData.employeeIds,
                startDate: bulkData.startDate,
                endDate: bulkData.endDate,
                shiftId: parseInt(bulkData.shiftId),
                isOffDay: bulkData.isOffDay
            })
            toast.success("Bulk roster updated")
            setIsBulkSheetOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Failed to process bulk roster")
        }
    }

    const columns: ColumnDef<Roster>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconCalendarEvent className="size-4 text-primary/60" />
                    <span className="font-medium">
                        {new Date(row.original.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "employeeName",
            header: "Employee Details",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{row.original.employeeIdCard} • {row.original.designationName}</span>
                </div>
            )
        },
        {
            accessorKey: "departmentName",
            header: "Department",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-normal bg-muted/30">
                    {row.original.departmentName}
                </Badge>
            )
        },
        {
            accessorKey: "shiftName",
            header: "Assigned Shift",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className={cn(
                            "font-medium text-sm",
                            row.original.isOffDay ? "text-amber-600" : "text-primary"
                        )}>
                            {row.original.isOffDay ? "OFF DAY" : row.original.shiftName}
                        </span>
                    </div>
                    {!row.original.isOffDay && (
                        <span className="text-[10px] text-muted-foreground">
                            {row.original.startTime} - {row.original.endTime}
                        </span>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 bg-muted/20 min-h-screen px-4 lg:px-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <IconCalendarStats className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Roster Management</h1>
                        <p className="text-sm text-muted-foreground">Schedule shifts and manage workforce duty rosters.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 shadow-sm rounded-xl" onClick={() => setIsBulkSheetOpen(true)}>
                        <IconUsersGroup className="size-4" />
                        Bulk Roster
                    </Button>
                    <Button className="gap-2 shadow-md rounded-xl" onClick={() => setIsSingleSheetOpen(true)}>
                        <IconPlus className="size-4" />
                        Quick Assign
                    </Button>
                </div>
            </div>

            {/* Quick Stats/Filter Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="lg:col-span-4 border-none shadow-sm bg-background/60 backdrop-blur-sm overflow-hidden">
                    <div className="h-1 bg-primary/30 w-full" />
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Search Employee</Label>
                                <div className="relative">
                                    <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Name or ID..."
                                        className="pl-9 h-10 border-none bg-muted/30 focus-visible:ring-1"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Department</Label>
                                <NativeSelect
                                    className="h-10 border-none bg-muted/30"
                                    value={departmentId}
                                    onChange={e => setDepartmentId(e.target.value)}
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">From Date</Label>
                                <Input
                                    type="date"
                                    className="h-10 border-none bg-muted/30"
                                    value={fromDate}
                                    onChange={e => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">To Date</Label>
                                <Input
                                    type="date"
                                    className="h-10 border-none bg-muted/30"
                                    value={toDate}
                                    onChange={e => setToDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-background">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <IconLoader className="size-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground font-medium animate-pulse">Syncing duty roster...</p>
                        </div>
                    ) : (
                        <DataTable
                            data={rosters}
                            columns={columns}
                            showActions={true}
                            showTabs={false}
                            enableSelection={true}
                            onDelete={(r) => {
                                rosterService.deleteRoster(r.id).then(() => {
                                    toast.success("Schedule deleted")
                                    fetchData()
                                })
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Single Assignment Sheet */}
            <Sheet open={isSingleSheetOpen} onOpenChange={setIsSingleSheetOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-md border-l-primary/10">
                    <SheetHeader className="pb-6">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <IconPlus className="size-6" />
                        </div>
                        <SheetTitle>Quick Shift Assign</SheetTitle>
                        <SheetDescription>Assign a shift to an individual employee for a specific date.</SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSingleSubmit} className="space-y-5 py-2">
                        <div className="space-y-2">
                            <Label>Choose Employee</Label>
                            <Select
                                value={singleData.employeeId}
                                onValueChange={v => setSingleData(p => ({ ...p, employeeId: v }))}
                            >
                                <SelectTrigger className="h-11 bg-muted/30 border-none">
                                    <SelectValue placeholder="Select Employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allEmployees.map(e => (
                                        <SelectItem key={e.id} value={e.id.toString()}>
                                            {e.fullNameEn} ({e.employeeId})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Schedule Date</Label>
                            <Input
                                type="date"
                                className="h-11 bg-muted/30 border-none"
                                value={singleData.date}
                                onChange={e => setSingleData(p => ({ ...p, date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Select Shift</Label>
                            <Select
                                value={singleData.shiftId}
                                onValueChange={v => setSingleData(p => ({ ...p, shiftId: v }))}
                            >
                                <SelectTrigger className="h-11 bg-muted/30 border-none">
                                    <SelectValue placeholder="Select Shift Template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shifts.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.nameEn} ({s.inTime} - {s.outTime})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-dashed">
                            <input
                                type="checkbox"
                                id="isOffDaySingle"
                                className="size-4 accent-primary"
                                checked={singleData.isOffDay}
                                onChange={e => setSingleData(p => ({ ...p, isOffDay: e.target.checked }))}
                            />
                            <Label htmlFor="isOffDaySingle" className="cursor-pointer">Mark as Weekly Off Day</Label>
                        </div>

                        <SheetFooter className="pt-6">
                            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg">Save Assignment</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Bulk Assignment Sheet */}
            <Sheet open={isBulkSheetOpen} onOpenChange={setIsBulkSheetOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-lg border-l-primary/10">
                    <SheetHeader className="pb-6">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <IconUsersGroup className="size-6" />
                        </div>
                        <SheetTitle>Bulk Roster Planning</SheetTitle>
                        <SheetDescription>Update multiple employees for a specific date range at once.</SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleBulkSubmit} className="space-y-6 py-2">
                        <div className="space-y-2">
                            <Label>Select Employees (Multi-select)</Label>
                            <div className="max-h-[150px] overflow-y-auto p-3 bg-muted/30 rounded-xl border space-y-2">
                                {allEmployees.map(e => (
                                    <div key={e.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="size-4"
                                            checked={bulkData.employeeIds.includes(e.id)}
                                            onChange={checked => {
                                                const ids = [...bulkData.employeeIds]
                                                if (checked.target.checked) ids.push(e.id)
                                                else {
                                                    const idx = ids.indexOf(e.id)
                                                    ids.splice(idx, 1)
                                                }
                                                setBulkData(p => ({ ...p, employeeIds: ids }))
                                            }}
                                        />
                                        <span className="text-xs">{e.fullNameEn} ({e.employeeId})</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    className="h-11 bg-muted/30 border-none"
                                    value={bulkData.startDate}
                                    onChange={e => setBulkData(p => ({ ...p, startDate: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    className="h-11 bg-muted/30 border-none"
                                    value={bulkData.endDate}
                                    onChange={e => setBulkData(p => ({ ...p, endDate: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Shift Template</Label>
                            <Select
                                value={bulkData.shiftId}
                                onValueChange={v => setBulkData(p => ({ ...p, shiftId: v }))}
                            >
                                <SelectTrigger className="h-11 bg-muted/30 border-none">
                                    <SelectValue placeholder="Choose Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shifts.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.nameEn} ({s.inTime} - {s.outTime})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-dashed">
                            <input
                                type="checkbox"
                                id="isOffDayBulk"
                                className="size-4 accent-primary"
                                checked={bulkData.isOffDay}
                                onChange={e => setBulkData(p => ({ ...p, isOffDay: e.target.checked }))}
                            />
                            <Label htmlFor="isOffDayBulk" className="cursor-pointer">Mark as Weekly Off for all selected</Label>
                        </div>

                        <SheetFooter className="pt-4">
                            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg border-b-4 border-primary/20 hover:border-b-0 transition-all">Process Bulk Roster</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
