"use client"

import * as React from "react"
import {
    IconCalculator,
    IconPlus,
    IconSearch,
    IconFileAnalytics,
    IconDownload,
    IconFilter,
    IconDots,
    IconPaperclip,
    IconCheck,
    IconX,
    IconClock
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const costingData = [
    { id: "C-2026-001", style: "Casual Denim Shirt", buyer: "H&M", season: "Summer 26", targetFob: 12.50, calculatedFob: 11.85, margin: "22%", status: "Approved", date: "2026-01-15" },
    { id: "C-2026-002", style: "Cotton Polo-T", buyer: "Zara", season: "Summer 26", targetFob: 4.20, calculatedFob: 4.45, margin: "14%", status: "Pending", date: "2026-01-20" },
    { id: "C-2026-003", style: "Formal Chino", buyer: "Target", season: "Autumn 26", targetFob: 15.00, calculatedFob: 14.20, margin: "18%", status: "Open", date: "2026-01-22" },
    { id: "C-2026-004", style: "Winter Parka", buyer: "Walmart", season: "Winter 26", targetFob: 35.00, calculatedFob: 36.50, margin: "10%", status: "Rejected", date: "2026-01-10" },
    { id: "C-2026-005", style: "Linen Trousers", buyer: "Gap", season: "Summer 26", targetFob: 18.00, calculatedFob: 16.50, margin: "25%", status: "Approved", date: "2026-01-28" },
]

export default function CostingPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconCalculator className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">FOB Costing</h1>
                        <p className="text-sm text-muted-foreground">Manage and analyze pre-production costing sheets.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-background">
                        <IconDownload className="mr-2 size-4" />
                        Export
                    </Button>
                    <Button size="sm" className="shadow-md">
                        <IconPlus className="mr-2 size-4" />
                        New Costing
                    </Button>
                </div>
            </div>

            {/* Quick Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input placeholder="Search Style/ID..." className="pl-9 bg-muted/30 border-none focus-visible:ring-1" />
                        </div>
                        <Select>
                            <SelectTrigger className="bg-muted/30 border-none focus:ring-1">
                                <SelectValue placeholder="Buyer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hm">H&M</SelectItem>
                                <SelectItem value="zara">Zara</SelectItem>
                                <SelectItem value="target">Target</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="bg-muted/30 border-none focus:ring-1">
                                <SelectValue placeholder="Season" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sum26">Summer 26</SelectItem>
                                <SelectItem value="win26">Winter 26</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="bg-muted/30 border-none focus:ring-1">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" className="text-muted-foreground">
                            <IconFilter className="mr-2 size-4" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table Area */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-[120px] font-bold text-xs uppercase text-muted-foreground tracking-wider">Cost ID</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Style Details</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider text-center">Buyer/Season</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider text-right">Target FOB</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider text-right">Calc. FOB</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider text-center">Margin</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider text-center">Status</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costingData.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-muted/10 border-muted/30">
                                    <TableCell className="font-mono text-xs font-bold text-primary">{item.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{item.style}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] h-4 font-normal px-1 shadow-none bg-muted/20">Woven</Badge>
                                                <IconPaperclip className="size-3 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-semibold">{item.buyer}</span>
                                            <span className="text-xs text-muted-foreground">{item.season}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-sm">
                                        ${item.targetFob.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`text-sm font-bold ${item.calculatedFob > item.targetFob ? 'text-destructive' : 'text-emerald-600'}`}>
                                            ${item.calculatedFob.toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] font-bold border-none">
                                            {item.margin}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            {item.status === "Approved" && (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none gap-1">
                                                    <IconCheck className="size-3" /> Approved
                                                </Badge>
                                            )}
                                            {item.status === "Pending" && (
                                                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-none gap-1">
                                                    <IconClock className="size-3" /> Pending
                                                </Badge>
                                            )}
                                            {item.status === "Open" && (
                                                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none gap-1">
                                                    Draft
                                                </Badge>
                                            )}
                                            {item.status === "Rejected" && (
                                                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 shadow-none gap-1">
                                                    <IconX className="size-3" /> Rejected
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <IconDots className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem>View Sheet</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Costing</DropdownMenuItem>
                                                <DropdownMenuItem>Copy Style</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-4 border-t border-muted/30 flex items-center justify-between bg-muted/5">
                    <p className="text-xs text-muted-foreground">Showing 5 of 128 costings</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
