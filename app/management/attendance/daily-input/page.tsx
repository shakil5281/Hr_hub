"use client"

import * as React from "react"
import { IconFingerprint, IconUpload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"

export default function DailyInputPage() {
    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconFingerprint className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Daily Input</h1>
            </div>
            <p className="text-muted-foreground">Manually input or upload daily attendance records.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Data Import</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Select File (CSV/Excel)</Label>
                            <Input type="file" />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" />
                        </div>
                    </div>
                    <Button>
                        <IconUpload className="size-4 mr-2" />
                        Upload & Process
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
