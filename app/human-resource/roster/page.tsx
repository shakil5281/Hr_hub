"use client"

import * as React from "react"
import { IconCalendar, IconPlus, IconTrash, IconPencil, IconCalendarStats, IconCalendarMonth } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import { NativeSelect } from "@/components/ui/select"
import Calendar23 from "@/components/calendar-23"

// --- Types ---

type Roster = {
    id: number
    employeeId: string
    employeeName: string
    department: string
    designation: string
    date: string
    shiftName: string
    startTime: string
    endTime: string
}

const mockRosterData: Roster[] = [
    { id: 1, employeeId: "EMP001", employeeName: "John Doe", department: "Engineering", designation: "Software Engineer", date: "2024-05-20", shiftName: "General Shift", startTime: "09:00 AM", endTime: "06:00 PM" },
    { id: 2, employeeId: "EMP002", employeeName: "Jane Smith", department: "HR", designation: "HR Manager", date: "2024-05-20", shiftName: "Morning Shift", startTime: "06:00 AM", endTime: "02:00 PM" },
    { id: 3, employeeId: "EMP003", employeeName: "Alice Johnson", department: "Engineering", designation: "QA Engineer", date: "2024-05-21", shiftName: "Evening Shift", startTime: "02:00 PM", endTime: "10:00 PM" },
]

export default function RosterPage() {
    const [data, setData] = React.useState<Roster[]>(mockRosterData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [currentRoster, setCurrentRoster] = React.useState<Partial<Roster>>({})
    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | undefined>()

    // --- Columns ---
    const columns: ColumnDef<Roster>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <span className="font-medium text-muted-foreground">{row.getValue("date")}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("employeeName")}</span>
                    <span className="text-xs text-muted-foreground">{row.original.employeeId}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <Badge variant="outline">{row.getValue("department")}</Badge>
        },
        {
            accessorKey: "shiftName",
            header: "Shift",
            cell: ({ row }) => (
                <div>
                    <span className="block font-medium">{row.getValue("shiftName")}</span>
                    <span className="text-xs text-muted-foreground">{row.original.startTime} - {row.original.endTime}</span>
                </div>
            )
        },
    ]

    // --- Actions ---
    const handleAddClick = () => {
        setIsEditing(false)
        setCurrentRoster({})
        setIsSheetOpen(true)
    }

    const handleEditClick = (roster: Roster) => {
        setIsEditing(true)
        setCurrentRoster({ ...roster })
        setIsSheetOpen(true)
    }

    const handleDelete = (roster: Roster) => {
        setData(prev => prev.filter(item => item.id !== roster.id))
        toast.success("Roster entry removed successfully")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock save
        if (!isEditing) {
            const newId = Math.max(...data.map(d => d.id), 0) + 1
            // Mock data population for demo
            const newItem: Roster = {
                id: newId,
                employeeId: currentRoster.employeeId || "EMP-NEW",
                employeeName: "New Employee",
                department: "Engineering",
                designation: "Developer",
                date: currentRoster.date || "2024-05-22",
                shiftName: currentRoster.shiftName || "General Shift",
                startTime: "09:00 AM",
                endTime: "06:00 PM"
            }
            setData(prev => [...prev, newItem])
            toast.success("Roster entry created")
        } else {
            setData(prev => prev.map(item => item.id === currentRoster.id ? { ...item, ...currentRoster } as Roster : item))
            toast.success("Roster entry updated")
        }
        setIsSheetOpen(false)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconCalendarStats className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Roster Management</h1>
                    </div>
                    <p className="text-muted-foreground">Manage employee shift schedules and roster planning.</p>
                </div>
                <Button className="gap-2" onClick={handleAddClick}>
                    <IconPlus className="size-4" />
                    Add Schedule
                </Button>
            </div>

            <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <CardContent className="p-4 grid gap-4 md:grid-cols-4 items-end">
                    <div className="grid gap-2">
                        <Label>Search Employee</Label>
                        <Input placeholder="ID or Name..." />
                    </div>
                    <div className="grid gap-2">
                        <Label>Department</Label>
                        <NativeSelect>
                            <option value="all">All Departments</option>
                            <option value="eng">Engineering</option>
                            <option value="hr">HR</option>
                        </NativeSelect>
                    </div>
                    <div className="grid gap-2">
                        <Label>Date Range</Label>
                        <div className="w-full">
                            {/* @ts-ignore - Calendar23 props might differ slightly in actual implementation */}
                            <Calendar23 />
                        </div>
                    </div>
                    <Button variant="outline" className="w-full">
                        Apply Filters
                    </Button>
                </CardContent>
            </Card>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Add Schedule"
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDelete={handleDelete}
                showColumnCustomizer={false}
            />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>{isEditing ? "Edit Roster Schedule" : "Add Roster Schedule"}</SheetTitle>
                        <SheetDescription>
                            Assign a shift to an employee for a specific date or date range.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="grid gap-2">
                            <Label>Employee</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="emp1">John Doe (EMP001)</SelectItem>
                                    <SelectItem value="emp2">Jane Smith (EMP002)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                type="date"
                                id="date"
                                value={currentRoster.date}
                                onChange={e => setCurrentRoster(p => ({ ...p, date: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Shift</Label>
                            <Select
                                value={currentRoster.shiftName}
                                onValueChange={v => setCurrentRoster(p => ({ ...p, shiftName: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General Shift">General Shift (09:00 AM - 06:00 PM)</SelectItem>
                                    <SelectItem value="Morning Shift">Morning Shift (06:00 AM - 02:00 PM)</SelectItem>
                                    <SelectItem value="Evening Shift">Evening Shift (02:00 PM - 10:00 PM)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </SheetClose>
                            <Button type="submit">{isEditing ? "Update Schedule" : "Add Schedule"}</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
