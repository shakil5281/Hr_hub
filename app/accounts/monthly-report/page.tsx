"use client"

import * as React from "react"
import { IconReportAnalytics } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NativeSelect } from "@/components/ui/select"

type MonthlyReport = {
    id: string
    month: string
    totalIncome: number
    totalExpense: number
    netProfit: number
    status: string
}

const initialData: MonthlyReport[] = [
    { id: "RPT-2024-01", month: "January 2024", totalIncome: 50000, totalExpense: 35000, netProfit: 15000, status: "Finalized" },
    { id: "RPT-2023-12", month: "December 2023", totalIncome: 48000, totalExpense: 32000, netProfit: 16000, status: "Archived" },
]

export default function MonthlyReportPage() {
    const [data, setData] = React.useState<MonthlyReport[]>(initialData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingRecord, setEditingRecord] = React.useState<MonthlyReport | null>(null)
    const [formData, setFormData] = React.useState<Partial<MonthlyReport>>({})

    const columns: ColumnDef<MonthlyReport>[] = [
        {
            accessorKey: "id",
            header: "Report ID",
            cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "month",
            header: "Month",
        },
        {
            accessorKey: "totalIncome",
            header: "Total Income",
            cell: ({ row }) => <div className="text-green-600 font-medium">${(row.getValue("totalIncome") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "totalExpense",
            header: "Total Expense",
            cell: ({ row }) => <div className="text-red-500 font-medium">${(row.getValue("totalExpense") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "netProfit",
            header: "Net Profit",
            cell: ({ row }) => <div className="font-bold">${(row.getValue("netProfit") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge variant={status === "Finalized" ? "default" : status === "Draft" ? "outline" : "secondary"}>
                        {status}
                    </Badge>
                )
            },
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const income = Number(formData.totalIncome) || 0
        const expense = Number(formData.totalExpense) || 0
        const calculatedNet = income - expense

        if (editingRecord) {
            setData(data.map(item => item.id === editingRecord.id ? {
                ...item,
                ...formData,
                netProfit: calculatedNet
            } as MonthlyReport : item))
            toast.success("Report updated successfully")
        } else {
            const newRecord: MonthlyReport = {
                id: `RPT-${new Date().getFullYear()}-${data.length + 1}`,
                month: formData.month || "New Month",
                totalIncome: income,
                totalExpense: expense,
                netProfit: calculatedNet,
                status: "Draft",
                ...formData
            } as MonthlyReport
            setData([...data, newRecord])
            toast.success("New report created")
        }
        setIsSheetOpen(false)
        setEditingRecord(null)
        setFormData({})
    }

    const startEdit = (record: MonthlyReport) => {
        setEditingRecord(record)
        setFormData(record)
        setIsSheetOpen(true)
    }

    const handleDelete = (record: MonthlyReport) => {
        setData(data.filter(item => item.id !== record.id))
        toast.success("Report deleted")
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconReportAnalytics className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Monthly Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Financial summaries and monthly closure reports.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Create Report"
                onAddClick={() => {
                    setEditingRecord(null)
                    setFormData({})
                    setIsSheetOpen(true)
                }}
                onEditClick={startEdit}
                onDelete={handleDelete}
                showTabs={true}
            />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{editingRecord ? "Edit Report" : "Create Monthly Report"}</SheetTitle>
                        <SheetDescription>
                            {editingRecord ? "Adjust report figures." : "Generate a new monthly financial summary."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="month">Month</Label>
                            <Input
                                id="month"
                                value={formData.month || ""}
                                onChange={e => setFormData({ ...formData, month: e.target.value })}
                                placeholder="e.g., February 2024"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalIncome">Total Income</Label>
                            <Input
                                id="totalIncome"
                                type="number"
                                value={formData.totalIncome || ""}
                                onChange={e => setFormData({ ...formData, totalIncome: Number(e.target.value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalExpense">Total Expense</Label>
                            <Input
                                id="totalExpense"
                                type="number"
                                value={formData.totalExpense || ""}
                                onChange={e => setFormData({ ...formData, totalExpense: Number(e.target.value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        {/* Net profit is calculated automatically */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Report Status</Label>
                            <NativeSelect
                                id="status"
                                value={formData.status || "Draft"}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Review">In Review</option>
                                <option value="Finalized">Finalized</option>
                                <option value="Archived">Archived</option>
                            </NativeSelect>
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingRecord ? "Save Changes" : "Generate Report"}</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
