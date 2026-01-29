"use client"

import { SummaryCard } from "@/components/summary-card"
import { IconCash, IconTrendingUp, IconUsers, IconWallet } from "@tabler/icons-react"

const chartData = [
    { value: 100 }, { value: 120 }, { value: 110 }, { value: 140 },
    { value: 130 }, { value: 160 }, { value: 150 }, { value: 180 }
]

export default function SalarySummaryPage() {
    return (
        <div className="p-0 space-y-6 w-full text-foreground transition-colors duration-500">
            <div className="flex items-center gap-4 px-4 py-4 lg:px-6 mb-2 border-b border-muted/40 bg-muted/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <IconCash className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Salary Summary</h1>
                    <p className="text-sm text-muted-foreground">Comprehensive overview of payroll and employee compensation.</p>
                </div>
            </div>

            <div className="px-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <SummaryCard
                        title="Total Paid"
                        value="$124,500"
                        icon={IconCash}
                        trend={{ value: "2.5%", label: "than last month", isUp: true }}
                        status="success"
                        chartData={chartData}
                    />
                    <SummaryCard
                        title="Pending Payments"
                        value="$12,000"
                        icon={IconWallet}
                        trend={{ value: "45", label: "employees", isUp: false }}
                        status="warning"
                        chartData={chartData.map(d => ({ value: d.value * 0.2 }))}
                    />
                    <SummaryCard
                        title="Avg Salary"
                        value="$4,200"
                        icon={IconTrendingUp}
                        trend={{ value: "0.5%", label: "steady growth", isUp: true }}
                        status="primary"
                        chartData={chartData.map(d => ({ value: 4000 + Math.random() * 500 }))}
                    />
                    <SummaryCard
                        title="Total Employees"
                        value="145"
                        icon={IconUsers}
                        trend={{ value: "12", label: "new this month", isUp: true }}
                        status="info"
                        chartData={chartData.map(d => ({ value: 140 + Math.random() * 10 }))}
                    />
                </div>

                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                        Chart Area Placeholder
                    </div>
                </div>
            </div>
        </div>
    )
}
