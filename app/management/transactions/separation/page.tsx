"use client"

import * as React from "react"
import {
    IconUserMinus,
    IconPlus,
    IconFileLike,
    IconCheck,
    IconX,
    IconAlertCircle,
    IconCalendarOff,
    IconCurrencyDollar,
    IconCalendar
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// --- Types ---

type SeparationStatus = "Pending" | "Approved" | "Left" | "Closed"
type SeparationType = "Resignation" | "Termination" | "Retirement" | "Absconding" | "End of Contract"

type SeparationRecord = {
    id: number
    employeeId: string
    employeeName: string
    department: string
    designation: string
    type: SeparationType
    submissionDate: string
    lastWorkingDate: string
    status: SeparationStatus
    reason: string
}

const mockSeparationData: SeparationRecord[] = [
    {
        id: 1,
        employeeId: "EMP005",
        employeeName: "Michael Brown",
        department: "Marketing",
        designation: "Marketing Specialist",
        type: "Resignation",
        submissionDate: "2024-05-10",
        lastWorkingDate: "2024-06-10",
        status: "Pending",
        reason: "Found better opportunity"
    },
    {
        id: 2,
        employeeId: "EMP012",
        employeeName: "Sarah Connor",
        department: "Operations",
        designation: "Supervisor",
        type: "Termination",
        submissionDate: "2024-05-15",
        lastWorkingDate: "2024-05-15",
        status: "Left",
        reason: "Policy violation"
    },
    {
        id: 3,
        employeeId: "EMP008",
        employeeName: "James Wilson",
        department: "Engineering",
        designation: "Senior Dev",
        type: "Resignation",
        submissionDate: "2024-04-01",
        lastWorkingDate: "2024-05-01",
        status: "Closed",
        reason: "Relocation"
    },
]

// --- Helper Components ---

function DatePicker({ date, setDate, required }: { date: string, setDate: (date: string) => void, required?: boolean }) {
    const parsedDate = date ? new Date(date) : undefined

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {parsedDate ? format(parsedDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={parsedDate}
                    onSelect={(d: Date | undefined) => setDate(d ? format(d, "yyyy-MM-dd") : "")}
                    initialFocus
                    required={required}
                />
            </PopoverContent>
        </Popover>
    )
}

export default function SeparationPage() {
    const [data, setData] = React.useState<SeparationRecord[]>(mockSeparationData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [currentRecord, setCurrentRecord] = React.useState<Partial<SeparationRecord>>({})
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
    const [actionType, setActionType] = React.useState<"approve" | "lefty" | "close" | null>(null)
    const [selectedRecord, setSelectedRecord] = React.useState<SeparationRecord | null>(null)

    // --- Stats ---
    const stats = {
        pending: data.filter(d => d.status === "Pending").length,
        left: data.filter(d => d.status === "Left").length,
        closed: data.filter(d => d.status === "Closed").length,
        total: data.length
    }

    // --- Columns ---
    const columns: ColumnDef<SeparationRecord>[] = [
        {
            accessorKey: "employeeName",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.getValue("employeeName")}</span>
                    <span className="text-xs text-muted-foreground">{row.original.employeeId} • {row.original.department}</span>
                </div>
            )
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <Badge variant="secondary" className="font-normal">{row.getValue("type")}</Badge>
        },
        {
            accessorKey: "dates",
            header: "Dates",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground text-xs">Submitted:</span>
                        <span>{row.original.submissionDate}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground text-xs">Last Day:</span>
                        <span className="font-medium">{row.original.lastWorkingDate}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as SeparationStatus
                let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
                let className = ""

                switch (status) {
                    case "Pending":
                        variant = "secondary"
                        className = "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200"
                        break
                    case "Approved":
                        variant = "default"
                        className = "bg-blue-500 text-white hover:bg-blue-600"
                        break
                    case "Left":
                        variant = "secondary"
                        className = "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200"
                        break
                    case "Closed":
                        variant = "outline"
                        className = "bg-green-500/10 text-green-600 border-green-200"
                        break
                }

                return <Badge variant={variant} className={className}>{status}</Badge>
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const record = row.original
                return (
                    <div className="flex gap-2 justify-end">
                        {record.status === "Pending" && (
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={() => handleStatusAction(record, "approve")} title="Approve">
                                <IconCheck className="size-4" />
                            </Button>
                        )}
                        {record.status === "Approved" && (
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-orange-600" onClick={() => handleStatusAction(record, "lefty")} title="Mark as Left">
                                <IconCalendarOff className="size-4" />
                            </Button>
                        )}
                        {record.status === "Left" && (
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-600" onClick={() => handleStatusAction(record, "close")} title="Final Settlement / Close">
                                <IconFileLike className="size-4" />
                            </Button>
                        )}
                    </div>
                )
            }
        }
    ]

    // --- Actions ---
    const handleAddClick = () => {
        setIsEditing(false)
        setCurrentRecord({
            status: "Pending",
            submissionDate: new Date().toISOString().split('T')[0],
            // Default last working date to 30 days from now
            lastWorkingDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            type: "Resignation"
        })
        setIsSheetOpen(true)
    }

    const handleEditClick = (record: SeparationRecord) => {
        setIsEditing(true)
        setCurrentRecord({ ...record })
        setIsSheetOpen(true)
    }

    const handleDelete = (record: SeparationRecord) => {
        setData(prev => prev.filter(item => item.id !== record.id))
        toast.success("Record removed")
    }

    const handleStatusAction = (record: SeparationRecord, action: "approve" | "lefty" | "close") => {
        setSelectedRecord(record)
        setActionType(action)
        setConfirmDialogOpen(true)
    }

    const confirmStatusChange = () => {
        if (!selectedRecord || !actionType) return

        let newStatus: SeparationStatus = selectedRecord.status
        let successMessage = ""

        if (actionType === "approve") {
            newStatus = "Approved"
            successMessage = "Resignation approved"
        } else if (actionType === "lefty") {
            newStatus = "Left"
            successMessage = "Employee marked as Left"
        } else if (actionType === "close") {
            newStatus = "Closed"
            successMessage = "File closed successfully"
        }

        setData(prev => prev.map(item => item.id === selectedRecord.id ? { ...item, status: newStatus } : item))
        toast.success(successMessage)
        setConfirmDialogOpen(false)
        setSelectedRecord(null)
        setActionType(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isEditing) {
            const newId = Math.max(...data.map(d => d.id), 0) + 1
            const newItem: SeparationRecord = {
                id: newId,
                employeeId: currentRecord.employeeId || "EMP-NEW",
                employeeName: "New Employee", // Mock
                department: "TBD",
                designation: "TBD",
                type: currentRecord.type || "Resignation",
                submissionDate: currentRecord.submissionDate || "",
                lastWorkingDate: currentRecord.lastWorkingDate || "",
                status: "Pending",
                reason: currentRecord.reason || ""
            }
            setData(prev => [...prev, newItem])
            toast.success("Separation request created")
        } else {
            setData(prev => prev.map(item => item.id === currentRecord.id ? { ...item, ...currentRecord } as SeparationRecord : item))
            toast.success("Record updated")
        }
        setIsSheetOpen(false)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <IconUserMinus className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Separation Management</h1>
                    </div>
                    <p className="text-muted-foreground">Manage employee resignations, terminations, and exit clearances.</p>
                </div>
                <Button className="gap-2" onClick={handleAddClick}>
                    <IconPlus className="size-4" />
                    New Request
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100 dark:border-blue-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-orange-100 dark:border-orange-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Marked as Left</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.left}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-100 dark:border-green-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Closed / Settled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.closed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Separations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                data={data}
                columns={columns}
                addLabel="New Request"
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDelete={handleDelete}
                showColumnCustomizer={false}
            />

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>{isEditing ? "Edit Separation Request" : "New Separation Request"}</SheetTitle>
                        <SheetDescription>
                            Enter details for employee separation.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="grid gap-2">
                            <Label>Employee</Label>
                            <NativeSelect
                                disabled={isEditing}
                                value={currentRecord.employeeId}
                                onChange={(e) => setCurrentRecord(p => ({ ...p, employeeId: e.target.value }))}
                            >
                                <option value="" disabled>Select Employee</option>
                                <option value="EMP001">John Doe (EMP001)</option>
                                <option value="EMP002">Jane Smith (EMP002)</option>
                                <option value="EMP005">Michael Brown (EMP005)</option>
                            </NativeSelect>
                        </div>

                        <div className="grid gap-2">
                            <Label>Separation Type</Label>
                            <NativeSelect
                                value={currentRecord.type}
                                onChange={(e) => setCurrentRecord(p => ({ ...p, type: e.target.value as SeparationType }))}
                            >
                                <option value="Resignation">Resignation</option>
                                <option value="Termination">Termination</option>
                                <option value="Retirement">Retirement</option>
                                <option value="Absconding">Absconding</option>
                                <option value="End of Contract">End of Contract</option>
                            </NativeSelect>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="submitDate">Submission Date</Label>
                                <DatePicker
                                    date={currentRecord.submissionDate || ""}
                                    setDate={(d) => setCurrentRecord(p => ({ ...p, submissionDate: d }))}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastDate">Last Working Day</Label>
                                <DatePicker
                                    date={currentRecord.lastWorkingDate || ""}
                                    setDate={(d) => setCurrentRecord(p => ({ ...p, lastWorkingDate: d }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason / Remarks</Label>
                            <Textarea
                                id="reason"
                                value={currentRecord.reason}
                                onChange={e => setCurrentRecord(p => ({ ...p, reason: e.target.value }))}
                                placeholder="Enter reason for separation..."
                                className="h-24"
                            />
                        </div>

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </SheetClose>
                            <Button type="submit">{isEditing ? "Update" : "Submit Request"}</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                            {actionType === "approve" && "Are you sure you want to approve this resignation request?"}
                            {actionType === "lefty" && "Are you sure you want to mark this employee as LEFT? This will deactivate their access."}
                            {actionType === "close" && "Are you sure you want to CLOSE this file? Ensure all assets are returned and final settlement is calculated."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant={actionType === "close" || actionType === "lefty" ? "destructive" : "default"}
                            onClick={confirmStatusChange}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
