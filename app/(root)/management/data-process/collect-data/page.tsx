"use client"

import * as React from "react"
import { IconCloudDownload, IconDeviceDesktop, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { attendanceService } from "@/lib/services/attendance"

import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function CollectDataPage() {
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })
    const [progress, setProgress] = React.useState(0)
    const [isProcessing, setIsProcessing] = React.useState(false)

    // Mock logs
    const [logs, setLogs] = React.useState([
        { id: 1, time: "10:00 AM", device: "Main Gate Device 01", count: 45, status: "Success" },
    ])

    const handleCollect = async () => {
        if (!range?.from) return toast.error("Please select a date range");

        setIsProcessing(true)
        setProgress(0)

        try {
            // Fake progress for UX
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 95));
            }, 500);

            const payload = {
                startDate: format(range.from, "yyyy-MM-dd"),
                endDate: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd"),
            }

            const response = await attendanceService.syncData(payload);

            clearInterval(interval);
            setProgress(100);

            toast.success(response.message);

            setLogs(prevLogs => [
                {
                    id: Date.now(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    device: `Range: ${payload.startDate} - ${payload.endDate}`,
                    count: response.count,
                    status: "Success"
                },
                ...prevLogs
            ]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Sync failed");
            setLogs(prevLogs => [
                {
                    id: Date.now(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    device: "ZkTeco File Sync",
                    count: 0,
                    status: "Failed"
                },
                ...prevLogs
            ]);
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 w-full bg-muted/10 min-h-screen">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
                        <IconCloudDownload className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Collect Attendance Data</h1>
                        <p className="text-muted-foreground font-medium">Fetch biometric or punch logs from connected ZKTeco devices.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
                {/* Selection Panel */}
                <div className="space-y-6">
                    <Card className="border-none shadow-lg overflow-hidden">
                        <div className="h-1.5 bg-primary/80" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Date Range Selection</CardTitle>
                            <CardDescription>Select single or multiple dates to fetch logs.</CardDescription>
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
                        <CardHeader>
                            <CardTitle className="text-lg">Execution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isProcessing ? (
                                <div className="space-y-4 py-4 bg-muted/40 rounded-2xl px-6 border border-dashed animate-pulse">
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span className="flex items-center gap-2 text-primary">
                                            <div className="size-2 rounded-full bg-primary animate-ping" />
                                            Syncing logs...
                                        </span>
                                        <span className="text-lg">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3 rounded-full" />
                                </div>
                            ) : (
                                <Button
                                    onClick={handleCollect}
                                    className="w-full h-16 text-lg font-bold gap-3 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                    size="lg"
                                    disabled={!range?.from}
                                >
                                    <IconRefresh className="size-6" />
                                    Fetch New Logs
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Status & Logs Panel */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-md">
                        <CardHeader className="bg-muted/50 border-b">
                            <CardTitle>Recent Sync Activity</CardTitle>
                            <CardDescription>Historical log of data collection tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-none bg-muted/30">
                                        <TableHead className="font-bold py-4">Time</TableHead>
                                        <TableHead className="font-bold">Execution Scope</TableHead>
                                        <TableHead className="font-bold">Records Fetched</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id} className="border-muted/20">
                                            <TableCell className="font-medium">{log.time}</TableCell>
                                            <TableCell className="text-muted-foreground">{log.device}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                                    {log.count}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-xs font-bold",
                                                    log.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    {log.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
