"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconId,
    IconPrinter,
    IconDownload,
    IconSearch,
    IconUser,
    IconLoader,
    IconFilter
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DateRange } from "react-day-picker"
import { NativeSelect } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { cn } from "@/lib/utils"
import { isSameMonth, isSameYear } from "date-fns"
import { jobCardService, type JobCardResponse } from "@/lib/services/jobcard"
import { organogramService } from "@/lib/services/organogram"
import { employeeService } from "@/lib/services/employee"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

export default function JobCardPage() {
    const [empId, setEmpId] = React.useState("")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 0, 31)
    })
    const [department, setDepartment] = React.useState("all")
    const [designation, setDesignation] = React.useState("all")
    const [section, setSection] = React.useState("all")

    const [showReport, setShowReport] = React.useState(false)
    const [jobCardData, setJobCardData] = React.useState<JobCardResponse | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const [departments, setDepartments] = React.useState<any[]>([])
    const [designations, setDesignations] = React.useState<any[]>([])
    const [sections, setSections] = React.useState<any[]>([])
    const [employees, setEmployees] = React.useState<any[]>([])
    const [selectedEmployee, setSelectedEmployee] = React.useState<any>(null)

    // Fetch filter options
    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [depts, desigs, sects] = await Promise.all([
                    organogramService.getDepartments(),
                    organogramService.getDesignations(),
                    organogramService.getSections()
                ])
                setDepartments(depts)
                setDesignations(desigs)
                setSections(sects)
            } catch (error) {
                console.error("Failed to fetch filters", error)
            }
        }
        fetchFilters()
    }, [])

    // Fetch employees based on filters
    React.useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const params: any = {}
                if (department !== "all") params.departmentId = parseInt(department)
                if (designation !== "all") params.designationId = parseInt(designation)
                if (section !== "all") params.sectionId = parseInt(section)

                const emps = await employeeService.getEmployees(params)
                setEmployees(emps)
            } catch (error) {
                console.error("Failed to fetch employees", error)
            }
        }
        fetchEmployees()
    }, [department, designation, section])

    const handleGenerate = async () => {
        if (!empId && !selectedEmployee) {
            toast.error("Please enter an Employee ID or select from filters")
            return
        }
        if (!dateRange?.from || !dateRange?.to) {
            toast.error("Please select a date range")
            return
        }

        setIsLoading(true)
        try {
            let employeeIdToUse = selectedEmployee?.id

            // If empId is entered, find employee by employee ID card
            if (empId) {
                const emp = employees.find(e => e.employeeId === empId)
                if (emp) {
                    employeeIdToUse = emp.id
                } else {
                    toast.error("Employee not found with ID: " + empId)
                    setIsLoading(false)
                    return
                }
            }

            if (!employeeIdToUse) {
                toast.error("Please select an employee")
                setIsLoading(false)
                return
            }

            const data = await jobCardService.getJobCard({
                employeeId: employeeIdToUse,
                fromDate: format(dateRange.from, "yyyy-MM-dd"),
                toDate: format(dateRange.to, "yyyy-MM-dd")
            })

            setJobCardData(data)
            setShowReport(true)
            toast.success("Job card generated successfully")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to generate job card")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Job Card</h1>
                    <p className="text-muted-foreground text-sm">Employee Monthly Audit Report</p>
                </div>
                <div className="flex items-center gap-2">
                    {showReport && (
                        <>
                            <Button variant="outline" size="sm" className="h-9 px-4" onClick={() => window.print()}>
                                <IconPrinter className="mr-2 size-4" />
                                Print
                            </Button>
                            <Button size="sm" className="h-9 px-4">
                                <IconDownload className="mr-2 size-4" />
                                Export PDF
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <main className="px-6 space-y-6">
                {/* Generation Filter */}
                <Card>
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <IconFilter className="size-4 opacity-70" />
                            Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Employee ID</Label>
                                <div className="relative">
                                    <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="EMP-XXXX"
                                        className="pl-9 h-9"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Department</Label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-9">
                                    <option value="all">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Designation</Label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-9">
                                    <option value="all">All Designations</option>
                                    {designations.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Date Range</Label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                />
                            </div>
                            <Button
                                className="h-9 gap-2 w-full"
                                onClick={handleGenerate}
                                disabled={isLoading}
                            >
                                {isLoading ? <IconLoader className="size-4 animate-spin" /> : <IconSearch className="size-4" />}
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {!showReport ? (
                    <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed">
                        <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                            <IconId className="size-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold">No Report Generated</h3>
                        <p className="text-xs text-muted-foreground mt-1">Select filters above to generate report</p>
                    </div>
                ) : jobCardData ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Report Content - Job Card */}
                        <Card className="print-report">
                            {/* Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold">Monthly Job Card</h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {dateRange?.from && dateRange?.to && (
                                                isSameMonth(dateRange.from, dateRange.to) && isSameYear(dateRange.from, dateRange.to) ? (
                                                    format(dateRange.from, "MMMM yyyy")
                                                ) : (
                                                    `${format(dateRange.from, "MMM dd, yy")} - ${format(dateRange.to, "MMM dd, yy")}`
                                                )
                                            )}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Finalized</Badge>
                                </div>

                                {/* Employee Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 pt-4 border-t">
                                    <InfoItem label="Name" value={jobCardData.employee.employeeName} />
                                    <InfoItem label="ID" value={jobCardData.employee.employeeIdCard} />
                                    <InfoItem label="Department" value={jobCardData.employee.department} />
                                    <InfoItem label="Designation" value={jobCardData.employee.designation} />
                                    <InfoItem label="Section" value={jobCardData.employee.section} />
                                    <InfoItem label="Joining Date" value={jobCardData.employee.joiningDate || "N/A"} />
                                    <InfoItem label="Grade" value={jobCardData.employee.grade || "N/A"} />
                                    <InfoItem label="Shift" value={jobCardData.employee.shift || "N/A"} />
                                </div>
                            </div>

                            <CardContent className="p-6">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                                    <StatCard label="Present" value={jobCardData.summary.presentDays} color="bg-emerald-50 text-emerald-700 border-emerald-100" />
                                    <StatCard label="Absent" value={jobCardData.summary.absentDays} color="bg-rose-50 text-rose-700 border-rose-100" />
                                    <StatCard label="Weekend" value={jobCardData.summary.weekendDays} color="bg-slate-50 text-slate-700 border-slate-100" />
                                    <StatCard label="Holiday" value={jobCardData.summary.holidayDays} color="bg-blue-50 text-blue-700 border-blue-100" />
                                    <StatCard label="Total OT" value={`${jobCardData.summary.totalOTHours}h`} color="bg-amber-50 text-amber-700 border-amber-100" />
                                    <StatCard label="Late" value={`${jobCardData.summary.totalLateMinutes}m`} color="bg-orange-50 text-orange-700 border-orange-100" />
                                </div>

                                {/* Attendance Table */}
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="border-b">
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Day</th>
                                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">In</th>
                                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Out</th>
                                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Late</th>
                                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">OT</th>
                                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Total</th>
                                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobCardData.attendanceRecords.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={cn(
                                                        "border-b last:border-0 hover:bg-muted/50",
                                                        row.status === "Weekend" && "bg-slate-50/50",
                                                        row.status === "Absent" && "bg-rose-50/30"
                                                    )}
                                                >
                                                    <td className="px-4 py-2.5 font-medium">{row.date}</td>
                                                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{row.day}</td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "font-normal text-xs",
                                                                row.status === "Present" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                                                row.status === "Absent" && "bg-rose-50 text-rose-700 border-rose-200",
                                                                row.status === "Weekend" && "bg-slate-100 text-slate-700 border-slate-200"
                                                            )}
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-mono text-xs">{row.inTime}</td>
                                                    <td className="px-4 py-2.5 text-center font-mono text-xs">{row.outTime}</td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        {row.lateMinutes > 0 ? (
                                                            <span className="text-xs font-semibold text-rose-600">{row.lateMinutes}m</span>
                                                        ) : <span className="text-muted-foreground">-</span>}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        {row.otHours > 0 ? (
                                                            <span className="text-xs font-semibold text-emerald-600">+{row.otHours}h</span>
                                                        ) : <span className="text-muted-foreground">-</span>}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-semibold text-xs">{row.totalHours > 0 ? `${row.totalHours}h` : "-"}</td>
                                                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.remarks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>

                            {/* Signature Section */}
                            <div className="p-6 border-t mt-6">
                                <div className="grid grid-cols-3 gap-12 pt-16">
                                    <div className="text-center border-t border-slate-300 pt-2">
                                        <p className="text-xs font-semibold text-muted-foreground">Employee Signature</p>
                                    </div>
                                    <div className="text-center border-t border-slate-300 pt-2">
                                        <p className="text-xs font-semibold text-muted-foreground">Department Head</p>
                                    </div>
                                    <div className="text-center border-t border-slate-300 pt-2">
                                        <p className="text-xs font-semibold text-muted-foreground">HR Authority</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : null}
            </main>

            {/* Print Friendly Styles */}
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-report, .print-report * { visibility: visible; }
                    .print-report { position: absolute; left: 0; top: 0; width: 100%; border: none; shadow: none; }
                    header, button, nav, aside { display: none !important; }
                }
            `}</style>
        </div>
    )
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    )
}

function StatCard({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className={cn("p-4 rounded-lg border", color)}>
            <p className="text-xs opacity-80 mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    )
}
