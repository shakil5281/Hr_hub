"use client"

import * as React from "react"
import {
    IconUsers,
    IconUserPlus,
    IconShieldLock,
    IconMail,
    IconClock,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconCircleCheck,
    IconUserPause,
    IconCircleX,
    IconCheck
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

type User = {
    id: number
    name: string
    email: string
    role: string
    status: "Running" | "Pending" | "Close"
    lastLogin: string
    image?: string
}

const usersData: User[] = [
    { id: 1, name: "Admin User", email: "admin@hrhub.com", role: "Super Admin", status: "Running", lastLogin: "2 min ago" },
    { id: 2, name: "HR Manager", email: "hr@hrhub.com", role: "HR Manager", status: "Running", lastLogin: "1 hour ago" },
    { id: 3, name: "John Doe", email: "john@hrhub.com", role: "Employee", status: "Pending", lastLogin: "3 days ago" },
    { id: 4, name: "Jane Smith", email: "jane@hrhub.com", role: "IT Officer", status: "Close", lastLogin: "5 days ago" },
    { id: 5, name: "Robert Fox", email: "robert@hrhub.com", role: "Accounts Manager", status: "Pending", lastLogin: "Never" },
]

export default function UsersPage() {
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">User Details</span>,
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs">
                            {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">{user.name}</span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <IconMail className="size-3" />
                                {user.email}
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "role",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Role</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                        <IconShieldLock className="size-3.5 text-slate-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{row.getValue("role")}</span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</span>,
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Running" ? "success" : status === "Pending" ? "warning" : "destructive"}
                        className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight"
                    >
                        {status === "Running" && <IconCheck className="size-2.5 mr-1" />}
                        {status}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "lastLogin",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Seen</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <IconClock className="size-3.5" />
                    <span className="text-xs font-medium tabular-nums">{row.getValue("lastLogin")}</span>
                </div>
            )
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
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50 px-3 pt-3">Quick Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-primary/5 cursor-pointer">
                                <IconEdit className="size-4 text-primary" />
                                <span className="text-xs font-bold">Edit Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-primary/5 cursor-pointer">
                                <IconShieldLock className="size-4 text-indigo-500" />
                                <span className="text-xs font-bold">Reset Password</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="opacity-50" />
                            <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-destructive/5 text-destructive cursor-pointer hover:!text-destructive">
                                <IconTrash className="size-4" />
                                <span className="text-xs font-bold">Deactivate Account</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Premium Header Area */}
            <div className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                                <IconUsers className="size-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">System Users</h1>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Access Authority & Identity Matrix</p>
                            </div>
                        </div>
                        <Button className="rounded-xl h-11 px-6 gap-2 shadow-lg shadow-primary/10 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <IconUserPlus className="size-5" />
                            Create User Entity
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <UserStat color="text-primary" icon={IconUsers} label="Total Staff" value="128" />
                    <UserStat color="text-emerald-500" icon={IconCircleCheck} label="Running active" value="94" />
                    <UserStat color="text-amber-500" icon={IconUserPause} label="Pending verification" value="12" />
                    <UserStat color="text-rose-500" icon={IconCircleX} label="Closed access" value="22" />
                </div>

                {/* Table Container */}
                <Card className="border shadow-sm rounded-3xl overflow-hidden bg-card">
                    <div className="p-6 border-b bg-muted/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                                Identity Ledger
                                <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] font-bold">LIVE</Badge>
                            </h2>
                            <p className="text-xs text-muted-foreground font-medium">Managing distributed identity across system roles.</p>
                        </div>
                    </div>
                    <DataTable
                        data={usersData}
                        columns={columns}
                        searchKey="name"
                        filterKey="status"
                        showTabs={true}
                        enableSelection={true}
                        enableDrag={true}
                        tabs={[
                            { label: "Running", value: "Running" },
                            { label: "Pending", value: "Pending" },
                            { label: "Close", value: "Close" },
                        ]}
                    />
                </Card>
            </main>
        </div>
    )
}

interface UserStatProps {
    label: string
    value: string
    icon: React.ComponentType<{ className?: string }>
    color: string
}

function UserStat({ label, value, icon: Icon, color }: UserStatProps) {
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
