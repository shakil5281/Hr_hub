"use client"

import * as React from "react"
import {
    IconBoxSeam,
    IconSearch,
    IconPlus,
    IconFilter,
    IconTruckDelivery,
    IconCheck,
    IconAlertTriangle,
    IconClock,
    IconDotsVertical
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const samples = [
    { id: "SMP-1001", style: "JK-402", type: "Proto Sample", buyer: "H&M", reqDate: "2026-02-10", status: "Sent", progress: 100, comment: "Couier Sent: DHL-123" },
    { id: "SMP-1002", style: "TS-109", type: "Fit Sample 1", buyer: "Zara", reqDate: "2026-02-12", status: "Making", progress: 60, comment: "Pattern Correction" },
    { id: "SMP-1003", style: "PN-882", type: "PP Sample", buyer: "Target", reqDate: "2026-02-15", status: "Pending", progress: 0, comment: "Fabric not ready" },
    { id: "SMP-1004", style: "TR-552", type: "Size Set", buyer: "Gap", reqDate: "2026-02-18", status: "Rejected", progress: 100, comment: "Measurement deviation" },
    { id: "SMP-1005", style: "JK-403", type: "TOP Sample", buyer: "H&M", reqDate: "2026-02-20", status: "Approved", progress: 100, comment: "Proceed for bulk" },
]

export default function SamplesPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconBoxSeam className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sample Tracking</h1>
                        <p className="text-sm text-muted-foreground">Monitor sample stages from Proto to TOP.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <IconTruckDelivery className="mr-2 size-4" />
                        Courier Log
                    </Button>
                    <Button size="sm">
                        <IconPlus className="mr-2 size-4" />
                        New Sample Req
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Pending Requests", value: "12", color: "text-amber-600", bg: "bg-amber-500/10" },
                    { label: "In Making", value: "8", color: "text-blue-600", bg: "bg-blue-500/10" },
                    { label: "Sent for Approval", value: "5", color: "text-purple-600", bg: "bg-purple-500/10" },
                    { label: "Rejected (Re-submit)", value: "3", color: "text-red-600", bg: "bg-red-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                                <p className="text-2xl font-black mt-1">{stat.value}</p>
                            </div>
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                                <IconBoxSeam className={`size-5 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm flex-1">
                <CardHeader className="p-4 pb-0">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-muted/50">
                                <TabsTrigger value="all">All Samples</TabsTrigger>
                                <TabsTrigger value="proto">Proto</TabsTrigger>
                                <TabsTrigger value="fit">Fit</TabsTrigger>
                                <TabsTrigger value="pp">Pre-Production</TabsTrigger>
                                <TabsTrigger value="top">TOP</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input placeholder="Search Style ID..." className="pl-9 bg-muted/20 border-none h-9 w-64" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <IconFilter className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="all" className="m-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="font-bold text-xs uppercase tracking-wider">Sample ID</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider">Style Details</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider">Type</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider">Req. Date</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider">Progress</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {samples.map((sample) => (
                                        <TableRow key={sample.id} className="group hover:bg-muted/10 border-muted/20">
                                            <TableCell className="font-bold text-xs text-primary">{sample.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{sample.style}</span>
                                                    <span className="text-xs text-muted-foreground">{sample.buyer}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal bg-background">{sample.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">
                                                {new Date(sample.reqDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {sample.status === "Approved" && <Badge className="bg-emerald-500/10 text-emerald-600 border-none"><IconCheck className="size-3 mr-1" /> Approved</Badge>}
                                                    {sample.status === "Rejected" && <Badge className="bg-red-500/10 text-red-600 border-none"><IconAlertTriangle className="size-3 mr-1" /> Rejected</Badge>}
                                                    {sample.status === "Pending" && <Badge className="bg-muted text-muted-foreground border-none">Pending</Badge>}
                                                    {sample.status === "Making" && <Badge className="bg-blue-500/10 text-blue-600 border-none"><IconClock className="size-3 mr-1" /> Making</Badge>}
                                                    {sample.status === "Sent" && <Badge className="bg-purple-500/10 text-purple-600 border-none"><IconTruckDelivery className="size-3 mr-1" /> Sent</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="w-[150px]">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                                        <span>{sample.progress}%</span>
                                                    </div>
                                                    <Progress value={sample.progress} className="h-1.5" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <IconDotsVertical className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    )
}
