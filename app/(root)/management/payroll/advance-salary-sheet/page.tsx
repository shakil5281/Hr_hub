"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    IconPlus,
    IconCash,
    IconSearch,
    IconLoader,
    IconCalendar,
    IconCurrencyTaka
} from "@tabler/icons-react"
import { payrollService, type AdvanceSalary } from "@/lib/services/payroll"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

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

export default function AdvanceSalarySheetPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [records, setRecords] = React.useState<AdvanceSalary[]>([])

    React.useEffect(() => {
        handleSearch()
    }, [])

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const data = await payrollService.getAdvanceSalaries({ year, month })
            setRecords(data)
        } catch (error) {
            toast.error("Failed to load advance salary records")
        } finally {
            setIsLoading(false)
        }
    }

    const columns: ColumnDef<AdvanceSalary>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <Badge variant="outline" className="font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-xs">{row.original.employeeName}</div>
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <span className="font-bold">৳{row.original.amount.toLocaleString()}</span>
        },
        {
            accessorKey: "requestDate",
            header: "Request Date",
            cell: ({ row }) => format(new Date(row.original.requestDate), "dd MMM yyyy")
        },
        {
            header: "Repayment Period",
            cell: ({ row }) => `${MONTHS.find(m => m.value === row.original.repaymentMonth)?.label} ${row.original.repaymentYear}`
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className={row.original.status === "Approved" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}>
                    {row.original.status}
                </Badge>
            )
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1400px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-100">
                                <IconCurrencyTaka className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Advance Salary</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Management & Tracking</p>
                            </div>
                        </div>
                        <Button className="rounded-full bg-slate-900">
                            <IconPlus className="mr-2 size-4" /> New Request
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1400px] space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-1 border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Filter Records</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Month</label>
                                <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-10 rounded-xl">
                                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-10 rounded-xl">
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </NativeSelect>
                            </div>
                            <Button
                                className="w-full h-10 rounded-xl gap-2 bg-slate-900"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                                Reload Data
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-3">
                        <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                            <DataTable columns={columns} data={records} showColumnCustomizer={false} searchKey="employeeName" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
