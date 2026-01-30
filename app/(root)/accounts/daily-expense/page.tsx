"use client"

import * as React from "react"
import { IconCreditCard } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NativeSelect } from "@/components/ui/select"

type ExpenseRecord = {
    id: string
    date: string
    description: string
    category: string
    amount: number
    approvedBy: string
    status: string
}

const initialData: ExpenseRecord[] = [
    { id: "EXP-5001", date: "2024-01-29", description: "Office Supplies", category: "Operational", amount: 150, approvedBy: "Manager", status: "Approved" },
    { id: "EXP-5002", date: "2024-01-29", description: "Machine Repair - Line 2", category: "Maintenance", amount: 1200, approvedBy: "Director", status: "Pending" },
]

export default function DailyExpensePage() {
    const [data, setData] = React.useState<ExpenseRecord[]>(initialData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingRecord, setEditingRecord] = React.useState<ExpenseRecord | null>(null)
    const [formData, setFormData] = React.useState<Partial<ExpenseRecord>>({})

    const columns: ColumnDef<ExpenseRecord>[] = [
        {
            accessorKey: "id",
            header: "Expense ID",
            cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <div className="font-bold text-red-500">${(row.getValue("amount") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge variant={status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"}>
                        {status}
                    </Badge>
                )
            },
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingRecord) {
            setData(data.map(item => item.id === editingRecord.id ? { ...item, ...formData } as ExpenseRecord : item))
            toast.success("Expense updated successfully")
        } else {
            const newRecord: ExpenseRecord = {
                id: `EXP-${5000 + data.length + 1}`,
                date: new Date().toISOString().split('T')[0],
                description: formData.description || "",
                category: formData.category || "General",
                amount: Number(formData.amount) || 0,
                approvedBy: "System",
                status: "Pending",
                ...formData
            } as ExpenseRecord
            setData([...data, newRecord])
            toast.success("Expense recorded")
        }
        setIsSheetOpen(false)
        setEditingRecord(null)
        setFormData({})
    }

    const startEdit = (record: ExpenseRecord) => {
        setEditingRecord(record)
        setFormData(record)
        setIsSheetOpen(true)
    }

    const handleDelete = (record: ExpenseRecord) => {
        setData(data.filter(item => item.id !== record.id))
        toast.success("Expense deleted")
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCreditCard className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Daily Expense</h1>
                    <p className="text-sm text-muted-foreground">
                        Log and track daily operational expenses.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Log Expense"
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
                        <SheetTitle>{editingRecord ? "Edit Expense" : "New Expense Entry"}</SheetTitle>
                        <SheetDescription>
                            {editingRecord ? "Update the expense details." : "Record a new company expense."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description || ""}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g., Office Supplies, Transport"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <NativeSelect
                                id="category"
                                value={formData.category || "General"}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Operational">Operational</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Payroll">Payroll</option>
                                <option value="Marketing">Marketing</option>
                                <option value="General">General</option>
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date || ""}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount || ""}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Approval Status</Label>
                            <NativeSelect
                                id="status"
                                value={formData.status || "Pending"}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </NativeSelect>
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingRecord ? "Save Changes" : "Log Expense"}</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
