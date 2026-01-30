"use client"

import * as React from "react"
import {
    IconClipboardList,
    IconPlus,
    IconSearch,
    IconFileText,
    IconDimensions,
    IconPalette,
    IconSettings,
    IconEye,
    IconExternalLink,
    IconChecklist
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const orders = [
    { id: "PO-88210", buyer: "H&M", style: "JK-402", qty: 12000, val: "$84,000", shipDate: "2026-04-15", status: "Running" },
    { id: "PO-88211", buyer: "Zara", style: "TS-109", qty: 25000, val: "$112,500", shipDate: "2026-05-10", status: "Pending Booking" },
    { id: "PO-88212", buyer: "Target", style: "PN-882", qty: 8500, val: "$42,500", shipDate: "2026-03-25", status: "In Production" },
    { id: "PO-88213", buyer: "Gap", style: "TR-552", qty: 15000, val: "$97,500", shipDate: "2026-06-01", status: "Booking Done" },
]

export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconClipboardList className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
                        <p className="text-sm text-muted-foreground">Manage POs, order breakdowns, and shipment schedules.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Import CSV</Button>
                    <Button size="sm">
                        <IconPlus className="mr-2 size-4" />
                        Create PO
                    </Button>
                </div>
            </div>

            {/* List and Breakdown Area */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative w-full max-w-sm">
                                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input placeholder="Search PO / Buyer / Style..." className="pl-9 bg-muted/20 border-none" />
                            </div>
                            <Button variant="ghost" size="sm"><IconSettings className="size-4 mr-2" />Columns</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="font-bold text-xs uppercase tracking-wider pl-6">PO Number</TableHead>
                                    <TableHead className="font-bold text-xs uppercase tracking-wider">Buyer & Style</TableHead>
                                    <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Order Qty</TableHead>
                                    <TableHead className="font-bold text-xs uppercase tracking-wider text-right">FOB Value</TableHead>
                                    <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Ship Date</TableHead>
                                    <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                                    <TableHead className="w-[100px] pr-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((po) => (
                                    <TableRow key={po.id} className="group hover:bg-muted/10 border-muted/20">
                                        <TableCell className="pl-6 font-bold text-xs text-primary">{po.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{po.buyer}</span>
                                                <span className="text-xs text-muted-foreground font-medium uppercase">{po.style}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-sm">
                                            {po.qty.toLocaleString()} <span className="text-[10px] text-muted-foreground ml-1">pcs</span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-sm">
                                            {po.val}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-muted/40 border-none text-[10px] font-bold">
                                                {new Date(po.shipDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={`text-[10px] font-bold border-none ${po.status === 'Running' ? 'bg-blue-500/10 text-blue-600' :
                                                    po.status === 'In Production' ? 'bg-emerald-500/10 text-emerald-600' :
                                                        'bg-amber-500/10 text-amber-600'
                                                }`}>
                                                {po.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 gap-1 font-bold text-xs px-2 hover:bg-primary/5 hover:text-primary">
                                                        <IconDimensions className="size-3" /> Breakdown
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="sm:max-w-xl p-0">
                                                    <div className="bg-primary/5 p-6 border-b border-primary/10">
                                                        <SheetHeader>
                                                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
                                                                <IconDimensions className="size-4" /> Order Breakdown
                                                            </div>
                                                            <SheetTitle className="text-2xl font-black">{po.id}</SheetTitle>
                                                            <SheetDescription className="font-medium">
                                                                Breakdown by Color and Size for style <span className="text-foreground font-bold">{po.style}</span>
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                    </div>
                                                    <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
                                                        {/* Detailed breakdown table */}
                                                        <div className="space-y-8">
                                                            {["Jet Black", "Cloud White"].map((color, cIdx) => (
                                                                <div key={cIdx} className="space-y-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`size-4 rounded-full shadow-sm ${color === 'Jet Black' ? 'bg-black' : 'bg-white border'}`} />
                                                                        <h3 className="font-bold text-sm uppercase tracking-tight">{color}</h3>
                                                                        <Badge className="ml-auto bg-muted transition-colors hover:bg-muted/80 text-muted-foreground text-[10px] font-extrabold uppercase tracking-widest border-none">Total: {po.qty / 2}</Badge>
                                                                    </div>
                                                                    <div className="grid grid-cols-5 gap-2">
                                                                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                                                            <div key={size} className="flex flex-col gap-1 p-2 bg-muted/20 border border-muted/40 rounded-lg text-center transition-all hover:bg-primary/5 hover:border-primary/20">
                                                                                <span className="text-[10px] font-black text-muted-foreground">{size}</span>
                                                                                <span className="text-sm font-bold">{(po.qty / 10).toLocaleString()}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-10 p-4 rounded-xl bg-muted/10 border border-muted/40 flex items-center justify-between">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase text-muted-foreground">Combined Total Pieces</p>
                                                                <p className="text-3xl font-black text-primary">{po.qty.toLocaleString()}</p>
                                                            </div>
                                                            <Button size="icon" variant="ghost" className="h-10 w-10"><IconExternalLink className="size-5" /></Button>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
