"use client"

import * as React from "react"
import {
    IconBuildingWarehouse,
    IconSearch,
    IconFilter,
    IconAlertTriangle,
    IconCheck,
    IconArrowRight,
    IconLayoutGrid
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

const inventoryItems = [
    {
        id: "INV-001",
        name: "Cotton Jersey 160 GSM",
        color: "Jet Black",
        req: 5000,
        received: 4800,
        unit: "kg",
        status: "Shortage",
        batches: [
            { id: "B-101", qty: 2000, loc: "Rack A-12" },
            { id: "B-102", qty: 2800, loc: "Rack A-14" },
        ]
    },
    {
        id: "INV-002",
        name: "YKK Metal Zipper",
        color: "Antique Brass",
        req: 12000,
        received: 12000,
        unit: "pcs",
        status: "Completed",
        batches: [
            { id: "B-201", qty: 12000, loc: "Bin C-05" },
        ]
    },
    {
        id: "INV-003",
        name: "Polyester Thread 40/2",
        color: "Navy Blue",
        req: 500,
        received: 0,
        unit: "cones",
        status: "Pending",
        batches: []
    }
]

export default function InventoryPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconBuildingWarehouse className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">In-house Inventory</h1>
                        <p className="text-sm text-muted-foreground">Track inventory against order requirements.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="Search item..." className="pl-9 w-64 h-9 bg-background" />
                    </div>
                    <Button variant="outline" size="sm" className="h-9"><IconFilter className="size-4" /></Button>
                </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventoryItems.map((item) => {
                    const percentage = Math.min(100, Math.round((item.received / item.req) * 100))

                    return (
                        <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <Badge variant="outline" className="text-[10px] mb-2">{item.id}</Badge>
                                        <CardTitle className="text-base font-bold leading-tight">{item.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">{item.color}</p>
                                    </div>
                                    <div className={`p-1.5 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' :
                                            item.status === 'Shortage' ? 'bg-red-500/10 text-red-600' :
                                                'bg-amber-500/10 text-amber-600'
                                        }`}>
                                        {item.status === 'Completed' ? <IconCheck className="size-4" /> :
                                            item.status === 'Shortage' ? <IconAlertTriangle className="size-4" /> :
                                                <IconLayoutGrid className="size-4" />}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-muted-foreground">Received / Required</span>
                                        <span className={
                                            item.received < item.req ? "text-red-500" : "text-emerald-500"
                                        }>
                                            {percentage}%
                                        </span>
                                    </div>
                                    <Progress value={percentage} className="h-2" indicatorClassName={
                                        item.received < item.req && item.received > 0 ? "bg-amber-500" :
                                            item.received === 0 ? "bg-muted" : "bg-emerald-500"
                                    } />
                                    <div className="flex justify-between text-xs font-bold pt-1">
                                        <span>{item.received.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">{item.unit}</span></span>
                                        <span className="text-muted-foreground">{item.req.toLocaleString()} <span className="text-[10px] font-normal">{item.unit}</span></span>
                                    </div>
                                </div>

                                {/* Batches / Location */}
                                <div className="pt-2 border-t border-dashed border-muted/50">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Storage Batches</p>
                                    <ScrollArea className="h-20 w-full">
                                        {item.batches.length > 0 ? (
                                            <div className="space-y-1.5">
                                                {item.batches.map((batch) => (
                                                    <div key={batch.id} className="flex justify-between items-center text-xs bg-muted/20 p-1.5 rounded-md">
                                                        <span className="font-mono text-[10px] text-primary">{batch.id}</span>
                                                        <span className="font-medium text-muted-foreground">{batch.loc}</span>
                                                        <span className="font-bold">{batch.qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground italic">
                                                No stock received yet
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
