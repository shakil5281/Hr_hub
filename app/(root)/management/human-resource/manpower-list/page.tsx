"use client"

import * as React from "react"
import { IconUsers } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import initialData from "../employee-info/employee-data.json"
import { toast } from "sonner"

type Employee = {
    id: number
    employeeId: string
    name: string
    designation: string
    department: string
    email: string
    joinDate: string
    status: string
}

const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "employeeId",
        header: "Employee ID",
        cell: ({ row }) => <div className="font-medium">{row.getValue("employeeId")}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue("name")}</span>
                <span className="text-xs text-muted-foreground">{row.original.email}</span>
            </div>
        ),
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "department",
        header: "Department",
    },
    {
        accessorKey: "joinDate",
        header: "Join Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("joinDate"))
            return <div>{date.toLocaleDateString()}</div>
        },
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

export default function ManpowerListPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconUsers className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Manpower List</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your workforce and view employee details.
                    </p>
                </div>
            </div>

            <DataTable
                data={initialData}
                columns={columns}
                addLabel="Add Employee"
                onAddClick={() => toast.info("Add Employee clicked")}
                onEditClick={(row) => toast.info(`Edit ${row.name}`)}
                onDelete={(row) => toast.success(`Deleted ${row.name}`)}
                showTabs={true}
            />
        </div>
    )
}
