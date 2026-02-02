"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconHierarchy2,
    IconBuilding,
    IconBuildingSkyscraper,
    IconLayoutGrid,
    IconIdBadge2,
    IconGitCommit,
    IconPlus,
    IconLoader,
    IconEdit,
    IconTrash,
    IconCircleCheck,
    IconX,
    IconUpload,
    IconFileSpreadsheet
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { organogramService, Department, Section, Designation, Line } from "@/lib/services/organogram"
import { companyService, Company } from "@/lib/services/company"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    NativeSelect
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
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

export default function CompanyOrganogramPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState("company")
    const [isLoading, setIsLoading] = React.useState(true)

    // Data states
    const [companies, setCompanies] = React.useState<Company[]>([])
    const [departments, setDepartments] = React.useState<Department[]>([])
    const [sections, setSections] = React.useState<Section[]>([])
    const [designations, setDesignations] = React.useState<Designation[]>([])
    const [lines, setLines] = React.useState<Line[]>([])

    // Selection states for filtering
    const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
    const [selectedDeptId, setSelectedDeptId] = React.useState<string>("all")
    const [selectedSectionId, setSelectedSectionId] = React.useState<string>("all")

    // CRUD Modal states
    const [isDeptModalOpen, setIsDeptModalOpen] = React.useState(false)
    const [isSectModalOpen, setIsSectModalOpen] = React.useState(false)
    const [isDesigModalOpen, setIsDesigModalOpen] = React.useState(false)
    const [isLineModalOpen, setIsLineModalOpen] = React.useState(false)

    const [editingItem, setEditingItem] = React.useState<any>(null)
    const [isSaving, setIsSaving] = React.useState(false)

    // Delete Alert state
    const [deleteItem, setDeleteItem] = React.useState<{ id: number, type: string } | null>(null)

    const fetchData = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const [companiesData, depsData] = await Promise.all([
                companyService.getAll(),
                organogramService.getDepartments()
            ])
            setCompanies(companiesData)
            setDepartments(depsData)

            // If we have sections/etc, they will be loaded by the useEffect
        } catch (error) {
            console.error(error)
            toast.error("Failed to load organogram data")
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    // Fetch related data when selections change
    React.useEffect(() => {
        const fetchRelated = async () => {
            if (activeTab === "department") {
                const compId = selectedCompanyId === "all" ? undefined : parseInt(selectedCompanyId)
                const data = await organogramService.getDepartments(compId)
                setDepartments(data)
            } else if (activeTab === "section") {
                const deptId = selectedDeptId === "all" ? undefined : parseInt(selectedDeptId)
                const data = await organogramService.getSections(deptId)
                setSections(data)
            } else if (activeTab === "designation") {
                const sectId = selectedSectionId === "all" ? undefined : parseInt(selectedSectionId)
                const data = await organogramService.getDesignations(sectId)
                setDesignations(data)
            } else if (activeTab === "line") {
                const sectId = selectedSectionId === "all" ? undefined : parseInt(selectedSectionId)
                const data = await organogramService.getLines(sectId)
                setLines(data)
            }
        }
        fetchRelated()
    }, [activeTab, selectedCompanyId, selectedDeptId, selectedSectionId])

    // --- CRUD Handlers ---

    const handleSaveDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const nameEn = formData.get("nameEn") as string
        const nameBn = formData.get("nameBn") as string
        const companyId = parseInt(formData.get("companyId") as string)

        try {
            if (editingItem) {
                await organogramService.updateDepartment(editingItem.id, { nameEn, nameBn, companyId })
                toast.success("Department updated")
            } else {
                await organogramService.createDepartment({ nameEn, nameBn, companyId })
                toast.success("Department created")
            }
            setIsDeptModalOpen(false)
            fetchData()
        } catch (error) {
            toast.error("Failed to save department")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const nameEn = formData.get("nameEn") as string
        const nameBn = formData.get("nameBn") as string
        const departmentId = parseInt(formData.get("departmentId") as string)

        try {
            if (editingItem) {
                await organogramService.updateSection(editingItem.id, { nameEn, nameBn, departmentId })
                toast.success("Section updated")
            } else {
                await organogramService.createSection({ nameEn, nameBn, departmentId })
                toast.success("Section created")
            }
            setIsSectModalOpen(false)
            // Force reload current view
            const data = await organogramService.getSections(selectedDeptId === "all" ? undefined : parseInt(selectedDeptId))
            setSections(data)
        } catch (error) {
            toast.error("Failed to save section")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveDesignation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const nameEn = formData.get("nameEn") as string
        const nameBn = formData.get("nameBn") as string
        const sectionId = parseInt(formData.get("sectionId") as string)
        const nightBill = parseFloat(formData.get("nightBill") as string) || 0
        const holidayBill = parseFloat(formData.get("holidayBill") as string) || 0
        const attendanceBonus = parseFloat(formData.get("attendanceBonus") as string) || 0

        try {
            if (editingItem) {
                await organogramService.updateDesignation(editingItem.id, { nameEn, nameBn, sectionId, nightBill, holidayBill, attendanceBonus })
                toast.success("Designation updated")
            } else {
                await organogramService.createDesignation({ nameEn, nameBn, sectionId, nightBill, holidayBill, attendanceBonus })
                toast.success("Designation created")
            }
            setIsDesigModalOpen(false)
            const data = await organogramService.getDesignations(selectedSectionId === "all" ? undefined : parseInt(selectedSectionId))
            setDesignations(data)
        } catch (error) {
            toast.error("Failed to save designation")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveLine = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const nameEn = formData.get("nameEn") as string
        const nameBn = formData.get("nameBn") as string
        const sectionId = parseInt(formData.get("sectionId") as string)

        try {
            if (editingItem) {
                await organogramService.updateLine(editingItem.id, { nameEn, nameBn, sectionId })
                toast.success("Line updated")
            } else {
                await organogramService.createLine({ nameEn, nameBn, sectionId })
                toast.success("Line created")
            }
            setIsLineModalOpen(false)
            const data = await organogramService.getLines(selectedSectionId === "all" ? undefined : parseInt(selectedSectionId))
            setLines(data)
        } catch (error) {
            toast.error("Failed to save line")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteItem) return
        try {
            const { id, type } = deleteItem
            if (type === "dept") await organogramService.deleteDepartment(id)
            else if (type === "sect") await organogramService.deleteSection(id)
            else if (type === "desig") await organogramService.deleteDesignation(id)
            else if (type === "line") await organogramService.deleteLine(id)

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`)
            fetchData() // Simple reload all for now
            setDeleteItem(null)
        } catch (error) {
            toast.error("Failed to delete item")
        }
    }

    // --- Columns ---
    const companyColumns: ColumnDef<Company>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
            size: 40,
        },
        { accessorKey: "companyNameEn", header: "Company Name (English)" },
        { accessorKey: "companyNameBn", header: "Company Name (Bangla)", cell: ({ row }) => <span className="font-sutonny text-lg">{row.original.companyNameBn}</span> },
        { accessorKey: "registrationNo", header: "Reg No" },
        { accessorKey: "industry", header: "Industry" },
        { accessorKey: "email", header: "Email" },
    ]

    const deptColumns: ColumnDef<Department>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
            size: 40,
        },
        { accessorKey: "nameEn", header: "Department Name (English)" },
        { accessorKey: "nameBn", header: "Department Name (Bangla)", cell: ({ row }) => <span className="font-sutonny text-lg">{row.original.nameBn}</span> },
        { accessorKey: "companyName", header: "Company" },
    ]

    const sectionColumns: ColumnDef<Section>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
            size: 40,
        },
        { accessorKey: "nameEn", header: "Section Name (English)" },
        { accessorKey: "nameBn", header: "Section Name (Bangla)", cell: ({ row }) => <span className="font-sutonny text-lg">{row.original.nameBn}</span> },
        { accessorKey: "departmentName", header: "Department" },
    ]

    const designationColumns: ColumnDef<Designation>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
            size: 40,
        },
        { accessorKey: "nameEn", header: "Designation Title (English)" },
        { accessorKey: "nameBn", header: "Designation Title (Bangla)", cell: ({ row }) => <span className="font-sutonny text-lg">{row.original.nameBn}</span> },
        { accessorKey: "sectionName", header: "Section" },
        { accessorKey: "nightBill", header: "Night Bill" },
        { accessorKey: "holidayBill", header: "Holiday Bill" },
        { accessorKey: "attendanceBonus", header: "Attn Bonus" },
    ]

    const lineColumns: ColumnDef<Line>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
            size: 40,
        },
        { accessorKey: "nameEn", header: "Line Name (English)" },
        { accessorKey: "nameBn", header: "Line Name (Bangla)", cell: ({ row }) => <span className="font-sutonny text-lg">{row.original.nameBn}</span> },
        { accessorKey: "sectionName", header: "Section" },
    ]

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-muted/20 min-h-screen">
            <div className="flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <IconHierarchy2 className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Company Organogram</h1>
                        <p className="text-sm text-muted-foreground">Manage organizational structure and departments.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchData()}>
                        <IconLoader className={cn("size-4 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-2" onClick={() => router.push('/management/information/company-organogram/import')}>
                        <IconUpload className="size-4" />
                        <span>Import</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-green-200 bg-green-50/50 hover:bg-green-50 text-green-700"
                        onClick={async () => {
                            try {
                                await organogramService.downloadTemplate()
                                toast.success("Excel template downloaded successfully!")
                            } catch (error) {
                                console.error(error)
                                toast.error("Failed to download template")
                            }
                        }}
                    >
                        <IconFileSpreadsheet className="size-4" />
                        <span>Excel Demo</span>
                    </Button>
                </div>
            </div>

            <div className="px-4 lg:px-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <div className="flex justify-center flex-col items-center">
                        <div className="bg-white dark:bg-zinc-900 p-0 rounded-full border shadow-sm sticky top-4 z-20 w-full max-w-5xl mx-auto flex items-center h-[44px] overflow-hidden">
                            <TabsList className="flex w-full h-full p-0 bg-transparent gap-0">
                                {[
                                    { val: "company", icon: IconBuilding, label: "Company" },
                                    { val: "department", icon: IconBuildingSkyscraper, label: "Department" },
                                    { val: "section", icon: IconLayoutGrid, label: "Section" },
                                    { val: "designation", icon: IconIdBadge2, label: "Designation" },
                                    { val: "line", icon: IconGitCommit, label: "Line" },
                                ].map((t) => (
                                    <TabsTrigger
                                        key={t.val}
                                        value={t.val}
                                        className="flex-1 h-full rounded-full data-[state=active]:bg-[#108545] data-[state=active]:text-white transition-all duration-300 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium p-0"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <t.icon className="size-4.5" />
                                            <span className="text-sm leading-none">{t.label}</span>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </div>

                    <Card className="border-muted/40 shadow-xl overflow-hidden rounded-3xl bg-background/50 backdrop-blur-sm">
                        <CardHeader className="bg-muted/30 border-b pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Organization Data</CardTitle>
                                    <CardDescription>View and manage {activeTab} information.</CardDescription>
                                </div>
                                {activeTab !== "company" && (
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-[#108545] hover:bg-[#0d6e39] text-white shadow-md gap-2 px-4 h-9"
                                        onClick={() => {
                                            setEditingItem(null)
                                            if (activeTab === "department") setIsDeptModalOpen(true)
                                            else if (activeTab === "section") setIsSectModalOpen(true)
                                            else if (activeTab === "designation") setIsDesigModalOpen(true)
                                            else if (activeTab === "line") setIsLineModalOpen(true)
                                        }}
                                    >
                                        <IconPlus className="size-4" />
                                        <span>Add {activeTab === "designation" ? "Title" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Filter Bar */}
                            {(activeTab !== "company") && (
                                <div className="p-4 border-b bg-muted/10 flex flex-wrap gap-4 items-end">
                                    {activeTab === "department" && (
                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                            <Label className="text-xs font-medium text-muted-foreground">Company Filter</Label>
                                            <NativeSelect
                                                value={selectedCompanyId}
                                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                                            >
                                                <option value="all">All Companies</option>
                                                {companies.map(c => (
                                                    <option key={c.id} value={c.id.toString()}>{c.companyNameEn}</option>
                                                ))}
                                            </NativeSelect>
                                        </div>
                                    )}
                                    {activeTab === "section" && (
                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                            <Label className="text-xs font-medium text-muted-foreground">Department Filter</Label>
                                            <NativeSelect
                                                value={selectedDeptId}
                                                onChange={(e) => setSelectedDeptId(e.target.value)}
                                            >
                                                <option value="all">All Departments</option>
                                                {departments.map(d => (
                                                    <option key={d.id} value={d.id.toString()}>{d.nameEn}</option>
                                                ))}
                                            </NativeSelect>
                                        </div>
                                    )}
                                    {(activeTab === "designation" || activeTab === "line") && (
                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                            <Label className="text-xs font-medium text-muted-foreground">Section Filter</Label>
                                            <NativeSelect
                                                value={selectedSectionId}
                                                onChange={(e) => setSelectedSectionId(e.target.value)}
                                            >
                                                <option value="all">All Sections</option>
                                                {sections.map(s => (
                                                    <option key={s.id} value={s.id.toString()}>{s.nameEn}</option>
                                                ))}
                                            </NativeSelect>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="px-1">
                                <TabsContent value="company" className="m-0">
                                    <DataTable
                                        data={companies}
                                        columns={companyColumns}
                                        showTabs={false}
                                        isLoading={isLoading}
                                        enableSelection={true}
                                        enableDrag={true}
                                        onEditClick={(item) => router.push(`/management/information/company-information/edit/${item.id}`)}
                                    />
                                </TabsContent>
                                <TabsContent value="department" className="m-0">
                                    <DataTable
                                        data={departments}
                                        columns={deptColumns}
                                        showTabs={false}
                                        isLoading={isLoading}
                                        enableSelection={true}
                                        enableDrag={true}
                                        onEditClick={(item) => { setEditingItem(item); setIsDeptModalOpen(true); }}
                                        onDelete={(item: any) => setDeleteItem({ id: item.id, type: "dept" })}
                                    />
                                </TabsContent>
                                <TabsContent value="section" className="m-0">
                                    <DataTable
                                        data={sections}
                                        columns={sectionColumns}
                                        showTabs={false}
                                        isLoading={isLoading}
                                        enableSelection={true}
                                        enableDrag={true}
                                        onEditClick={(item) => { setEditingItem(item); setIsSectModalOpen(true); }}
                                        onDelete={(item: any) => setDeleteItem({ id: item.id, type: "sect" })}
                                    />
                                </TabsContent>
                                <TabsContent value="designation" className="m-0">
                                    <DataTable
                                        data={designations}
                                        columns={designationColumns}
                                        showTabs={false}
                                        isLoading={isLoading}
                                        enableSelection={true}
                                        enableDrag={true}
                                        onEditClick={(item) => { setEditingItem(item); setIsDesigModalOpen(true); }}
                                        onDelete={(item: any) => setDeleteItem({ id: item.id, type: "desig" })}
                                    />
                                </TabsContent>
                                <TabsContent value="line" className="m-0">
                                    <DataTable
                                        data={lines}
                                        columns={lineColumns}
                                        showTabs={false}
                                        isLoading={isLoading}
                                        enableSelection={true}
                                        enableDrag={true}
                                        onEditClick={(item) => { setEditingItem(item); setIsLineModalOpen(true); }}
                                        onDelete={(item: any) => setDeleteItem({ id: item.id, type: "line" })}
                                    />
                                </TabsContent>
                            </div>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>

            {/* --- Modals --- */}

            {/* Department Modal */}
            <Dialog open={isDeptModalOpen} onOpenChange={setIsDeptModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSaveDepartment}>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Department" : "New Department"}</DialogTitle>
                            <DialogDescription>Add a department to your organization.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dept-company">Company</Label>
                                <NativeSelect id="dept-company" name="companyId" defaultValue={editingItem?.companyId} required>
                                    <option value="">Select Company</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.companyNameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dept-name">Department Name (English)</Label>
                                <Input id="dept-name" name="nameEn" defaultValue={editingItem?.nameEn} placeholder="e.g. Human Resources" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dept-name-bn">Department Name (Bangla)</Label>
                                <Input
                                    id="dept-name-bn"
                                    name="nameBn"
                                    defaultValue={editingItem?.nameBn}
                                    placeholder="e.g. মানব সম্পদ"
                                    className="font-sutonny text-lg"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsDeptModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Department"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Section Modal */}
            <Dialog open={isSectModalOpen} onOpenChange={setIsSectModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSaveSection}>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Section" : "New Section"}</DialogTitle>
                            <DialogDescription>Create a section under a department.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sect-dept">Department</Label>
                                <NativeSelect id="sect-dept" name="departmentId" defaultValue={editingItem?.departmentId} required>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sect-name">Section Name (English)</Label>
                                <Input id="sect-name" name="nameEn" defaultValue={editingItem?.nameEn} placeholder="e.g. Administration" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sect-name-bn">Section Name (Bangla)</Label>
                                <Input
                                    id="sect-name-bn"
                                    name="nameBn"
                                    defaultValue={editingItem?.nameBn}
                                    placeholder="e.g. প্রশাসন"
                                    className="font-sutonny text-lg"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsSectModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Section"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Designation Modal */}
            <Dialog open={isDesigModalOpen} onOpenChange={setIsDesigModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSaveDesignation}>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Designation" : "New Designation"}</DialogTitle>
                            <DialogDescription>Specify a job title for a section.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="desig-sect">Section</Label>
                                <NativeSelect id="desig-sect" name="sectionId" defaultValue={editingItem?.sectionId} required>
                                    <option value="">Select Section</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desig-name">Designation Title (English)</Label>
                                <Input id="desig-name" name="nameEn" defaultValue={editingItem?.nameEn} placeholder="e.g. Senior Manager" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desig-name-bn">Designation Title (Bangla)</Label>
                                <Input
                                    id="desig-name-bn"
                                    name="nameBn"
                                    defaultValue={editingItem?.nameBn}
                                    placeholder="e.g. সিনিয়র ম্যানেজার"
                                    className="font-sutonny text-lg"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="desig-night">Night Bill</Label>
                                    <Input id="desig-night" name="nightBill" type="number" step="0.01" defaultValue={editingItem?.nightBill || 0} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desig-holiday">Holiday Bill</Label>
                                    <Input id="desig-holiday" name="holidayBill" type="number" step="0.01" defaultValue={editingItem?.holidayBill || 0} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desig-bonus">Attn Bonus</Label>
                                    <Input id="desig-bonus" name="attendanceBonus" type="number" step="0.01" defaultValue={editingItem?.attendanceBonus || 0} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsDesigModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Designation"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Line Modal */}
            <Dialog open={isLineModalOpen} onOpenChange={setIsLineModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSaveLine}>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Line" : "New Line"}</DialogTitle>
                            <DialogDescription>Define a production line within a section.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="line-sect">Section</Label>
                                <NativeSelect id="line-sect" name="sectionId" defaultValue={editingItem?.sectionId} required>
                                    <option value="">Select Section</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="line-name">Line Name (English)</Label>
                                <Input id="line-name" name="nameEn" defaultValue={editingItem?.nameEn} placeholder="e.g. Line-01" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="line-name-bn">Line Name (Bangla)</Label>
                                <Input
                                    id="line-name-bn"
                                    name="nameBn"
                                    defaultValue={editingItem?.nameBn}
                                    placeholder="e.g. লাইন-০১"
                                    className="font-sutonny text-lg"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsLineModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Line"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={deleteItem !== null} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the <b>{deleteItem?.type}</b> from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Delete Item
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
