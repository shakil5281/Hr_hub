"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    IconArrowLeft,
    IconUserCircle,
    IconCheck,
    IconUsers,
    IconMapPin,
    IconCash,
    IconCreditCard,
    IconPhone,
    IconDeviceFloppy,
    IconSearch,
    IconLoader2,
    IconFileLike
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NativeSelect } from "@/components/ui/select"
import { toast } from "sonner"
import { employeeService, type Employee, type UpdateEmployeeDto } from "@/lib/services/employee"

export default function OthersInformationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const employeeIdFromUrl = searchParams.get("id")

    const [isLoading, setIsLoading] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [employee, setEmployee] = React.useState<Employee | null>(null)
    const [searchId, setSearchId] = React.useState("")
    const [isUploading, setIsUploading] = React.useState(false)
    const sigInputRef = React.useRef<HTMLInputElement>(null)

    // Load employee data
    const loadEmployee = React.useCallback(async (id: number) => {
        setIsLoading(true)
        try {
            const data = await employeeService.getEmployee(id)
            setEmployee(data)
        } catch (error) {
            toast.error("Failed to load employee data")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        if (employeeIdFromUrl) {
            loadEmployee(parseInt(employeeIdFromUrl))
        }
    }, [employeeIdFromUrl, loadEmployee])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchId.trim()) return

        setIsLoading(true)
        try {
            // Check if searchId is a number (internal ID) or string (EmployeeId)
            let foundEmployee: Employee | undefined
            const employees = await employeeService.getEmployees()
            foundEmployee = employees.find(e => e.employeeId === searchId || e.id.toString() === searchId)

            if (foundEmployee) {
                router.push(`/management/human-resource/employee-info/others-information?id=${foundEmployee.id}`)
            } else {
                toast.error("Employee not found")
            }
        } catch (error) {
            toast.error("Search failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!employee) return

        setIsSaving(true)
        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement)
            const data: UpdateEmployeeDto = {
                ...employee,
                // Personal/Basic
                proximity: formData.get("proximity") as string,
                religion: formData.get("religion") as string,
                gender: formData.get("gender") as string,

                // Address
                presentAddress: formData.get("presentAddress") as string,
                permanentAddress: formData.get("permanentAddress") as string,

                // Family
                fatherNameEn: formData.get("fatherNameEn") as string,
                fatherNameBn: formData.get("fatherNameBn") as string,
                motherNameEn: formData.get("motherNameEn") as string,
                motherNameBn: formData.get("motherNameBn") as string,
                maritalStatus: formData.get("maritalStatus") as string,
                spouseNameEn: formData.get("spouseNameEn") as string,
                spouseNameBn: formData.get("spouseNameBn") as string,
                spouseOccupation: formData.get("spouseOccupation") as string,
                spouseContact: formData.get("spouseContact") as string,

                // Salary
                basicSalary: parseFloat(formData.get("basicSalary") as string) || 0,
                houseRent: parseFloat(formData.get("houseRent") as string) || 0,
                medicalAllowance: parseFloat(formData.get("medicalAllowance") as string) || 0,
                conveyance: parseFloat(formData.get("conveyance") as string) || 0,
                foodAllowance: parseFloat(formData.get("foodAllowance") as string) || 0,
                otherAllowance: parseFloat(formData.get("otherAllowance") as string) || 0,
                grossSalary: parseFloat(formData.get("grossSalary") as string) || 0,

                // Account
                bankName: formData.get("bankName") as string,
                bankBranchName: formData.get("bankBranchName") as string,
                bankAccountNo: formData.get("bankAccountNo") as string,
                bankRoutingNo: formData.get("bankRoutingNo") as string,
                bankAccountType: formData.get("bankAccountType") as string,

                // Emergency
                emergencyContactName: formData.get("emergencyContactName") as string,
                emergencyContactRelation: formData.get("emergencyContactRelation") as string,
                emergencyContactPhone: formData.get("emergencyContactPhone") as string,
                emergencyContactAddress: formData.get("emergencyContactAddress") as string,
            }

            await employeeService.updateEmployee(employee.id, data)
            toast.success("Information updated successfully")
            loadEmployee(employee.id)
        } catch (error) {
            toast.error("Failed to update information")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleSigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!employee) return
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const { url } = await employeeService.uploadImage(file, 'signature')
            setEmployee({ ...employee, signatureImageUrl: url })
            toast.success("Signature uploaded")
        } catch (error) {
            toast.error("Upload failed")
        } finally {
            setIsUploading(false)
        }
    }

    if (!employeeIdFromUrl && !employee) {
        return (
            <div className="flex flex-col gap-6 p-4 lg:p-6 mx-auto w-full max-w-2xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <IconArrowLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Search Employee</h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Select Employee</CardTitle>
                        <CardDescription>Enter Employee ID or Name to manage their additional information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Employee ID (e.g. EMP000001)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <IconLoader2 className="animate-spin size-4" /> : <IconSearch className="size-4 mr-2" />}
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading && !employee) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <IconLoader2 className="animate-spin size-8 text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/management/human-resource/employee-info")}>
                        <IconArrowLeft className="size-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{employee?.fullNameEn}</h1>
                        <p className="text-sm text-muted-foreground">ID: {employee?.employeeId} | {employee?.designationName} | {employee?.departmentName}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                        setEmployee(null)
                        router.push("/management/human-resource/employee-info/others-information")
                    }}>
                        Change Employee
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <Tabs defaultValue="family" className="w-full">
                    <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
                        <TabsList className="w-full justify-start h-auto bg-muted/50 p-1 border rounded-lg">
                            <TabsTrigger value="family" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <IconUsers className="size-5" />
                                <span>Family Info</span>
                            </TabsTrigger>
                            <TabsTrigger value="salary" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <IconCash className="size-5" />
                                <span>Salary Info</span>
                            </TabsTrigger>
                            <TabsTrigger value="accounts" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <IconCreditCard className="size-5" />
                                <span>Account Info</span>
                            </TabsTrigger>
                            <TabsTrigger value="address" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <IconMapPin className="size-5" />
                                <span>Address</span>
                            </TabsTrigger>
                            <TabsTrigger value="emergency" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <IconPhone className="size-5" />
                                <span>Emergency Contact</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Family Information */}
                    <TabsContent value="family">
                        <Card className="border-l-4 border-l-primary shadow-md">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <IconUsers className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Family Information</CardTitle>
                                        <CardDescription>Parents and Spouse details</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="fatherNameEn">Father&apos;s Name (English)</Label>
                                        <Input id="fatherNameEn" name="fatherNameEn" defaultValue={employee?.fatherNameEn} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="fatherNameBn">Father&apos;s Name (Bangla)</Label>
                                        <Input id="fatherNameBn" name="fatherNameBn" defaultValue={employee?.fatherNameBn} className="font-hindi" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="motherNameEn">Mother&apos;s Name (English)</Label>
                                        <Input id="motherNameEn" name="motherNameEn" defaultValue={employee?.motherNameEn} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="motherNameBn">Mother&apos;s Name (Bangla)</Label>
                                        <Input id="motherNameBn" name="motherNameBn" defaultValue={employee?.motherNameBn} className="font-hindi" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="maritalStatus">Marital Status</Label>
                                        <NativeSelect id="maritalStatus" name="maritalStatus" defaultValue={employee?.maritalStatus}>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Divorced">Divorced</option>
                                        </NativeSelect>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-4">
                                    <h3 className="text-sm font-semibold">Spouse Information (if married)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="spouseNameEn">Spouse Name (English)</Label>
                                            <Input id="spouseNameEn" name="spouseNameEn" defaultValue={employee?.spouseNameEn} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="spouseNameBn">Spouse Name (Bangla)</Label>
                                            <Input id="spouseNameBn" name="spouseNameBn" defaultValue={employee?.spouseNameBn} className="font-hindi" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="spouseOccupation">Spouse Occupation</Label>
                                            <Input id="spouseOccupation" name="spouseOccupation" defaultValue={employee?.spouseOccupation} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="spouseContact">Spouse Contact</Label>
                                            <Input id="spouseContact" name="spouseContact" defaultValue={employee?.spouseContact} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Address Information */}
                    <TabsContent value="address">
                        <Card className="border-l-4 border-l-primary shadow-md">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <IconMapPin className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Address Information</CardTitle>
                                        <CardDescription>Present and permanent address details</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 pt-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="presentAddress">Present Address</Label>
                                        <Textarea id="presentAddress" name="presentAddress" defaultValue={employee?.presentAddress} rows={3} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="permanentAddress">Permanent Address</Label>
                                        <Textarea id="permanentAddress" name="permanentAddress" defaultValue={employee?.permanentAddress} rows={3} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Salary Information */}
                    <TabsContent value="salary">
                        <Card className="border-l-4 border-l-primary shadow-md">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <IconCash className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Salary Information</CardTitle>
                                        <CardDescription>Salary structure and allowances</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="basicSalary">Basic Salary</Label>
                                        <Input id="basicSalary" name="basicSalary" type="number" step="0.01" defaultValue={employee?.basicSalary} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="houseRent">House Rent</Label>
                                        <Input id="houseRent" name="houseRent" type="number" step="0.01" defaultValue={employee?.houseRent} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                                        <Input id="medicalAllowance" name="medicalAllowance" type="number" step="0.01" defaultValue={employee?.medicalAllowance} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="conveyance">Conveyance</Label>
                                        <Input id="conveyance" name="conveyance" type="number" step="0.01" defaultValue={employee?.conveyance} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="foodAllowance">Food Allowance</Label>
                                        <Input id="foodAllowance" name="foodAllowance" type="number" step="0.01" defaultValue={employee?.foodAllowance} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="otherAllowance">Other Allowance</Label>
                                        <Input id="otherAllowance" name="otherAllowance" type="number" step="0.01" defaultValue={employee?.otherAllowance} />
                                    </div>
                                    <div className="grid gap-2 border-t pt-2 sm:col-span-2 lg:col-span-1">
                                        <Label htmlFor="grossSalary" className="font-bold text-primary">Gross Salary</Label>
                                        <Input id="grossSalary" name="grossSalary" type="number" step="0.01" defaultValue={employee?.grossSalary} className="border-primary/30 font-bold" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Account Information */}
                    <TabsContent value="accounts">
                        <Card className="border-l-4 border-l-primary shadow-md">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <IconCreditCard className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Account Information</CardTitle>
                                        <CardDescription>Bank account details for salary disbursement</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bankName">Bank Name</Label>
                                        <Input id="bankName" name="bankName" defaultValue={employee?.bankName} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bankBranchName">Branch Name</Label>
                                        <Input id="bankBranchName" name="bankBranchName" defaultValue={employee?.bankBranchName} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bankAccountNo">Account Number</Label>
                                        <Input id="bankAccountNo" name="bankAccountNo" defaultValue={employee?.bankAccountNo} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bankRoutingNo">Routing Number</Label>
                                        <Input id="bankRoutingNo" name="bankRoutingNo" defaultValue={employee?.bankRoutingNo} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bankAccountType">Account Type</Label>
                                        <NativeSelect id="bankAccountType" name="bankAccountType" defaultValue={employee?.bankAccountType}>
                                            <option value="Savings">Savings</option>
                                            <option value="Current">Current</option>
                                            <option value="Salary">Salary</option>
                                        </NativeSelect>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Emergency Contact */}
                    <TabsContent value="emergency">
                        <Card className="border-l-4 border-l-primary shadow-md">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <IconPhone className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Emergency Contact</CardTitle>
                                        <CardDescription>Person to contact in case of emergency</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergencyContactName">Contact Name</Label>
                                        <Input id="emergencyContactName" name="emergencyContactName" defaultValue={employee?.emergencyContactName} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergencyContactRelation">Relation</Label>
                                        <Input id="emergencyContactRelation" name="emergencyContactRelation" defaultValue={employee?.emergencyContactRelation} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                                        <Input id="emergencyContactPhone" name="emergencyContactPhone" defaultValue={employee?.emergencyContactPhone} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergencyContactAddress">Address</Label>
                                        <Input id="emergencyContactAddress" name="emergencyContactAddress" defaultValue={employee?.emergencyContactAddress} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-6 border-t pt-6">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" className="min-w-32" disabled={isSaving}>
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <IconLoader2 className="animate-spin size-4" />
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <IconDeviceFloppy className="size-4" />
                                Save All Information
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
