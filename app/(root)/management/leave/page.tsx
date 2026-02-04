"use client"

import * as React from "react"
import { IconCalendarEvent, IconPlus, IconCheck, IconX, IconEye, IconFilter, IconLoader, IconHistory } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { leaveService, type LeaveApplication, type LeaveType } from "@/lib/services/leave"
import { format } from "date-fns"

export default function LeaveManagementPage() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [isActionLoading, setIsActionLoading] = React.useState<number | null>(null)
    const [applications, setApplications] = React.useState<LeaveApplication[]>([])
    const [leaveTypes, setLeaveTypes] = React.useState<LeaveType[]>([])

    // Form state
    const [isApplying, setIsApplying] = React.useState(false)
    const [formData, setFormData] = React.useState({
        employeeId: 1, // Mock current user for now
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: ""
    })

    React.useEffect(() => {
        loadData()
        leaveService.getLeaveTypes().then(setLeaveTypes)
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const data = await leaveService.getApplications()
            setApplications(data)
        } catch (error) {
            toast.error("Failed to load leave applications")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (id: number, status: "Approved" | "Rejected") => {
        setIsActionLoading(id)
        try {
            await leaveService.actionLeave({ id, status })
            toast.success(`Leave request ${status.toLowerCase()} successfully`)
            loadData()
        } catch (error) {
            toast.error("Failed to process leave action")
        } finally {
            setIsActionLoading(null)
        }
    }

    const handleSubmit = async () => {
        if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason) {
            toast.error("Please fill all required fields")
            return
        }

        setIsApplying(true)
        try {
            await leaveService.applyLeave({
                ...formData,
                leaveTypeId: parseInt(formData.leaveTypeId)
            })
            toast.success("Leave application submitted successfully")
            loadData()
            // Reset form and close sheet (if possible via state)
            setFormData({
                employeeId: 1,
                leaveTypeId: "",
                startDate: "",
                endDate: "",
                reason: ""
            })
        } catch (error) {
            toast.error("Failed to submit leave application")
        } finally {
            setIsApplying(false)
        }
    }

    const columns: ColumnDef<LeaveApplication>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{row.original.department}</span>
                </div>
            )
        },
        {
            accessorKey: "leaveTypeName",
            header: "Leave Type",
            cell: ({ row }) => <Badge className="bg-blue-50 text-blue-600 border-blue-100">{row.original.leaveTypeName}</Badge>
        },
        {
            accessorKey: "startDate",
            header: "Duration",
            cell: ({ row }) => (
                <div className="text-[10px] font-medium">
                    <div>{format(new Date(row.original.startDate), "dd MMM")} - {format(new Date(row.original.endDate), "dd MMM yyyy")}</div>
                    <div className="text-emerald-600">{row.original.totalDays} day(s)</div>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status
                const variant = status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"
                return <Badge variant={variant} className="text-[10px] font-black uppercase">{status}</Badge>
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 justify-end">
                    {row.original.status === "Pending" && (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleAction(row.original.id, "Approved")}
                                disabled={isActionLoading === row.original.id}
                            >
                                {isActionLoading === row.original.id ? <IconLoader className="size-4 animate-spin" /> : <IconCheck className="size-4" />}
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                onClick={() => handleAction(row.original.id, "Rejected")}
                                disabled={isActionLoading === row.original.id}
                            >
                                {isActionLoading === row.original.id ? <IconLoader className="size-4 animate-spin" /> : <IconX className="size-4" />}
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="p-6 space-y-6 w-full animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <IconCalendarEvent className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">Leave Management</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Application Approval & Tracking</p>
                    </div>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="rounded-full h-10 px-6 gap-2 font-bold shadow-lg shadow-primary/20">
                            <IconPlus className="size-4" /> New Leave Application
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                        <SheetHeader className="pb-6 border-b">
                            <SheetTitle className="text-xl font-black tracking-tight">Apply for Leave</SheetTitle>
                            <SheetDescription>Submit a formal leave request to the management.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-6 py-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest p-1">Leave Type</Label>
                                <NativeSelect
                                    value={formData.leaveTypeId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, leaveTypeId: e.target.value }))}
                                    className="h-12 rounded-2xl border-2"
                                >
                                    <option value="">Select Type</option>
                                    {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                                </NativeSelect>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest p-1">Start Date</Label>
                                    <Input
                                        type="date"
                                        className="h-12 rounded-2xl border-2"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest p-1">End Date</Label>
                                    <Input
                                        type="date"
                                        className="h-12 rounded-2xl border-2"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest p-1">Reason</Label>
                                <Textarea
                                    placeholder="Briefly describe why you need this leave..."
                                    className="min-h-[120px] rounded-2xl border-2 p-4"
                                    value={formData.reason}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                />
                            </div>
                            <Button
                                className="h-12 rounded-2xl font-black text-base mt-2"
                                onClick={handleSubmit}
                                disabled={isApplying}
                            >
                                {isApplying ? <IconLoader className="mr-2 animate-spin" /> : <IconCheck className="mr-2" />}
                                Submit Application
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <KPICard title="Pending Requests" value={applications.filter(a => a.status === "Pending").length.toString()} icon={IconHistory} color="text-amber-600" bg="bg-amber-50" />
                <KPICard title="On Leave Today" value="-" icon={IconCalendarEvent} color="text-blue-600" bg="bg-blue-50" />
                <KPICard title="Approved" value={applications.filter(a => a.status === "Approved").length.toString()} icon={IconCheck} color="text-emerald-600" bg="bg-emerald-50" />
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b pb-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <IconFilter className="size-4" />
                        Application Repository
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={applications}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

function KPICard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-none shadow-xl shadow-slate-100/50 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center ${bg} ${color} shadow-inner`}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-black tabular-nums tracking-tighter mt-0.5">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
