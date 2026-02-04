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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"

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
            cell: ({ row }) => <Badge variant="outline" className="font-bold">{row.original.employeeIdCard}</Badge>
        },
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => <span className="font-medium text-xs">{row.original.employeeName}</span>
        },
        {
            accessorKey: "bonusType",
            header: "Festival",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconGift className="size-3 text-rose-500" />
                    <span className="font-bold text-xs">{row.original.bonusType}</span>
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <span className="font-black">৳{row.original.amount.toLocaleString()}</span>
        },
        {
            header: "Period",
            cell: ({ row }) => `${MONTHS.find(m => m.value === row.original.month)?.label} ${row.original.year}`
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className="bg-rose-100 text-rose-600 border-none px-3">
                    {row.original.status}
                </Badge>
            )
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-6 lg:px-8 max-w-[1400px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-xl shadow-rose-100">
                                <IconMoodSmile className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter">Festival Bonus</h1>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Eid & Special Disbursements</p>
                            </div>
                        </div>
                        <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-10 px-6">
                            <IconPlus className="mr-2 size-4" /> Generate Bonus
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1400px] space-y-8">
                <Card className="border-none shadow-xl shadow-rose-100/20 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-rose-950">Disbursement Cycle</CardTitle>
                            <div className="flex items-center gap-2">
                                <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-9 w-32 rounded-xl">
                                    <option value={2026}>2026</option>
                                    <option value={2025}>2025</option>
                                    <option value={2024}>2024</option>
                                </NativeSelect>
                                <Button size="sm" variant="outline" className="h-9 rounded-xl px-4" onClick={handleSearch} disabled={isLoading}>
                                    {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={records} showColumnCustomizer={false} searchKey="employeeName" />
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
