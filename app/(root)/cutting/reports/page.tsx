"use client"

import * as React from "react"
import {
    IconChartBar,
    IconFileAnalytics,
    IconDownload,
    IconCalendarStats
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"

const wastageData = [
    { name: 'Mon', fabric: 2.1, standard: 3.0 },
    { name: 'Tue', fabric: 2.4, standard: 3.0 },
    { name: 'Wed', fabric: 3.2, standard: 3.0 }, // High wastage
    { name: 'Thu', fabric: 2.8, standard: 3.0 },
    { name: 'Fri', fabric: 2.5, standard: 3.0 },
    { name: 'Sat', fabric: 2.2, standard: 3.0 },
]

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconChartBar className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Cutting Reports</h1>
                        <p className="text-sm text-muted-foreground">Detailed analysis of consumption, wastage, and efficiency.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><IconCalendarStats className="mr-2 size-4" /> This Week</Button>
                    <Button size="sm"><IconDownload className="mr-2 size-4" /> Export All</Button>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Fabric Wastage %</CardTitle>
                        <CardDescription>Daily wastage vs Standard allowance (3.0%).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={wastageData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--muted)/0.3)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} />
                                    <Tooltip
                                        cursor={{ fill: 'oklch(var(--muted)/0.1)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="fabric" name="Actual Wastage %" fill="oklch(var(--primary))" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="standard" name="Standard Limit %" fill="oklch(var(--muted))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { title: "Daily Cutting Report", desc: "Detailed shift-wise production log.", icon: IconFileAnalytics },
                        { title: "Marker Efficiency Report", desc: "Marker utilization summary.", icon: IconFileAnalytics },
                        { title: "Fabric Reconciliation", desc: "Issued vs Consumed vs Returned.", icon: IconFileAnalytics },
                        { title: "Re-cut / Damage Report", desc: "Defective panel replacement log.", icon: IconFileAnalytics },
                    ].map((rep, i) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <rep.icon className="size-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{rep.title}</h4>
                                    <p className="text-xs text-muted-foreground">{rep.desc}</p>
                                </div>
                                <Button variant="ghost" size="icon"><IconDownload className="size-4" /></Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
