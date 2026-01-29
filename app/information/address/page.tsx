"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconMapPin, IconBuilding, IconArrowLeft } from "@tabler/icons-react"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ColumnDef } from "@tanstack/react-table"
import addressDB from "./filtered-data.json"

// --- Types ---
interface Division {
    id: string
    name_en: string
    name_bn: string
}

interface District {
    id: string
    division_id: string
    name_en: string
    name_bn: string
}

interface PostOffice {
    id: string
    district_id: string
    thana: string
    office: string
    code: string
}

// --- Columns ---
const divisionColumns: ColumnDef<Division>[] = [
    {
        accessorKey: "name_en",
        header: "Division Name (English)",
        cell: ({ row }) => <span className="font-medium">{row.original.name_en}</span>,
    },
    {
        accessorKey: "name_bn",
        header: "Division Name (Bangla)",
        cell: ({ row }) => <span className="font-hindi text-base">{row.original.name_bn}</span>,
    },
]

const districtColumns: ColumnDef<District>[] = [
    {
        accessorKey: "name_en",
        header: "District Name (English)",
        cell: ({ row }) => <span className="font-medium">{row.original.name_en}</span>,
    },
    {
        accessorKey: "name_bn",
        header: "District Name (Bangla)",
        cell: ({ row }) => <span className="font-hindi text-base">{row.original.name_bn}</span>,
    },
]

const postOfficeColumns: ColumnDef<PostOffice>[] = [
    {
        accessorKey: "thana",
        header: "Thana / Upazila",
    },
    {
        accessorKey: "office",
        header: "Post Office",
    },
    {
        accessorKey: "code",
        header: "Postal Code",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono text-xs bg-muted/50">
                {row.original.code}
            </Badge>
        ),
    },
]

export default function AddressPage() {
    // State
    const [activeTab, setActiveTab] = React.useState("divisions")
    const [selectedDivisionId, setSelectedDivisionId] = React.useState<string>("")
    const [selectedDistrictId, setSelectedDistrictId] = React.useState<string>("")

    // Derived Data
    const filteredDistricts = React.useMemo(() => {
        if (!selectedDivisionId) return addressDB.districts
        return addressDB.districts.filter(d => d.division_id === selectedDivisionId)
    }, [selectedDivisionId])

    const filteredPostOffices = React.useMemo(() => {
        if (selectedDistrictId) {
            return addressDB.postOffices.filter(p => p.district_id === selectedDistrictId)
        }
        if (selectedDivisionId) {
            // Find all districts in this division, then find all POs in those districts
            const districtIds = addressDB.districts
                .filter(d => d.division_id === selectedDivisionId)
                .map(d => d.id)
            return addressDB.postOffices.filter(p => districtIds.includes(p.district_id))
        }
        return addressDB.postOffices
    }, [selectedDivisionId, selectedDistrictId])

    // Handlers
    const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const divId = e.target.value
        setSelectedDivisionId(divId)
        setSelectedDistrictId("")
        if (divId) {
            setActiveTab("districts")
        } else {
            setActiveTab("divisions")
        }
    }

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const distId = e.target.value
        setSelectedDistrictId(distId)
        if (distId) {
            setActiveTab("post_offices")
        } else if (selectedDivisionId) {
            setActiveTab("districts")
        }
    }

    const handleReset = () => {
        setSelectedDivisionId("")
        setSelectedDistrictId("")
        setActiveTab("divisions")
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex items-center gap-2">
                <IconMapPin className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Address Management</h1>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">Filter Location</CardTitle>
                    <CardDescription>Select a region to automatically view related data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="division">Division</Label>
                            <div className="relative">
                                <IconBuilding className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <NativeSelect
                                    id="division"
                                    className="pl-9"
                                    value={selectedDivisionId}
                                    onChange={handleDivisionChange}
                                >
                                    <option value="">All Divisions</option>
                                    {addressDB.divisions.map(div => (
                                        <option key={div.id} value={div.id}>
                                            {div.name_en} ({div.name_bn})
                                        </option>
                                    ))}
                                </NativeSelect>
                            </div>
                        </div>

                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="district">District</Label>
                            <div className="relative">
                                <IconMapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <NativeSelect
                                    id="district"
                                    className="pl-9"
                                    value={selectedDistrictId}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedDivisionId}
                                >
                                    <option value="">
                                        {selectedDivisionId ? "All Districts in Division" : "Select Division First"}
                                    </option>
                                    {addressDB.districts
                                        .filter(d => !selectedDivisionId || d.division_id === selectedDivisionId)
                                        .map(dist => (
                                            <option key={dist.id} value={dist.id}>
                                                {dist.name_en} ({dist.name_bn})
                                            </option>
                                        ))}
                                </NativeSelect>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                disabled={!selectedDivisionId}
                                className="w-full sm:w-auto"
                            >
                                <IconArrowLeft className="mr-2 size-4" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="divisions">Divisions</TabsTrigger>
                    <TabsTrigger value="districts">Districts</TabsTrigger>
                    <TabsTrigger value="post_offices">Post Offices</TabsTrigger>
                </TabsList>

                <TabsContent value="divisions" className="mt-4">
                    <DataTable
                        data={addressDB.divisions}
                        columns={divisionColumns}
                        showTabs={false}
                        showActions={false}
                        showColumnCustomizer={false}
                    />
                </TabsContent>

                <TabsContent value="districts" className="mt-4">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            {selectedDivisionId
                                ? `Showing Districts for ${addressDB.divisions.find(d => d.id === selectedDivisionId)?.name_en}`
                                : "All Districts"}
                        </h3>
                        <Badge variant="secondary" className="font-mono">{filteredDistricts.length}</Badge>
                    </div>
                    <DataTable
                        data={filteredDistricts}
                        columns={districtColumns}
                        showTabs={false}
                        showActions={false}
                        showColumnCustomizer={false}
                    />
                </TabsContent>

                <TabsContent value="post_offices" className="mt-4">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            {selectedDistrictId
                                ? `Showing Post Offices for ${addressDB.districts.find(d => d.id === selectedDistrictId)?.name_en}`
                                : selectedDivisionId
                                    ? `Showing Post Offices for Division`
                                    : "All Post Offices"}
                        </h3>
                        <Badge variant="secondary" className="font-mono">{filteredPostOffices.length}</Badge>
                    </div>
                    <DataTable
                        data={filteredPostOffices}
                        columns={postOfficeColumns}
                        showTabs={false}
                        addLabel="Add Post Office"
                        onAddClick={() => { }}
                        showActions={true}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
