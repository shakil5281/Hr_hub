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
                        <CardTitle className="text-base flex items-center gap-2">
                            <IconAdjustmentsHorizontal className="size-5 text-primary" />
                            Report Configuration
                        </CardTitle>
                        <CardDescription>Select employee and month to generate the attendance job card.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Employee ID</label>
                                <div className="relative">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="EMP-XXXX"
                                        className="pl-10 h-10 rounded-xl"
                                        value={empId}
                                        onChange={(e) => setEmpId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</label>
                                <NativeSelect value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl">
                                    <option value="engineering">Engineering</option>
                                    <option value="hr">HR & Admin</option>
                                    <option value="sales">Sales & Marketing</option>
                                    <option value="production">Production</option>
                                    <option value="quality">Quality Control</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Designation</label>
                                <NativeSelect value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-10 rounded-xl">
                                    <option value="swe">Software Engineer</option>
                                    <option value="mgr">Manager</option>
                                    <option value="op">Operator</option>
                                    <option value="exec">Executive</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Line / Section</label>
                                <NativeSelect value={line} onChange={(e) => setLine(e.target.value)} className="h-10 rounded-xl">
                                    <option value="line-01">Line 01</option>
                                    <option value="line-02">Line 02</option>
                                    <option value="platform">Platform</option>
                                    <option value="core">Core Teams</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Range</label>
                                <DateRangePicker
                                    date={dateRange}
                                    setDate={setDateRange}
                                />
                            </div>

                            <Button
                                className="h-10 rounded-xl gap-2 w-full"
                                onClick={handleGenerate}
                            >
                                <IconSearch className="size-5" />
                                Generate
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {!showReport ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-accent/5 rounded-3xl border-2 border-dashed border-muted/50">
                        <div className="size-20 bg-background rounded-full flex items-center justify-center border-2 border-muted/20 mb-4 text-muted-foreground/20">
                            <IconId className="size-10" />
                        </div>
                        <h3 className="text-lg font-bold text-muted-foreground">No Report Generated</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-1">
                            Use the filters above to retrieve an employee's attendance record for any given month.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                        {/* Report Content - This part looks like a formal Job Card */}
                        <Card className="border overflow-hidden bg-white dark:bg-slate-950">
                            {/* Company Branding Section (Job Card Header) */}
                            <div className="p-8 border-b bg-muted/5 flex flex-col md:flex-row justify-between items-start gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-slate-900 border-4 border-primary/20 flex items-center justify-center dark:bg-white text-white dark:text-slate-900">
                                            <span className="font-black text-xl italic underline decoration-primary decoration-4">HH</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tighter">HR HUB ENTERPRISE</h2>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Intelligence. Operations. Growth.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="px-3 py-1 bg-primary/10 text-primary w-fit rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Attendance Report
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">Monthly Job Card</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-background p-6 rounded-2xl border shadow-sm">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Report For</p>
                                        <p className="text-sm font-bold">
                                            {dateRange?.from && dateRange?.to ? (
                                                isSameMonth(dateRange.from, dateRange.to) && isSameYear(dateRange.from, dateRange.to) ? (
                                                    format(dateRange.from, "MMMM yyyy")
                                                ) : (
                                                    `${format(dateRange.from, "MMM dd, yy")} - ${format(dateRange.to, "MMM dd, yy")}`
                                                )
                                            ) : "Selected Interval"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Generated On</p>
                                        <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Shift Code</p>
                                        <p className="text-sm font-bold">DS-01 (Day)</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Status</p>
                                        <Badge variant="success" className="h-5 px-1.5 text-[8px] font-black uppercase">Finalized</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Employee Information Strip */}
                            <div className="px-8 py-6 bg-slate-900 text-white flex flex-wrap gap-x-12 gap-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                                        <IconUser className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Full Name</p>
                                        <p className="text-sm font-bold">{MOCK_EMPLOYEE.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                                        <IconId className="size-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Emp ID</p>
                                        <p className="text-sm font-bold">{MOCK_EMPLOYEE.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                                        <IconBriefcase className="size-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Department</p>
                                        <p className="text-sm font-bold">{MOCK_EMPLOYEE.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                                        <IconCalendar className="size-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Designation</p>
                                        <p className="text-sm font-bold">{MOCK_EMPLOYEE.designation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 border-l border-slate-700 pl-12 hidden xl:flex">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Section / Grade</p>
                                        <p className="text-sm font-bold">{MOCK_EMPLOYEE.section} • {MOCK_EMPLOYEE.grade}</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-0">
                                {/* Summary Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b">
                                    <SummaryStat label="Present" value={totals?.present} icon={IconCheck} color="text-emerald-500" />
                                    <SummaryStat label="Absent" value={totals?.absent} icon={IconX} color="text-rose-500" />
                                    <SummaryStat label="Holiday" value={totals?.holiday} icon={IconCalendar} color="text-indigo-500" />
                                    <SummaryStat label="Weekend" value={totals?.weekend} icon={IconBriefcase} color="text-slate-500" />
                                    <SummaryStat label="Total OT" value={`${totals?.totalOT}h`} icon={IconClock} color="text-amber-500" />
                                    <SummaryStat label="Total Late" value={`${totals?.totalLate}m`} icon={IconAlertCircle} color="text-orange-500" />
                                </div>

                                {/* Table Header */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/30 border-b">
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-left tracking-widest text-muted-foreground w-20">Date</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-left tracking-widest text-muted-foreground w-20">Day</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground w-28">Status</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground">In Time</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground">Out Time</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground">Late (m)</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground">OT (h)</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground">Total (h)</th>
                                                <th className="px-4 py-4 text-[10px] font-black uppercase text-left tracking-widest text-muted-foreground">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceData.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={cn(
                                                        "border-b hover:bg-muted/10 transition-colors",
                                                        row.status === "Weekend" && "bg-slate-50 dark:bg-slate-900/50",
                                                        row.status === "Holiday" && "bg-indigo-50/30 dark:bg-indigo-900/10",
                                                        row.status === "Absent" && "bg-rose-50/30 dark:bg-rose-900/10"
                                                    )}
                                                >
                                                    <td className="px-4 py-3 text-sm font-bold">{row.date}</td>
                                                    <td className="px-4 py-3 text-xs font-medium text-muted-foreground">{row.day}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Badge
                                                            variant={
                                                                row.status === "Present" ? "success" :
                                                                    row.status === "Absent" ? "destructive" :
                                                                        row.status === "Weekend" ? "secondary" : "default"
                                                            }
                                                            className="h-5 px-1.5 text-[8px] font-black uppercase"
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-xs font-bold">{row.inTime}</td>
                                                    <td className="px-4 py-3 text-center text-xs font-bold">{row.outTime}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.late > 0 ? (
                                                            <span className="text-xs font-black text-rose-500">{row.late}</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground opacity-30">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.ot > 0 ? (
                                                            <span className="text-xs font-black text-emerald-500">+{row.ot}</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground opacity-30">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-xs font-bold">{row.total > 0 ? `${row.total}h` : "-"}</td>
                                                    <td className="px-4 py-3 text-[10px] font-medium text-muted-foreground italic">{row.remarks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>

                            {/* Signatures for Print */}
                            <div className="p-12 pt-20 grid grid-cols-3 gap-12 border-t mt-12 print:block border-dashed">
                                <div className="border-t-2 border-slate-300 pt-3 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Employee Signature</p>
                                </div>
                                <div className="border-t-2 border-slate-300 pt-3 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Department Head</p>
                                </div>
                                <div className="border-t-2 border-slate-300 pt-3 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest">HR Authorized</p>
                                </div>
                            </div>
                        </Card>

                        {/* Navigation Footer */}
                        <div className="flex justify-between items-center py-4 px-2">
                            <Button variant="ghost" disabled className="rounded-full gap-2">
                                <IconChevronLeft className="size-4" />
                                Previous Month
                            </Button>
                            <div className="flex gap-2">
                                <div className="size-2 rounded-full bg-primary" />
                                <div className="size-2 rounded-full bg-muted" />
                                <div className="size-2 rounded-full bg-muted" />
                            </div>
                            <Button variant="ghost" className="rounded-full gap-2 text-primary">
                                Next Month
                                <IconChevronRight className="size-4" />
                            </Button>
                        </div>
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

function SummaryStat({ label, value, icon: Icon, color }: any) {
    return (
        <div className="p-6 flex flex-col items-center justify-center border-r last:border-r-0 group hover:bg-muted/50 transition-colors">
            <div className={cn("p-2 rounded-xl bg-background mb-3 shadow-sm border group-hover:scale-110 transition-transform", color)}>
                <Icon className="size-4" />
            </div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{label}</p>
            <p className="text-lg font-black tracking-tight leading-none">{value}</p>
        </div>
    )
}
