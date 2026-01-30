import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCash } from "@tabler/icons-react"
import { Progress } from "@/components/ui/progress"

export default function PayrollPage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex items-center gap-2">
                <IconCash className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Payroll Management</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Next Pay Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">February 1, 2026</div>
                        <p className="text-sm text-muted-foreground mt-1">4 days remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payroll Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>Processing Progress</span>
                            <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payroll Summary - January 2026</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Gross Salary</p>
                            <p className="text-xl font-bold">$125,000.00</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Deductions</p>
                            <p className="text-xl font-bold text-red-600">$12,500.00</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Net Salary</p>
                            <p className="text-xl font-bold text-green-600">$112,500.00</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Employees Paid</p>
                            <p className="text-xl font-bold">142 / 145</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
