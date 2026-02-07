"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    IconPlus,
    IconSearch,
    IconLoader,
    IconCurrencyTaka,
    IconFilter,
    IconCurrencyDollar
} from "@tabler/icons-react"
import { payrollService, type AdvanceSalary } from "@/lib/services/payroll"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
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
            cell: ({ row }) => <span className="font-medium">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.employeeName}</div>
            )
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <span className="font-bold tabular-nums">৳{row.original.amount.toLocaleString()}</span>
        },
        {
            accessorKey: "requestDate",
            header: "Request Date",
            cell: ({ row }) => format(new Date(row.original.requestDate), "dd MMM yyyy")
        },
        {
            header: "Repayment Start",
            cell: ({ row }) => (
                <span className="text-sm">
                    {MONTHS.find(m => m.value === row.original.repaymentMonth)?.label} {row.original.repaymentYear}
                </span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "Approved" ? "success" : "warning"} className="font-normal text-xs">
                    {row.original.status}
                </Badge>
            )
        }
    ]

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Advance Salary</h1>
                    <p className="text-muted-foreground text-sm">Manage employee advance salary requests</p>
                </div>
                <Button className="gap-2">
                    <IconPlus className="size-4" />
                    New Request
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <IconFilter className="size-4 opacity-70" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Month</Label>
                            <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-9">
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </NativeSelect>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Year</Label>
                            <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-9">
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </NativeSelect>
                        </div>
                        <Button
                            className="w-full h-9 gap-2"
                            onClick={handleSearch}
                            disabled={isLoading}
                        >
                            {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                            Reload Data
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-base font-semibold">Advance Salary Records</CardTitle>
                    </CardHeader>
                    <DataTable
                        columns={columns}
                        data={records}
                        showColumnCustomizer={false}
                        searchKey="employeeName"
                    />
                </Card>
            </div>
        </div>
    )
}
