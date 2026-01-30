"use client"

import * as React from "react"
import { IconListCheck } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type ProductionItem = {
    id: string
    product: string
    line: string
    quantity: number
    unit: string
    status: string
    dueDate: string
    priority: string
}


const columns: ColumnDef<ProductionItem>[] = [
    {
        accessorKey: "id",
        header: "Batch ID",
        cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue("product")}</span>
            </div>
        ),
    },
    {
        accessorKey: "line",
        header: "Line",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => <div>{row.getValue("quantity")} {row.original.unit}</div>,
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={
                    status === "Complete" ? "default" :
                        status === "Processing" ? "secondary" :
                            status === "Close" ? "outline" : // Maybe a specific variant for Close if available, or just outline/secondary
                                status === "Pending" ? "destructive" : // Or yellow if available, destructive is red
                                    "secondary"
                }>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
]

const data: ProductionItem[] = [
    {
        id: "PRD-2026-001",
        product: "Industrial Filter X2",
        line: "Line 01",
        quantity: 1500,
        unit: "pcs",
        status: "Complete",
        dueDate: "Jan 28, 2026",
        priority: "High"
    },
    {
        id: "PRD-2026-002",
        product: "Precision Bearing B7",
        line: "Line 03",
        quantity: 5000,
        unit: "pcs",
        status: "Processing",
        dueDate: "Jan 30, 2026",
        priority: "Medium"
    },
    {
        id: "PRD-2026-003",
        product: "Hydraulic Pump H1",
        line: "Line 02",
        quantity: 800,
        unit: "pcs",
        status: "Pending",
        dueDate: "Jan 25, 2026",
        priority: "High"
    },
    {
        id: "PRD-2026-004",
        product: "Steel Gasket G4",
        line: "Line 04",
        quantity: 12000,
        unit: "pcs",
        status: "Pending",
        dueDate: "Feb 05, 2026",
        priority: "Low"
    },
    {
        id: "PRD-2026-005",
        product: "Torque Wrench T2",
        line: "Line 01",
        quantity: 300,
        unit: "pcs",
        status: "Processing",
        dueDate: "Jan 31, 2026",
        priority: "Medium"
    },
    {
        id: "PRD-2026-006",
        product: "Valve Set V5",
        line: "Line 02",
        quantity: 200,
        unit: "pcs",
        status: "Close",
        dueDate: "Jan 20, 2026",
        priority: "Low"
    }
]

export default function ProductionListPage() {
    const tabs = [
        { value: "Processing", label: "Processing" },
        { value: "Pending", label: "Pending" },
        { value: "Complete", label: "Complete" },
        { value: "Close", label: "Close" },
    ]

    const filters = [
        {
            columnId: "priority",
            title: "Priority",
            options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
            ],
        },
        {
            columnId: "line",
            title: "Line",
            options: [
                { label: "Line 01", value: "Line 01" },
                { label: "Line 02", value: "Line 02" },
                { label: "Line 03", value: "Line 03" },
                { label: "Line 04", value: "Line 04" },
            ],
        },
    ]

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconListCheck className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Production List</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and track manufacturing cycles across all lines.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Add Batch"
                onAddClick={() => toast.info("Add Batch clicked")}
                onEditClick={(row) => toast.info(`Edit ${row.id}`)}
                onDelete={(row) => toast.success(`Deleted ${row.id}`)}
                showTabs={true}
                tabs={tabs}
                filterKey="status"
                filters={filters}
                searchKey="product"
            />
        </div>
    )
}
