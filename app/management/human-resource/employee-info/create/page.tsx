"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconUserCircle, IconCheck, IconPhoto } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"

export default function CreateEmployeePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [joinDate, setJoinDate] = React.useState<Date | undefined>(new Date())
    const [dob, setDob] = React.useState<Date | undefined>(undefined)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Employee created successfully")
            router.push("/human-resource/employee-info")
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <IconArrowLeft className="size-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <IconUserCircle className="size-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">Add New Employee</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Basic Info & Profile Image */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-primary/10 shadow-sm overflow-hidden text-center">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-sm">Profile Picture</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <div className="size-32 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-inner mb-4 relative group cursor-pointer hover:bg-muted/80 transition-colors">
                                    <IconPhoto className="size-10 text-muted-foreground" />
                                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">Upload</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground px-4">
                                    Allowed JPG, PNG. Max size 2MB.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-sm">Status & Date</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <NativeSelect id="status" className="w-full" defaultValue="active">
                                        <option value="active">Active</option>
                                        <option value="on-leave">On Leave</option>
                                        <option value="probation">Probation</option>
                                    </NativeSelect>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="joinDate">Joining Date</Label>
                                    <DatePicker date={joinDate} setDate={setJoinDate} placeholder="Select Joining Date" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Detailed Info Sections */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-sm">Personal Information</CardTitle>
                                </div>
                                <CardDescription>Basic personal details for identification.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="fullNameEn">Full Name (English)</Label>
                                        <Input id="fullNameEn" placeholder="e.g. John Doe" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="fullNameBn">Full Name (Bangla)</Label>
                                        <Input id="fullNameBn" placeholder="যেমন: জন ডো" className="font-hindi" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nid">NID (National ID)</Label>
                                        <Input id="nid" placeholder="123 456 7890" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <DatePicker date={dob} setDate={setDob} placeholder="Select Date of Birth" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Official Information */}
                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <CardTitle className="text-sm">Company Official Information</CardTitle>
                                <CardDescription>Departmental and structural placement.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <NativeSelect id="department" required>
                                            <option value="">Select Department</option>
                                            <option value="engineering">Engineering</option>
                                            <option value="hr">Human Resource</option>
                                            <option value="production">Production</option>
                                            <option value="quality">Quality</option>
                                        </NativeSelect>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="section">Section</Label>
                                        <NativeSelect id="section">
                                            <option value="">Select Section</option>
                                            <option value="backend">Backend</option>
                                            <option value="frontend">Frontend</option>
                                            <option value="sewing">Sewing</option>
                                            <option value="finishing">Finishing</option>
                                        </NativeSelect>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="designation">Designation</Label>
                                        <Input id="designation" placeholder="e.g. Operator" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="line">Line</Label>
                                        <NativeSelect id="line">
                                            <option value="">Select Line</option>
                                            <option value="l-01">Line 01</option>
                                            <option value="l-02">Line 02</option>
                                            <option value="l-03">Line 03</option>
                                        </NativeSelect>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t pt-6">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => router.push("/human-resource/employee-info/others-information")}
                    >
                        Others Information
                    </Button>
                    <Button type="submit" className="min-w-32" disabled={isLoading}>
                        {isLoading ? "Saving..." : (
                            <span className="flex items-center gap-2">
                                <IconCheck className="size-4" />
                                Save Employee
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
