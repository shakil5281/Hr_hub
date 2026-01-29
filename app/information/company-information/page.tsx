"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    DataTable
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { IconBuilding, IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"
import { type ColumnDef } from "@tanstack/react-table"
import companyData from "./company-data.json"

interface CompanyData {
    id: number
    companyName: string
    registrationNo: string
    industry: string
    email: string
    status: string
    founded: string
}

const companyColumns: ColumnDef<CompanyData>[] = [
    {
        accessorKey: "companyName",
        header: "Company Name",
        cell: ({ row }) => <span className="font-medium">{row.original.companyName}</span>,
    },
    {
        accessorKey: "registrationNo",
        header: "Registration No",
    },
    {
        accessorKey: "industry",
        header: "Industry",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5 font-normal">
                {row.original.industry}
            </Badge>
        ),
    },
    {
        accessorKey: "email",
        header: "Official Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-1.5 w-fit font-normal">
                {row.original.status === "Active" ? (
                    <IconCircleCheckFilled className="size-3.5 text-green-500" />
                ) : (
                    <IconLoader className="size-3.5 text-muted-foreground animate-spin-slow" />
                )}
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "founded",
        header: "Founded",
    },
]

export default function CompanyInformationPage() {
    const router = useRouter()

    const handleEdit = (company: CompanyData) => {
        router.push(`/information/company-information/edit/${company.id}`)
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <IconBuilding className="size-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Company Information</h1>
            </div>

            <DataTable
                data={companyData as CompanyData[]}
                columns={companyColumns}
                showTabs={false}
                showColumnCustomizer={false}
                addLabel="Add New"
                onAddClick={() => router.push("/information/company-information/create")}
                onEditClick={handleEdit}
            />
        </div>
    )
}
