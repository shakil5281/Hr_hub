"use client"

import * as React from "react"
import { IconClock, IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

// --- Types ---

type Shift = {
    id: number
    name: string
    startTime: string
    endTime: string
    lateInTime: string
    lunchTimeStart: string
    lunchHour: string
    regHour: string
    weekends: string[]
    status: "Active" | "Inactive"
}

// --- Mock Data ---

const initialShifts: Shift[] = [
    {
        id: 1,
        name: "General Shift",
        startTime: "09:00 AM",
        endTime: "06:00 PM",
        lateInTime: "09:15 AM",
        lunchTimeStart: "01:00 PM",
        lunchHour: "1.0",
        regHour: "8.0",
        weekends: ["Friday", "Saturday"],
        status: "Active"
    },
    {
        id: 2,
        name: "Morning Shift",
        startTime: "06:00 AM",
        endTime: "02:00 PM",
        lateInTime: "06:15 AM",
        lunchTimeStart: "11:00 AM",
        lunchHour: "0.5",
        regHour: "7.5",
        weekends: ["Friday"],
        status: "Active"
    },
    {
        id: 3,
        name: "Evening Shift",
        startTime: "02:00 PM",
        endTime: "10:00 PM",
        lateInTime: "02:15 PM",
        lunchTimeStart: "07:00 PM",
        lunchHour: "0.5",
        regHour: "7.5",
        weekends: ["Friday"],
        status: "Active"
    },
]

const DAYS_OF_WEEK = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ShiftPage() {
    const [data, setData] = React.useState<Shift[]>(initialShifts)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [currentShift, setCurrentShift] = React.useState<Partial<Shift>>({})
    const [isEditing, setIsEditing] = React.useState(false)

    // Calculate generic hours difference
    const calculateHours = (start: string, end: string, lunchDuration: string) => {
        if (!start || !end) return ""

        try {
            const [startH, startM] = start.split(":").map(Number)
            const [endH, endM] = end.split(":").map(Number)

            let diff = (endH * 60 + endM) - (startH * 60 + startM)
            if (diff < 0) diff += 24 * 60 // Handle overnight shifts

            const hours = diff / 60
            const lunch = parseFloat(lunchDuration) || 0

            return Math.max(0, hours - lunch).toFixed(1)
        } catch (e) {
            return ""
        }
    }

    // Effect to auto-calculate regHour when dependencies change
    React.useEffect(() => {
        if (isSheetOpen && currentShift.startTime && currentShift.endTime) {
            const reg = calculateHours(currentShift.startTime, currentShift.endTime, currentShift.lunchHour || "0")
            if (reg && reg !== currentShift.regHour) {
                setCurrentShift(prev => ({ ...prev, regHour: reg }))
            }
        }
    }, [currentShift.startTime, currentShift.endTime, currentShift.lunchHour, isSheetOpen])

    // --- Columns ---

    const columns: ColumnDef<Shift>[] = [
        {
            accessorKey: "name",
            header: "Shift Name",
            cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>
        },
        {
            accessorKey: "startTime",
            header: "Start Time"
        },
        {
            accessorKey: "endTime",
            header: "End Time"
        },
        {
            accessorKey: "lunchHour",
            header: "Lunch Hr",
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("lunchHour")}</span>
        },
        {
            accessorKey: "regHour",
            header: "Reg Hours",
            cell: ({ row }) => <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-sm">{row.getValue("regHour")}</span>
        },
        {
            accessorKey: "weekends",
            header: "Weekends",
            cell: ({ row }) => {
                const weekends = row.getValue("weekends") as string[]
                return <span className="text-muted-foreground text-xs">{weekends.slice(0, 2).join(", ")}{weekends.length > 2 && "..."}</span>
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
            }
        },
    ]

    // --- Actions ---

    const handleAddClick = () => {
        setIsEditing(false)
        setCurrentShift({
            name: "",
            startTime: "",
            endTime: "",
            lateInTime: "",
            lunchTimeStart: "",
            lunchHour: "1.0",
            regHour: "",
            weekends: ["Friday"],
            status: "Active"
        })
        setIsSheetOpen(true)
    }

    const handleEditClick = (shift: Shift) => {
        setIsEditing(true)
        setCurrentShift({ ...shift })
        setIsSheetOpen(true)
    }

    const handleDelete = (shift: Shift) => {
        setData(prev => prev.filter(s => s.id !== shift.id))
        toast.success("Shift deleted successfully")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing) {
            setData(prev => prev.map(s => s.id === currentShift.id ? { ...currentShift, id: s.id } as Shift : s))
            toast.success("Shift updated successfully")
        } else {
            const newId = Math.max(...data.map(s => s.id), 0) + 1
            setData(prev => [...prev, { ...currentShift, id: newId } as Shift])
            toast.success("New shift created successfully")
        }
        setIsSheetOpen(false)
    }

    const handleWeekendChange = (day: string) => {
        const currentWeekends = currentShift.weekends || []
        if (currentWeekends.includes(day)) {
            setCurrentShift(prev => ({ ...prev, weekends: currentWeekends.filter(d => d !== day) }))
        } else {
            setCurrentShift(prev => ({ ...prev, weekends: [...currentWeekends, day] }))
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconClock className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Shift Management</h1>
                    </div>
                    <p className="text-muted-foreground">Configure working hours, late policies, and breaks.</p>
                </div>
                <Button className="gap-2" onClick={handleAddClick}>
                    <IconPlus className="size-4" />
                    Create Shift
                </Button>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Create Shift"
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDelete={handleDelete}
                showColumnCustomizer={false}
            />

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{isEditing ? "Edit Shift" : "Create New Shift"}</SheetTitle>
                        <SheetDescription>
                            {isEditing ? "Update existing shift details." : "Define a new work shift schedule."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Shift Name</Label>
                                <Input
                                    id="name"
                                    value={currentShift.name}
                                    onChange={e => setCurrentShift(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. General Shift"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start-time">Start Time</Label>
                                    <Input
                                        id="start-time"
                                        type="time"
                                        value={currentShift.startTime?.replace(/ AM| PM/g, "")}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, startTime: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end-time">End Time</Label>
                                    <Input
                                        id="end-time"
                                        type="time"
                                        value={currentShift.endTime?.replace(/ AM| PM/g, "")}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, endTime: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="late-in-time">Late In Time</Label>
                                    <Input
                                        id="late-in-time"
                                        type="time"
                                        value={currentShift.lateInTime?.replace(/ AM| PM/g, "")}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, lateInTime: e.target.value }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lunch-time">Lunch Start Time</Label>
                                    <Input
                                        id="lunch-time"
                                        type="time"
                                        value={currentShift.lunchTimeStart?.replace(/ AM| PM/g, "")}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, lunchTimeStart: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="lunch-hour">Lunch Duration (Hours)</Label>
                                    <Input
                                        id="lunch-hour"
                                        type="number"
                                        step="0.5"
                                        value={currentShift.lunchHour}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, lunchHour: e.target.value }))}
                                        placeholder="e.g. 1.0"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="reg-hour">Regular Hours (Auto-Calc)</Label>
                                    <Input
                                        id="reg-hour"
                                        type="number"
                                        step="0.1"
                                        value={currentShift.regHour}
                                        className="bg-muted font-mono"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Weekend Days</Label>
                                <div className="grid grid-cols-2 gap-2 border rounded-md p-4 bg-muted/20">
                                    {DAYS_OF_WEEK.map(day => (
                                        <div key={day} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`day-${day}`}
                                                checked={currentShift.weekends?.includes(day)}
                                                onCheckedChange={() => handleWeekendChange(day)}
                                            />
                                            <Label htmlFor={`day-${day}`} className="font-normal cursor-pointer text-sm">
                                                {day}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={currentShift.status}
                                    onValueChange={(val: "Active" | "Inactive") => setCurrentShift(prev => ({ ...prev, status: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </SheetClose>
                            <Button type="submit">{isEditing ? "Update Shift" : "Create Shift"}</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
