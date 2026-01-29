"use client"

import * as React from "react"
import { IconMessageCircle2 } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CounselingReportPage() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "employeeName", header: "Employee" },
        { accessorKey: "issue", header: "Issue" },
        { accessorKey: "actionTaken", header: "Action Taken" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>
        },
    ]

    const data = [
        { id: "1", date: "2024-05-15", employeeName: "John Doe", issue: "Continuous Late", actionTaken: "Verbal Warning", status: "Closed" },
        { id: "2", date: "2024-05-18", employeeName: "Alice Wonderland", issue: "Unexplained Absence", actionTaken: "Asked for explanation", status: "Open" },
    ]

    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconMessageCircle2 className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Counseling Report</h1>
            </div>
            <p className="text-muted-foreground">Record and track disciplinary or counseling sessions.</p>

            <div className="flex justify-end">
                <Button>New Report</Button>
            </div>

            <DataTable columns={columns} data={data} showColumnCustomizer={false} />
        </div>
    )
}
