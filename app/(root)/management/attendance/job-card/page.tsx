"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    IconId,
    IconPrinter,
    IconDownload,
    IconSearch,
    IconCalendar,
    IconUser,
    IconBriefcase,
    IconClock,
    IconCheck,
    IconX,
    IconAlertCircle,
    IconChevronLeft,
    IconChevronRight,
    IconAdjustmentsHorizontal,
    IconHierarchy,
    IconStack,
    IconLine
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DateRange } from "react-day-picker"
import { NativeSelect } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { cn } from "@/lib/utils"
import { eachDayOfInterval, isSameMonth, isSameYear } from "date-fns"

// --- Mock Data ---

const MOCK_EMPLOYEE = {
    id: "EMP1024",
    name: "Sarah Wilson",
    department: "Engineering",
    designation: "Software Engineer",
    section: "Platform",
    joiningDate: "Jan 15, 2024",
    grade: "A2",
    shift: "Day (09:00 AM - 06:00 PM)"
}

const generateMockAttendance = (fromDate: Date, toDate: Date) => {
    const days = eachDayOfInterval({ start: fromDate, end: toDate })
    const attendance = []

    for (const day of days) {
        const dateStr = format(day, "dd MMM")
        const dayName = format(day, "eee")

        const isWeekend = dayName === "Fri" // Assuming Friday weekend

        if (isWeekend) {
            attendance.push({
                date: dateStr,
                day: dayName,
                status: "Weekend",
                inTime: "-",
                outTime: "-",
                late: 0,
                early: 0,
                ot: 0,
                total: 0,
                remarks: "Weekly Off"
            })
        } else {
            const isAbsent = Math.random() < 0.05
            const isLate = Math.random() < 0.2

            if (isAbsent) {
                attendance.push({
                    date: dateStr,
                    day: dayName,
                    status: "Absent",
                    inTime: "-",
                    outTime: "-",
                    late: 0,
                    early: 0,
                    ot: 0,
                    total: 0,
                    remarks: "Uninformed"
                })
            } else {
                const inHour = isLate ? 9 : 8
                const inMin = isLate ? Math.floor(Math.random() * 30) + 1 : Math.floor(Math.random() * 59)
                const outHour = 18 + Math.floor(Math.random() * 2)
                const outMin = Math.floor(Math.random() * 59)

                attendance.push({
                    date: dateStr,
                    day: dayName,
                    status: "Present",
                    inTime: `${inHour.toString().padStart(2, '0')}:${inMin.toString().padStart(2, '0')} AM`,
                    outTime: `${outHour.toString().padStart(2, '0')}:${outMin.toString().padStart(2, '0')} PM`,
                    late: isLate ? inMin : 0,
                    early: 0,
                    ot: Math.max(0, outHour - 18),
                    total: 9 + (outHour - 18),
                    remarks: ""
                })
            }
        }
    }
    return attendance
}

export default function JobCardPage() {
    const [empId, setEmpId] = React.useState("")
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 0, 31)
    })
    const [department, setDepartment] = React.useState("engineering")
    const [designation, setDesignation] = React.useState("swe")
    const [line, setLine] = React.useState("line-01")

    const [showReport, setShowReport] = React.useState(false)
    const [attendanceData, setAttendanceData] = React.useState<any[]>([])

    const handleGenerate = () => {
        if (!empId && !department) return
        if (!dateRange?.from || !dateRange?.to) return
        setAttendanceData(generateMockAttendance(dateRange.from, dateRange.to))
        setShowReport(true)
    }

    const totals = React.useMemo(() => {
        if (!attendanceData.length) return null
        return {
            present: attendanceData.filter(d => d.status === "Present").length,
            absent: attendanceData.filter(d => d.status === "Absent").length,
            weekend: attendanceData.filter(d => d.status === "Weekend").length,
            holiday: attendanceData.filter(d => d.status === "Holiday").length,
            totalOT: attendanceData.reduce((acc, curr) => acc + curr.ot, 0),
            totalLate: attendanceData.reduce((acc, curr) => acc + curr.late, 0),
        }
    }, [attendanceData])

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
                        <CardDescription className="text-xs sm:text-sm">Select employee and month to generate the attendance job card.</CardDescription>
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
                                    <option value="engineering">Engineering</option>
                                    <option value="hr">HR & Admin</option>
                                    <option value="sales">Sales & Marketing</option>
                                    <option value="production">Production</option>
                                    <option value="quality">Quality Control</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Designation</label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-9 sm:h-10">
                                    <option value="swe">Software Engineer</option>
                                    <option value="mgr">Manager</option>
                                    <option value="op">Operator</option>
                                    <option value="exec">Executive</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Line / Section</label>
                                <NativeSelect value={line} onChange={(e) => setLine(e.target.value)} className="h-9 sm:h-10">
                                    <option value="line-01">Line 01</option>
                                    <option value="line-02">Line 02</option>
                                    <option value="platform">Platform</option>
                                    <option value="core">Core Teams</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2 sm:col-span-2 lg:col-span-3 xl:col-span-1">
                                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Select Range</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5">
                                <Button
                                    className="h-9 sm:h-10 gap-2 w-full"
                                    onClick={handleGenerate}
                                >
                                    <IconSearch className="size-4 sm:size-5" />
                                    Generate Report
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
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Report Content - Simple Job Card */}
                        <Card className="border">
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
                                        <p className="text-sm font-semibold">{MOCK_EMPLOYEE.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Employee ID</p>
                                        <p className="text-sm font-semibold">{MOCK_EMPLOYEE.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Department</p>
                                        <p className="text-sm font-semibold">{MOCK_EMPLOYEE.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Designation</p>
                                        <p className="text-sm font-semibold">{MOCK_EMPLOYEE.designation}</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Present</p>
                                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{totals?.present}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mb-1">Absent</p>
                                        <p className="text-xl font-bold text-rose-700 dark:text-rose-300">{totals?.absent}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                                        <p className="text-xs text-muted-foreground mb-1">Weekend</p>
                                        <p className="text-xl font-bold">{totals?.weekend}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Holiday</p>
                                        <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{totals?.holiday}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Total OT</p>
                                        <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{totals?.totalOT}h</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Late</p>
                                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{totals?.totalLate}m</p>
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
                                            {attendanceData.map((row, idx) => (
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
                                                        {row.late > 0 ? (
                                                            <span className="text-xs font-semibold text-rose-600">{row.late}m</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {row.ot > 0 ? (
                                                            <span className="text-xs font-semibold text-emerald-600">+{row.ot}h</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-xs font-medium">{row.total > 0 ? `${row.total}h` : "-"}</td>
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
                )}
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

