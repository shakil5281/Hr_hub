"use client"

import * as React from "react"
import { IconClock, IconPlus } from "@tabler/icons-react"
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
import { shiftService, Shift } from "@/lib/services/shift"

// --- Constants ---

const DAYS_OF_WEEK = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ShiftPage() {
    const [data, setData] = React.useState<Shift[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [currentShift, setCurrentShift] = React.useState<Partial<Shift>>({})
    const [isEditing, setIsEditing] = React.useState(false)

    const fetchShifts = async () => {
        try {
            setLoading(true)
            const shifts = await shiftService.getShifts()
            setData(shifts)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch shifts")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchShifts()
    }, [])

    // Calculate generic hours difference
    const calculateHours = (start?: string, end?: string, lunchDuration: number = 0) => {
        if (!start || !end) return "0.0"

        try {
            const [startH, startM] = start.split(":").map(Number)
            const [endH, endM] = end.split(":").map(Number)

            let diff = (endH * 60 + endM) - (startH * 60 + startM)
            if (diff < 0) diff += 24 * 60 // Handle overnight shifts

            const hours = diff / 60
            return Math.max(0, hours - lunchDuration).toFixed(1)
        } catch (e) {
            return "0.0"
        }
    }

    // --- Columns ---

    const columns: ColumnDef<Shift>[] = [
        {
            accessorKey: "nameEn",
            header: "Shift Name",
            cell: ({ row }) => <span className="font-medium">{row.getValue("nameEn")}</span>
        },
        {
            accessorKey: "inTime",
            header: "Start Time"
        },
        {
            accessorKey: "outTime",
            header: "End Time"
        },
        {
            accessorKey: "lunchHour",
            header: "Lunch Hr",
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("lunchHour")}</span>
        },
        {
            header: "Reg Hours",
            cell: ({ row }) => {
                const s = row.original
                const hours = calculateHours(s.inTime, s.outTime, Number(s.lunchHour))
                return <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-sm">{hours}</span>
            }
        },
        {
            accessorKey: "weekends",
            header: "Weekends",
            cell: ({ row }) => {
                const weekends = (row.getValue("weekends") as string || "").split(",").filter(Boolean)
                if (weekends.length === 0) return <span className="text-muted-foreground text-xs italic">None</span>
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
            nameEn: "",
            inTime: "09:00",
            outTime: "17:00",
            lateInTime: "09:15",
            lunchTimeStart: "13:00",
            lunchHour: 1.0,
            weekends: "Friday",
            status: "Active"
        })
        setIsSheetOpen(true)
    }

    const handleEditClick = (shift: Shift) => {
        setIsEditing(true)
        setCurrentShift({ ...shift })
        setIsSheetOpen(true)
    }

    const handleDelete = async (shift: Shift) => {
        try {
            await shiftService.deleteShift(shift.id)
            toast.success("Shift deleted successfully")
            fetchShifts()
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Failed to delete shift"
            toast.error(message)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const dto = {
                nameEn: currentShift.nameEn || "",
                nameBn: currentShift.nameBn,
                inTime: currentShift.inTime || "",
                outTime: currentShift.outTime || "",
                lateInTime: currentShift.lateInTime,
                lunchTimeStart: currentShift.lunchTimeStart,
                lunchHour: Number(currentShift.lunchHour) || 0,
                weekends: currentShift.weekends,
                status: currentShift.status || "Active"
            }

            if (isEditing && currentShift.id) {
                await shiftService.updateShift(currentShift.id, dto)
                toast.success("Shift updated successfully")
            } else {
                await shiftService.createShift(dto)
                toast.success("New shift created successfully")
            }
            setIsSheetOpen(false)
            fetchShifts()
        } catch (error) {
            console.error(error)
            toast.error("Failed to save shift")
        }
    }

    const handleWeekendChange = (day: string) => {
        const currentWeekendsStr = currentShift.weekends || ""
        let currentWeekends = currentWeekendsStr.split(",").filter(Boolean)

        if (currentWeekends.includes(day)) {
            currentWeekends = currentWeekends.filter(d => d !== day)
        } else {
            currentWeekends.push(day)
        }

        setCurrentShift(prev => ({ ...prev, weekends: currentWeekends.join(",") }))
    }

    const selectedWeekends = (currentShift.weekends || "").split(",").filter(Boolean)
    const regHours = calculateHours(currentShift.inTime, currentShift.outTime, Number(currentShift.lunchHour))

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
                onEditClick={handleEditClick}
                onDelete={handleDelete}
                showColumnCustomizer={false}
                isLoading={loading}
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
                                <Label htmlFor="nameEn">Shift Name (English)</Label>
                                <Input
                                    id="nameEn"
                                    value={currentShift.nameEn || ""}
                                    onChange={e => setCurrentShift(prev => ({ ...prev, nameEn: e.target.value }))}
                                    placeholder="e.g. General Shift"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nameBn">Shift Name (Bangla)</Label>
                                <Input
                                    id="nameBn"
                                    value={currentShift.nameBn || ""}
                                    onChange={e => setCurrentShift(prev => ({ ...prev, nameBn: e.target.value }))}
                                    placeholder="e.g. সাধারণ শিফট"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="inTime">Start Time</Label>
                                    <Input
                                        id="inTime"
                                        type="time"
                                        value={currentShift.inTime || ""}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, inTime: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="outTime">End Time</Label>
                                    <Input
                                        id="outTime"
                                        type="time"
                                        value={currentShift.outTime || ""}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, outTime: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="lateInTime">Late In Time</Label>
                                    <Input
                                        id="lateInTime"
                                        type="time"
                                        value={currentShift.lateInTime || ""}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, lateInTime: e.target.value }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lunchTimeStart">Lunch Start Time</Label>
                                    <Input
                                        id="lunchTimeStart"
                                        type="time"
                                        value={currentShift.lunchTimeStart || ""}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, lunchTimeStart: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="lunchHour">Lunch Duration (Hours)</Label>
                                    <Input
                                        id="lunchHour"
                                        type="number"
                                        step="0.5"
                                        value={currentShift.lunchHour || 0}
                                        onChange={e => setCurrentShift(prev => ({ ...prev, lunchHour: parseFloat(e.target.value) }))}
                                        placeholder="e.g. 1.0"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="reg-hour">Regular Hours (Auto-Calc)</Label>
                                    <Input
                                        id="reg-hour"
                                        type="text"
                                        value={regHours}
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
                                                checked={selectedWeekends.includes(day)}
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

