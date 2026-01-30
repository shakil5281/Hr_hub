"use client"

import * as React from "react"
import {
    IconUsers,
    IconPlus,
    IconSearch,
    IconMapPin,
    IconMail,
    IconPhone,
    IconBriefcase
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const buyers = [
    {
        id: 1,
        name: "H&M",
        country: "Sweden",
        contact: "Sarah Connor",
        email: "sarah.c@hm.com",
        orders: 12,
        status: "Active",
        logo: "HM",
        color: "bg-red-600"
    },
    {
        id: 2,
        name: "Inditex (Zara)",
        country: "Spain",
        contact: "Miguel Rodriguez",
        email: "miguel.r@inditex.com",
        orders: 8,
        status: "Active",
        logo: "ZR",
        color: "bg-black"
    },
    {
        id: 3,
        name: "Target Corp",
        country: "USA",
        contact: "James Smith",
        email: "procurement@target.com",
        orders: 5,
        status: "Review",
        logo: "TG",
        color: "bg-red-500"
    },
    {
        id: 4,
        name: "Gap Inc.",
        country: "USA",
        contact: "Emily Blunt",
        email: "emily.b@gap.com",
        orders: 10,
        status: "Active",
        logo: "GP",
        color: "bg-blue-800"
    },
]

export default function BuyersPage() {
    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <IconUsers className="size-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buyer Profiles</h1>
                        <p className="text-sm text-muted-foreground">Manage buyer details, contacts, and agreements.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="Search Buyers..." className="pl-9 h-9 w-64 bg-background border-muted" />
                    </div>
                    <Button size="sm">
                        <IconPlus className="mr-2 size-4" />
                        Add Buyer
                    </Button>
                </div>
            </div>

            {/* Buyer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {buyers.map((buyer) => (
                    <Card key={buyer.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="relative p-6 pb-2">
                            <div className="flex justify-between items-start">
                                <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                                    <AvatarFallback className={`${buyer.color} text-white font-black text-lg`}>{buyer.logo}</AvatarFallback>
                                </Avatar>
                                <Badge variant={buyer.status === 'Active' ? 'default' : 'secondary'} className="absolute top-6 right-6">
                                    {buyer.status}
                                </Badge>
                            </div>
                            <CardTitle className="mt-4 text-xl font-bold">{buyer.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 font-medium text-foreground/80">
                                <IconMapPin className="size-3.5 text-muted-foreground" /> {buyer.country}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 space-y-4">
                            <div className="pt-2 border-t border-muted/40 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <IconBriefcase className="size-4 text-muted-foreground" />
                                    <span className="font-semibold">{buyer.orders} Active Orders</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <IconUsers className="size-4 text-muted-foreground" />
                                    <span className="truncate">{buyer.contact}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    <IconMail className="size-4" />
                                    <span className="truncate">{buyer.email}</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-wider group-hover:bg-primary group-hover:text-primary-foreground border-primary/20">View Profile</Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Ghost Card */}
                <div className="border-2 border-dashed border-muted/60 rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:bg-muted/10 cursor-pointer transition-colors group">
                    <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconPlus className="size-8" />
                    </div>
                    <p className="font-bold text-lg">New Buyer</p>
                    <p className="text-sm text-center px-4 mt-1">Onboard a new partner to the system.</p>
                </div>
            </div>
        </div>
    )
}
