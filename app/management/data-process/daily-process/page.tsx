"use client"

import * as React from "react"
import { IconCalendarStats, IconPlayerPlay } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

export default function DailyProcessPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [processing, setProcessing] = React.useState(false)
    const [progress, setProgress] = React.useState(0)

    const handleProcess = () => {
        if (!date) return toast.error("Please select a date")

        setProcessing(true)
        setProgress(0)

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setProcessing(false)
                    toast.success(`Processed attendance for ${date.toDateString()}`)
                    return 0
                }
                return prev + 5
            })
        }, 100)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 w-full">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <IconCalendarStats className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Daily data Process</h1>
                </div>
                <p className="text-muted-foreground">Process daily attendance records, calculate late/early, and overtime.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Date</CardTitle>
                        <CardDescription>Choose the day to process.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle>Process Actions</CardTitle>
                        <CardDescription>Run the calculation engine for the selected date.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between font-medium">
                                <span>Selected Date:</span>
                                <span>{date?.toLocaleDateString() || "Not selected"}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Status:</span>
                                <span>Pending Action</span>
                            </div>
                        </div>

                        {processing ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Processing records...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                        ) : (
                            <Button onClick={handleProcess} className="w-full gap-2" size="lg" disabled={!date}>
                                <IconPlayerPlay className="size-4" />
                                Process Daily Data
                            </Button>
                        )}

                        <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                            <p className="font-semibold mb-1">Items to be processed:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Late Arrivals</li>
                                <li>Early Departures</li>
                                <li>Overtime Calculation</li>
                                <li>Shift Adherence</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
