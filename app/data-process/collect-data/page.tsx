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

export default function CollectDataPage() {
    const [progress, setProgress] = React.useState(0)
    const [isProcessing, setIsProcessing] = React.useState(false)

    // Mock logs
    const [logs, setLogs] = React.useState([
        { id: 1, time: "10:00 AM", device: "Main Gate Device 01", count: 45, status: "Success" },
        { id: 2, time: "09:55 AM", device: "Back Office Device 02", count: 12, status: "Success" },
    ])

    const handleCollect = () => {
        setIsProcessing(true)
        setProgress(0)

        // Mock progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsProcessing(false)
                    toast.success("Data collection complete")
                    setLogs(prevLogs => [
                        { id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), device: "Main Gate Device 01", count: Math.floor(Math.random() * 20), status: "Success" },
                        ...prevLogs
                    ])
                    return 0
                }
                return prev + 10
            })
        }, 200)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 w-full">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <IconCloudDownload className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Collect Attendance Data</h1>
                </div>
                <p className="text-muted-foreground">Fetch biometric or punch logs from connected devices.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Manual Trigger</CardTitle>
                        <CardDescription>Initiate immediate data collection from all configured devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isProcessing ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Connecting to devices...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                        ) : (
                            <Button onClick={handleCollect} className="w-full gap-2" size="lg">
                                <IconRefresh className="size-4" />
                                Start Collection
                            </Button>
                        )}
                        <p className="text-xs text-muted-foreground text-center">
                            Last collection run: Today at 10:00 AM
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Device Status</CardTitle>
                        <CardDescription>Real-time status of connected terminals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 p-3 border rounded-md">
                            <div className="bg-green-100 p-2 rounded-full dar:bg-green-900/20">
                                <IconDeviceDesktop className="size-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Main Gate Device 01</p>
                                <p className="text-xs text-muted-foreground">IP: 192.168.1.201</p>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-950/30">Online</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Collection Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Records Fetched</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.time}</TableCell>
                                    <TableCell>{log.device}</TableCell>
                                    <TableCell>{log.count}</TableCell>
                                    <TableCell>
                                        <span className="text-green-600 font-medium">{log.status}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
