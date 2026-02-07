"use client"

import * as React from "react"
import {
    IconId,
    IconSearch,
    IconLoader,
    IconEye,
    IconBuildingBank,
    IconCalendarCheck,
    IconFileSpreadsheet,
    IconDownload
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
import { Label } from "@/components/ui/label"

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

    const handleExport = async () => {
        try {
            toast.promise(
                payrollService.exportPaySlips({
                    year,
                    month,
                    searchTerm: searchTerm.trim() || undefined
                }),
                {
                    loading: 'Preparing Excel report...',
                    success: 'Salary sheet downloaded successfully',
                    error: 'Failed to export salary sheet'
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    const columns: ColumnDef<MonthlySalarySheet>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <span className="font-medium">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.employeeName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.designation}</span>
                </div>
            )
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.department}</span>
        },
        {
            accessorKey: "netPayable",
            header: "Net Payable",
            cell: ({ row }) => <span className="font-bold">৳{row.original.netPayable.toLocaleString()}</span>
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Link href={`/management/payroll/payslip/${row.original.id}`}>
                    <Button size="sm" variant="outline" className="gap-2 h-8">
                        <IconEye className="size-4" />
                        View
                    </Button>
                </Link>
            )
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Payslip Management</h1>
                    <p className="text-muted-foreground text-sm">Search and manage employee payslips</p>
                </div>
            </div>

            {/* Search Panel */}
            <div className="px-6">
                <Card className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <IconSearch className="size-4 opacity-70" />
                            Filter Criteria
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Month</Label>
                                <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-9">
                                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Year</Label>
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-9">
                                    <option value={2026}>2026</option>
                                    <option value={2025}>2025</option>
                                </NativeSelect>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Search</Label>
                                <Input
                                    placeholder="Employee ID or Name..."
                                    className="h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 gap-2 h-9"
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                                    Search
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 h-9"
                                    onClick={handleExport}
                                    disabled={isLoading}
                                >
                                    <IconFileSpreadsheet className="size-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Results */}
            {hasSearched && (
                <div className="px-6">
                    <Card>
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-sm flex items-center gap-2">
                                <IconCalendarCheck className="size-4 text-muted-foreground" />
                                Payslips for {MONTHS.find(m => m.value === month)?.label} {year}
                            </h2>
                            <Badge variant="secondary">{records.length} records</Badge>
                        </div>
                        <DataTable
                            columns={columns}
                            data={records}
                            showColumnCustomizer={false}
                            searchKey="employeeName"
                        />
                    </Card>
                </div>
            )}
        </div>
    )
}
