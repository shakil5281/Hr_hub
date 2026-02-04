"use client"

import * as React from "react"
import {
    IconId,
    IconSearch,
    IconLoader,
    IconEye,
    IconBuildingBank,
    IconCalendarCheck
} from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { payrollService, type MonthlySalarySheet } from "@/lib/services/payroll"
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

export default function PaySlipListPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [searchTerm, setSearchTerm] = React.useState("")

    const [isLoading, setIsLoading] = React.useState(false)
    const [records, setRecords] = React.useState<MonthlySalarySheet[]>([])
    const [hasSearched, setHasSearched] = React.useState(false)

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const data = await payrollService.getMonthlySheet({
                year,
                month,
                searchTerm: searchTerm.trim() || undefined
            })
            setRecords(data)
            setHasSearched(true)
        } catch (error) {
            toast.error("Failed to load records")
        } finally {
            setIsLoading(false)
        }
    }

    const columns: ColumnDef<MonthlySalarySheet>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <span className="font-bold text-xs">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee Details",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{row.original.employeeName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{row.original.designation}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <Badge variant="secondary" className="text-[10px] font-bold">{row.original.department}</Badge>
        },
        {
            accessorKey: "netPayable",
            header: "Net Payable",
            cell: ({ row }) => <span className="font-black text-xs">৳{row.original.netPayable.toLocaleString()}</span>
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <Link href={`/management/payroll/pay-slip/${row.original.id}`}>
                    <Button size="sm" variant="outline" className="h-8 rounded-full gap-2 border-2 hover:bg-slate-900 hover:text-white transition-all">
                        <IconEye className="size-4" />
                        View Slip
                    </Button>
                </Link>
            )
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-6 lg:px-8 max-w-[1200px]">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-xl shadow-slate-200">
                            <IconBuildingBank className="size-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter">Pay Slip Terminal</h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Individual Remuneration Access</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1200px] space-y-8">
                {/* Search Panel */}
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <IconId className="size-5 text-slate-800" />
                            Search Criteria
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Month</label>
                                <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-12 rounded-2xl border-2 font-bold">
                                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-12 rounded-2xl border-2 font-bold">
                                    <option value={2026}>2026</option>
                                    <option value={2025}>2025</option>
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee ID / Name</label>
                                <Input
                                    placeholder="Type to search..."
                                    className="h-12 rounded-2xl border-2 font-bold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                className="h-12 rounded-2xl gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-5 animate-spin" /> : <IconSearch className="size-5" />}
                                Retrieve Entry
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {hasSearched && (
                    <div className="bg-white border-2 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-800">
                                <IconCalendarCheck className="size-4" />
                                Result Sets for {MONTHS.find(m => m.value === month)?.label} {year}
                            </h2>
                            <Badge className="bg-slate-900 text-white">{records.length} Employees Found</Badge>
                        </div>
                        <DataTable
                            columns={columns}
                            data={records}
                            showColumnCustomizer={false}
                            searchKey="employeeName"
                        />
                    </div>
                )}
            </main>
        </div>
    )
}
