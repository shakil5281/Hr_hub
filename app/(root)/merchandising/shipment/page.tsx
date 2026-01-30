"use client"

import * as React from "react"
import {
    IconShip,
    IconSearch,
    IconFilter,
    IconFileDescription,
    IconDownload,
    IconAnchor
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const shipments = [
    { id: "SHP-2026-001", invoice: "INV-2601", buyer: "H&M", style: "JK-402", qty: 12000, carton: 600, vessel: "Maersk Sea", etd: "2026-04-15", status: "Sailed" },
    { id: "SHP-2026-002", invoice: "INV-2602", buyer: "Zara", style: "TS-109", qty: 24500, carton: 1225, vessel: "-", etd: "2026-05-10", status: "Booking" },
    { id: "SHP-2026-003", invoice: "INV-2603", buyer: "Target", style: "PN-882", qty: 8500, carton: 425, vessel: "Evergreen A", etd: "2026-03-25", status: "Gate In" },
]

export default function ShipmentPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconShip className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Shipment Tracking</h1>
                        <p className="text-sm text-muted-foreground">Manage ongoing and completed shipments.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <IconDownload className="mr-2 size-4" /> Export Report
                    </Button>
                    <Button size="sm" className="h-9">New Shipment</Button>
                </div>
            </div>

            {/* Shipment Grid */}
            <Card className="border-none shadow-sm overflow-hidden flex-1">
                <div className="p-4 border-b border-muted/20 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="Search Invoice or Vessel..." className="pl-9 bg-muted/20 border-none" />
                    </div>
                    <Button variant="outline" size="sm"><IconFilter className="mr-2 size-4" /> Filter</Button>
                </div>

                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-bold text-xs uppercase tracking-wider pl-6">Shipment ID</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider">Invoice No</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider">Buyer / Style</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Qty (pcs)</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Cartons</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider">Vessel Name</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-right">ETD Date</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shipments.map((shp) => (
                            <TableRow key={shp.id} className="group hover:bg-muted/10 border-muted/20">
                                <TableCell className="pl-6 font-bold text-xs text-primary">{shp.id}</TableCell>
                                <TableCell className="font-mono text-xs">{shp.invoice}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{shp.buyer}</span>
                                        <span className="text-xs text-muted-foreground">{shp.style}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-sm">{shp.qty.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">{shp.carton}</TableCell>
                                <TableCell className="text-sm font-medium">
                                    {shp.vessel !== "-" ? (
                                        <div className="flex items-center gap-1.5">
                                            <IconAnchor className="size-3 text-blue-500" />
                                            {shp.vessel}
                                        </div>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="text-right text-sm font-medium">{shp.etd}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={`border-none ${shp.status === 'Sailed' ? 'bg-blue-500/10 text-blue-600' :
                                            shp.status === 'Gate In' ? 'bg-emerald-500/10 text-emerald-600' :
                                                'bg-amber-500/10 text-amber-600'
                                        }`}>
                                        {shp.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <IconFileDescription className="size-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
