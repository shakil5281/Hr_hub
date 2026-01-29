"use client"

import { IconBuildingFactory2, IconActivity, IconAlertTriangle, IconChecklist } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductionDashboard() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconBuildingFactory2 className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Production Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Overview of production activities and key performance indicators.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Output</CardTitle>
                        <IconActivity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15,231</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Lines</CardTitle>
                        <IconBuildingFactory2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12/14</div>
                        <p className="text-xs text-muted-foreground">Running at 85% capacity</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Downtime</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2h 14m</div>
                        <p className="text-xs text-muted-foreground">-15% from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">QA Pass Rate</CardTitle>
                        <IconChecklist className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98.5%</div>
                        <p className="text-xs text-muted-foreground">+0.5% improvement</p>
                    </CardContent>
                </Card>
            </div>

            <div className="px-4 lg:px-6">
                <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground bg-muted/10">
                    Production Analytics Chart Placeholder
                </div>
            </div>
        </div>
    )
}
