import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconListDetails } from "@tabler/icons-react"

export default function LifecyclePage() {
    const stages = [
        { name: "Onboarding", count: 12, status: "Active" },
        { name: "Probation", count: 8, status: "Active" },
        { name: "Annual Review", count: 25, status: "Pending" },
        { name: "Offboarding", count: 3, status: "Active" },
    ]

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex items-center gap-2">
                <IconListDetails className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Employee Lifecycle</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stages.map((stage) => (
                    <Card key={stage.name}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stage.count}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stage.status}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lifecycle Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">New Hires Onboarding</p>
                                <p className="text-xs text-muted-foreground">8 employees starting this week</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">Probation Completion</p>
                                <p className="text-xs text-muted-foreground">5 employees cleared probation</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
