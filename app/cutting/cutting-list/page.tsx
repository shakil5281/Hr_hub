"use client"

import * as React from "react"
import { IconScissors } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type CuttingItem = {
    id: string
    styleNo: string
    color: string
    size: string
    quantity: number
    fabricType: string
    status: string
}

const columns: ColumnDef<CuttingItem>[] = [
    {
        accessorKey: "id",
        header: "Cut ID",
        cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "styleNo",
        header: "Style No",
    },
    {
        accessorKey: "color",
        header: "Color",
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("size")}</Badge>,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => <div>{row.getValue("quantity")} pcs</div>,
    },
    {
        accessorKey: "fabricType",
        header: "Fabric",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Completed" ? "default" : status === "In Progress" ? "secondary" : "destructive"}>
                    {status}
                </Badge>
            )
        },
    },
]

const data: CuttingItem[] = [
    { id: "CT-001", styleNo: "ST-2024-X", color: "Navy Blue", size: "M", quantity: 500, fabricType: "Cotton", status: "Completed" },
    { id: "CT-002", styleNo: "ST-2024-Y", color: "Black", size: "L", quantity: 300, fabricType: "Polyester", status: "In Progress" },
]

export default function CuttingListPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconScissors className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Cutting List</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage cutting orders and fabric consumption.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="New Cut Plan"
                onAddClick={() => toast.info("New Cut Plan clicked")}
                onEditClick={(row) => toast.info(`Edit ${row.id}`)}
                onDelete={(row) => toast.success(`Deleted ${row.id}`)}
                showTabs={true}
            />
        </div>
    )
}
