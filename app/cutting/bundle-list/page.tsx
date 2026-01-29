"use client"

import * as React from "react"
import { IconStack2 } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Bundle = {
    id: string
    cutId: string
    part: string
    size: string
    quantity: number
    status: string
}

const columns: ColumnDef<Bundle>[] = [
    {
        accessorKey: "id",
        header: "Bundle ID",
        cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "cutId",
        header: "Cut Ref",
    },
    {
        accessorKey: "part",
        header: "Part",
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("size")}</Badge>,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Ready" ? "default" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },
]

const data: Bundle[] = [
    { id: "BND-501", cutId: "CT-001", part: "Front Panel", size: "M", quantity: 20, status: "Ready" },
    { id: "BND-502", cutId: "CT-001", part: "Back Panel", size: "M", quantity: 20, status: "In Inspection" },
]

export default function BundleListPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconStack2 className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Bundle List</h1>
                    <p className="text-sm text-muted-foreground">
                        Track cut fabric bundles moved to sewing.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Create Bundle"
                onAddClick={() => toast.info("Create Bundle clicked")}
                onEditClick={(row) => toast.info(`Edit ${row.id}`)}
                onDelete={(row) => toast.success(`Deleted ${row.id}`)}
                showTabs={true}
            />
        </div>
    )
}
