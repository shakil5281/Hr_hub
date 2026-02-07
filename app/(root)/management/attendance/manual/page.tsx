"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconArrowLeft,
    IconCalendar,
    IconUsers,
    IconCheck,
    IconLoader,
    IconTrash,
    IconUsersGroup,
    IconInfoCircle,
    IconActivity,
    IconUserPlus
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { employeeService, type Employee } from "@/lib/services/employee"
import { attendanceService } from "@/lib/services/attendance"
import { toast } from "sonner"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ManualAttendancePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [selectedEmployees, setSelectedEmployees] = React.useState<Employee[]>([])

    // Form states
    const [date, setDate] = React.useState(format(new Date(), "yyyy-MM-dd"))
    const [inTime, setInTime] = React.useState("09:00:00")
    const [outTime, setOutTime] = React.useState("18:00:00")
    const [status, setStatus] = React.useState("Present")
    const [reason, setReason] = React.useState("")

    React.useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        setIsLoading(true)
        try {
            const data = await employeeService.getEmployees({})
            setEmployees(data)
        } catch (error) {
            toast.error("Cloud sync failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (selectedEmployees.length === 0) {
            toast.error("Selection required")
            return
        }
        if (!reason) {
            toast.error("Justification required")
            return
        }

        setIsSubmitting(true)
        try {
            await attendanceService.bulkManualEntry({
                employeeIds: selectedEmployees.map(e => e.id),
                date,
                inTime,
                outTime,
                status,
                reason
            })
            toast.success("Log synchronized")
            router.push("/management/attendance")
        } catch (error) {
            toast.error("Processing failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: "employeeId",
            header: "ID",
            cell: ({ row }) => <span className="font-bold text-xs tabular-nums text-muted-foreground">{row.original.employeeId}</span>,
        },
        {
            accessorKey: "fullNameEn",
            header: "Personnel",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">{row.original.fullNameEn}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{row.original.designationName}</span>
                </div>
            )
        },
        {
            accessorKey: "departmentName",
            header: "Dept.",
            cell: ({ row }) => <span className="text-xs font-medium text-muted-foreground">{row.original.departmentName}</span>,
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted">
                        <IconArrowLeft className="size-5" />
                    </Button>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <IconUsersGroup className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">Bulk Terminal</h1>
                        <p className="text-muted-foreground text-sm">Mass attendance overrides and corrections</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-full h-10 px-5 border-2 font-bold gap-2" onClick={() => router.push("/management/attendance/manual-entry")}>
                        <IconUserPlus className="size-4" />
                        Single Log
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full h-10 px-5 font-bold gap-2 text-destructive hover:bg-destructive/10" onClick={() => router.push("/management/attendance/delete")}>
                        <IconTrash className="size-4" />
                        Purge
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
                {/* Configuration Panel */}
                <div className="space-y-6 order-2 lg:order-1">
                    <Card className="border-none shadow-sm bg-muted/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <IconActivity className="size-4 text-primary" />
                                Override Settings
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Effective Date</Label>
                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl shadow-inner border-dashed" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Shift In</Label>
                                    <Input type="time" step="1" value={inTime} onChange={(e) => setInTime(e.target.value)} className="h-11 rounded-xl shadow-inner border-dashed" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Shift Out</Label>
                                    <Input type="time" step="1" value={outTime} onChange={(e) => setOutTime(e.target.value)} className="h-11 rounded-xl shadow-inner border-dashed" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Final Status</Label>
                                <NativeSelect value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl shadow-inner">
                                    <option value="Present">Present</option>
                                    <option value="Late">Late</option>
                                    <option value="Absent">Absent</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Half Day">Half Day</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Justification</Label>
                                <Textarea placeholder="Note reason for manual override..." value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[120px] rounded-2xl bg-white dark:bg-zinc-900 shadow-inner p-4 border-dashed" />
                            </div>

                            {selectedEmployees.length > 0 && (
                                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 animate-in zoom-in duration-300">
                                    <div className="flex gap-3">
                                        <IconInfoCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                        <p className="text-xs font-medium leading-relaxed">
                                            Applying <span className="font-bold text-primary">{status}</span> status to <span className="font-bold">{selectedEmployees.length} personnel</span> for the date of <span className="font-bold underline">{format(new Date(date), "PP")}</span>.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-tighter shadow-lg shadow-primary/20" onClick={handleSubmit} disabled={isSubmitting || selectedEmployees.length === 0}>
                                {isSubmitting ? <IconLoader className="size-5 animate-spin" /> : "Authorize Mass Change"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Selection Panel */}
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden order-1 lg:order-2">
                    <CardHeader className="pb-4 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold">Personnel Repository</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase mt-1">Select targets for manual override</CardDescription>
                            </div>
                            <Badge variant="outline" className="font-black text-[10px] uppercase bg-primary/10 text-primary border-none px-3 py-1">
                                {selectedEmployees.length} Active Targets
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="h-[500px] flex flex-col items-center justify-center gap-3">
                                <IconLoader className="h-10 w-10 animate-spin text-primary/50" />
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Syncing Personnel...</p>
                            </div>
                        ) : (
                            <DataTable data={employees} columns={columns} enableSelection={true} showActions={false} showTabs={false} searchKey="fullNameEn" onSelectionChange={(rows) => setSelectedEmployees(rows)} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
