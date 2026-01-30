"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconArrowLeft,
    IconInfoCircle,
    IconHome,
    IconFriends,
    IconCash,
    IconPencil,
    IconSchool,
    IconBolt,
    IconSearch,
    IconCheck,
    IconPlus,
    IconTrash
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"

export default function OthersInformationPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSave = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Others information updated successfully")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 w-full">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <IconArrowLeft className="size-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <IconInfoCircle className="size-6 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tight">Others Information</h1>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : (
                        <span className="flex items-center gap-2">
                            <IconCheck className="size-4" />
                            Save Changes
                        </span>
                    )}
                </Button>
            </div>

            <Tabs defaultValue="address" className="w-full">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto whitespace-nowrap">
                        <TabsTrigger value="address" className="flex items-center gap-2">
                            <IconHome className="size-4" /> Address
                        </TabsTrigger>
                        <TabsTrigger value="family" className="flex items-center gap-2">
                            <IconFriends className="size-4" /> Family Information
                        </TabsTrigger>
                        <TabsTrigger value="salary" className="flex items-center gap-2">
                            <IconCash className="size-4" /> Salary
                        </TabsTrigger>
                        <TabsTrigger value="signature" className="flex items-center gap-2">
                            <IconPencil className="size-4" /> Signature
                        </TabsTrigger>
                        <TabsTrigger value="educational" className="flex items-center gap-2">
                            <IconSchool className="size-4" /> Educational Information
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="flex items-center gap-2">
                            <IconBolt className="size-4" /> Skills
                        </TabsTrigger>
                        <TabsTrigger value="references" className="flex items-center gap-2">
                            <IconSearch className="size-4" /> References Info
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="mt-6">
                    {/* --- Address Tab --- */}
                    <TabsContent value="address">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-primary/10">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="text-sm">Present Address</CardTitle>
                                    <CardDescription>Current living location.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="grid gap-2">
                                        <Label>Village/House/Road</Label>
                                        <Input placeholder="Enter present address..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2"><Label>Division</Label><NativeSelect><option>Select Division</option></NativeSelect></div>
                                        <div className="grid gap-2"><Label>District</Label><NativeSelect><option>Select District</option></NativeSelect></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2"><Label>Thana/Upazila</Label><NativeSelect><option>Select Thana</option></NativeSelect></div>
                                        <div className="grid gap-2"><Label>Post Office</Label><NativeSelect><option>Select Post Office</option></NativeSelect></div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary/10">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="text-sm">Permanent Address</CardTitle>
                                    <CardDescription>Legal/Permanent home location.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="grid gap-2">
                                        <Label>Village/House/Road</Label>
                                        <Input placeholder="Enter permanent address..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2"><Label>Division</Label><NativeSelect><option>Select Division</option></NativeSelect></div>
                                        <div className="grid gap-2"><Label>District</Label><NativeSelect><option>Select District</option></NativeSelect></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2"><Label>Thana/Upazila</Label><NativeSelect><option>Select Thana</option></NativeSelect></div>
                                        <div className="grid gap-2"><Label>Post Office</Label><NativeSelect><option>Select Post Office</option></NativeSelect></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* --- Family Information Tab --- */}
                    <TabsContent value="family">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-sm">Family & Dependents</CardTitle>
                                    <CardDescription>Add family member details.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="gap-2">
                                    <IconPlus className="size-3.5" /> Add Member
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
                                    <div className="grid gap-2"><Label>Name</Label><Input placeholder="Name" /></div>
                                    <div className="grid gap-2"><Label>Relation</Label><NativeSelect><option>Father</option><option>Mother</option><option>Spouse</option><option>Child</option></NativeSelect></div>
                                    <div className="grid gap-2"><Label>Contact No</Label><Input placeholder="01712..." /></div>
                                    <div className="flex items-end justify-end"><Button variant="ghost" size="icon" className="text-destructive"><IconTrash className="size-4" /></Button></div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Salary Tab --- */}
                    <TabsContent value="salary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-primary/10">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="text-sm">Salary Structure</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="grid gap-2"><Label>Gross Salary</Label><Input type="number" placeholder="0.00" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2"><Label>Basic</Label><Input readOnly placeholder="0.00" className="bg-muted/50" /></div>
                                        <div className="grid gap-2"><Label>House Rent</Label><Input readOnly placeholder="0.00" className="bg-muted/50" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-primary/10">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="text-sm">Bank Details</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="grid gap-2"><Label>Bank Name</Label><NativeSelect><option>Sonali Bank</option><option>Dutch Bangla Bank</option><option>bKash</option></NativeSelect></div>
                                    <div className="grid gap-2"><Label>Account Number</Label><Input placeholder="XXXX XXXX XXXX" /></div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* --- Signature Tab --- */}
                    <TabsContent value="signature">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-sm">Employee Signature</CardTitle>
                            </CardHeader>
                            <CardContent className="p-12 flex flex-col items-center justify-center bg-muted/10 border-2 border-dashed m-6 rounded-xl">
                                <div className="size-40 flex items-center justify-center border rounded bg-background shadow-sm mb-4">
                                    <IconPencil className="size-12 text-muted-foreground/30" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Upload Image</Button>
                                    <Button variant="outline" size="sm">Draw Digital</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Educational Information Tab --- */}
                    <TabsContent value="educational">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-sm">Academic Qualifications</CardTitle>
                                </div >
                                <Button size="sm" variant="outline" className="gap-2">
                                    <IconPlus className="size-3.5" /> Add Record
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 border rounded-lg">
                                    <div className="grid gap-2 sm:col-span-2"><Label>Degree/Exam</Label><Input placeholder="SSC/HSC/Degree" /></div>
                                    <div className="grid gap-2"><Label>Passing Year</Label><Input placeholder="2020" /></div>
                                    <div className="grid gap-2"><Label>GPA/CGPA</Label><Input placeholder="5.00" /></div>
                                    <div className="flex items-end justify-end"><Button variant="ghost" size="icon" className="text-destructive"><IconTrash className="size-4" /></Button></div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Skills Tab --- */}
                    <TabsContent value="skills">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-sm">Skills & Expertise</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid gap-4">
                                    <Label>Technical Skills</Label>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {['Management', 'React', 'Node.js', 'HR Strategy'].map(skill => (
                                            <div key={skill} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                                                {skill} <IconTrash className="size-3 cursor-pointer" />
                                            </div>
                                        ))}
                                        <Button variant="ghost" size="sm" className="rounded-full border-dashed border-2 text-[10px] h-7">Add New</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- References Info Tab --- */}
                    <TabsContent value="references">
                        <Card className="border-primary/10">
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-sm">Professional References</CardTitle>
                                </div>
                                <Button size="sm" variant="outline" className="gap-2">
                                    <IconPlus className="size-3.5" /> Add Reference
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                                    <div className="grid gap-2"><Label>Reference Name</Label><Input placeholder="Full Name" /></div>
                                    <div className="grid gap-2"><Label>Organization</Label><Input placeholder="Company/Inst." /></div>
                                    <div className="grid gap-2"><Label>Contact/Email</Label><Input placeholder="Email or Phone" /></div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
