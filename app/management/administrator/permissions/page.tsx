"use client"

import * as React from "react"
import { IconLock, IconShieldLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type PermissionRole = {
    id: number
    roleName: string
    usersCount: number
    permissions: string[]
    status: "Active" | "Draft"
}

const rolesData: PermissionRole[] = [
    { id: 1, roleName: "Super Admin", usersCount: 2, permissions: ["All Access"], status: "Active" },
    { id: 2, roleName: "HR Manager", usersCount: 5, permissions: ["Manage Employees", "View Reports", "Edit Payroll"], status: "Active" },
    { id: 3, roleName: "Department Head", usersCount: 12, permissions: ["View Department Employees", "Approve Leaves"], status: "Active" },
    { id: 4, roleName: "Employee", usersCount: 150, permissions: ["View Own Profile", "Apply Leave"], status: "Active" },
]

const columns: ColumnDef<PermissionRole>[] = [
    { accessorKey: "roleName", header: "Role Name", cell: ({ row }) => <span className="font-bold">{row.getValue("roleName")}</span> },
    { accessorKey: "usersCount", header: "Users", cell: ({ row }) => <span className="font-mono">{row.getValue("usersCount")}</span> },
    {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
            const perms = row.original.permissions
            return (
                <div className="flex flex-wrap gap-1">
                    {perms.slice(0, 2).map((p, i) => <Badge key={i} variant="outline" className="text-xs">{p}</Badge>)}
                    {perms.length > 2 && <Badge variant="outline" className="text-xs">+{perms.length - 2}</Badge>}
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="secondary">{row.getValue("status")}</Badge>
    },
]

export default function PermissionsPage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconLock className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Permissions & Roles</h1>
                    </div>
                    <p className="text-muted-foreground">Configure roles and assign access permissions.</p>
                </div>
                <Button className="gap-2">
                    <IconShieldLock className="size-4" />
                    Create Role
                </Button>
            </div>

            <DataTable
                data={rolesData}
                columns={columns}
                addLabel="Create Role"
                onAddClick={() => toast.info("Create Role clicked")}
                onEditClick={(row) => toast.info(`Edit role ${row.roleName}`)}
                onDelete={(row) => toast.success(`Role ${row.roleName} deleted`)}
            />
        </div>
    )
}
