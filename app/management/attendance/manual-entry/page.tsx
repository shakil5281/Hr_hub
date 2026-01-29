"use client"

import * as React from "react"
import { IconEdit } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ManualEntryPage() {
    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconEdit className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Manual Attendance Entry</h1>
            </div>
            <p className="text-muted-foreground">Manually log attendance for an employee.</p>

            <Card className="max-w-2xl">
                <CardContent className="space-y-4 pt-6">
                    <div className="grid gap-2">
                        <Label>Employee ID</Label>
                        <Input placeholder="EMP001" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>In Time</Label>
                            <Input type="time" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Out Time</Label>
                            <Input type="time" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Reason</Label>
                        <NativeSelect>
                            <option>Device Error</option>
                            <option>Client Visit</option>
                            <option>Forgot ID</option>
                        </NativeSelect>
                    </div>
                    <Button className="w-full">Submit Entry</Button>
                </CardContent>
            </Card>
        </div>
    )
}
