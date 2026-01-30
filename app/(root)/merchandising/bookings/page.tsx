"use client"

import * as React from "react"
import {
    IconStack,
    IconSearch,
    IconPlus,
    IconFilter,
    IconDownload,
    IconExternalLink,
    IconAlertCircle
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

const bookings = [
    { id: "BKG-2021", type: "Fabric", item: "100% Cotton Jersey", supplier: "Nice Fabrics Ltd", po: "PO-88210", reqQty: 5000, unit: "kg", status: "Booked", etd: "2026-02-25" },
    { id: "BKG-2022", type: "Trims", item: "YKK Zipper #5", supplier: "YKK BD", po: "PO-88210", reqQty: 12000, unit: "pcs", status: "In-house", etd: "2026-02-10" },
    { id: "BKG-2023", type: "Fabric", item: "Spandex Rib", supplier: "Nice Fabrics Ltd", po: "PO-88211", reqQty: 800, unit: "kg", status: "Pending", etd: "-" },
    { id: "BKG-2024", type: "Accessories", item: "Main Label", supplier: "Top Label", po: "Multiple", reqQty: 50000, unit: "pcs", status: "Partial", etd: "2026-03-01" },
]

export default function BookingsPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconStack className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Material Booking</h1>
                        <p className="text-sm text-muted-foreground">Manage bookings for fabric, trims, and accessories.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <IconDownload className="mr-2 size-4" />
                        Export List
                    </Button>
                    <Button size="sm">
                        <IconPlus className="mr-2 size-4" />
                        First Booking
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-none shadow-sm bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold">12</div>
                        <div>
                            <p className="text-sm font-semibold">Pending Bookings</p>
                            <p className="text-xs text-muted-foreground">Require immediate attention</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 font-bold">5</div>
                        <div>
                            <p className="text-sm font-semibold">Supplier Delays</p>
                            <p className="text-xs text-muted-foreground">ETD passed or revised</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold">85%</div>
                        <div>
                            <p className="text-sm font-semibold">On-Time In-house</p>
                            <p className="text-xs text-muted-foreground">Last 30 days performance</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Booking List */}
            <Card className="border-none shadow-sm overflow-hidden flex-1">
                <div className="p-4 border-b border-muted/20 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="Search Booking ID, Item or Supplier..." className="pl-9 bg-muted/20 border-none" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                            <IconFilter className="mr-2 size-4" /> Filter
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="font-bold text-xs uppercase tracking-wider pl-6">Booking ID</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Type</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Item Details</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Supplier</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Qty</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-right">ETD</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((bkg) => (
                                <TableRow key={bkg.id} className="group hover:bg-muted/10 border-muted/20">
                                    <TableCell className="pl-6 font-bold text-xs text-primary">{bkg.id}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal text-[10px]">{bkg.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{bkg.item}</span>
                                            <span className="text-xs text-muted-foreground">PO: {bkg.po}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">{bkg.supplier}</TableCell>
                                    <TableCell className="text-right text-sm font-bold">
                                        {bkg.reqQty.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal ml-0.5">{bkg.unit}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`border-none ${bkg.status === 'In-house' ? 'bg-emerald-500/10 text-emerald-600' :
                                                bkg.status === 'Booked' ? 'bg-blue-500/10 text-blue-600' :
                                                    bkg.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-purple-500/10 text-purple-600'
                                            }`}>
                                            {bkg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-xs font-medium">
                                        {bkg.etd}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                            <IconExternalLink className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
