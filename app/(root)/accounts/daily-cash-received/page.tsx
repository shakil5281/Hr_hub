"use client"

import * as React from "react"
import { IconCash } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NativeSelect } from "@/components/ui/select"

type CashRecord = {
    id: string
    date: string
    source: string
    amount: number
    receivedBy: string
    status: string
    method: string
}

const initialData: CashRecord[] = [
    { id: "CR-1001", date: "2024-01-29", source: "Client Payment - ABC Corp", amount: 5000, receivedBy: "John Doe", status: "Verified", method: "Bank Transfer" },
    { id: "CR-1002", date: "2024-01-29", source: "Scrap Sales", amount: 250, receivedBy: "Jane Smith", status: "Pending", method: "Cash" },
]

export default function DailyCashReceivedPage() {
    const [data, setData] = React.useState<CashRecord[]>(initialData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingRecord, setEditingRecord] = React.useState<CashRecord | null>(null)
    const [formData, setFormData] = React.useState<Partial<CashRecord>>({})

    const columns: ColumnDef<CashRecord>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "source",
            header: "Source",
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <div className="font-bold text-green-600">${(row.getValue("amount") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "method",
            header: "Method",
        },
        {
            accessorKey: "receivedBy",
            header: "Received By",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge variant={status === "Verified" ? "default" : "secondary"}>
                        {status}
                    </Badge>
                )
            },
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingRecord) {
            setData(data.map(item => item.id === editingRecord.id ? { ...item, ...formData } as CashRecord : item))
            toast.success("Record updated successfully")
        } else {
            const newRecord: CashRecord = {
                id: `CR-${1000 + data.length + 1}`,
                date: new Date().toISOString().split('T')[0],
                source: formData.source || "",
                amount: Number(formData.amount) || 0,
                receivedBy: "CurrentUser", // Mock current user
                status: "Pending",
                method: formData.method || "Cash",
                ...formData
            } as CashRecord
            setData([...data, newRecord])
            toast.success("Cash received recorded")
        }
        setIsSheetOpen(false)
        setEditingRecord(null)
        setFormData({})
    }

    const startEdit = (record: CashRecord) => {
        setEditingRecord(record)
        setFormData(record)
        setIsSheetOpen(true)
    }

    const handleDelete = (record: CashRecord) => {
        setData(data.filter(item => item.id !== record.id))
        toast.success("Record deleted")
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCash className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Daily Cash Received</h1>
                    <p className="text-sm text-muted-foreground">
                        Track daily incoming cash flow and payments.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Receive Cash"
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
                        <SheetTitle>{editingRecord ? "Edit Record" : "New Cash Receipt"}</SheetTitle>
                        <SheetDescription>
                            {editingRecord ? "Modify the payment details." : "Enter details for the new payment received."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="source">Payment Source</Label>
                            <Input
                                id="source"
                                value={formData.source || ""}
                                onChange={e => setFormData({ ...formData, source: e.target.value })}
                                placeholder="e.g., Client Payment, Refund"
                                required
                            />
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
                            <Label htmlFor="method">Payment Method</Label>
                            <NativeSelect
                                id="method"
                                value={formData.method || "Cash"}
                                onChange={e => setFormData({ ...formData, method: e.target.value })}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Mobile Money">Mobile Money</option>
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <NativeSelect
                                id="status"
                                value={formData.status || "Pending"}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Verified">Verified</option>
                                <option value="Rejected">Rejected</option>
                            </NativeSelect>
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingRecord ? "Save Changes" : "Record Receipt"}</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
