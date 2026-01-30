"use client"

import * as React from "react"
import {
    IconFileText,
    IconPrinter,
    IconDownload,
    IconCircleCheck,
    IconClock,
    IconAlertCircle,
    IconEye,
    IconUser,
    IconBriefcase
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// --- Data Type ---
interface JobCardRecord {
    id: string
    name: string
    department: string
    designation: string
    month: string
    present: number
    absent: number
    late: number
    ot: string
    status: "Verified" | "Pending" | "Review"
    image: string
}

// --- Mock Data ---
const MOCK_DATA: JobCardRecord[] = [
    {
        id: "EMP1024",
        name: "Sarah Wilson",
        department: "Engineering",
        designation: "Software Engineer",
        month: "January 2026",
        present: 22,
        absent: 1,
        late: 2,
        ot: "12h",
        status: "Verified",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        id: "EMP1025",
        name: "Michael Ross",
        department: "Marketing",
        designation: "Sales Lead",
        month: "January 2026",
        present: 20,
        absent: 3,
        late: 0,
        ot: "5h",
        status: "Pending",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    {
        id: "EMP1026",
        name: "Emma Thompson",
        department: "HR",
        designation: "HR Manager",
        month: "January 2026",
        present: 23,
        absent: 0,
        late: 1,
        ot: "0h",
        status: "Verified",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
    },
    {
        id: "EMP1027",
        name: "David Miller",
        department: "Engineering",
        designation: "DevOps Engineer",
        month: "January 2026",
        present: 21,
        absent: 2,
        late: 5,
        ot: "20h",
        status: "Review",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    },
    {
        id: "EMP1028",
        name: "Sophia Garcia",
        department: "Sales",
        designation: "Account Manager",
        month: "January 2026",
        present: 19,
        absent: 4,
        late: 2,
        ot: "8h",
        status: "Verified",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
    }
]

// --- Table Columns ---
const columns: ColumnDef<JobCardRecord>[] = [
    {
        accessorKey: "name",
        header: "Employee",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="size-9 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={row.original.image} />
                    <AvatarFallback>{row.original.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">{row.original.name}</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{row.original.id}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <IconBriefcase className="size-3 text-muted-foreground" />
                <span className="text-xs font-semibold">{row.original.department}</span>
            </div>
        )
    },
    {
        accessorKey: "month",
        header: "Period",
        cell: ({ row }) => (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-muted/50 rounded-md text-[11px] font-bold">
                <IconClock className="size-3 text-muted-foreground" />
                {row.original.month}
            </div>
        )
    },
    {
        id: "stats",
        header: "P/A/L Stats",
        cell: ({ row }) => (
            <div className="flex items-center gap-3 font-mono">
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-emerald-500">{row.original.present}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">P</span>
                </div>
                <div className="w-px h-6 bg-muted-foreground/10" />
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-rose-500">{row.original.absent}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">A</span>
                </div>
                <div className="w-px h-6 bg-muted-foreground/10" />
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-amber-500">{row.original.late}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">L</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "ot",
        header: "OT Hours",
        cell: ({ row }) => (
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/5 text-indigo-600 font-bold px-3 py-0.5 text-[10px]">
                {row.original.ot}
            </Badge>
        )
    },
    {
        accessorKey: "status",
        header: "Audit Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <div className="flex justify-start">
                    {status === "Verified" && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                            <IconCircleCheck className="size-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verified</span>
                        </div>
                    )}
                    {status === "Pending" && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                            <IconClock className="size-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Pending</span>
                        </div>
                    )}
                    {status === "Review" && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20">
                            <IconAlertCircle className="size-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Review</span>
                        </div>
                    )}
                </div>
            )
        }
    }
]

export default function JobCardListPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Summary Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-5 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                                <IconFileText className="size-5.5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent italic">
                                    Registry
                                </h1>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                                    Management Terminal • Attendance Logs
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-9 rounded-xl border-2 hover:bg-muted font-bold text-xs gap-2">
                                <IconDownload className="size-4" />
                                Bulk Actions
                            </Button>
                            <Button size="sm" className="h-9 rounded-xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 font-bold text-xs gap-2">
                                <IconPrinter className="size-4" />
                                Batch Print
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto py-8">
                <div className="bg-card border-2 shadow-2xl shadow-accent/5 rounded-3xl overflow-hidden pt-6">
                    <DataTable
                        data={MOCK_DATA}
                        columns={columns}
                        searchKey="name"
                        addLabel="Generate New Card"
                        showTabs={true}
                        tabs={[
                            { label: "Engineering", value: "Engineering" },
                            { label: "Marketing", value: "Marketing" },
                            { label: "HR", value: "HR" },
                        ]}
                        filterKey="department"
                    />
                </div>

                {/* Floating Insight Card */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Records", value: "1,284", color: "text-primary", bg: "bg-primary/5" },
                        { label: "Pending Audit", value: "12", color: "text-amber-500", bg: "bg-amber-500/5" },
                        { label: "Processed Month", value: "Jan 2026", color: "text-indigo-500", bg: "bg-indigo-500/5" }
                    ].map((stat, i) => (
                        <div key={i} className={cn("p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center", stat.bg)}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</span>
                            <span className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
