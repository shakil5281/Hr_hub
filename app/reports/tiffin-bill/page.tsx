"use client"

import * as React from "react"
import { IconCoffee } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function TiffinBillPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "department", header: "Department" },
        { accessorKey: "billAmount", header: "Bill Amount", cell: ({ row }) => <span className="font-bold">{row.original.billAmount}</span> },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge> },
        {
            id: "actions",
            cell: () => <Button size="sm" variant="ghost">Approve</Button>
        }
    ]

    const data = [
        { id: "1", date: "2024-05-20", employeeName: "John Doe", department: "IT", billAmount: "$15.00", status: "Pending" },
        { id: "2", date: "2024-05-21", employeeName: "Jane Smith", department: "HR", billAmount: "$12.00", status: "Approved" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconCoffee className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Tiffin Bill</h1>
            </div>
            <p className="text-muted-foreground">Manage employee tiffin bill claims and approvals.</p>

            <Card>
                <CardHeader>
                    <CardTitle>File a Claim</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4 items-end">
                    <div className="grid gap-2">
                        <Label>Employee ID</Label>
                        <Input placeholder="Enter ID" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Amount</Label>
                        <Input type="number" placeholder="0.00" />
                    </div>
                    <Button>Submit Claim</Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Recent Claims</h3>
                    <div className="flex gap-2">
                        <NativeSelect>
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </NativeSelect>
                    </div>
                </div>
                <DataTable columns={columns} data={data} showColumnCustomizer={false} />
            </div>
        </div>
    )
}
