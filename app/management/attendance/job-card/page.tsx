"use client"

import * as React from "react"
import { IconId } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function JobCardPage() {
    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center gap-2 mb-1">
                <IconId className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Job Card</h1>
            </div>
            <p className="text-muted-foreground">View and print employee monthly attendance job cards.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Generate Job Card</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-end">
                    <div className="grid gap-2 flex-1">
                        <label className="text-sm font-medium">Employee ID</label>
                        <Input placeholder="Enter Employee ID" />
                    </div>
                    <div className="grid gap-2 flex-1">
                        <label className="text-sm font-medium">Month</label>
                        <Input type="month" />
                    </div>
                    <Button>Generate</Button>
                </CardContent>
            </Card>

            <div className="border border-dashed rounded-lg p-10 text-center text-muted-foreground">
                Enter details above to view job card.
            </div>
        </div>
    )
}
