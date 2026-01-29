"use client"

import * as React from "react"
import { IconChartLine, IconCoin, IconArrowUpRight, IconArrowDownRight, IconWallet } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinanceOverviewPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconChartLine className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Finance Overview</h1>
                    <p className="text-sm text-muted-foreground">Comprehensive overview of financial health and metrics.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 lg:px-6">
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                        <IconArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+12.5%</div>
                        <p className="text-xs text-muted-foreground">Compared to Q3 2023</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-200/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expense Ratio</CardTitle>
                        <IconArrowDownRight className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">42%</div>
                        <p className="text-xs text-muted-foreground">Operating costs / Revenue</p>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Reserve</CardTitle>
                        <IconWallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$125,000</div>
                        <p className="text-xs text-muted-foreground">Available liquidity</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 px-4 lg:px-6">
                <Card className="col-span-1 min-h-[300px] flex items-center justify-center bg-muted/5 border-dashed">
                    <div className="text-muted-foreground flex flex-col items-center">
                        <IconCoin className="h-8 w-8 mb-2 opacity-50" />
                        <span>Profitability Analysis Chart</span>
                    </div>
                </Card>
                <Card className="col-span-1 min-h-[300px] flex items-center justify-center bg-muted/5 border-dashed">
                    <div className="text-muted-foreground flex flex-col items-center">
                        <IconChartLine className="h-8 w-8 mb-2 opacity-50" />
                        <span>Expense Breakdown Chart</span>
                    </div>
                </Card>
            </div>
        </div>
    )
}
