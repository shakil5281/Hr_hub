"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { IconGift } from "@tabler/icons-react"

export default function EidBonusPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "basicSalary", header: "Basic Salary" },
        { accessorKey: "bonusPercentage", header: "Bonus %" },
        { accessorKey: "bonusAmount", header: "Bonus Amount", cell: ({ row }) => <span className="font-bold">{row.original.bonusAmount}</span> },
        { accessorKey: "status", header: "Status" },
    ]

    const data = [
        { id: "1", employeeName: "John Doe", basicSalary: 30000, bonusPercentage: "50%", bonusAmount: 15000, status: "Processed" },
        { id: "2", employeeName: "Jane Smith", basicSalary: 28000, bonusPercentage: "50%", bonusAmount: 14000, status: "Processed" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <IconGift className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Eid Bonus Management</h1>
                </div>
                <p className="text-muted-foreground">Calculate and distribute festival bonuses.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bonus Configuration</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4 items-end">
                    <div className="grid gap-2">
                        <Label>Bonus Type</Label>
                        <NativeSelect>
                            <option>Eid-ul-Fitr</option>
                            <option>Eid-ul-Adha</option>
                            <option>Durga Puja</option>
                        </NativeSelect>
                    </div>
                    <div className="grid gap-2">
                        <Label>Percentage of Basic</Label>
                        <Input defaultValue="50" type="number" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Disbursement Date</Label>
                        <Input type="date" />
                    </div>
                    <Button>Generate Sheet</Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Generated Bonus List</h3>
                <DataTable columns={columns} data={data} showColumnCustomizer={false} />
            </div>
        </div>
    )
}
