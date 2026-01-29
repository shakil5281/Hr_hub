"use client"

import * as React from "react"
import { IconHierarchy2 } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type LineAssignment = {
    id: string
    lineName: string
    supervisor: string
    shift: string
    capacity: number
    status: string
}

const columns: ColumnDef<LineAssignment>[] = [
    {
        accessorKey: "lineName",
        header: "Line Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("lineName")}</div>,
    },
    {
        accessorKey: "supervisor",
        header: "Supervisor",
    },
    {
        accessorKey: "shift",
        header: "Shift",
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => <div>{row.getValue("capacity")} units/hr</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Active" ? "default" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },
]

const data: LineAssignment[] = [
    { id: "1", lineName: "Line 01", supervisor: "John Doe", shift: "Morning", capacity: 150, status: "Active" },
    { id: "2", lineName: "Line 02", supervisor: "Jane Smith", shift: "Evening", capacity: 120, status: "Active" },
    { id: "3", lineName: "Line 03", supervisor: "Mike Ross", shift: "Night", capacity: 130, status: "Maintenance" },
]

export default function LineAssignPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconHierarchy2 className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Line Assign</h1>
                    <p className="text-sm text-muted-foreground">
                        Allocate and manage production line assignments.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Assign Line"
                onAddClick={() => toast.info("Assign Line clicked")}
                onEditClick={(row) => toast.info(`Edit assignment for ${row.lineName}`)}
                onDelete={(row) => toast.success(`Unassigned ${row.lineName}`)}
                showTabs={true}
            />
        </div>
    )
}
