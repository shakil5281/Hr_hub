"use client"

import * as React from "react"
import {
    IconCalculator,
    IconTrendingUp,
    IconTrendingDown,
    IconCreditCard,
    IconWallet,
    IconFileText,
    IconBuildingBank,
    IconCoin,
    IconArrowUpRight,
    IconArrowDownRight
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
import { Progress } from "@/components/ui/progress"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const dataCashFlow = [
    { name: "Jan", income: 45000, expense: 28000 },
    { name: "Feb", income: 52000, expense: 32000 },
    { name: "Mar", income: 48000, expense: 25000 },
    { name: "Apr", income: 61000, expense: 35000 },
    { name: "May", income: 55000, expense: 30000 },
    { name: "Jun", income: 67000, expense: 38000 },
    { name: "Jul", income: 72000, expense: 42000 },
]

const dataExpenseDistribution = [
    { name: "Salaries", value: 45, color: "#8b5cf6" },
    { name: "Materials", value: 25, color: "#3b82f6" },
    { name: "Utilities", value: 15, color: "#10b981" },
    { name: "Marketing", value: 10, color: "#f59e0b" },
    { name: "Others", value: 5, color: "#ef4444" },
]

const recentTransactions = [
    { id: "TRX-9001", party: "Global Fabrics Ltd.", date: "Today", amount: -4500, type: "Expense", status: "Completed" },
    { id: "TRX-9002", party: "Fashion House Inc.", date: "Yesterday", amount: 12500, type: "Income", status: "Completed" },
    { id: "TRX-9003", party: "Office Supplies", date: "Jan 28", amount: -320, type: "Expense", status: "Pending" },
    { id: "TRX-9004", party: "Urban Trends", date: "Jan 27", amount: 8000, type: "Income", status: "Completed" },
]

export default function AccountsDashboard() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-8 bg-muted/5 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                        <IconCalculator className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial Overview</h1>
                        <p className="text-sm text-muted-foreground">Monitor real-time cash flow, pending invoices, and expenses.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <IconFileText className="mr-2 size-4" /> Reports
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <IconCoin className="mr-2 size-4" /> New Transaction
                    </Button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-none shadow-md">
                    <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-indigo-500/10 to-transparent" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                        <IconWallet className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-foreground">$452,300.00</div>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none px-1 rounded text-[10px] font-bold">
                                <IconArrowUpRight className="size-3 mr-0.5" /> +2.5%
                            </Badge>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Income (Monthly)</CardTitle>
                        <IconTrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$72,000.00</div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">Target: $65k</span>
                            <Progress value={85} className="h-1.5 w-16 ml-2" indicatorClassName="bg-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Expenses (Monthly)</CardTitle>
                        <IconTrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$42,000.00</div>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-none px-1 rounded text-[10px] font-bold">
                                <IconArrowDownRight className="size-3 mr-0.5" /> +4.2%
                            </Badge>
                            <span className="text-xs text-muted-foreground">vs average</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
                        <IconCreditCard className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">24</div>
                        <p className="text-xs text-muted-foreground mt-1">Total Value: <span className="font-semibold text-foreground">$12,000</span></p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                {/* Main Chart */}
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Cash Flow Analysis
                            <Tabs defaultValue="year">
                                <TabsList className="h-8">
                                    <TabsTrigger value="month" className="text-xs h-7">Month</TabsTrigger>
                                    <TabsTrigger value="year" className="text-xs h-7">Year</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardTitle>
                        <CardDescription>Income vs Expense comparison for 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dataCashFlow} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                                />
                                <Area type="monotone" dataKey="income" name="Income" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expense" name="Expense" stroke="#f59e0b" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Side Cards: Expense Distribution & Recent Transactions */}
                <div className="col-span-3 flex flex-col gap-6">
                    <Card className="flex-1 border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Expense Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="relative h-[180px] w-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dataExpenseDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {dataExpenseDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-bold">42k</span>
                                    <span className="text-xs text-muted-foreground">Total</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {dataExpenseDistribution.slice(0, 4).map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">{item.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Section: Recent Transactions */}
            <Card className="border-none shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Latest financial activity from all accounts.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600">View All</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentTransactions.map((trx) => (
                            <div key={trx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-muted/20">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${trx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                        }`}>
                                        {trx.amount > 0 ? <IconArrowUpRight className="size-5" /> : <IconArrowDownRight className="size-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{trx.party}</p>
                                        <p className="text-xs text-muted-foreground">{trx.type} • {trx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${trx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {trx.amount > 0 ? '+' : ''}{trx.amount.toLocaleString()} BDT
                                    </p>
                                    <Badge variant="outline" className="text-[10px] border-none bg-muted/50 text-muted-foreground">
                                        {trx.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
