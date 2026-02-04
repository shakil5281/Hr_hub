"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    IconPlus,
    IconTrendingUp,
    IconSearch,
    IconLoader,
    IconArrowRight
} from "@tabler/icons-react"
import { payrollService, type SalaryIncrement } from "@/lib/services/payroll"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default function IncrementSheetPage() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [records, setRecords] = React.useState<SalaryIncrement[]>([])

    React.useEffect(() => {
        handleSearch()
    }, [])

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const data = await payrollService.getIncrements()
            setRecords(data)
        } catch (error) {
            toast.error("Failed to load increment records")
        } finally {
            setIsLoading(false)
        }
    }

    const columns: ColumnDef<SalaryIncrement>[] = [
        {
            accessorKey: "employeeIdCard",
            header: "ID",
            cell: ({ row }) => <Badge variant="outline" className="font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => <span className="font-medium text-xs">{row.original.employeeName}</span>
        },
        {
            accessorKey: "previousGrossSalary",
            header: "Old Salary",
            cell: ({ row }) => <span className="text-muted-foreground text-xs">৳{row.original.previousGrossSalary.toLocaleString()}</span>
        },
        {
            accessorKey: "incrementAmount",
            header: "Increment",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <IconPlus className="size-3" />
                    ৳{row.original.incrementAmount.toLocaleString()}
                </div>
            )
        },
        {
            accessorKey: "newGrossSalary",
            header: "New Salary",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconArrowRight className="size-3 text-muted-foreground" />
                    <span className="font-black text-xs">৳{row.original.newGrossSalary.toLocaleString()}</span>
                </div>
            )
        },
        {
            accessorKey: "effectiveDate",
            header: "Effective Date",
            cell: ({ row }) => format(new Date(row.original.effectiveDate), "dd MMM yyyy")
        },
        {
            accessorKey: "incrementType",
            header: "Type",
            cell: ({ row }) => <Badge variant="secondary" className="text-[10px]">{row.original.incrementType}</Badge>
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1400px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                                <IconTrendingUp className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Salary Increments</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">History & Adjustments</p>
                            </div>
                        </div>
                        <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                            <IconPlus className="mr-2 size-4" /> Add Increment
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1400px] space-y-8">
                <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                    <DataTable columns={columns} data={records} showColumnCustomizer={false} searchKey="employeeName" />
                </div>
            </main>
        </div>
    )
}
