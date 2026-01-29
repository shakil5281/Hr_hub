"use client"

import * as React from "react"
import { IconSettings, IconLoader, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SalaryProcessPage() {
    const [status, setStatus] = React.useState<"idle" | "processing" | "success">("idle")
    const [progress, setProgress] = React.useState(0)

    const handleProcess = () => {
        setStatus("processing")
        setProgress(0)
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval)
                    setStatus("success")
                    toast.success("Payroll processed successfully")
                    return 100
                }
                return p + 5
            })
        }, 150)
    }

    return (
        <div className="p-6 w-full space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Salary Processing</h2>
                <p className="text-muted-foreground">Run the monthly payroll engine to calculate salaries.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Select the period to process.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Month</Label>
                            <NativeSelect>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <NativeSelect>
                                <option>2024</option>
                                <option>2025</option>
                            </NativeSelect>
                        </div>
                    </div>

                    {status === "idle" && (
                        <Button className="w-full" onClick={handleProcess}>
                            <IconSettings className="mr-2 size-4" />
                            Start Processing
                        </Button>
                    )}

                    {status === "processing" && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Processing...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-2 py-4">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                <IconCheck className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="font-medium text-green-600">Processing Complete!</p>
                            <Button variant="outline" onClick={() => setStatus("idle")}>Process Another</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
