"use client"

import * as React from "react"
import { IconUsers, IconUserPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type User = {
    id: number
    name: string
    email: string
    role: string
    status: "Active" | "Inactive"
    lastLogin: string
}

const usersData: User[] = [
    { id: 1, name: "Admin User", email: "admin@hrhub.com", role: "Super Admin", status: "Active", lastLogin: "2 min ago" },
    { id: 2, name: "HR Manager", email: "hr@hrhub.com", role: "HR Manager", status: "Active", lastLogin: "1 hour ago" },
    { id: 3, name: "John Doe", email: "john@hrhub.com", role: "Employee", status: "Inactive", lastLogin: "3 days ago" },
]

const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span> },
    { accessorKey: "email", header: "Email" },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
        }
    },
    { accessorKey: "lastLogin", header: "Last Login", cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.getValue("lastLogin")}</span> },
]

export default function UsersPage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconUsers className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">System Users</h1>
                    </div>
                    <p className="text-muted-foreground">Manage user accounts and roles.</p>
                </div>
                <Button className="gap-2">
                    <IconUserPlus className="size-4" />
                    Add User
                </Button>
            </div>

            <DataTable
                data={usersData}
                columns={columns}
                addLabel="Add User"
                onAddClick={() => toast.info("Add user clicked")}
                onEditClick={(row) => toast.info(`Edit ${row.name}`)}
                onDelete={(row) => toast.success(`User ${row.name} deleted`)}
            />
        </div>
    )
}
