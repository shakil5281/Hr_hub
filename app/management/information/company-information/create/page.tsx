"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconBuilding, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { toast } from "sonner"

export default function CreateCompanyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Company created successfully")
            router.push("/information/company-information")
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <IconArrowLeft className="size-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <IconBuilding className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Add New Company</h1>
                </div>
            </div>

            <Card className="border-primary/10 shadow-lg">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>Enter the official information for the new company entity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" placeholder="e.g. Acme Hub Inc." required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="regNo">Registration Number</Label>
                                <Input id="regNo" placeholder="REG-000-000" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="industry">Industry</Label>
                                <NativeSelect id="industry" className="w-full">
                                    <option value="tech">Technology</option>
                                    <option value="finance">Finance</option>
                                    <option value="health">Healthcare</option>
                                    <option value="manufacturing">Manufacturing</option>
                                </NativeSelect>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Official Email</Label>
                            <Input id="email" type="email" placeholder="admin@company.com" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="founded">Year Founded</Label>
                                <Input id="founded" type="number" placeholder="2026" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Initial Status</Label>
                                <NativeSelect id="status" className="w-full" defaultValue="active">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </NativeSelect>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/20">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : (
                                <span className="flex items-center gap-2">
                                    <IconCheck className="size-4" />
                                    Save Company
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
