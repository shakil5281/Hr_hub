"use client"

import * as React from "react"
import {
    IconEdit,
    IconUser,
    IconCalendar,
    IconClock,
    IconMessageDots,
    IconSend,
    IconHistory,
    IconCheck,
    IconInfoCircle
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function ManualEntryPage() {
    const [empId, setEmpId] = React.useState("")
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [inTime, setInTime] = React.useState("09:00")
    const [outTime, setOutTime] = React.useState("18:00")
    const [reason, setReason] = React.useState("device-error")
    const [remarks, setRemarks] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            alert("Entry submitted successfully")
        }, 1000)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1200px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <IconEdit className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Manual Attendance</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Correction & Off-site Logging</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold">
                                <IconHistory className="mr-2 size-4" />
                                Entry History
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1200px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Entry Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border shadow-none overflow-hidden">
                            <CardHeader className="bg-muted/5 pb-6">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <IconEdit className="size-5 text-primary" />
                                    Attendance Correction Form
                                </CardTitle>
                                <CardDescription>Enter details to manually log or correct attendance data.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Employee Search */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee ID</label>
                                            <div className="relative">
                                                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search by ID or Name"
                                                    className="pl-10 h-11 rounded-xl"
                                                    value={empId}
                                                    onChange={(e) => setEmpId(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Date Selection */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Log Date</label>
                                            <DatePicker
                                                date={date}
                                                setDate={setDate}
                                                className="h-11 rounded-xl"
                                            />
                                        </div>

                                        {/* Time Inputs */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Check-In Time</label>
                                            <div className="relative">
                                                <IconClock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    className="pl-10 h-11 rounded-xl"
                                                    value={inTime}
                                                    onChange={(e) => setInTime(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Check-Out Time</label>
                                            <div className="relative">
                                                <IconClock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    className="pl-10 h-11 rounded-xl"
                                                    value={outTime}
                                                    onChange={(e) => setOutTime(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Reason Dropdown */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Correction Reason</label>
                                            <NativeSelect
                                                className="h-11 rounded-xl"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                            >
                                                <option value="device-error">Biometric Device Error</option>
                                                <option value="client-visit">Official Client Visit</option>
                                                <option value="forgot-id">Forgot Attendance ID</option>
                                                <option value="network">Network Connectivity Issue</option>
                                                <option value="other">Other / Special Approval</option>
                                            </NativeSelect>
                                        </div>

                                        {/* Remarks */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detailed Remarks</label>
                                            <div className="relative">
                                                <IconMessageDots className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                                <Textarea
                                                    placeholder="Specify the reason for manual entry..."
                                                    className="pl-10 min-h-[100px] rounded-2xl resize-none py-3"
                                                    value={remarks}
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase bg-muted/30 px-3 py-1.5 rounded-full border">
                                            <IconInfoCircle className="size-3.5 text-primary" />
                                            Requires HR Approval
                                        </div>
                                        <Button
                                            type="submit"
                                            className="h-11 rounded-xl px-8 gap-2 shadow-lg shadow-primary/10"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Submitting..." : (
                                                <>
                                                    <IconSend className="size-4" />
                                                    Process Entry
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Info & Recent Activity */}
                    <div className="space-y-6">
                        <Card className="border shadow-none bg-slate-900 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
                                    <IconInfoCircle className="size-4 text-primary" />
                                    Entry Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <GuideItem text="All manual entries are logged for audit purposes." />
                                    <GuideItem text="Check-in/out times must match official Shift timings." />
                                    <GuideItem text="Attachments may be required for special approvals." />
                                    <GuideItem text="Entries are pending until verified by HR Head." />
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-[10px] text-slate-400 font-medium">LATEST POLICY</p>
                                    <p className="text-xs mt-1 leading-relaxed opacity-80">Manual entries must be submitted within 48 hours of the attendance date.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Recent Logs</h3>
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-4 bg-background border rounded-2xl flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <IconCheck className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold leading-none">EMP0012 - Sarah</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tight">21 Jan • Device Error</p>
                                        </div>
                                    </div>
                                    <Badge variant="success" className="h-5 px-1.5 text-[8px] font-black uppercase">Admined</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function GuideItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="size-1 rounded-full bg-primary mt-1.5 shrink-0" />
            <p className="text-xs text-slate-300 font-medium leading-relaxed">{text}</p>
        </div>
    )
}
