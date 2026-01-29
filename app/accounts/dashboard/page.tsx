"use client"

import * as React from "react"
import { IconCalculator, IconTrendingUp, IconTrendingDown, IconCreditCard } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccountsDashboard() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCalculator className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Accounts Overview</h1>
                    <p className="text-sm text-muted-foreground">Manage financial transactions, ledgers, and banking.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$452,300.00</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                        <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Worth $12,000</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                        <IconTrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450.00</div>
                        <p className="text-xs text-muted-foreground">-4.2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit (YTD)</CardTitle>
                        <IconCalculator className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$89,400.00</div>
                        <p className="text-xs text-muted-foreground">+18% year over year</p>
                    </CardContent>
                </Card>
            </div>

            <div className="px-4 lg:px-6">
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground bg-muted/10">
                    Financial Cash Flow Chart Placeholder
                </div>
            </div>
        </div>
    )
}
