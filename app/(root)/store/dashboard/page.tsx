"use client"

import * as React from "react"
import {
    IconPackages,
    IconAlertTriangle,
    IconTrendingUp,
    IconTrendingDown,
    IconShoppingCart,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
// Using the interactive chart from previous context if available, or simpler ones.
// I'll stick to simple HTML/CSS visualization or placeholder for charts if specific chart components aren't easily imported without verify found files.
// Actually, I saw `ChartAreaInteractive` in `components/chart-area-interactive.tsx`. I can try reuse it or build simple ones.
// Let's make a simple custom bar chart for categories.

const lowStockItems = [
    { name: "Reactive Red Dye", current: 80, min: 100, unit: "kg" },
    { name: "Needle 14/90", current: 8, min: 10, unit: "box" },
    { name: "Sewing Thread White", current: 400, min: 500, unit: "cone" },
]

const recentTransactions = [
    { id: "GRN-1001", type: "IN", item: "Cotton Yarn 80/1", qty: 500, date: "2 mins ago" },
    { id: "ISS-2054", type: "OUT", item: "Polyester Fabric", qty: 200, date: "15 mins ago" },
    { id: "ISS-2055", type: "OUT", item: "YKK Zipper", qty: 50, date: "1 hour ago" },
    { id: "GRN-1002", type: "IN", item: "Packaging Boxes", qty: 1000, date: "3 hours ago" },
]

export default function StoreDashboard() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconPackages className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Store Overview</h1>
                    <p className="text-sm text-muted-foreground">Inventory health and movement summary.</p>
                </div>
            </div>

            <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">৳</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳ 4,250,000</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
                        <IconPackages className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">Across 5 categories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Items below compliance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending GRNs</CardTitle>
                        <IconShoppingCart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Awaiting inspection</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-7 lg:px-6">
                {/* Low Stock List */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Low Stock Alerts</CardTitle>
                        <CardDescription>Items falling below minimum stock level.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {lowStockItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Min: {item.min} {item.unit}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-600">{item.current} {item.unit}</p>
                                    </div>
                                    <Badge variant="destructive" className="h-6">Low</Badge>
                                </div>
                            </div>
                        ))}
                        <div className="pt-2">
                            <Progress value={80} className="h-2 bg-red-100" />
                            <p className="text-xs text-muted-foreground mt-2 text-center">80% of items are healthy</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stock Movement / Recent Activity */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Movement</CardTitle>
                        <CardDescription>Latest IN/OUT transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${tx.type === 'IN' ? 'bg-green-100 border-green-200' : 'bg-blue-100 border-blue-200'}`}>
                                            {tx.type === 'IN' ? <IconTrendingDown className="h-4 w-4 text-green-600" /> : <IconTrendingUp className="h-4 w-4 text-blue-600" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{tx.item}</p>
                                            <p className="text-xs text-muted-foreground">{tx.id} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <div className={`font-medium ${tx.type === 'IN' ? 'text-green-600' : 'text-blue-600'}`}>
                                        {tx.type === 'IN' ? '+' : '-'}{tx.qty}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Distribution (Placeholder / Simple Visual) */}
            <div className="grid gap-4 px-4 lg:grid-cols-4 lg:px-6">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Stock Value by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Raw Materials</span>
                                    <span className="text-muted-foreground">60%</span>
                                </div>
                                <Progress value={60} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Accessories</span>
                                    <span className="text-muted-foreground">25%</span>
                                </div>
                                <Progress value={25} className="h-2 bg-blue-100" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Spares & Machinery</span>
                                    <span className="text-muted-foreground">10%</span>
                                </div>
                                <Progress value={10} className="h-2 bg-yellow-100" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Chemicals</span>
                                    <span className="text-muted-foreground">5%</span>
                                </div>
                                <Progress value={5} className="h-2 bg-purple-100" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
