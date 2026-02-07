"use client"

import * as React from "react"
import { IconFingerprint, IconUpload, IconInfoCircle, IconFileSpreadsheet, IconCalendar, IconActivity } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function DailyInputPage() {
    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 text-center sm:text-left">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <IconFingerprint className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">Daily Input</h1>
                        <p className="text-muted-foreground text-sm">Manually ingest or synchronize daily biometric records</p>
                    </div>
                </div>
            </div>

            <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Protocol Card */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-muted/20">
                        <CardHeader className="pb-4 border-b">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <IconActivity className="size-4 text-primary" />
                                Data Ingestion Terminal
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <IconFileSpreadsheet className="size-3" />
                                        Biometric Source File (CSV/XLS)
                                    </Label>
                                    <div className="relative group">
                                        <Input type="file" className="h-14 py-3 rounded-xl shadow-inner border-dashed cursor-pointer bg-white dark:bg-zinc-900 transition-all hover:border-primary/50 group-hover:bg-primary/5" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                                            <IconUpload className="size-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <IconCalendar className="size-3" />
                                        Target Period
                                    </Label>
                                    <Input type="date" className="h-12 rounded-xl shadow-inner border-dashed font-bold" />
                                </div>
                            </div>

                            <Button className="w-full h-12 rounded-xl font-black uppercase tracking-tighter shadow-lg shadow-primary/20 gap-3 group">
                                <IconUpload className="size-5 group-hover:-translate-y-1 transition-transform" />
                                Authorize Synchronization
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Info & Insights */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-primary">
                                <IconInfoCircle className="size-4" />
                                Validation Protocol
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "Ensure columns match standard biometric output (UID, Timestamp, Node).",
                                "Date format should be ISO-8601 (YYYY-MM-DD).",
                                "Duplicates will be automatically merged into the audit trail.",
                                "System rejects entries without a unique identifier."
                            ].map((text, i) => (
                                <div key={i} className="flex gap-3 text-xs font-semibold text-muted-foreground leading-relaxed">
                                    <div className="size-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                    {text}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="p-8 border-2 border-dashed rounded-3xl bg-muted/5 text-center flex flex-col items-center justify-center opacity-60">
                        <IconActivity className="size-8 text-primary/20 mb-4 animate-pulse" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Synchronizer Inactive</h3>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Awaiting source file selection</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
