"use client"

import * as React from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import {
  DataTable
} from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/select"
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"
import { type ColumnDef } from "@tanstack/react-table"

import data from "./data.json"

interface DashboardData {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

const dashboardColumns: ColumnDef<DashboardData>[] = [
  {
    accessorKey: "header",
    header: "Header",
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 size-4" />
        ) : (
          <IconLoader className="size-4 animate-spin-slow" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
          defaultValue={row.original.target}
        />
      </div>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
          defaultValue={row.original.limit}
        />
      </div>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"
      if (isAssigned) return row.original.reviewer
      return (
        <NativeSelect className="w-40" defaultValue="Assign reviewer">
          <option value="Assign reviewer">Assign reviewer</option>
          <option value="Eddie Lake">Eddie Lake</option>
          <option value="Jamik Tashpulatov">Jamik Tashpulatov</option>
        </NativeSelect>
      )
    },
  },
]

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <DataTable
        data={data as DashboardData[]}
        columns={dashboardColumns}
      />
    </div>
  )
}
