"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    IconPlus,
    IconMoodSmile,
    IconSearch,
    IconLoader,
    IconGift
} from "@tabler/icons-react"
import { payrollService, type Bonus } from "@/lib/services/payroll"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
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

export default function EidBonusPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [isLoading, setIsLoading] = React.useState(false)
    const [records, setRecords] = React.useState<Bonus[]>([])

    React.useEffect(() => {
        handleSearch()
    }, [])

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const data = await payrollService.getBonuses({ year })
            setRecords(data)
        } catch (error) {
            toast.error("Failed to load bonus records")
        } finally {
            setIsLoading(false)
        }
    }

    const columns: ColumnDef<Bonus>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <span className="font-medium">{row.original.employeeIdCard}</span>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => <span className="font-medium">{row.original.employeeName}</span>
        },
        {
            accessorKey: "bonusType",
            header: "Festival",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconGift className="size-4 text-rose-500" />
                    <span>{row.original.bonusType}</span>
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <span className="font-bold tabular-nums">৳{row.original.amount.toLocaleString()}</span>
        },
        {
            header: "Period",
            cell: ({ row }) => `${MONTHS.find(m => m.value === row.original.month)?.label} ${row.original.year}`
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "Approved" ? "default" : "secondary"} className="font-normal text-xs">
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
                    <h1 className="text-2xl font-bold tracking-tight">Festival Bonus</h1>
                    <p className="text-muted-foreground text-sm">Manage bonus disbursements for holidays</p>
                </div>
                <Button className="gap-2 bg-rose-600 hover:bg-rose-700">
                    <IconPlus className="size-4" />
                    Generate Bonus
                </Button>
            </div>

            <div className="px-6">
                <Card>
                    <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold">Disbursement Records</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Label className="whitespace-nowrap">Fiscal Year</Label>
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-9 w-28">
                                    <option value={2026}>2026</option>
                                    <option value={2025}>2025</option>
                                    <option value={2024}>2024</option>
                                </NativeSelect>
                            </div>
                            <Button size="sm" variant="outline" className="h-9" onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                            </Button>
                        </div>
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
