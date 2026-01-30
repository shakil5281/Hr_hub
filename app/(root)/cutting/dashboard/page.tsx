"use client"

import * as React from "react"
import {
    IconScissors,
    IconBoxSeam,
    IconLayersIntersect,
    IconAlertTriangle
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line
} from "recharts"
import { Badge } from "@/components/ui/badge"

const dailyCut = [
    { name: 'Mon', target: 5000, actual: 4800 },
    { name: 'Tue', target: 5000, actual: 5100 },
    { name: 'Wed', target: 5000, actual: 4950 },
    { name: 'Thu', target: 5000, actual: 5300 },
    { name: 'Fri', target: 5000, actual: 4200 }, // Low due to machine breakdown maybe
    { name: 'Sat', target: 5000, actual: 5150 },
]

const efficiencyData = [
    { name: 'Table 1', value: 92 },
    { name: 'Table 2', value: 88 },
    { name: 'Table 3', value: 75 },
    { name: 'Table 4', value: 95 },
]

export default function CuttingDashboard() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 shadow-lg shadow-orange-600/20">
                        <IconScissors className="size-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Cutting Floor Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Real-time production monitoring and efficiency tracking.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Today's Cut Qty", value: "4,800", sub: "Pcs", trend: "+2.5%", color: "text-orange-600", bg: "bg-orange-500/10", icon: IconScissors },
                    { label: "Fabric Consumed", value: "1,250", sub: "Yds", trend: "-1.2%", color: "text-blue-600", bg: "bg-blue-500/10", icon: IconBoxSeam },
                    { label: "Wastage", value: "3.2%", sub: "Target < 4%", trend: "Good", color: "text-emerald-600", bg: "bg-emerald-500/10", icon: IconLayersIntersect },
                    { label: "Pending Re-cuts", value: "45", sub: "Panels", trend: "High", color: "text-red-600", bg: "bg-red-500/10", icon: IconAlertTriangle },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{stat.value} <span className="text-xs font-normal text-muted-foreground">{stat.sub}</span></div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className={stat.trend === 'High' ? 'text-red-500 font-bold' : stat.trend === 'Good' ? 'text-emerald-500 font-bold' : ''}>
                                    {stat.trend}
                                </span> vs yesterday
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Daily Cut Production</CardTitle>
                        <CardDescription>Target vs Actual output for the current week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyCut}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--muted)/0.3)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="actual" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle>Table Efficiency</CardTitle>
                        <CardDescription>Cutting table performance score.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        {efficiencyData.map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span>{item.name}</span>
                                    <span className={item.value < 85 ? 'text-red-500' : 'text-emerald-600'}>{item.value}%</span>
                                </div>
                                <Progress value={item.value} className="h-2" indicatorClassName={item.value < 85 ? 'bg-red-500' : 'bg-emerald-500'} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Active Jobs */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Jobs In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { id: "CP-1022", style: "JK-402", buyer: "H&M", progress: 75, status: "Spreading" },
                            { id: "CP-1023", style: "TS-110", buyer: "Zara", progress: 40, status: "Marker Making" },
                            { id: "CP-1025", style: "PN-889", buyer: "Target", progress: 95, status: "Bundling" },
                        ].map((job, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-muted/10 rounded-lg border border-muted/20">
                                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center font-bold text-xs shadow-sm border">
                                    {job.progress}%
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-sm">{job.id} - {job.style}</h4>
                                        <Badge variant="outline" className="text-[10px] h-5">{job.status}</Badge>
                                    </div>
                                    <Progress value={job.progress} className="h-1.5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
