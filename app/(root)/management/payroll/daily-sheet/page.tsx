"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconCash,
    IconSearch,
    IconLoader,
    IconDownload,
    IconCalendar,
    IconAdjustmentsHorizontal,
    IconTrendingUp,
    IconUsers,
    IconUserCheck
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { payrollService, type DailySalarySheet } from "@/lib/services/payroll"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"

export default function DailySalarySheetPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [departmentId, setDepartmentId] = React.useState("all")
    const [searchTerm, setSearchTerm] = React.useState("")

    const [isLoading, setIsLoading] = React.useState(false)
    const [records, setRecords] = React.useState<DailySalarySheet[]>([])
    const [departments, setDepartments] = React.useState<any[]>([])
    const [hasSearched, setHasSearched] = React.useState(false)

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments)
        handleSearch()
    }, [])

    const columns: ColumnDef<DailySalarySheet>[] = [
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
            accessorKey: "perDaySalary",
            header: "Daily Base",
            cell: ({ row }) => <span className="text-xs font-bold tabular-nums">৳{row.original.perDaySalary.toLocaleString()}</span>
        },
        {
            accessorKey: "attendanceStatus",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.attendanceStatus === "Present" ? "success" : "destructive"}
                    className="text-[10px] font-black uppercase"
                >
                    {row.original.attendanceStatus}
                </Badge>
            )
        },
        {
            accessorKey: "otAmount",
            header: "OT Pay",
            cell: ({ row }) => (
                <div className="flex flex-col text-[10px]">
                    <span className="font-bold text-blue-600">৳{row.original.otAmount.toLocaleString()}</span>
                    <span className="text-muted-foreground">{row.original.otHours}h</span>
                </div>
            )
        },
        {
            accessorKey: "deduction",
            header: "Deduction",
            cell: ({ row }) => <span className="text-xs font-bold text-rose-600 tabular-nums">-৳{row.original.deduction.toLocaleString()}</span>
        },
        {
            accessorKey: "netPayable",
            header: "Days Payable",
            cell: ({ row }) => (
                <Badge className="bg-emerald-600 text-white font-bold text-xs">
                    ৳{row.original.netPayable.toLocaleString()}
                </Badge>
            )
        }
    ]

    const handleSearch = async () => {
        if (!date) return
        setIsLoading(true)
        try {
            const data = await payrollService.getDailySheet({
                date: format(date, "yyyy-MM-dd"),
                departmentId: departmentId === "all" ? undefined : parseInt(departmentId),
                searchTerm: searchTerm.trim() || undefined
            })
            setRecords(data)
            setHasSearched(true)
        } catch (error) {
            toast.error("Failed to load daily salary data")
        } finally {
            setIsLoading(false)
        }
    }

    const totalPayable = records.reduce((sum, r) => sum + r.netPayable, 0)

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                                <IconCash className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Daily Salary Sheet</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Daily Prorated Earnings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconDownload className="mr-2 size-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Stats */}
                {hasSearched && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KPICard title="Daily Total Payable" value={`৳${totalPayable.toLocaleString()}`} icon={IconTrendingUp} color="text-emerald-600" bg="bg-emerald-500/10" />
                        <KPICard title="Active Employees" value={records.length.toString()} icon={IconUsers} color="text-blue-600" bg="bg-blue-500/10" />
                        <KPICard title="Date" value={date ? format(date, "dd MMM yyyy") : "-"} icon={IconCalendar} color="text-amber-600" bg="bg-amber-500/10" />
                    </div>
                )}

                {/* Filters */}
                <Card className="border shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-blue-600" />
                            Daily Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Date</label>
                                <DatePicker date={date} setDate={setDate} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</label>
                                <NativeSelect value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">Every Unit</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search</label>
                                <Input
                                    placeholder="Name/ID..."
                                    className="h-10 rounded-xl"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-5 animate-spin" /> : <IconSearch className="size-5" />}
                                Search Date
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                    <DataTable
                        columns={columns}
                        data={records}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                    />
                </div>
            </main>
        </div>
    )
}

function KPICard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border shadow-none">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center border shadow-sm ${bg} ${color}`}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-black tabular-nums tracking-tighter leading-none mt-1">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
