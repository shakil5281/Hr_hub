"use client"

import * as React from "react"
import {
    IconChartLine,
    IconCoin,
    IconArrowUpRight,
    IconArrowDownRight,
    IconWallet,
    IconTrendingUp,
    IconTrendingDown,
    IconActivity,
    IconReportAnalytics,
    IconDownload,
    IconCalendar
} from "@tabler/icons-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    Legend,
    ComposedChart,
    Line,
    PieChart,
    Pie,
    Cell
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data
const performanceData = [
    { month: "Jan", revenue: 45000, profit: 12000, expenses: 33000 },
    { month: "Feb", revenue: 52000, profit: 15000, expenses: 37000 },
    { month: "Mar", revenue: 49000, profit: 11000, expenses: 38000 },
    { month: "Apr", revenue: 63000, profit: 21000, expenses: 42000 },
    { month: "May", revenue: 58000, profit: 18000, expenses: 40000 },
    { month: "Jun", revenue: 71000, profit: 28000, expenses: 43000 },
    { month: "Jul", revenue: 68000, profit: 24000, expenses: 44000 },
    { month: "Aug", revenue: 74000, profit: 29000, expenses: 45000 },
    { month: "Sep", revenue: 82000, profit: 34000, expenses: 48000 },
]

const revenueStreams = [
    { name: "Product Sales", value: 65, color: "#8b5cf6" },
    { name: "Services", value: 25, color: "#10b981" },
    { name: "Investments", value: 10, color: "#f59e0b" },
]

const budgetVsActual = [
    { category: "Marketing", budget: 12000, actual: 11500 },
    { category: "Operations", budget: 25000, actual: 26500 },
    { category: "R&D", budget: 15000, actual: 12000 },
    { category: "Salary", budget: 45000, actual: 44800 },
]

export default function FinanceOverviewPage() {
    const [period, setPeriod] = React.useState("ytd")

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                        <IconChartLine className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Finance Overview</h1>
                        <p className="text-sm text-muted-foreground">Comprehensive financial health analysis and reporting.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px] h-9">
                            <IconCalendar className="mr-2 size-4 opacity-50" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                            <SelectItem value="q1">Q1 2026</SelectItem>
                            <SelectItem value="q2">Q2 2026</SelectItem>
                            <SelectItem value="last_year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                        <IconDownload className="mr-2 size-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Gross Revenue</CardTitle>
                        <IconCoin className="h-4 w-4 text-violet-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$562,000</div>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200/50 px-1 rounded text-[10px] font-bold">
                                <IconArrowUpRight className="size-3 mr-0.5" /> +12.5%
                            </Badge>
                            <span className="text-xs text-muted-foreground">vs last year</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit Margin</CardTitle>
                        <IconActivity className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">34.2%</div>
                        <p className="text-xs text-muted-foreground mt-1">Healthy profit levels</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Operating Expense ratio</CardTitle>
                        <IconTrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42%</div>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200/50 px-1 rounded text-[10px] font-bold">
                                <IconArrowUpRight className="size-3 mr-0.5" /> +2.1%
                            </Badge>
                            <span className="text-xs text-muted-foreground">Slightly elevated</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Working Capital</CardTitle>
                        <IconWallet className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$125,000</div>
                        <p className="text-xs text-muted-foreground mt-1">Liquidity ratio: 1.5</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Main Performance Chart */}
                <Card className="col-span-3 lg:col-span-2 border-none shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Financial Performance</CardTitle>
                                <CardDescription>Monthly breakdown of Revenue, Expenses, and Profit</CardDescription>
                            </div>
                            <Tabs defaultValue="chart" className="w-[200px]">
                                <TabsList className="grid w-full grid-cols-2 h-8">
                                    <TabsTrigger value="chart" className="text-xs h-7">Chart</TabsTrigger>
                                    <TabsTrigger value="table" className="text-xs h-7">Table</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <ResponsiveContainer width="100%" height={350}>
                            <ComposedChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#6B7280" />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#6B7280" tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" fill="url(#colorRevenue)" strokeWidth={2} />
                                <Bar dataKey="profit" name="Net Profit" barSize={12} fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Secondary Metrics */}
                <div className="flex flex-col gap-6">
                    <Card className="flex-1 border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Revenue Sources</CardTitle>
                            <CardDescription>Breakdown by channel</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenueStreams}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {revenueStreams.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${value}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold">Total</span>
                                    <span className="text-xs text-muted-foreground">$562k</span>
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                {revenueStreams.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="font-semibold">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Budget vs Actual</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {budgetVsActual.map((item) => {
                                    const percent = (item.actual / item.budget) * 100
                                    const isOverBudget = percent > 100
                                    return (
                                        <div key={item.category} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{item.category}</span>
                                                <span className={`text-xs ${isOverBudget ? 'text-rose-600 font-bold' : 'text-muted-foreground'}`}>
                                                    {percent.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                <span>${item.actual.toLocaleString()}</span>
                                                <span>${item.budget.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
