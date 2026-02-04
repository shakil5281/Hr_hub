"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconCash,
    IconSearch,
    IconLoader,
    IconDownload,
    IconPlayerPlay,
    IconCalendar,
    IconBuildingBank,
    IconEye,
    IconAdjustmentsHorizontal,
    IconUser,
    IconCreditCard
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { payrollService, type MonthlySalarySheet } from "@/lib/services/payroll"
import { organogramService } from "@/lib/services/organogram"
import { toast } from "sonner"
import Link from "next/link"

const MONTHS = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 }
]

const YEARS = [2024, 2025, 2026]

export default function MonthlySalarySheetPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [departmentId, setDepartmentId] = React.useState("all")
    const [searchTerm, setSearchTerm] = React.useState("")

    const [isLoading, setIsLoading] = React.useState(false)
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [records, setRecords] = React.useState<MonthlySalarySheet[]>([])
    const [departments, setDepartments] = React.useState<any[]>([])
    const [hasSearched, setHasSearched] = React.useState(false)

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments)
        handleSearch()
    }, [])

    const columns: ColumnDef<MonthlySalarySheet>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <Badge variant="outline" className="text-[10px] font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee & Unit",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{row.original.department}</span>
                </div>
            )
        },
        {
            accessorKey: "grossSalary",
            header: "Gross",
            cell: ({ row }) => <span className="text-xs font-bold tabular-nums">৳{row.original.grossSalary.toLocaleString()}</span>
        },
        {
            accessorKey: "presentDays",
            header: "P/L/A",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-[10px] font-bold">
                    <span className="text-emerald-600">{row.original.presentDays}</span>
                    <span>/</span>
                    <span className="text-blue-600">{row.original.leaveDays}</span>
                    <span>/</span>
                    <span className="text-rose-600">{row.original.absentDays}</span>
                </div>
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
            accessorKey: "totalDeduction",
            header: "Deduction",
            cell: ({ row }) => <span className="text-xs font-bold text-rose-600 tabular-nums">-৳{row.original.totalDeduction.toLocaleString()}</span>
        },
        {
            accessorKey: "netPayable",
            header: "Net Payable",
            cell: ({ row }) => (
                <div className="flex flex-col bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums">৳{row.original.netPayable.toLocaleString()}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600/70">Payable</span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const colors = {
                    "Processed": "bg-blue-100 text-blue-600 border-blue-200",
                    "Approved": "bg-purple-100 text-purple-600 border-purple-200",
                    "Paid": "bg-emerald-100 text-emerald-600 border-emerald-200",
                    "Draft": "bg-muted text-muted-foreground border-transparent"
                }
                const status = row.original.status as keyof typeof colors
                return (
                    <Badge variant="outline" className={`${colors[status] || colors.Draft} text-[10px] font-black uppercase px-2`}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Link href={`/management/payroll/payslip/${row.original.id}`}>
                        <Button size="icon" variant="ghost" className="size-8 text-blue-600 hover:bg-blue-50">
                            <IconEye className="size-4" />
                        </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="size-8 text-emerald-600 hover:bg-emerald-50">
                        <IconDownload className="size-4" />
                    </Button>
                </div>
            )
        }
    ]

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const data = await payrollService.getMonthlySheet({
                year,
                month,
                departmentId: departmentId === "all" ? undefined : parseInt(departmentId),
                searchTerm: searchTerm.trim() || undefined
            })
            setRecords(data)
            setHasSearched(true)
        } catch (error) {
            toast.error("Failed to load salary sheet")
        } finally {
            setIsLoading(false)
        }
    }

    const handleProcess = async () => {
        if (!confirm(`Process salary for ${MONTHS.find(m => m.value === month)?.label} ${year}? This will overwrite existing drafts.`)) return

        setIsProcessing(true)
        try {
            const res = await payrollService.processSalary({
                year,
                month,
                departmentId: departmentId === "all" ? undefined : parseInt(departmentId)
            })
            toast.success(res.message || "Salary processed successfully")
            handleSearch()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to process salary")
        } finally {
            setIsProcessing(false)
        }
    }

    const totalNetPayable = records.reduce((sum, r) => sum + r.netPayable, 0)
    const totalDeductions = records.reduce((sum, r) => sum + r.totalDeduction, 0)

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
                                <IconCash className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">Monthly Salary Sheet</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Payroll Processing & Audit</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                className="rounded-full h-8 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                                onClick={handleProcess}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <IconLoader className="mr-2 size-4 animate-spin" /> : <IconPlayerPlay className="mr-2 size-4" />}
                                Process Salary
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconDownload className="mr-2 size-4" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Stats Summary */}
                {hasSearched && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <KPICard title="Total Payable" value={`৳${totalNetPayable.toLocaleString()}`} icon={IconBuildingBank} color="text-emerald-600" bg="bg-emerald-500/10" />
                        <KPICard title="Deductions" value={`৳${totalDeductions.toLocaleString()}`} icon={IconCreditCard} color="text-rose-600" bg="bg-rose-500/10" />
                        <KPICard title="Total Employees" value={records.length.toString()} icon={IconUser} color="text-blue-600" bg="bg-blue-500/10" />
                        <KPICard title="Period" value={`${MONTHS.find(m => m.value === month)?.label} ${year}`} icon={IconCalendar} color="text-amber-600" bg="bg-amber-500/10" />
                    </div>
                )}

                {/* Filters */}
                <Card className="border shadow-none bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-emerald-600" />
                            Selection Scope
                        </CardTitle>
                        <CardDescription>Select period and department to generate the salary sheet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Month</label>
                                <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-10 rounded-xl">
                                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Year</label>
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-10 rounded-xl">
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</label>
                                <NativeSelect value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="h-10 rounded-xl">
                                    <option value="all">Entire Plant</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search</label>
                                <Input
                                    placeholder="ID or Name..."
                                    className="h-10 rounded-xl"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                className="h-10 rounded-xl gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-5 animate-spin" /> : <IconSearch className="size-5" />}
                                Load Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Table */}
                <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b bg-muted/20 flex items-center justify-between text-emerald-950 dark:text-emerald-50">
                        <h2 className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                            Master Salary Sheet
                            {hasSearched && <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200">{records.length} Employees</Badge>}
                        </h2>
                    </div>
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
        <Card className="border shadow-none hover:bg-muted/10 transition-colors">
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
