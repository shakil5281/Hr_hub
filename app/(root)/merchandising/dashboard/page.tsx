"use client"

import * as React from "react"
import {
    IconShirt,
    IconUsers,
    IconBriefcase,
    IconCalendar,
    IconCurrencyDollar,
    IconAlertTriangle,
    IconClipboardCheck,
    IconTruckDelivery,
    IconPackageExport,
    IconTrendingUp,
    IconDotsVertical
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const buyerData = [
    { name: "H&M", orders: 45, value: 450000, color: "oklch(0.65 0.12 250)" },
    { name: "Zara", orders: 32, value: 380000, color: "oklch(0.53 0.14 150)" },
    { name: "Walmart", orders: 28, value: 320000, color: "oklch(0.75 0.10 50)" },
    { name: "Target", orders: 22, value: 250000, color: "oklch(0.45 0.18 320)" },
    { name: "Gap", orders: 18, value: 180000, color: "oklch(0.55 0.15 200)" },
]

const recentDelays = [
    { id: 1, style: "JK-402", buyer: "H&M", issue: "Fabric Delay", status: "Critical", days: 4 },
    { id: 2, style: "TS-109", buyer: "Zara", issue: "Sample Rejection", status: "Warning", days: 2 },
    { id: 3, style: "PN-882", buyer: "Target", issue: "Sewing Bottleneck", status: "Warning", days: 3 },
]

export default function MerchandisingDashboard() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconShirt className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Merchandising Overview</h1>
                        <p className="text-sm text-muted-foreground">Real-time tracking of orders, samples, and supply chain.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Last 30 Days</Button>
                    <Button size="sm" className="shadow-md">Generate Report</Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Active Orders", value: "145", sub: "+12% vs last month", icon: IconBriefcase, color: "text-blue-600", bg: "bg-blue-500/10" },
                    { title: "Pending Samples", value: "24", sub: "8 Proto, 12 Fit, 4 PP", icon: IconClipboardCheck, color: "text-amber-600", bg: "bg-amber-500/10" },
                    { title: "Fabric In-house", value: "68%", sub: "12 orders pending", icon: IconPackageExport, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                    { title: "Shipment Due", value: "08", sub: "For current week", icon: IconTruckDelivery, color: "text-violet-600", bg: "bg-violet-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {stat.sub}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Buyer Wise Distribution */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Buyer Wise Order Value</CardTitle>
                            <CardDescription>Order values distributed across top buyers (USD)</CardDescription>
                        </div>
                        <IconTrendingUp className="text-muted-foreground size-5" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={buyerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }}
                                        tickFormatter={(v) => `$${v / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'oklch(var(--muted)/0.1)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {buyerData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Delay Alerts */}
                <Card className="border-none shadow-sm flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Production Alerts</CardTitle>
                            <Badge variant="destructive" className="animate-pulse">Critical</Badge>
                        </div>
                        <CardDescription>Current delays and bottlenecks</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        {recentDelays.map((delay) => (
                            <div key={delay.id} className="group relative flex items-center gap-4 p-3 rounded-xl border border-muted/40 hover:border-primary/20 hover:bg-muted/30 transition-all">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${delay.status === 'Critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                    <IconAlertTriangle className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-sm font-bold truncate tracking-tight">{delay.style}</p>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{delay.days} Days Late</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">{delay.buyer} • {delay.issue}</p>
                                    <div className="mt-2 h-1 w-full bg-muted/40 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${delay.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`}
                                            style={{ width: delay.status === 'Critical' ? '85%' : '60%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-xs text-primary font-bold hover:bg-primary/5">
                            VIEW ALL ALERTS
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row - Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Supply Chain Milestone Approvals</CardTitle>
                        <CardDescription>Status of fabric and trim approvals across running orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 pt-2">
                            {[
                                { label: "Fabric Lab Dips", total: 120, approved: 95, color: "bg-blue-500" },
                                { label: "Bulk Fabric Booking", total: 45, approved: 42, color: "bg-emerald-500" },
                                { label: "Trim Approvals", total: 85, approved: 35, color: "bg-amber-500" },
                            ].map((item, i) => {
                                const percentage = Math.round((item.approved / item.total) * 100)
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-muted-foreground">{item.label}</span>
                                            <span className="font-bold">{item.approved}/{item.total} <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span></span>
                                        </div>
                                        <Progress value={percentage} className="h-1.5" indicatorClassName={item.color} />
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm flex flex-col justify-center items-center p-6 bg-primary text-primary-foreground">
                    <IconPackageExport className="size-12 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-1">Weekly Target</h3>
                    <p className="text-sm opacity-80 text-center mb-6 px-4">You have 12 styles reaching their final packing stage this week.</p>
                    <div className="text-4xl font-extrabold mb-4">85%</div>
                    <Button variant="secondary" className="w-full font-bold">Manage Shipments</Button>
                </Card>
            </div>
        </div>
    )
}
