"use client"

import * as React from "react"
import { IconClipboardList, IconPlus } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/select"
import { toast } from "sonner"

// Types
type ManpowerReq = {
    id: string
    position: string
    department: string
    required: number
    filled: number
    vacant: number
    priority: "High" | "Medium" | "Low"
    status: "Open" | "In Progress" | "Closed"
}

// Mock Data
const initialData: ManpowerReq[] = [
    // Sewing
    { id: "1", position: "Senior Operator", department: "Sewing", required: 50, filled: 45, vacant: 5, priority: "High", status: "Open" },
    { id: "2", position: "Helper", department: "Sewing", required: 30, filled: 30, vacant: 0, priority: "Low", status: "Closed" },
    // Finishing
    { id: "3", position: "Iron Man", department: "Finishing", required: 10, filled: 8, vacant: 2, priority: "Medium", status: "Open" },
    { id: "4", position: "Folder", department: "Finishing", required: 15, filled: 12, vacant: 3, priority: "High", status: "Open" },
    // Cutting
    { id: "5", position: "Cutter", department: "Cutting", required: 5, filled: 5, vacant: 0, priority: "Medium", status: "Closed" },
    { id: "6", position: "Spreader", department: "Cutting", required: 8, filled: 6, vacant: 2, priority: "High", status: "Open" },
    // Quality
    { id: "7", position: "Quality Inspector", department: "Quality", required: 20, filled: 18, vacant: 2, priority: "High", status: "Open" },
    { id: "8", position: "QA Manager", department: "Quality", required: 1, filled: 0, vacant: 1, priority: "High", status: "Open" },
]

export default function ManpowerRequirementPage() {
    const [data, setData] = React.useState<ManpowerReq[]>(initialData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [formData, setFormData] = React.useState<Partial<ManpowerReq>>({
        department: "Sewing",
        priority: "Medium",
        status: "Open",
        required: 0,
        filled: 0,
    })

    // Columns
    const columns: ColumnDef<ManpowerReq>[] = [
        { accessorKey: "position", header: "Position" },
        { accessorKey: "department", header: "Department" },
        { accessorKey: "required", header: "Required" },
        { accessorKey: "filled", header: "Filled" },
        {
            accessorKey: "vacant",
            header: "Vacant",
            cell: ({ row }) => <span className={row.original.vacant > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>{row.original.vacant}</span>
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => (
                <Badge variant={row.original.priority === "High" ? "destructive" : row.original.priority === "Medium" ? "default" : "secondary"}>
                    {row.original.priority}
                </Badge>
            )
        },
        { accessorKey: "status", header: "Status" },
    ]

    // Derived Data
    const summaryStats = [
        { title: "Total Required", value: data.reduce((acc, curr) => acc + curr.required, 0) },
        { title: "Total Filled", value: data.reduce((acc, curr) => acc + curr.filled, 0) },
        { title: "Total Vacant", value: data.reduce((acc, curr) => acc + curr.vacant, 0), className: "text-red-600" },
    ]

    const handleEdit = (record: ManpowerReq) => {
        setEditingId(record.id)
        setFormData(record)
        setIsSheetOpen(true)
    }

    const handleDelete = (record: ManpowerReq) => {
        setData(prev => prev.filter(item => item.id !== record.id))
        toast.success("Requisition deleted successfully")
    }

    const handleSubmit = () => {
        if (!formData.position || !formData.department) {
            toast.error("Please fill in required fields")
            return
        }

        const required = Number(formData.required) || 0
        const filled = Number(formData.filled) || 0
        const vacant = required - filled

        if (editingId) {
            setData(prev => prev.map(item => item.id === editingId ? { ...item, ...formData, required, filled, vacant } as ManpowerReq : item))
            toast.success("Requisition updated")
        } else {
            const newItem: ManpowerReq = {
                id: Math.random().toString(36).substr(2, 9),
                position: formData.position!,
                department: formData.department!,
                required,
                filled,
                vacant,
                priority: (formData.priority as any) || "Medium",
                status: (formData.status as any) || "Open",
            }
            setData(prev => [...prev, newItem])
            toast.success("Requisition created")
        }
        setIsSheetOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({
            department: "Sewing",
            priority: "Medium",
            status: "Open",
            required: 0,
            filled: 0,
        })
    }

    const openCreateSheet = (dept?: string) => {
        resetForm()
        if (dept) {
            setFormData(prev => ({ ...prev, department: dept }))
        }
        setIsSheetOpen(true)
    }

    const FormSheet = () => (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{editingId ? "Edit Requisition" : "New Requisition"}</SheetTitle>
                    <SheetDescription>
                        {editingId ? "Update existing manpower requirement details." : "Create a new manpower requirement for a department."}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Position</Label>
                        <Input
                            value={formData.position || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            placeholder="e.g. Senior Operator"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Department</Label>
                        <NativeSelect
                            value={formData.department}
                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        >
                            <option value="Sewing">Sewing</option>
                            <option value="Finishing">Finishing</option>
                            <option value="Cutting">Cutting</option>
                            <option value="Quality">Quality</option>
                        </NativeSelect>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Required</Label>
                            <Input
                                type="number"
                                value={formData.required}
                                onChange={(e) => setFormData(prev => ({ ...prev, required: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Filled</Label>
                            <Input
                                type="number"
                                value={formData.filled}
                                onChange={(e) => setFormData(prev => ({ ...prev, filled: Number(e.target.value) }))}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Priority</Label>
                        <NativeSelect
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </NativeSelect>
                    </div>
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <NativeSelect
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </NativeSelect>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )

    return (
        <div className="p-6 space-y-6 w-full">
            <FormSheet />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <IconClipboardList className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Manpower Requirement</h1>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Manage and track manpower requisitions across departments.</p>
                    <Button onClick={() => openCreateSheet()} className="gap-2">
                        <IconPlus className="size-4" /> New Requisition
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {summaryStats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.className || ""}`}>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="summary" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="sewing">Sewing</TabsTrigger>
                    <TabsTrigger value="finishing">Finishing</TabsTrigger>
                    <TabsTrigger value="cutting">Cutting</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Requirements Overview</CardTitle>
                            <CardDescription>Consolidated list of all pending and open requirements.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable
                                columns={columns}
                                data={data}
                                showColumnCustomizer={false}
                                onEditClick={handleEdit}
                                onDelete={handleDelete}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {["Sewing", "Finishing", "Cutting", "Quality"].map((dept) => (
                    <TabsContent key={dept} value={dept.toLowerCase()}>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>{dept} Department</CardTitle>
                                        <CardDescription>Manpower needs for {dept.toLowerCase()} lines.</CardDescription>
                                    </div>
                                    <Button size="sm" onClick={() => openCreateSheet(dept)}>Add Requisition</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <DataTable
                                    columns={columns}
                                    data={data.filter(d => d.department === dept)}
                                    showColumnCustomizer={false}
                                    onEditClick={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
