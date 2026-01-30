"use client"

import * as React from "react"
import { IconFileReport, IconDeviceFloppy, IconFilter, IconX } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { NativeSelect } from "@/components/ui/select"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"

type DailyReport = {
    id: number
    date: string
    line: string
    totalOutput: number
    efficiency: number
    downtime: string
    status: string
}

const initialData: DailyReport[] = [
    { id: 1, date: "2026-01-29", line: "Line 01", totalOutput: 1250, efficiency: 94, downtime: "15m", status: "Optimal" },
    { id: 2, date: "2026-01-29", line: "Line 02", totalOutput: 980, efficiency: 82, downtime: "45m", status: "Warning" },
    { id: 3, date: "2026-01-28", line: "Line 03", totalOutput: 1100, efficiency: 88, downtime: "20m", status: "Optimal" },
    { id: 4, date: "2026-01-28", line: "Line 01", totalOutput: 1300, efficiency: 96, downtime: "5m", status: "Optimal" },
]

export default function DailyReportPage() {
    const [reports, setReports] = React.useState<DailyReport[]>(initialData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingReport, setEditingReport] = React.useState<DailyReport | null>(null)

    // Filter State
    const [filters, setFilters] = React.useState({
        date: "",
        line: "All",
        status: "All"
    })

    // Form state
    const [formData, setFormData] = React.useState<Partial<DailyReport>>({
        date: new Date().toISOString().split('T')[0],
        line: "",
        totalOutput: 0,
        efficiency: 0,
        downtime: "",
        status: "Optimal"
    })

    const filteredReports = React.useMemo(() => {
        return reports.filter(item => {
            const matchesLine = filters.line === "All" || item.line === filters.line
            const matchesStatus = filters.status === "All" || item.status === filters.status
            const matchesDate = !filters.date || item.date === filters.date

            return matchesLine && matchesStatus && matchesDate
        })
    }, [reports, filters])

    const clearFilters = () => {
        setFilters({
            date: "",
            line: "All",
            status: "All"
        })
    }

    const columns: ColumnDef<DailyReport>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>
        },
        {
            accessorKey: "line",
            header: "Line",
        },
        {
            accessorKey: "totalOutput",
            header: "Total Output",
            cell: ({ row }) => <div className="font-medium">{row.getValue("totalOutput")} pcs</div>,
        },
        {
            accessorKey: "efficiency",
            header: "Efficiency",
            cell: ({ row }) => <div>{row.getValue("efficiency")}%</div>,
        },
        {
            accessorKey: "downtime",
            header: "Downtime",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge variant={status === "Optimal" ? "default" : status === "Warning" ? "destructive" : "secondary"}>
                        {status}
                    </Badge>
                )
            },
        },
    ]

    const handleAdd = () => {
        setEditingReport(null)
        setFormData({
            date: new Date().toISOString().split('T')[0],
            line: "",
            totalOutput: 0,
            efficiency: 0,
            downtime: "",
            status: "Optimal"
        })
        setIsSheetOpen(true)
    }

    const handleEdit = (report: DailyReport) => {
        setEditingReport(report)
        setFormData(report)
        setIsSheetOpen(true)
    }

    const handleDelete = (report: DailyReport) => {
        setReports(prev => prev.filter(r => r.id !== report.id))
        toast.success("Report deleted successfully")
    }

    const handleSave = () => {
        if (!formData.line || !formData.date) {
            toast.error("Please fill in all required fields")
            return
        }

        if (editingReport) {
            setReports(prev => prev.map(r => r.id === editingReport.id ? { ...r, ...formData } as DailyReport : r))
            toast.success("Report updated successfully")
        } else {
            const newReport = {
                ...formData,
                id: Math.max(0, ...reports.map(r => r.id)) + 1
            } as DailyReport
            setReports(prev => [...prev, newReport])
            toast.success("New report added successfully")
        }
        setIsSheetOpen(false)
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <IconFileReport className="size-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Daily Production Report</h1>
                        <p className="text-sm text-muted-foreground">
                            Daily analytics for factory output and line performance.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 lg:px-6">
                <Card className="bg-muted/50 border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconFilter className="h-4 w-4" />
                            Filter Reports
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <DatePicker
                                    date={filters.date ? new Date(filters.date) : undefined}
                                    setDate={(date) => setFilters(prev => ({ ...prev, date: date ? date.toISOString().split('T')[0] : "" }))}
                                    placeholder="Pick a date"
                                    className="w-full bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="filterLine">Production Line</Label>
                                <NativeSelect
                                    id="filterLine"
                                    value={filters.line}
                                    onChange={(e) => setFilters(prev => ({ ...prev, line: e.target.value }))}
                                    className="bg-background"
                                >
                                    <option value="All">All Lines</option>
                                    <option value="Line 01">Line 01</option>
                                    <option value="Line 02">Line 02</option>
                                    <option value="Line 03">Line 03</option>
                                    <option value="Line 04">Line 04</option>
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="filterStatus">Status</Label>
                                <NativeSelect
                                    id="filterStatus"
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="bg-background"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Optimal">Optimal</option>
                                    <option value="Warning">Warning</option>
                                    <option value="Maintenance">Maintenance</option>
                                </NativeSelect>
                            </div>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full bg-background"
                            >
                                <IconX className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                data={filteredReports}
                columns={columns}
                addLabel="Add Report"
                onAddClick={handleAdd}
                onEditClick={handleEdit}
                onDelete={handleDelete}
                showTabs={false} // Tabs disabled since we now have advanced filtering
            />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md">
                    <SheetHeader className="border-b pb-4">
                        <SheetTitle>{editingReport ? "Edit Production Report" : "Add Production Report"}</SheetTitle>
                        <SheetDescription>
                            Enter the daily production details below.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="line">Production Line</Label>
                            <NativeSelect
                                id="line"
                                value={formData.line}
                                onChange={e => setFormData(prev => ({ ...prev, line: e.target.value }))}
                            >
                                <option value="" disabled>Select a line</option>
                                <option value="Line 01">Line 01</option>
                                <option value="Line 02">Line 02</option>
                                <option value="Line 03">Line 03</option>
                                <option value="Line 04">Line 04</option>
                            </NativeSelect>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="output">Total Output (pcs)</Label>
                                <Input
                                    id="output"
                                    type="number"
                                    value={formData.totalOutput}
                                    onChange={e => setFormData(prev => ({ ...prev, totalOutput: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="efficiency">Efficiency (%)</Label>
                                <Input
                                    id="efficiency"
                                    type="number"
                                    value={formData.efficiency}
                                    onChange={e => setFormData(prev => ({ ...prev, efficiency: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="downtime">Downtime (minutes/hours)</Label>
                            <Input
                                id="downtime"
                                placeholder="e.g. 15m or 1h"
                                value={formData.downtime}
                                onChange={e => setFormData(prev => ({ ...prev, downtime: e.target.value }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Operational Status</Label>
                            <NativeSelect
                                id="status"
                                value={formData.status}
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="Optimal">Optimal</option>
                                <option value="Warning">Warning</option>
                                <option value="Maintenance">Maintenance</option>
                            </NativeSelect>
                        </div>
                    </div>

                    <SheetFooter className="border-t pt-4">
                        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="gap-2">
                            <IconDeviceFloppy className="size-4" />
                            {editingReport ? "Update Report" : "Save Report"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
