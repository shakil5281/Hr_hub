"use client"

import * as React from "react"
import {
    IconChartPie,
    IconArrowUpRight,
    IconCalendarStats,
    IconChartBar
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    Pie,
    LineChart,
    Line,
    Legend
} from "recharts"

const monthlySales = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
]

const buyerShare = [
    { name: 'H&M', value: 45, color: '#2563eb' },
    { name: 'Zara', value: 30, color: '#7c3aed' },
    { name: 'Target', value: 15, color: '#db2777' },
    { name: 'Other', value: 10, color: '#9ca3af' },
]

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconChartPie className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Analytics</h1>
                        <p className="text-sm text-muted-foreground">Comprehensive insights into sales and production.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Last 6 Months</Button>
                    <Button size="sm">Download PDF</Button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Monthly Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlySales}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--muted)/0.3)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} />
                                    <Tooltip
                                        cursor={{ fill: 'oklch(var(--muted)/0.1)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="oklch(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Buyer Share */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Buyer Market Share</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={buyerShare}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {buyerShare.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "On-Time Shipment", value: "94.5%", change: "+2.1%", icon: IconArrowUpRight },
                    { title: "Average Lead Time", value: "65 Days", change: "-5 Days", icon: IconCalendarStats },
                    { title: "Order Cancellation", value: "0.8%", change: "-0.2%", icon: IconChartBar },
                ].map((kpi, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <kpi.icon className="size-5" />
                                </div>
                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">{kpi.change}</Badge>
                            </div>
                            <h3 className="text-3xl font-black text-foreground mb-1">{kpi.value}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
