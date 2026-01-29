"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { IconBuilding, IconChevronLeft, IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"
import companyData from "../../company-data.json"

export default function EditCompanyPage() {
    const router = useRouter()
    const params = useParams()
    const companyId = params.id

    const [loading, setLoading] = React.useState(false)
    const currentCompany = companyData.find(c => c.id.toString() === companyId)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setLoading(false)
        toast.success("Company information updated successfully")
        router.push("/information/company-information")
    }

    if (!currentCompany) {
        return (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Company not found.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <IconChevronLeft className="size-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit &quot;{currentCompany.companyName}&quot;</h1>
                    <p className="text-muted-foreground text-sm">Update the company details and configuration.</p>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <Card className="shadow-lg border-muted/40">
                    <CardHeader className="bg-muted/30 pb-8">
                        <CardTitle className="flex items-center gap-2">
                            <IconBuilding className="size-5 text-primary" />
                            Company Details
                        </CardTitle>
                        <CardDescription>Modify the registration and contact information for this company.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8 pt-8 px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" placeholder="Enter company name" defaultValue={currentCompany.companyName} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationNo">Registration Number</Label>
                                <Input id="registrationNo" placeholder="REG-123456" defaultValue={currentCompany.registrationNo} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <NativeSelect id="industry" className="w-full" defaultValue={currentCompany.industry}>
                                    <option value="Technology">Technology</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="E-commerce">E-commerce</option>
                                </NativeSelect>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <NativeSelect id="status" className="w-full" defaultValue={currentCompany.status}>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                </NativeSelect>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Official Email</Label>
                                <Input id="email" type="email" placeholder="contact@company.com" defaultValue={currentCompany.email} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="founded">Founded Year</Label>
                                <Input id="founded" placeholder="e.g. 2020" defaultValue={currentCompany.founded} required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 border-t px-8 py-6 flex justify-end gap-3 rounded-b-lg">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="min-w-[120px]">
                            {loading ? (
                                <>
                                    <IconLoader className="mr-2 size-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <IconCircleCheckFilled className="mr-2 size-4" />
                                    Update Company
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
