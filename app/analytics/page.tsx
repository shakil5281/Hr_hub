import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconChartBar } from "@tabler/icons-react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex items-center gap-2">
                <IconChartBar className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Workforce Analytics</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Headcount Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-green-600 font-medium">↑ 4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.4%</div>
                        <p className="text-xs text-red-600 font-medium">↓ 0.5% from last year</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Productivity Index</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94.8</div>
                        <p className="text-xs text-muted-foreground">Target: 95.0</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartAreaInteractive />
                </CardContent>
            </Card>
        </div>
    )
}
