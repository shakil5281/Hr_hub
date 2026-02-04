"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconId,
    IconPrinter,
    IconDownload,
    IconSearch,
    IconUser,
    IconAdjustmentsHorizontal,
    IconLoader
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
        <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1600px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                                <IconId className="size-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Attendance Job Card</h1>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Employee Monthly Audit Report</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {showReport && (
                                <>
                                    <Button variant="outline" size="sm" className="rounded-full h-8 px-4" onClick={() => window.print()}>
                                        <IconPrinter className="mr-2 size-4" />
                                        Print Card
                                    </Button>
                                    <Button size="sm" className="rounded-full h-8 px-4">
                                        <IconDownload className="mr-2 size-4" />
                                        Export PDF
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8">
                {/* Generation Filter */}
                <Card className="border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-4 sm:size-5 text-primary" />
                            Report Configuration
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Select employee and date range to generate the attendance job card.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Employee ID</label>
                                <div className="relative">
                                    <IconUser className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="EMP-XXXX"
                                        className="pl-9 h-9 sm:h-10"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Department</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-9 sm:h-10">
                                    <option value="all">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Designation</label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-9 sm:h-10">
                                    <option value="all">All Designations</option>
                                    {designations.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Section</label>
                                <NativeSelect value={section} onChange={(e) => setSection(e.target.value)} className="h-9 sm:h-10">
                                    <option value="all">All Sections</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                                </NativeSelect>
                            </div>

                            <div className="space-y-2 sm:col-span-2 lg:col-span-3 xl:col-span-1">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Select Range</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                />
                            </div>

                            {employees.length > 0 && !empId && (
                                <div className="space-y-2 sm:col-span-2 lg:col-span-3 xl:col-span-5">
                                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Select Employee</label>
                                    <NativeSelect
                                        value={selectedEmployee?.id || ""}
                                        onChange={(e) => {
                                            const emp = employees.find(emp => emp.id === parseInt(e.target.value))
                                            setSelectedEmployee(emp)
                                        }}
                                        className="h-9 sm:h-10"
                                    >
                                        <option value="">Choose an employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.employeeId} - {emp.fullNameEn} ({emp.department?.nameEn})
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </div>
                            )}

                            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5">
                                <Button
                                    className="h-9 sm:h-10 gap-2 w-full"
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <IconLoader className="size-4 sm:size-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <IconSearch className="size-4 sm:size-5" />
                                            Generate Report
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {!showReport ? (
                    <div className="flex flex-col items-center justify-center py-16 rounded-lg border">
                        <IconId className="size-12 text-muted-foreground/30 mb-3" />
                        <h3 className="text-sm font-semibold text-muted-foreground">No Report Generated</h3>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                            Select filters above to generate report
                        </p>
                    </div>
                ) : jobCardData ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Report Content - Job Card */}
                        <Card className="border print-report">
                            {/* Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold">Monthly Job Card</h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {dateRange?.from && dateRange?.to && (
                                                isSameMonth(dateRange.from, dateRange.to) && isSameYear(dateRange.from, dateRange.to) ? (
                                                    format(dateRange.from, "MMMM yyyy")
                                                ) : (
                                                    `${format(dateRange.from, "MMM dd, yy")} - ${format(dateRange.to, "MMM dd, yy")}`
                                                )
                                            )}
                                        </p>
                                    </div>
                                    <Badge variant="success" className="text-xs">Finalized</Badge>
                                </div>

                                {/* Employee Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Name</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.employeeName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Employee ID</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.employeeIdCard}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Department</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Designation</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.designation}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Section</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.section}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Joining Date</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.joiningDate || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Grade</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.grade || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Shift</p>
                                        <p className="text-sm font-semibold">{jobCardData.employee.shift}</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Present</p>
                                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{jobCardData.summary.presentDays}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mb-1">Absent</p>
                                        <p className="text-xl font-bold text-rose-700 dark:text-rose-300">{jobCardData.summary.absentDays}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                                        <p className="text-xs text-muted-foreground mb-1">Weekend</p>
                                        <p className="text-xl font-bold">{jobCardData.summary.weekendDays}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Holiday</p>
                                        <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{jobCardData.summary.holidayDays}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Total OT</p>
                                        <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{jobCardData.summary.totalOTHours}h</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Late</p>
                                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{jobCardData.summary.totalLateMinutes}m</p>
                                    </div>
                                </div>

                                {/* Attendance Table */}
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr className="border-b">
                                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-muted-foreground">Date</th>
                                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-muted-foreground">Day</th>
                                                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">Status</th>
                                                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">In</th>
                                                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">Out</th>
                                                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">Late</th>
                                                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">OT</th>
                                                <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">Total</th>
                                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-muted-foreground">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobCardData.attendanceRecords.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={cn(
                                                        "border-b hover:bg-muted/20",
                                                        row.status === "Weekend" && "bg-slate-50 dark:bg-slate-900/30",
                                                        row.status === "Absent" && "bg-rose-50/50 dark:bg-rose-900/10"
                                                    )}
                                                >
                                                    <td className="px-3 py-2 text-sm font-medium">{row.date}</td>
                                                    <td className="px-3 py-2 text-xs text-muted-foreground">{row.day}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        <Badge
                                                            variant={
                                                                row.status === "Present" ? "success" :
                                                                    row.status === "Absent" ? "destructive" :
                                                                        "secondary"
                                                            }
                                                            className="text-[10px]"
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-xs">{row.inTime}</td>
                                                    <td className="px-3 py-2 text-center text-xs">{row.outTime}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        {row.lateMinutes > 0 ? (
                                                            <span className="text-xs font-semibold text-rose-600">{row.lateMinutes}m</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {row.otHours > 0 ? (
                                                            <span className="text-xs font-semibold text-emerald-600">+{row.otHours}h</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-xs font-medium">{row.totalHours > 0 ? `${row.totalHours}h` : "-"}</td>
                                                    <td className="px-3 py-2 text-[10px] text-muted-foreground">{row.remarks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>

                            {/* Signature Section */}
                            <div className="p-6 border-t">
                                <div className="grid grid-cols-3 gap-8 pt-12">
                                    <div className="text-center border-t pt-2">
                                        <p className="text-[10px] text-muted-foreground uppercase">Employee</p>
                                    </div>
                                    <div className="text-center border-t pt-2">
                                        <p className="text-[10px] text-muted-foreground uppercase">Department Head</p>
                                    </div>
                                    <div className="text-center border-t pt-2">
                                        <p className="text-[10px] text-muted-foreground uppercase">HR</p>
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
                    .animate-in { animation: none !important; }
                    .print-report, .print-report * { visibility: visible; }
                    .print-report { position: absolute; left: 0; top: 0; width: 100%; }
                    button, .generation-filter, header, .no-print { display: none !important; }
                    .Card { border: 1px solid #eee !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    )
}
