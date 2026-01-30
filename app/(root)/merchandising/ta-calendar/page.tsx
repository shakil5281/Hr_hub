"use client"

import * as React from "react"
import {
    IconCalendar,
    IconPlus,
    IconSearch,
    IconChevronLeft,
    IconChevronRight,
    IconFilter,
    IconFlag,
    IconCircleCheck,
    IconAlertCircle,
    IconClock
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const styles = [
    {
        id: "JK-101",
        buyer: "H&M",
        shipDate: "2026-03-15",
        milestones: [
            { name: "Lab Dip", start: 0, duration: 10, status: "completed" },
            { name: "Fabric Booking", start: 8, duration: 5, status: "completed" },
            { name: "Fit Sample", start: 12, duration: 8, status: "delayed" },
            { name: "PP Meeting", start: 22, duration: 3, status: "pending" },
            { name: "Production", start: 25, duration: 25, status: "pending" },
            { name: "Final QA", start: 50, duration: 5, status: "pending" },
        ]
    },
    {
        id: "TS-202",
        buyer: "Zara",
        shipDate: "2026-04-10",
        milestones: [
            { name: "Proto Approval", start: 5, duration: 12, status: "completed" },
            { name: "Bulk Yarn", start: 15, duration: 15, status: "on-track" },
            { name: "Dyeing", start: 28, duration: 10, status: "pending" },
            { name: "Sewing", start: 40, duration: 20, status: "pending" },
        ]
    }
]

const days = Array.from({ length: 90 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i - 15)
    return d
})

export default function TACalendarPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconCalendar className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Time & Action Calendar</h1>
                        <p className="text-sm text-muted-foreground">Order lifecycle timeline and milestone tracking.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted rounded-lg p-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-3">Gantt</Button>
                        <Button variant="secondary" size="sm" className="h-7 text-xs px-3 shadow-sm bg-background">Board</Button>
                    </div>
                    <Button size="sm">
                        <IconPlus className="mr-2 size-4" />
                        Create T&A
                    </Button>
                </div>
            </div>

            {/* Timeline Controls */}
            <div className="flex items-center justify-between bg-background p-3 rounded-xl shadow-sm border border-muted/20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><IconChevronLeft className="size-4" /></Button>
                        <span className="text-sm font-bold px-2">Jan - Mar 2026</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><IconChevronRight className="size-4" /></Button>
                    </div>
                    <div className="h-4 w-[1px] bg-muted/60" />
                    <div className="flex gap-2">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">On Track</Badge>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Delayed</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <IconSearch className="size-4 text-muted-foreground ml-2" />
                    <input className="bg-transparent border-none outline-none text-sm w-40" placeholder="Filter style..." />
                </div>
            </div>

            {/* Gantt View */}
            <Card className="border-none shadow-sm overflow-hidden flex-1 flex flex-col">
                <ScrollArea className="flex-1">
                    <div className="min-w-[2000px]">
                        {/* Timeline Header */}
                        <div className="flex border-b border-muted/40 sticky top-0 bg-background z-20">
                            <div className="w-64 p-4 font-bold text-xs uppercase text-muted-foreground tracking-wider border-r border-muted/40 bg-muted/10 sticky left-0 z-30">
                                STYLE / BUYER
                            </div>
                            <div className="flex-1 flex h-14">
                                {days.map((day, i) => (
                                    <div
                                        key={i}
                                        className={`w-12 flex flex-col items-center justify-center border-r border-muted/20 text-center ${day.toDateString() === new Date().toDateString() ? 'bg-primary/10' : ''}`}
                                    >
                                        <span className="text-[10px] text-muted-foreground font-bold">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="text-xs font-bold">{day.getDate()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline Body */}
                        {styles.map((style, idx) => (
                            <div key={idx} className="flex border-b border-muted/20 group hover:bg-muted/5 transition-colors">
                                <div className="w-64 p-4 border-r border-muted/40 sticky left-0 z-10 bg-background group-hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-extrabold text-primary">{style.id}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{style.buyer}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Shipment</p>
                                            <p className="text-xs font-bold">{new Date(style.shipDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <div className="h-1 flex-1 bg-muted/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-2/5" />
                                        </div>
                                        <span className="text-[10px] font-bold">40%</span>
                                    </div>
                                </div>
                                <div className="flex-1 relative h-32 py-4">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex">
                                        {days.map((day, i) => (
                                            <div
                                                key={i}
                                                className={`w-12 border-r border-muted/10 h-full ${day.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Milestones */}
                                    {style.milestones.map((ms, msIdx) => (
                                        <div
                                            key={msIdx}
                                            className="absolute h-8 rounded-lg flex items-center px-3 text-[10px] font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                                            style={{
                                                left: `${ms.start * 48}px`,
                                                width: `${ms.duration * 48}px`,
                                                top: `${msIdx % 2 === 0 ? 12 : 52}px`,
                                                background: ms.status === 'completed' ? 'oklch(0.65 0.12 250 / 0.15)' :
                                                    ms.status === 'delayed' ? 'oklch(0.65 0.15 40 / 0.15)' :
                                                        ms.status === 'on-track' ? 'oklch(0.53 0.14 150 / 0.15)' : 'oklch(var(--muted)/0.5)',
                                                border: `1px solid ${ms.status === 'completed' ? 'oklch(0.65 0.12 250 / 0.4)' :
                                                    ms.status === 'delayed' ? 'oklch(0.65 0.15 40 / 0.4)' :
                                                        ms.status === 'on-track' ? 'oklch(0.53 0.14 150 / 0.4)' : 'oklch(var(--muted))'
                                                    }`,
                                                color: ms.status === 'completed' ? 'oklch(0.65 0.12 250)' :
                                                    ms.status === 'delayed' ? 'oklch(0.65 0.15 40)' :
                                                        ms.status === 'on-track' ? 'oklch(0.53 0.14 150)' : 'oklch(var(--muted-foreground))'
                                            }}
                                        >
                                            <div className="flex items-center gap-1 truncate">
                                                {ms.status === 'completed' && <IconCircleCheck className="size-3" />}
                                                {ms.status === 'delayed' && <IconAlertCircle className="size-3" />}
                                                {ms.status === 'on-track' && <IconClock className="size-3" />}
                                                {ms.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
        </div>
    )
}
