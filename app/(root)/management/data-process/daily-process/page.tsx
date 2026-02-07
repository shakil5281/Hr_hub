"use client"

import * as React from "react"
import { IconCalendarStats, IconPlayerPlay, IconBuildingFactory2, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { attendanceService } from "@/lib/services/attendance"
import { organogramService } from "@/lib/services/organogram"
import { NativeSelect } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function DailyProcessPage() {
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })
    const [departmentId, setDepartmentId] = React.useState<string>("all")
    const [departments, setDepartments] = React.useState<any[]>([])
    const [processing, setProcessing] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [result, setResult] = React.useState<string | null>(null)

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments).catch(console.error)
    }, [])

    const handleProcess = async () => {
        if (!range?.from) return toast.error("Please select a date range")

        setProcessing(true)
        setProgress(15)
        setResult(null)

        try {
            const payload = {
                startDate: format(range.from, "yyyy-MM-dd"),
                endDate: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd"),
                departmentId: departmentId === "all" ? undefined : parseInt(departmentId)
            }

            setProgress(45)
            const response = await attendanceService.processDailyData(payload)
            setProgress(100)
            setResult(response.message)
            toast.success("Daily process completed")
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Processing failed")
            setProgress(0)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 w-full bg-muted/10 min-h-screen">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
                        <IconCalendarStats className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Daily data Process</h1>
                        <p className="text-muted-foreground font-medium">Calculation engine for attendance, late, early, & overtime.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
                {/* Selection Panel */}
                <div className="space-y-6">
                    <Card className="border-none shadow-lg overflow-hidden">
                        <div className="h-1.5 bg-primary/80" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">1. Range Selection</CardTitle>
                            <CardDescription>Select single or multiple dates to process.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <Calendar
                                mode="range"
                                selected={range}
                                onSelect={setRange}
                                className="rounded-xl border shadow-sm bg-background"
                                initialFocus
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">2. Target Filter</CardTitle>
                            <CardDescription>Process specific department or all employees.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                                    <IconBuildingFactory2 className="size-3.5" />
                                    Department
                                </Label>
                                <NativeSelect
                                    className="h-11 bg-muted/40 border-none font-medium text-sm"
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                >
                                    <option value="all">All Departments (Recommended)</option>
                                    {departments.map((d: any) => (
                                        <option key={d.id} value={d.id}>{d.nameEn}</option>
                                    ))}
                                </NativeSelect>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Execution Panel */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-md sticky top-6">
                        <CardHeader className="border-b bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Process Summary</CardTitle>
                                    <CardDescription>Review selection before execution.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    {processing && <div className="animate-spin text-primary"><IconPlayerPlay className="size-5" /></div>}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Start Date</span>
                                    <p className="text-xl font-semibold">{range?.from ? format(range.from, "PPP") : "---"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">End Date</span>
                                    <p className="text-xl font-semibold">{range?.to ? format(range.to, "PPP") : (range?.from ? format(range.from, "PPP") : "---")}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Department</span>
                                    <p className="font-semibold text-primary">{departmentId === "all" ? "Whole Organization" : departments.find((d: any) => d.id === parseInt(departmentId))?.nameEn}</p>
                                </div>
                            </div>

                            {processing ? (
                                <div className="space-y-4 py-8 bg-muted/40 rounded-2xl px-6 border border-dashed animate-pulse">
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-primary animate-ping" />
                                            Executing logic engines...
                                        </span>
                                        <span className="text-lg">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3 rounded-full" />
                                    <p className="text-xs text-center text-muted-foreground">This may take a few seconds depending on the workforce size.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {result && (
                                        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400">
                                            <IconCheck className="size-5 stroke-[3]" />
                                            <p className="text-sm font-semibold">{result}</p>
                                        </div>
                                    )}
                                    <Button
                                        onClick={handleProcess}
                                        className="w-full h-16 text-lg font-bold gap-3 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                        size="lg"
                                        disabled={!range?.from}
                                    >
                                        <IconPlayerPlay className="size-6 fill-current" />
                                        Begin Daily Process
                                    </Button>
                                </div>
                            )}

                            <div className="pt-4 border-t border-dashed">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 tracking-widest flex items-center gap-2">
                                    <IconAlertCircle className="size-4" />
                                    Operations performed
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        "Shift timing synchronization",
                                        "Late Arrival (L) calculation",
                                        "Early Out (E) detection",
                                        "Overtime (OT) verification",
                                        "On-Leave status update",
                                        "Off-Day / Weekend tagging"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="size-1.5 rounded-full bg-primary/40" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
