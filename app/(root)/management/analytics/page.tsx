"use client"

import * as React from "react"
import {
    IconChartBar,
    IconTrendingUp,
    IconUsers,
    IconTarget,
    IconCalendar,
    IconDownload,
    IconFilter,
    IconArrowUpRight,
    IconArrowDownRight,
    IconInfoCircle,
    IconHierarchy,
    IconReportAnalytics,
    IconBuildingSkyscraper,
    IconUserCheck,
    IconBriefcase
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
} from "recharts"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// --- Mock Data ---

const AREA_DATA = [
    { month: "Jan", output: 4000, target: 4400 },
    { month: "Feb", output: 3000, target: 4200 },
    { month: "Mar", output: 2000, target: 4000 },
    { month: "Apr", output: 2780, target: 3900 },
    { month: "May", output: 1890, target: 3800 },
    { month: "Jun", output: 2390, target: 4000 },
    { month: "Jul", output: 3490, target: 4100 },
]

const DEPT_DATA = [
    { name: "Engineering", value: 45, color: "var(--primary)" },
    { name: "Marketing", value: 15, color: "#6366f1" },
    { name: "Sales", value: 20, color: "#a855f7" },
    { name: "Support", value: 10, color: "#ec4899" },
    { name: "HR/Ops", value: 10, color: "#f43f5e" },
]

const PERFORMANCE_DATA = [
    { name: "High", value: 65, color: "#10b981" },
    { name: "Mid", value: 25, color: "#3b82f6" },
    { name: "Low", value: 10, color: "#f59e0b" },
]

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-8 p-4 lg:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-1000">

            {/* 1. Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <IconChartBar className="size-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Workforce Analytics</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        A real-time comprehensive audit of your organization's human capital performance and distribution.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[140px] bg-background">
                            <IconCalendar className="mr-2 size-4 opacity-50" />
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 90 Days</SelectItem>
                            <SelectItem value="1y">Full Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="hidden sm:flex border-2">
                        <IconFilter className="mr-2 size-4" />
                        Advanced Filter
                    </Button>
                    <Button size="sm" className="shadow-xl shadow-primary/20">
                        <IconDownload className="mr-2 size-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* 2. KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Headcount"
                    value="1,284"
                    trend="+4.2%"
                    positive
                    description="12 New hires this month"
                    icon={IconUsers}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <KPICard
                    title="Turnover Rate"
                    value="2.14%"
                    trend="-0.5%"
                    positive
                    description="Industry avg: 4.8%"
                    icon={IconUserCheck}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <KPICard
                    title="Open Positions"
                    value="42"
                    trend="+8"
                    negative={false}
                    description="6 High-priority roles"
                    icon={IconBriefcase}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                />
                <KPICard
                    title="Target Achievement"
                    value="94.2%"
                    trend="-1.2%"
                    negative
                    description="Critical projects delayed"
                    icon={IconTarget}
                    color="text-rose-500"
                    bg="bg-rose-500/10"
                />
            </div>

            {/* 3. Main Chart Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Workforce Output Trend */}
                <Card className="xl:col-span-2 border-2 shadow-xl shadow-accent/5 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="text-xl font-bold">Productivity Trends</CardTitle>
                            <CardDescription>Daily enterprise output vs target benchmarks.</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Actual</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-muted-foreground/30 border-2 border-dashed border-muted-foreground" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Target</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full px-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={AREA_DATA}>
                                <defs>
                                    <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background/95 p-3 shadow-2xl backdrop-blur-md">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Actual</span>
                                                            <span className="text-sm font-black text-primary">${payload[0].value}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Target</span>
                                                            <span className="text-sm font-black text-muted-foreground">${payload[1].value}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="target"
                                    stroke="var(--muted-foreground)"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="transparent"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="output"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorOutput)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Right Column Mix */}
                <div className="space-y-8">
                    {/* Department Distribution */}
                    <Card className="border-2 shadow-xl shadow-accent/5">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <IconHierarchy className="size-5 text-indigo-500" />
                                Dept. Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={DEPT_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {DEPT_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-3 pt-0">
                            <div className="grid grid-cols-2 w-full gap-2">
                                {DEPT_DATA.slice(0, 4).map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase truncate">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Quick Insight Card - Premium Dark */}
                    <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <IconInfoCircle className="size-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Efficiency Insight</span>
                            </div>
                            <h3 className="text-lg font-bold leading-tight mb-3">
                                Productivity is up <span className="text-emerald-400">12%</span> in Eng. Dept.
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                High correlation found between updated toolsets and output benchmarks this quarter. Recommend roll-out to Marketing.
                            </p>
                            <Button variant="outline" size="sm" className="mt-6 w-full rounded-full border-slate-700 bg-transparent text-white hover:bg-slate-900">
                                Full Insight Report
                            </Button>
                        </div>
                        {/* Background flare */}
                        <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            {/* 4. Detailed Table / List Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Talent Performance Table */}
                <Card className="border-none shadow-none bg-accent/5">
                    <CardHeader className="px-0 pt-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Performance Audit</CardTitle>
                                <CardDescription>Top performing divisions by KPI score.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 space-y-4">
                        {[
                            { name: "Frontend Core", score: 98, trend: "+2", color: "bg-primary" },
                            { name: "Enterprise Sales", score: 92, trend: "-1", color: "bg-indigo-500" },
                            { name: "Backend Infrastructure", score: 89, trend: "+4", color: "bg-emerald-500" },
                            { name: "Customer Experience", score: 85, trend: "0", color: "bg-amber-500" },
                        ].map((div) => (
                            <div key={div.name} className="bg-background border rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer group">
                                <div className="flex gap-4 items-center">
                                    <div className={cn("size-10 rounded-lg flex items-center justify-center text-white font-black", div.color)}>
                                        {div.score}
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold">{div.name}</h5>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {div.trend.startsWith('+') ? <IconArrowUpRight className="size-3 text-emerald-500" /> : <IconArrowDownRight className="size-3 text-rose-500" />}
                                            <span className={cn("text-[10px] font-bold", div.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                                                {div.trend}% vs Target
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground italic">Score</div>
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className={cn("h-full", div.color)} style={{ width: `${div.score}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Organizational Structure Insight */}
                <Card className="border-none shadow-none bg-accent/5">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Organizational Health</CardTitle>
                        <CardDescription>Visual breakdown of workforce balance and spans.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <HealthStat
                            label="Manager Span"
                            value="1:8"
                            description="Healthy ratio (Ideal: 1:7-10)"
                            icon={IconBuildingSkyscraper}
                            status="success"
                        />
                        <HealthStat
                            label="Avg. Tenure"
                            value="3.2y"
                            description="+0.4y Increase since Q3"
                            icon={IconCalendar}
                            status="warning"
                        />
                        <HealthStat
                            label="Skill Gap Audit"
                            value="14%"
                            description="Identified in Cloud/AI roles"
                            icon={IconTrendingUp}
                            status="error"
                        />
                        <HealthStat
                            label="Remote Adoption"
                            value="82%"
                            description="Stable workforce distribution"
                            icon={IconReportAnalytics}
                            status="success"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// --- Subcomponents ---

function KPICard({ title, value, trend, positive, negative, description, icon: Icon, color, bg }: any) {
    return (
        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
                <div className={cn("p-2 rounded-xl transition-colors", bg, color)}>
                    <Icon className="size-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black tracking-tight">{value}</div>
                <div className="flex items-center gap-2 mt-4">
                    <Badge variant={positive ? "success" : negative ? "destructive" : "secondary"} className="h-5 px-1.5 text-[10px] font-bold">
                        {trend}
                    </Badge>
                    <span className="text-[10px] font-medium text-muted-foreground leading-none">{description}</span>
                </div>
            </CardContent>
            {/* Background design */}
            <div className="absolute -right-4 -bottom-4 size-32 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-500">
                <Icon className="w-full h-full" />
            </div>
        </Card>
    )
}

function HealthStat({ label, value, description, icon: Icon, status }: any) {
    return (
        <div className="bg-background border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between">
                <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="size-6" />
                </div>
                {status === 'success' && <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                {status === 'warning' && <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                {status === 'error' && <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />}
            </div>
            <div>
                <div className="text-2xl font-black tracking-tighter">{value}</div>
                <div className="text-sm font-bold mt-0.5">{label}</div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed italic">{description}</p>
            </div>
        </div>
    )
}
