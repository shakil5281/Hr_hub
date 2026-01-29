"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCash, IconTrendingUp, IconUsers, IconWallet } from "@tabler/icons-react"

export default function SalarySummaryPage() {
    return (
        <div className="p-6 space-y-6 w-full">
            <h1 className="text-2xl font-bold tracking-tight">Salary Summary</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        <IconCash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$124,500</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <IconWallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,000</div>
                        <p className="text-xs text-muted-foreground">45 employees pending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
                        <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$4,200</div>
                        <p className="text-xs text-muted-foreground">Per employee</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">145</div>
                        <p className="text-xs text-muted-foreground">Active on payroll</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                    Chart Area Placeholder
                </div>
            </div>
        </div>
    )
}
