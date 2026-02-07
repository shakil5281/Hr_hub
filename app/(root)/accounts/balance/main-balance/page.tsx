"use client"

import * as React from "react"
import {
    IconBuildingSkyscraper,
    IconWallet,
    IconArrowUpRight,
    IconArrowDownRight,
    IconSearch,
    IconFilter,
    IconCircleChevronRight
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

const branchData = [
    {
        id: "BR-01",
        name: "Main Head Office",
        manager: "Sarah Johnson",
        balance: 145000,
        income: 250000,
        expense: 105000,
        lastUpdate: "2026-02-05",
        status: "Active"
    },
    {
        id: "BR-02",
        name: "North Region Hub",
        manager: "Michael Chen",
        balance: 65000,
        income: 120000,
        expense: 55000,
        lastUpdate: "2026-02-06",
        status: "Active"
    },
    {
        id: "BR-03",
        name: "South West Branch",
        manager: "Emily Davis",
        balance: 38500,
        income: 85000,
        expense: 46500,
        lastUpdate: "2026-02-04",
        status: "Review Required"
    },
    {
        id: "BR-04",
        name: "East Coast Center",
        manager: "Robert Wilson",
        balance: 12000,
        income: 45000,
        expense: 33000,
        lastUpdate: "2026-02-06",
        status: "Active"
    },
]

export default function MainBalancePage() {
    const totalBalance = branchData.reduce((sum, b) => sum + b.balance, 0)
    const totalIncome = branchData.reduce((sum, b) => sum + b.income, 0)
    const totalExpense = branchData.reduce((sum, b) => sum + b.expense, 0)

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <IconBuildingSkyscraper className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Main Balance</h1>
                        <p className="text-sm text-muted-foreground">Consolidated balance overview across all organization branches.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input placeholder="Search branch..." className="pl-9 h-9" />
                    </div>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <IconFilter className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Total Summary Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-violet-700 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium opacity-90">Total Company Balance</CardTitle>
                        <IconWallet className="size-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">${totalBalance.toLocaleString()}</div>
                        <p className="text-[10px] opacity-80 mt-1">Sum of 4 active branches</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-emerald-600">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Branch Income</CardTitle>
                        <IconArrowUpRight className="size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-600">
                            <span>+8.2% from previous cycle</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-rose-500">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Branch Expense</CardTitle>
                        <IconArrowDownRight className="size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalExpense.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-rose-500">
                            <span>-2.4% vs last cycle</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Branch List Table */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Branch Balance Details</CardTitle>
                    <CardDescription>Performance and liquidity breakdown per branch location.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[200px]">Branch Name</TableHead>
                                <TableHead>Branch Manager</TableHead>
                                <TableHead>Current Balance</TableHead>
                                <TableHead>In/Out Activity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branchData.map((branch) => (
                                <TableRow key={branch.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{branch.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{branch.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{branch.manager}</TableCell>
                                    <TableCell>
                                        <span className="font-bold text-sm">${branch.balance.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4 text-[11px]">
                                            <div className="flex flex-col">
                                                <span className="text-emerald-600 font-medium">Income</span>
                                                <span>${branch.income.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-rose-600 font-medium">Expense</span>
                                                <span>${branch.expense.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={branch.status === "Active" ? "default" : "outline"}
                                            className={branch.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "text-amber-700 border-amber-100 bg-amber-50"}
                                        >
                                            {branch.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary">
                                            <IconCircleChevronRight className="size-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Bottom Insight */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <IconBuildingSkyscraper size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-primary">Regional Compliance Note</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Internal liquidity audit for all branches is scheduled for the end of the month. Ensure all manual transaction entries in South West Branch are verified by HQ before closing the current cycle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
