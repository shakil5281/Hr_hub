"use client"

import * as React from "react"
import { IconTarget } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type ProductionTarget = {
    id: string
    period: string
    product: string
    targetQuantity: number
    metPercentage: number
    status: string
}

const columns: ColumnDef<ProductionTarget>[] = [
    {
        accessorKey: "period",
        header: "Period",
    },
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => <div className="font-medium">{row.getValue("product")}</div>,
    },
    {
        accessorKey: "targetQuantity",
        header: "Target Quantity",
        cell: ({ row }) => <div>{(row.getValue("targetQuantity") as number).toLocaleString()} units</div>,
    },
    {
        accessorKey: "metPercentage",
        header: "Status %",
        cell: ({ row }) => <div>{row.getValue("metPercentage")}%</div>,
    },
    {
        accessorKey: "status",
        header: "Outcome",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Achieved" ? "default" : "destructive"}>
                    {status}
                </Badge>
            )
        },
    },
]

const data: ProductionTarget[] = [
    { id: "1", period: "January 2026", product: "Industrial Filter X2", targetQuantity: 10000, metPercentage: 105, status: "Achieved" },
    { id: "2", period: "January 2026", product: "Precision Bearing B7", targetQuantity: 20000, metPercentage: 85, status: "In Progress" },
]

export default function TargetPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconTarget className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Production Targets</h1>
                    <p className="text-sm text-muted-foreground">
                        Set and monitor output objectives.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Set Target"
                onAddClick={() => toast.info("Set Target clicked")}
                onEditClick={(row) => toast.info(`Edit target for ${row.product}`)}
                onDelete={(row) => toast.success(`Deleted target for ${row.product}`)}
                showTabs={true}
            />
        </div>
    )
}
