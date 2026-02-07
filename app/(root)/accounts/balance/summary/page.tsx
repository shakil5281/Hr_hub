"use client"

import * as React from "react"
import {
    IconScale,
    IconArrowUpRight,
    IconArrowDownRight,
    IconWallet,
    IconBuildingBank,
    IconCreditCard,
    IconChartPie
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts"

const assetData = [
    { name: "Cash in Hand", value: 45000, color: "#8b5cf6" },
    { name: "Bank Balance", value: 125000, color: "#10b981" },
    { name: "Accounts Receivable", value: 35000, color: "#3b82f6" },
    { name: "Inventory", value: 75000, color: "#f59e0b" },
]

const monthTrend = [
    { month: "Jan", assets: 250000, liabilities: 120000 },
    { month: "Feb", assets: 280000, liabilities: 115000 },
    { month: "Mar", assets: 240000, liabilities: 130000 },
    { month: "Apr", assets: 310000, liabilities: 140000 },
]

import { accountsService, AccountsSummary } from "@/lib/services/accounts"
import { toast } from "sonner"

export default function BalanceSummaryPage() {
    const [summary, setSummary] = React.useState<AccountsSummary | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchSummary = async () => {
        try {
            setIsLoading(true)
            const data = await accountsService.getSummary()
            setSummary(data)
        } catch (error) {
            toast.error("Failed to fetch balance summary")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchSummary()
    }, [])

    const assetData = summary ? summary.branchBalances.map((b, i) => ({
        name: b.branchName,
        value: b.balance,
        color: ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"][i % 5]
    })) : []

    const monthTrend = [
        { month: "Jan", assets: (summary?.totalReceived || 0) * 0.8, liabilities: (summary?.totalExpense || 0) * 0.8 },
        { month: "Feb", assets: (summary?.totalReceived || 0) * 0.9, liabilities: (summary?.totalExpense || 0) * 0.9 },
        { month: "Current", assets: summary?.totalReceived || 0, liabilities: summary?.totalExpense || 0 },
    ]

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <IconScale className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Balance Summary</h1>
                        <p className="text-sm text-muted-foreground">Snapshot of your organization's financial position.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
                        <IconBuildingBank className="size-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(summary?.totalReceived || 0).toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-medium">
                            <IconArrowUpRight className="size-3" />
                            <span>Total incoming cash</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Expense</CardTitle>
                        <IconCreditCard className="size-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(summary?.totalExpense || 0).toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1 text-rose-500 text-xs font-medium">
                            <IconArrowDownRight className="size-3" />
                            <span>Total outgoing cash</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium opacity-90">Current Balance</CardTitle>
                        <IconWallet className="size-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(summary?.currentBalance || 0).toLocaleString()}</div>
                        <p className="text-xs opacity-70 mt-1">Received - Expense</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Asset Distribution */}
                <Card className="lg:col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <IconChartPie className="size-5 text-violet-600" />
                            Branch Balance Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by branch</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={assetData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {assetData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => `$${value.toLocaleString()}`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {assetData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span className="font-semibold">${item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Historical Comparison */}
                <Card className="lg:col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Financial Performance</CardTitle>
                        <CardDescription>Cash flow trend visualization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="pt-4">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="assets" name="Incoming" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={25} />
                                        <Bar dataKey="liabilities" name="Outgoing" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
