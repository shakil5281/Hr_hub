"use client"

import * as React from "react"
import {
    IconScissors,
    IconPlus,
    IconSearch,
    IconFileUpload,
    IconFileText,
    IconX,
    IconCheck,
    IconEye,
    IconDownload,
    IconGridDots,
    IconList,
    IconPaperclip
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const initialStyles = [
    { id: "JK-402", name: "Denim Sherpa Jacket", buyer: "H&M", status: "In Development", progress: 65, techpack: "TS_882_v3.pdf" },
    { id: "TS-109", name: "Organic Cotton Tee", buyer: "Zara", status: "Approved", progress: 100, techpack: "Zara_SS26_final.pdf" },
    { id: "PN-882", name: "Tech Cargo Pants", buyer: "Target", status: "Proto Sent", progress: 40, techpack: "Cargo_V1.pdf" },
    { id: "TR-552", name: "Linen Summer Vest", buyer: "Gap", status: "Draft", progress: 15, techpack: null },
]

export default function StylesPage() {
    const [view, setView] = React.useState<'grid' | 'list'>('grid')

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconScissors className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Styles & Techpack</h1>
                        <p className="text-sm text-muted-foreground">Manage technical drawings, style details, and development progress.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted rounded-lg p-1 mr-2">
                        <Button
                            variant={view === 'grid' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 shadow-sm"
                            onClick={() => setView('grid')}
                        >
                            <IconGridDots className="size-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 shadow-sm"
                            onClick={() => setView('list')}
                        >
                            <IconList className="size-4" />
                        </Button>
                    </div>
                    <Button size="sm">
                        <IconPlus className="mr-2 size-4" />
                        New Style
                    </Button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background p-4 rounded-xl shadow-sm border border-muted/20">
                <div className="md:col-span-2 relative">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search styles by name or code..." className="pl-9 bg-muted/30 border-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="text-xs font-bold border-muted/60">Season: SS26</Button>
                    <Button variant="outline" className="text-xs font-bold border-muted/60">Buyer: Default</Button>
                </div>
                <Button variant="secondary" className="font-bold text-xs uppercase tracking-widest">Applied Filters</Button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {initialStyles.map((style) => (
                    <Card key={style.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="h-48 bg-muted/20 relative flex items-center justify-center transition-colors group-hover:bg-primary/5">
                            {/* SVG Placeholder for Style Drawing */}
                            <div className="opacity-20 transition-opacity group-hover:opacity-40">
                                <IconScissors className="size-20" />
                            </div>
                            <div className="absolute top-3 left-3 flex gap-2">
                                <Badge className="bg-background/80 backdrop-blur-md text-primary text-[10px] font-black border-none shadow-sm">{style.id}</Badge>
                            </div>
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <Button size="sm" variant="secondary" className="font-bold shadow-lg"><IconEye className="size-4 mr-2" /> Preview</Button>
                            </div>
                        </div>
                        <CardHeader className="p-4 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{style.buyer}</p>
                                <Badge variant="outline" className="text-[9px] h-4 font-bold uppercase tracking-tighter bg-primary/5 border-primary/20 text-primary">{style.status}</Badge>
                            </div>
                            <CardTitle className="text-lg font-black tracking-tight pt-1">{style.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 flex-1">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        <span>Dev Progress</span>
                                        <span>{style.progress}%</span>
                                    </div>
                                    <Progress value={style.progress} className="h-1.5" />
                                </div>

                                {style.techpack ? (
                                    <div className="p-2.5 rounded-lg border border-primary/10 bg-primary/5 flex items-center gap-2 group/file">
                                        <IconFileText className="size-4 text-primary" />
                                        <span className="text-[11px] font-bold text-primary flex-1 truncate">{style.techpack}</span>
                                        <IconDownload className="size-3 text-primary opacity-60 group-hover/file:opacity-100 cursor-pointer" />
                                    </div>
                                ) : (
                                    <div className="p-2.5 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/5 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all">
                                        <IconFileUpload className="size-4 text-muted-foreground" />
                                        <span className="text-[11px] font-bold text-muted-foreground">Upload Techpack</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/10 border-t border-muted/20 flex gap-2">
                            <Button variant="ghost" size="sm" className="flex-1 text-[10px] font-black uppercase tracking-widest h-8">Costing</Button>
                            <div className="h-4 w-[1px] bg-muted-foreground/20" />
                            <Button variant="ghost" size="sm" className="flex-1 text-[10px] font-black uppercase tracking-widest h-8">Booking</Button>
                        </CardFooter>
                    </Card>
                ))}

                {/* New Style Ghost Card */}
                <div className="border-2 border-dashed border-muted/40 rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:bg-primary/5 hover:border-primary/30 transition-all group cursor-pointer h-full">
                    <div className="size-16 rounded-full bg-muted/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                        <IconPlus className="size-8 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <span className="font-extrabold text-sm uppercase tracking-widest">Create Style</span>
                    <p className="text-[10px] font-medium text-center mt-2 px-6">Upload techpack or start from a scratch.</p>
                </div>
            </div>
        </div>
    )
}
