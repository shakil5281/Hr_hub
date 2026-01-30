"use client"

import * as React from "react"
import {
    IconShieldLock,
    IconLock,
    IconPlus,
    IconUsers,
    IconKey,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconEye,
    IconHistory,
    IconCheck,
    IconSearch,
    IconAdjustmentsHorizontal
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PermissionRole = {
    id: number
    roleName: string
    usersCount: number
    permissions: string[]
    status: "Active" | "Draft" | "Archived"
    lastUpdated: string
}

const rolesData: PermissionRole[] = [
    { id: 1, roleName: "Super Admin", usersCount: 2, permissions: ["All Access", "User Management", "System Settings", "Audit Logs"], status: "Active", lastUpdated: "Jan 20, 2026" },
    { id: 2, roleName: "HR Manager", usersCount: 5, permissions: ["Manage Employees", "View Reports", "Edit Payroll", "Leave Approval"], status: "Active", lastUpdated: "Jan 22, 2026" },
    { id: 3, roleName: "Accounts Manager", usersCount: 3, permissions: ["Edit Payroll", "View Transactions", "Tax Management"], status: "Active", lastUpdated: "Jan 15, 2026" },
    { id: 4, roleName: "IT Officer", usersCount: 2, permissions: ["Network Access", "Troubleshooting", "System Configuration"], status: "Active", lastUpdated: "Jan 25, 2026" },
    { id: 5, roleName: "Store Manager", usersCount: 4, permissions: ["Inventory Control", "Stock Updates", "Supplier Logs"], status: "Draft", lastUpdated: "Jan 28, 2026" },
    { id: 6, roleName: "Guest User", usersCount: 0, permissions: ["View Public Records"], status: "Archived", lastUpdated: "Dec 30, 2025" },
]

export default function PermissionsPage() {
    const columns: ColumnDef<PermissionRole>[] = [
        {
            accessorKey: "roleName",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">Role Entity</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-3 px-2">
                    <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 text-indigo-600 font-bold text-xs">
                        {row.original.roleName[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight">{row.getValue("roleName")}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">Internal System Role</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "usersCount",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Users</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 font-medium tabular-nums text-slate-600 dark:text-slate-400">
                    <IconUsers className="size-4 opacity-50" />
                    <span className="text-xs">{row.getValue("usersCount")}</span>
                </div>
            )
        },
        {
            accessorKey: "permissions",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scope of Authority</span>,
            cell: ({ row }) => {
                const perms = row.original.permissions
                return (
                    <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                        {perms.slice(0, 2).map((p, i) => (
                            <Badge key={i} variant="outline" className="text-[9px] font-bold uppercase tracking-tight py-0 px-1 border-slate-200">
                                {p}
                            </Badge>
                        ))}
                        {perms.length > 2 && (
                            <Badge variant="outline" className="text-[9px] font-bold py-0 px-1 bg-slate-50 border-slate-200">
                                +{perms.length - 2} MORE
                            </Badge>
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: "status",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enforcement</span>,
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Active" ? "success" : status === "Draft" ? "warning" : "secondary"}
                        className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight"
                    >
                        {status === "Active" && <IconCheck className="size-2.5 mr-1" />}
                        {status}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "lastUpdated",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modified</span>,
            cell: ({ row }) => <span className="text-xs text-muted-foreground font-medium tabular-nums">{row.getValue("lastUpdated")}</span>
        },
        {
            id: "actions",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 text-right block">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end px-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                                <IconDotsVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-muted/20">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50 px-3 pt-3">Rule Maintenance</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-indigo-500/10 focus:text-indigo-600 cursor-pointer">
                                <IconEdit className="size-4" />
                                <span className="text-xs font-bold">Modify Permissions</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-indigo-500/10 focus:text-indigo-600 cursor-pointer">
                                <IconEye className="size-4" />
                                <span className="text-xs font-bold">View Access Matrix</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-indigo-500/10 focus:text-indigo-600 cursor-pointer">
                                <IconHistory className="size-4" />
                                <span className="text-xs font-bold">Audit History</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-destructive/5 text-destructive cursor-pointer hover:!text-destructive">
                                <IconTrash className="size-4" />
                                <span className="text-xs font-bold">Revoke Role</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none">
                                <IconShieldLock className="size-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Authority Matrix</h1>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Role Definitions & Access Control</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-xl h-11 px-6 gap-2 font-bold text-xs border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-800">
                                <IconKey className="size-4" />
                                Global Keys
                            </Button>
                            <Button className="rounded-xl h-11 px-6 gap-2 shadow-lg shadow-indigo-100 dark:shadow-none bg-indigo-600 hover:bg-indigo-700 font-bold text-xs">
                                <IconPlus className="size-4" />
                                Create New Privilege Role
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Stats Ledger */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatBox label="Total Roles" value="06" icon={IconShieldLock} color="text-indigo-600" />
                    <StatBox label="Active Grants" value="24" icon={IconKey} color="text-emerald-500" />
                    <StatBox label="Assigned Users" value="163" icon={IconUsers} color="text-blue-500" />
                    <StatBox label="Security Audit" value="OK" icon={IconLock} color="text-amber-500" />
                </div>

                {/* Main Content Area */}
                <Card className="border shadow-sm rounded-3xl overflow-hidden bg-card">
                    <div className="p-6 border-b bg-muted/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                                Role Registry
                                <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] font-bold">RBAC v2.4</Badge>
                            </h2>
                            <p className="text-xs text-muted-foreground font-medium">Configure hierarchical access levels for internal departments.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="size-9 rounded-full">
                                <IconAdjustmentsHorizontal className="size-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        data={rolesData}
                        columns={columns}
                        searchKey="roleName"
                        filterKey="status"
                        showTabs={true}
                        enableSelection={true}
                        enableDrag={true}
                        tabs={[
                            { label: "Active Roles", value: "Active" },
                            { label: "Draft Stage", value: "Draft" },
                            { label: "Archived", value: "Archived" },
                        ]}
                    />
                </Card>
            </main>
        </div>
    )
}

interface StatBoxProps {
    label: string
    value: string
    icon: React.ComponentType<{ className?: string }>
    color: string
}

function StatBox({ label, value, icon: Icon, color }: StatBoxProps) {
    return (
        <Card className="border shadow-none hover:bg-muted/30 transition-all duration-300 group">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center bg-background border shadow-sm group-hover:scale-110 transition-transform", color)}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                    <h3 className="text-2xl font-bold tabular-nums tracking-tight mt-0.5">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
