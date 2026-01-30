"use client"

import * as React from "react"
import { IconCalendarStats } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type MonthlyReport = {
    id: string
    month: string
    totalOutput: number
    targetMet: string
    avgEfficiency: number
    topLine: string
}

const columns: ColumnDef<MonthlyReport>[] = [
    {
        accessorKey: "month",
        header: "Month",
    },
    {
        accessorKey: "totalOutput",
        header: "Total Output",
        cell: ({ row }) => <div className="font-medium">{(row.getValue("totalOutput") as number).toLocaleString()} pcs</div>,
    },
    {
        accessorKey: "targetMet",
        header: "Target Met",
        cell: ({ row }) => {
            const met = row.getValue("targetMet") as string
            return (
                <Badge variant={met === "Yes" ? "default" : "destructive"}>
                    {met}
                </Badge>
            )
        },
    },
    {
        accessorKey: "avgEfficiency",
        header: "Avg. Efficiency",
        cell: ({ row }) => <div>{row.getValue("avgEfficiency")}%</div>,
    },
    {
        accessorKey: "topLine",
        header: "Top Performing Line",
    },
]

const data: MonthlyReport[] = [
    { id: "1", month: "January 2026", totalOutput: 45000, targetMet: "Yes", avgEfficiency: 92, topLine: "Line 01" },
    { id: "2", month: "December 2025", totalOutput: 42000, targetMet: "No", avgEfficiency: 85, topLine: "Line 03" },
]

export default function MonthlyReportPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCalendarStats className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Monthly Production Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Historical performance and monthly analysis.
                    </p>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="Export CSV"
                onAddClick={() => toast.info("Export CSV clicked")}
                onEditClick={(row) => toast.info(`View details for ${row.month}`)}
                onDelete={(row) => toast.success(`Deleted ${row.month}`)}
                showTabs={true}
            />
        </div>
    )
}
