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
    IconRefresh,
    IconSettings,
    IconShieldCheck
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService, type RoleDetails, type UpdatePermissionDto } from "@/lib/services/auth"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

type EnhancedRole = RoleDetails & {
    permissions: string[]
    status: "Active" | "Draft" | "Archived"
    lastUpdated: string
}

export default function PermissionsPage() {
    const [roles, setRoles] = React.useState<EnhancedRole[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    // Data State
    const [allPermissions, setAllPermissions] = React.useState<string[]>([])

    // Create Role State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [newRoleName, setNewRoleName] = React.useState("")
    const [isCreating, setIsCreating] = React.useState(false)

    // Edit Permissions State
    const [isPermissionDialogOpen, setIsPermissionDialogOpen] = React.useState(false)
    const [selectedRole, setSelectedRole] = React.useState<EnhancedRole | null>(null)
    const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([])
    const [isSavingPermissions, setIsSavingPermissions] = React.useState(false)

    const fetchData = React.useCallback(async (silent = false) => {
        if (silent) setIsRefreshing(true)
        else setIsLoading(true)

        try {
            const [rolesData, permissionsData] = await Promise.all([
                authService.getRoles(),
                authService.getAllPermissions(),
                new Promise(resolve => setTimeout(resolve, 800)) // Slight delay for smooth transition
            ])

            // Enhance roles with permissions data specifically for that role
            const enhancedData: EnhancedRole[] = rolesData.map(role => ({
                ...role,
                permissions: [], // Will be loaded on demand or leave empty
                status: "Active",
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }))

            setRoles(enhancedData)
            setAllPermissions(permissionsData)
        } catch (error: any) {
            toast.error("Failed to load Authority Matrix", {
                description: error.response?.data?.message || "Verify your administrative permissions."
            })
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleCreateRole = async () => {
        if (!newRoleName) return
        setIsCreating(true)
        try {
            const result = await authService.createRole(newRoleName)
            if (result.success) {
                toast.success("Identity Role Created", {
                    description: `New authority level "${newRoleName}" added to system.`
                })
                setIsCreateDialogOpen(false)
                setNewRoleName("")
                fetchData(true)
            } else {
                toast.error("Creation Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Creation Failed", {
                description: error.response?.data?.message || "Role might already exist."
            })
        } finally {
            setIsCreating(false)
        }
    }

    const openPermissionEditor = async (role: EnhancedRole) => {
        setSelectedRole(role)
        setIsPermissionDialogOpen(true)
        // Fetch current permissions for this role
        try {
            const data = await authService.getRolePermissions(role.name)
            setSelectedPermissions(data.permissions)
        } catch (error) {
            toast.error("Failed to fetch role permissions")
        }
    }

    const handleSavePermissions = async () => {
        if (!selectedRole) return
        setIsSavingPermissions(true)
        try {
            const dto: UpdatePermissionDto = {
                roleName: selectedRole.name,
                permissions: selectedPermissions
            }
            const result = await authService.updateRolePermissions(dto)
            if (result.success) {
                toast.success("Permissions Updated", {
                    description: `Access scope for ${selectedRole.name} has been updated.`
                })
                setIsPermissionDialogOpen(false)
            } else {
                toast.error("Update Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Update Failed", {
                description: error.response?.data?.message || "Something went wrong."
            })
        } finally {
            setIsSavingPermissions(false)
        }
    }

    const togglePermission = (perm: string) => {
        setSelectedPermissions(prev =>
            prev.includes(perm)
                ? prev.filter(p => p !== perm)
                : [...prev, perm]
        )
    }

    const columns: ColumnDef<EnhancedRole>[] = [
        {
            accessorKey: "name",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">Role Entity</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-3 px-2">
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs uppercase">
                        {row.original.name[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight">{row.getValue("name")}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">System Role</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "userCount",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Users</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 font-medium tabular-nums text-slate-600 dark:text-slate-400">
                    <IconUsers className="size-4 opacity-50" />
                    <span className="text-xs">{row.getValue("userCount")}</span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>,
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Active" ? "success" : "secondary"}
                        className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight"
                    >
                        {status === "Active" && <IconCheck className="size-2.5 mr-1" />}
                        {status}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 text-right block">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end px-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-2 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => openPermissionEditor(row.original)}
                    >
                        <IconSettings className="size-3.5" />
                        Configure
                    </Button>
                </div>
            )
        }
    ]

    const groupedPermissions = React.useMemo(() => {
        const groups: Record<string, string[]> = {}
        allPermissions.forEach(perm => {
            const parts = perm.split('.')
            const groupName = parts.length > 1 ? parts[1] : 'General'
            if (!groups[groupName]) groups[groupName] = []
            groups[groupName].push(perm)
        })
        return groups
    }, [allPermissions])

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-background/80 backdrop-blur-xl border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                                <IconShieldLock className="size-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Authority Matrix</h1>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Role Definitions & Access Control</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl h-11 px-4 gap-2 font-bold text-xs"
                                onClick={() => fetchData(true)}
                                disabled={isLoading || isRefreshing}
                            >
                                <IconRefresh className={cn("size-4", (isLoading || isRefreshing) && "animate-spin")} />
                                Refresh
                            </Button>
                            <Button
                                className="rounded-xl h-11 px-6 gap-2 shadow-lg shadow-primary/20 font-bold text-xs"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <IconPlus className="size-4" />
                                Create Role
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Stats Ledger */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatBox label="Total Roles" value={roles.length.toString().padStart(2, '0')} icon={IconShieldLock} color="text-primary" />
                    <StatBox label="Permission Nodes" value={allPermissions.length.toString()} icon={IconKey} color="text-emerald-500" />
                    <StatBox label="Assigned Users" value={roles.reduce((acc, r) => acc + r.userCount, 0).toString()} icon={IconUsers} color="text-blue-500" />
                    <StatBox label="Security Status" value="OPTIMAL" icon={IconShieldCheck} color="text-amber-500" />
                </div>

                {/* Main Content Area */}
                <Card className="border shadow-sm rounded-3xl overflow-hidden bg-card">
                    <div className="p-6 border-b bg-muted/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                                Role Registry
                            </h2>
                            <p className="text-xs text-muted-foreground font-medium">Configure hierarchical access levels.</p>
                        </div>
                    </div>

                    <DataTable
                        data={roles}
                        columns={columns}
                        searchKey="name"
                        enableSelection={false}
                        isLoading={isLoading || isRefreshing}
                    />
                </Card>
            </main>

            {/* Create Role Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconPlus className="size-5 text-primary" />
                            Create Privilege Level
                        </DialogTitle>
                        <DialogDescription>
                            Define a new authority role in the system ledger.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Identity Role Name</Label>
                            <Input
                                placeholder="e.g. Finance Officer"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="rounded-xl h-12 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsCreateDialogOpen(false)}>Discard</Button>
                        <Button
                            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                            onClick={handleCreateRole}
                            disabled={!newRoleName || isCreating}
                        >
                            {isCreating ? "Creating..." : "Create Role"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Permission Editor Dialog */}
            <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                <DialogContent className="w-full max-w-[95vw] lg:max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col p-0 rounded-2xl sm:rounded-3xl overflow-hidden gap-0">
                    <div className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/5 shrink-0">
                        <DialogHeader className="p-0 space-y-1 text-left">
                            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <IconShieldCheck className="size-5 text-primary shrink-0" />
                                <span className="truncate max-w-[200px] sm:max-w-none">{selectedRole?.name}</span>
                                <span className="text-muted-foreground font-normal hidden sm:inline">Permissions</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                Configure granular access controls for this role.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Badge variant="outline" className="h-7 px-3 bg-primary/10 text-primary border-primary/20 font-bold whitespace-nowrap">
                                {selectedPermissions.length} Active Grants
                            </Badge>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                                <div key={group} className="space-y-3 p-4 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all h-fit break-inside-avoid">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2 text-primary">
                                            <IconKey className="size-4" />
                                            {group} Module
                                        </h3>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-[10px] font-bold"
                                                onClick={() => {
                                                    const allGroup = perms.every(p => selectedPermissions.includes(p));
                                                    if (allGroup) {
                                                        setSelectedPermissions(prev => prev.filter(p => !perms.includes(p)));
                                                    } else {
                                                        setSelectedPermissions(prev => [...new Set([...prev, ...perms])]);
                                                    }
                                                }}
                                            >
                                                Toggle All
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 ml-1">
                                        {perms.map(perm => (
                                            <div key={perm} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => togglePermission(perm)}>
                                                <Checkbox
                                                    id={perm}
                                                    checked={selectedPermissions.includes(perm)}
                                                    onCheckedChange={() => togglePermission(perm)}
                                                    className="mt-0.5 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                />
                                                <div className="grid gap-0.5 leading-none">
                                                    <label
                                                        htmlFor={perm}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pointer-events-none"
                                                    >
                                                        {perm.split('.').pop()} {/* Display last part of permission string */}
                                                    </label>
                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                        {perm}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="p-4 sm:p-6 border-t bg-muted/5 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0">
                        <Button variant="ghost" className="rounded-xl font-bold w-full sm:w-auto" onClick={() => setIsPermissionDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 w-full sm:w-auto"
                            onClick={handleSavePermissions}
                            disabled={isSavingPermissions}
                        >
                            {isSavingPermissions ? "Saving Matrix..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
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
        <Card className="border shadow-none hover:bg-muted/30 transition-all duration-300 group rounded-3xl">
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
