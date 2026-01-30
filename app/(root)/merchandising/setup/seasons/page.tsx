"use client"

import * as React from "react"
import {
    IconTags,
    IconPlus,
    IconSearch,
    IconEdit
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const seasons = [
    { id: 1, name: "Spring/Summer 2026", code: "SS26", status: "Active", styles: 45 },
    { id: 2, name: "Autumn/Winter 2026", code: "AW26", status: "Planning", styles: 12 },
    { id: 3, name: "Spring/Summer 2025", code: "SS25", status: "Archived", styles: 82 },
]

const brands = [
    { id: 1, name: "H&M Basic", buyer: "H&M", category: "Casual" },
    { id: 2, name: "Zara Man", buyer: "Zara", category: "Formal/Casual" },
    { id: 3, name: "Target Kids", buyer: "Target", category: "Kids" },
]

export default function SeasonsPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconTags className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Seasons & Brands</h1>
                        <p className="text-sm text-muted-foreground">Setup seasons and brand categories for buyers.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seasons Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Seasons</h2>
                        <Button size="sm"><IconPlus className="size-4 mr-2" />Add Season</Button>
                    </div>
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-0">
                            {seasons.map((season, i) => (
                                <div key={season.id} className={`flex items-center justify-between p-4 ${i !== seasons.length - 1 ? 'border-b border-muted/20' : ''}`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm">{season.name}</p>
                                            <Badge variant="outline" className="text-[10px]">{season.code}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{season.styles} Styles Linked</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={season.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}>
                                            {season.status}
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><IconEdit className="size-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Brands Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Brand Lines</h2>
                        <Button size="sm" variant="outline"><IconPlus className="size-4 mr-2" />Add Brand</Button>
                    </div>
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-0">
                            {brands.map((brand, i) => (
                                <div key={brand.id} className={`flex items-center justify-between p-4 ${i !== brands.length - 1 ? 'border-b border-muted/20' : ''}`}>
                                    <div>
                                        <p className="font-bold text-sm">{brand.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Buyer: {brand.buyer} • {brand.category}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><IconEdit className="size-4" /></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
