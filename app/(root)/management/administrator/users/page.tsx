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
    IconCheck,
    IconRefresh,
    IconShieldCheck,
    IconX
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
import { authService, type User, type RoleDetails } from "@/lib/services/auth"
import { LoadingOverlay } from "@/components/loading-state"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    NativeSelect
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function UsersPage() {
    const [users, setUsers] = React.useState<User[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    // Role Dialog State
    const [roles, setRoles] = React.useState<RoleDetails[]>([])
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
    const [targetRole, setTargetRole] = React.useState<string>("")
    const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false)
    const [isAssigning, setIsAssigning] = React.useState(false)

    // Edit Dialog State
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [editForm, setEditForm] = React.useState({ fullName: "", email: "", isActive: true })
    const [isUpdating, setIsUpdating] = React.useState(false)

    // Delete Dialog State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Create Dialog State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [createForm, setCreateForm] = React.useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        role: ""
    })
    const [isCreating, setIsCreating] = React.useState(false)

    const fetchUsers = React.useCallback(async (silent = false) => {
        if (silent) setIsRefreshing(true)
        else setIsLoading(true)

        try {
            const [userData, rolesData] = await Promise.all([
                authService.getUsers(),
                authService.getRoles(),
                new Promise(resolve => setTimeout(resolve, 2500))
            ])
            setUsers(userData)
            setRoles(rolesData)
        } catch (error: any) {
            toast.error("Failed to fetch users", {
                description: error.response?.data?.message || "Please check your permissions."
            })
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])

    React.useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleAssignRole = async () => {
        if (!selectedUser || !targetRole) return

        setIsAssigning(true)
        try {
            const result = await authService.assignRole(selectedUser.id, targetRole)
            if (result.success) {
                toast.success("Role Assigned", {
                    description: `Successfully assigned ${targetRole} to ${selectedUser.fullName || selectedUser.username}`
                })
                // Update local selected user state to reflect change immediately
                setSelectedUser(prev => prev ? { ...prev, roles: [...prev.roles, targetRole] } : null)
                setTargetRole("")
                setIsRoleDialogOpen(false)
                fetchUsers(true)
            } else {
                toast.error("Assignment Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Assignment Failed", {
                description: error.response?.data?.message || "Something went wrong."
            })
        } finally {
            setIsAssigning(false)
        }
    }

    const handleRemoveRole = async (role: string) => {
        if (!selectedUser) return

        // Confirmation is implicit by clicking the specific X, but you could add a confirm dialog if desired.
        // For now, direct action is faster for admin workflows.

        try {
            const result = await authService.removeRole(selectedUser.id, role)
            if (result.success) {
                toast.success("Role Removed", {
                    description: `Successfully removed ${role} from ${selectedUser.fullName || selectedUser.username}`
                })
                // Update local selected user state to reflect change immediately
                setSelectedUser(prev => prev ? { ...prev, roles: prev.roles.filter(r => r !== role) } : null)
                fetchUsers(true)
            } else {
                toast.error("Removal Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Removal Failed", {
                description: error.response?.data?.message || "Something went wrong."
            })
        }
    }

    const handleUpdateUser = async () => {
        if (!selectedUser) return

        setIsUpdating(true)
        try {
            const result = await authService.updateUser(selectedUser.id, editForm)
            if (result.success) {
                toast.success("User Updated", { description: "User details updated successfully." })
                setIsEditDialogOpen(false)
                fetchUsers(true)
            } else {
                toast.error("Update Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Update Failed", {
                description: error.response?.data?.message || "Something went wrong."
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteUser = async () => {
        if (!selectedUser) return

        setIsDeleting(true)
        try {
            const result = await authService.deleteUser(selectedUser.id)
            if (result.success) {
                toast.success("User Deleted", { description: "User has been removed from the system." })
                setIsDeleteDialogOpen(false)
                fetchUsers(true)
            } else {
                toast.error("Deletion Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Deletion Failed", {
                description: error.response?.data?.message || "Something went wrong."
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCreateUser = async () => {
        if (!createForm.username || !createForm.password || !createForm.email) {
            toast.error("Validation Error", { description: "Please fill in all required fields." })
            return
        }

        setIsCreating(true)
        try {
            const result = await authService.createUser(createForm)
            if (result.success) {
                toast.success("User Created", { description: "New user entity has been provisioned." })
                setIsCreateDialogOpen(false)
                setCreateForm({ username: "", email: "", password: "", fullName: "", role: "" })
                fetchUsers(true)
            } else {
                toast.error("Creation Failed", { description: result.message })
            }
        } catch (error: any) {
            toast.error("Creation Failed", {
                description: error.response?.data?.message || "Something went wrong."
            })
        } finally {
            setIsCreating(false)
        }
    }

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "fullName",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">User Details</span>,
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs">
                            {user.fullName ? user.fullName.split(" ").map(n => n[0]).join("") : user.username[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">{user.fullName || user.username}</span>
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
            accessorKey: "username",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</span>,
            cell: ({ row }) => (
                <span className="text-xs font-medium">{row.getValue("username")}</span>
            )
        },
        {
            accessorKey: "roles",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Roles</span>,
            cell: ({ row }) => {
                const roles = row.getValue("roles") as string[]
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.map(role => (
                            <div key={role} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                <IconShieldLock className="size-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{role}</span>
                            </div>
                        ))}
                    </div>
                )
            }
        },
        {
            accessorKey: "isActive",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</span>,
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean
                return (
                    <Badge
                        variant={isActive ? "success" : "destructive"}
                        className="h-5 px-2 text-[10px] font-bold uppercase tracking-tight"
                    >
                        {isActive ? <IconCheck className="size-2.5 mr-1" /> : <IconCircleX className="size-2.5 mr-1" />}
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 text-right block">Actions</span>,
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex justify-end px-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                                    <IconDotsVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-muted/20">
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50 px-3 pt-3">Quick Actions</DropdownMenuLabel>

                                <DropdownMenuItem
                                    className="gap-3 px-3 py-2.5 rounded-lg focus:bg-primary/5 cursor-pointer"
                                    onClick={() => {
                                        setSelectedUser(user)
                                        setTargetRole("")
                                        setIsRoleDialogOpen(true)
                                    }}
                                >
                                    <IconShieldCheck className="size-4 text-emerald-500" />
                                    <span className="text-xs font-bold">Assign Role</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="gap-3 px-3 py-2.5 rounded-lg focus:bg-primary/5 cursor-pointer"
                                    onClick={() => {
                                        setSelectedUser(user)
                                        setEditForm({
                                            fullName: user.fullName || "",
                                            email: user.email,
                                            isActive: user.isActive
                                        })
                                        setIsEditDialogOpen(true)
                                    }}
                                >
                                    <IconEdit className="size-4 text-primary" />
                                    <span className="text-xs font-bold">Edit Profile</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg focus:bg-primary/5 cursor-pointer">
                                    <IconShieldLock className="size-4 text-indigo-500" />
                                    <span className="text-xs font-bold">Reset Password</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="opacity-50" />

                                <DropdownMenuItem
                                    className="gap-3 px-3 py-2.5 rounded-lg focus:bg-destructive/5 text-destructive cursor-pointer hover:text-destructive!"
                                    onClick={() => {
                                        setSelectedUser(user)
                                        setIsDeleteDialogOpen(true)
                                    }}
                                >
                                    <IconTrash className="size-4" />
                                    <span className="text-xs font-bold">Delete Account</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ]

    const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
    }

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
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => fetchUsers(true)}
                                disabled={isLoading || isRefreshing}
                                className="rounded-xl h-11 px-4 gap-2 font-bold"
                            >
                                <IconRefresh className={cn("size-4", (isLoading || isRefreshing) && "animate-spin")} />
                                Reload
                            </Button>
                            <Button
                                className="rounded-xl h-11 px-6 gap-2 shadow-lg shadow-primary/10 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <IconUserPlus className="size-5" />
                                Create User Entity
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8 relative">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UserStat color="text-primary" icon={IconUsers} label="Total Staff" value={stats.total.toString()} />
                    <UserStat color="text-emerald-500" icon={IconCircleCheck} label="Active Users" value={stats.active.toString()} />
                    <UserStat color="text-rose-500" icon={IconCircleX} label="Inactive Access" value={stats.inactive.toString()} />
                </div>

                {/* Table Container */}
                <Card className="border shadow-sm rounded-3xl overflow-hidden bg-card">
                    <div className="p-6 border-b bg-muted/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                                Identity Ledger
                                <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] font-bold">
                                    {isLoading || isRefreshing ? "REFRESHING..." : "LIVE"}
                                </Badge>
                            </h2>
                            <p className="text-xs text-muted-foreground font-medium">Managing distributed identity across system roles.</p>
                        </div>
                    </div>
                    <DataTable
                        data={users}
                        columns={columns}
                        searchKey="fullName"
                        filterKey="isActive"
                        showTabs={true}
                        enableSelection={true}
                        enableDrag={true}
                        isLoading={isLoading || isRefreshing}
                        tabs={[
                            { label: "Active", value: "true" },
                            { label: "Inactive", value: "false" },
                        ]}
                    />
                </Card>
            </main>

            {/* Role Assignment Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconUserPlus className="size-5 text-primary" />
                            Provision New Identity
                        </DialogTitle>
                        <DialogDescription>
                            Create a new system user with specific role based access.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Username <span className="text-rose-500">*</span></Label>
                                <Input
                                    value={createForm.username}
                                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                                    className="rounded-xl h-11 focus:ring-primary/20"
                                    placeholder="jdoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
                                <Input
                                    value={createForm.fullName}
                                    onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                                    className="rounded-xl h-11 focus:ring-primary/20"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address <span className="text-rose-500">*</span></Label>
                            <Input
                                value={createForm.email}
                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                className="rounded-xl h-11 focus:ring-primary/20"
                                placeholder="john.doe@company.com"
                                type="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Initial Password <span className="text-rose-500">*</span></Label>
                            <Input
                                value={createForm.password}
                                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                className="rounded-xl h-11 focus:ring-primary/20"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Initial Role</Label>
                            <NativeSelect
                                value={createForm.role}
                                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                                className="rounded-xl h-11 border-muted-foreground/20 focus:ring-primary/20"
                            >
                                <option value="" disabled>Select a role (Optional)</option>
                                <option value="">No Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                            onClick={handleCreateUser}
                            disabled={isCreating}
                        >
                            {isCreating ? "Provisioning..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Role Assignment Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconShieldCheck className="size-5 text-emerald-500" />
                            Assign System Role
                        </DialogTitle>
                        <DialogDescription>
                            Elevate or modify permissions for <span className="font-bold text-foreground">{selectedUser?.fullName || selectedUser?.username}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Current Roles</label>
                            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-muted/30 border border-muted min-h-12">
                                {selectedUser?.roles.map(role => (
                                    <Badge key={role} variant="outline" className="bg-background font-bold text-[10px] pr-1 gap-1 flex items-center">
                                        {role}
                                        <button
                                            onClick={() => handleRemoveRole(role)}
                                            className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                                            title="Remove Role"
                                        >
                                            <IconX className="size-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedUser?.roles.length === 0 && <span className="text-xs text-muted-foreground italic">No roles assigned</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Target Authority</label>
                            <NativeSelect
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="rounded-xl h-12 border-muted-foreground/20 focus:ring-primary/20"
                            >
                                <option value="" disabled>Select a role to assign</option>
                                {roles.filter(r => !selectedUser?.roles.includes(r.name)).map(role => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </NativeSelect>
                            {roles.filter(r => !selectedUser?.roles.includes(r.name)).length === 0 && (
                                <p className="text-[10px] text-muted-foreground italic ml-1 mt-1">
                                    User already has all available roles.
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                            onClick={handleAssignRole}
                            disabled={!targetRole || isAssigning}
                        >
                            {isAssigning ? "Assigning Authority..." : "Assign Permissions"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconEdit className="size-5 text-primary" />
                            Update User Details
                        </DialogTitle>
                        <DialogDescription>
                            Modify basic identity information for <span className="font-bold text-foreground">@{selectedUser?.username}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Identity Name</Label>
                            <Input
                                value={editForm.fullName}
                                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                className="rounded-xl h-12 focus:ring-primary/20"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Digital Address (Email)</Label>
                            <Input
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="rounded-xl h-12 focus:ring-primary/20"
                                placeholder="Enter email address"
                                type="email"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">Access Status</Label>
                                <p className="text-xs text-muted-foreground">Toggle account availability in the system.</p>
                            </div>
                            <Switch
                                checked={editForm.isActive}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsEditDialogOpen(false)}>Discard</Button>
                        <Button
                            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                            onClick={handleUpdateUser}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving Changes..." : "Commit Updates"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl border-rose-100 dark:border-rose-900">
                    <AlertDialogHeader>
                        <div className="size-14 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center mb-4">
                            <IconTrash className="size-7 text-rose-500" />
                        </div>
                        <AlertDialogTitle className="text-xl">Terminate Account?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed">
                            You are about to permanently remove <span className="font-bold text-foreground">{selectedUser?.fullName || selectedUser?.username}</span> from the central identity ledger.
                            <span className="block mt-2 font-semibold text-rose-600 dark:text-rose-400">This action is irreversible.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl font-bold bg-muted/50">Keep Account</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl font-bold bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 dark:shadow-rose-900 border-none px-8"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Terminating..." : "Confirm Deletion"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
