"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
    IconEdit,
    IconUser,
    IconClock,
    IconMessageDots,
    IconSend,
    IconInfoCircle,
    IconLoader,
    IconPlus,
    IconTrash,
    IconUsers,
    IconSearch,
    IconCheck
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { manualAttendanceService, type ManualAttendanceHistory } from "@/lib/services/manualAttendance"
import { employeeService } from "@/lib/services/employee"
import { toast } from "sonner"

export default function ManualEntryPage() {
    const router = useRouter()
    const [empId, setEmpId] = React.useState("")
    const [empName, setEmpName] = React.useState("")
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null)
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [inTime, setInTime] = React.useState("09:00")
    const [outTime, setOutTime] = React.useState("18:00")
    const [reason, setReason] = React.useState("device-error")
    const [remarks, setRemarks] = React.useState("")
    const [status, setStatus] = React.useState("Present")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSearching, setIsSearching] = React.useState(false)
    const [history, setHistory] = React.useState<ManualAttendanceHistory[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = React.useState(true)

    // Fetch history on mount
    React.useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setIsLoadingHistory(true)
            const data = await manualAttendanceService.getHistory({ pageSize: 10 })
            setHistory(data)
        } catch (error) {
            console.error("Failed to fetch history", error)
        } finally {
            setIsLoadingHistory(false)
        }
    }

    const searchEmployee = async () => {
        if (!empId.trim()) {
            toast.error("Please enter an Employee ID")
            return
        }

        setIsSearching(true)
        try {
            const employees = await employeeService.getEmployees({ searchTerm: empId })

            if (employees.length === 0) {
                toast.error("Employee not found")
                setSelectedEmployeeId(null)
                setEmpName("")
                return
            }

            const employee = employees[0]
            setSelectedEmployeeId(employee.id)
            setEmpName(employee.fullNameEn)
            toast.success(`Employee found: ${employee.fullNameEn}`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to search employee")
            setSelectedEmployeeId(null)
            setEmpName("")
        } finally {
            setIsSearching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedEmployeeId) {
            toast.error("Please search and select an employee first")
            return
        }

        if (!date) {
            toast.error("Please select a date")
            return
        }

        setIsSubmitting(true)
        try {
            await manualAttendanceService.createEntry({
                employeeId: selectedEmployeeId,
                date: format(date, "yyyy-MM-dd"),
                inTime: inTime || null,
                outTime: outTime || null,
                reason: reason,
                remarks: remarks,
                status: status
            })

            toast.success("Manual attendance entry submitted successfully!")

            // Reset form
            setEmpId("")
            setEmpName("")
            setSelectedEmployeeId(null)
            setDate(new Date())
            setInTime("09:00")
            setOutTime("18:00")
            setReason("device-error")
            setRemarks("")
            setStatus("Present")

            // Refresh history
            fetchHistory()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit entry")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <IconEdit className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manual Attendance</h1>
                        <p className="text-muted-foreground text-sm">Correct attendance logs or add missing entries</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push("/management/attendance/manual")}
                    >
                        <IconUsers className="size-4" />
                        Bulk Entry
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => router.push("/management/attendance/delete")}
                    >
                        <IconTrash className="size-4" />
                        Delete Entries
                    </Button>
                </div>
            </div>

            <main className="px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Entry Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <IconEdit className="size-4 opacity-70" />
                                    Entry Form
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Employee Search */}
                                        <div className="space-y-4 md:col-span-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold">Employee ID</Label>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                            <Input
                                                                placeholder="Enter Employee ID"
                                                                className="pl-10 h-11"
                                                                value={empId}
                                                                onChange={(e) => setEmpId(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault()
                                                                        searchEmployee()
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-11 w-11 p-0 shrink-0"
                                                            onClick={searchEmployee}
                                                            disabled={isSearching}
                                                        >
                                                            {isSearching ? <IconLoader className="size-4 animate-spin text-primary" /> : <IconSearch className="size-4" />}
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-muted-foreground">Employee Name</Label>
                                                    <Input
                                                        placeholder="Patiently waiting for ID..."
                                                        className="h-11 bg-muted/30 border-dashed"
                                                        value={empName}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            {selectedEmployeeId && (
                                                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary font-medium animate-in fade-in zoom-in-95 duration-300">
                                                    <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <IconCheck className="size-3" />
                                                    </div>
                                                    Successfully verified employee: <span className="font-bold">{empName}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Date Selection */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Log Date</Label>
                                            <DatePicker
                                                date={date}
                                                setDate={setDate}
                                            />
                                        </div>

                                        {/* Status Selection */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Attendance Status</Label>
                                            <NativeSelect
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="h-11"
                                            >
                                                <option value="Present">Present</option>
                                                <option value="Late">Late</option>
                                                <option value="Absent">Absent</option>
                                                <option value="On Leave">On Leave</option>
                                            </NativeSelect>
                                        </div>

                                        {/* Time Inputs */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Check-In Time</Label>
                                            <div className="relative">
                                                <IconClock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    className="pl-10 h-11"
                                                    value={inTime}
                                                    onChange={(e) => setInTime(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Check-Out Time</Label>
                                            <div className="relative">
                                                <IconClock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    className="pl-10 h-11"
                                                    value={outTime}
                                                    onChange={(e) => setOutTime(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Reason Dropdown */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Correction Reason</Label>
                                            <NativeSelect
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="h-11"
                                            >
                                                <option value="device-error">Biometric Device Error</option>
                                                <option value="client-visit">Official Client Visit</option>
                                                <option value="forgot-id">Forgot Attendance ID</option>
                                                <option value="network">Network Connectivity Issue</option>
                                                <option value="other">Other / Special Approval</option>
                                            </NativeSelect>
                                        </div>

                                        {/* Remarks */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-sm font-semibold text-muted-foreground">Additional Remarks</Label>
                                            <Textarea
                                                placeholder="Provide context for this correction (optional)..."
                                                className="min-h-[120px] resize-none rounded-xl"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-end gap-3 border-t">
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => {
                                                setEmpId("")
                                                setEmpName("")
                                                setSelectedEmployeeId(null)
                                            }}
                                        >
                                            Clear Form
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="px-8 h-11 gap-2"
                                            disabled={isSubmitting || !selectedEmployeeId}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <IconLoader className="size-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <IconSend className="size-4" />
                                                    Submit Entry
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Info & Recent Activity */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <IconInfoCircle className="size-4 text-primary" />
                                    Entry Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <ul className="space-y-2.5 text-xs text-muted-foreground">
                                    <li className="flex gap-2">
                                        <div className="size-1.5 rounded-full bg-primary/40 mt-1 shrink-0" />
                                        All manual entries are logged and audited.
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="size-1.5 rounded-full bg-primary/40 mt-1 shrink-0" />
                                        Start and end times should reflect actual work.
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="size-1.5 rounded-full bg-primary/40 mt-1 shrink-0" />
                                        Submissions may require HR approval.
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-bold">Recent History</h3>
                            </div>

                            <div className="space-y-3">
                                {isLoadingHistory ? (
                                    <div className="flex items-center justify-center py-12 border rounded-3xl bg-muted/20">
                                        <IconLoader className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                ) : history.length === 0 ? (
                                    <div className="p-8 border-2 border-dashed rounded-3xl text-center">
                                        <p className="text-xs text-muted-foreground italic">No recent entries found</p>
                                    </div>
                                ) : (
                                    history.slice(0, 5).map((entry) => (
                                        <div key={entry.id} className="p-4 bg-background border rounded-2xl flex items-center justify-between shadow-sm hover:border-primary/20 transition-all hover:shadow-md cursor-default group">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold group-hover:text-primary transition-colors">{entry.employeeName}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                                    <span className="bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider">{format(new Date(entry.date), "dd MMM")}</span>
                                                    <span>•</span>
                                                    <span className="truncate max-w-[120px]">{entry.reason}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="font-semibold text-[10px] bg-primary/5 text-primary border-primary/20">
                                                {entry.status}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
