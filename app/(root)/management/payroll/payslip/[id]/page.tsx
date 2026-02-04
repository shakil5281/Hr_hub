"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import {
    IconPrinter,
    IconDownload,
    IconLoader,
    IconBuildingBank,
    IconUser,
    IconBriefcase,
    IconCalendarStats,
    IconArrowLeft,
    IconCash
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { payrollService, type Payslip } from "@/lib/services/payroll"
import { toast } from "sonner"
import Link from "next/link"

export default function PayslipPage() {
    const params = useParams()
    const id = parseInt(params.id as string)

    const [isLoading, setIsLoading] = React.useState(true)
    const [data, setData] = React.useState<Payslip | null>(null)

    React.useEffect(() => {
        if (id) {
            payrollService.getPayslip(id)
                .then(setData)
                .catch(() => toast.error("Failed to load payslip"))
                .finally(() => setIsLoading(false))
        }
    }, [id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <IconLoader className="size-10 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!data) return <div>Payslip not found</div>

    return (
        <div className="min-h-screen bg-muted/30 pb-20 animate-in fade-in duration-700">
            {/* Control Bar */}
            <div className="bg-background border-b sticky top-0 z-30 print:hidden">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[900px]">
                    <Link href="/management/payroll/monthly-sheet">
                        <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold">
                            <IconArrowLeft className="size-4" />
                            Back to Sheet
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2 text-xs font-bold" onClick={() => window.print()}>
                            <IconPrinter className="size-4" />
                            Print Payslip
                        </Button>
                        <Button size="sm" className="gap-2 text-xs font-bold bg-slate-900">
                            <IconDownload className="size-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-[900px]">
                <Card className="border-none shadow-2xl overflow-hidden bg-white text-slate-900 rounded-3xl">
                    <CardContent className="p-0">
                        {/* Payslip Header */}
                        <div className="bg-slate-900 text-white p-10 flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="size-12 bg-white rounded-xl flex items-center justify-center text-slate-900">
                                    <IconBuildingBank className="size-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tighter uppercase italic">Payslip</h1>
                                    <p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase opacity-70">Confidential Remuneration Record</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <h2 className="text-xl font-bold">ERP Hub Ltd.</h2>
                                <p className="text-xs text-slate-400">Plant: Ashulia, Savar, Dhaka</p>
                                <div className="mt-4 inline-block bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none block">Payroll Period</span>
                                    <span className="text-sm font-black">{data.monthName} {data.year}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            {/* Employee Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 underline decoration-slate-200 underline-offset-4">Employee Details</h3>
                                    <div className="space-y-4">
                                        <InfoItem icon={IconUser} label="Employee Name" value={data.employeeName} />
                                        <InfoItem icon={IconBriefcase} label="Designation" value={data.designation} />
                                        <InfoItem icon={IconBriefcase} label="Department" value={data.department} />
                                        <InfoItem icon={IconCalendarStats} label="Join Date" value={data.joinedDate} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 underline decoration-slate-200 underline-offset-4">Payment Info</h3>
                                    <div className="space-y-4">
                                        <InfoItem icon={IconBuildingBank} label="Bank Account" value={data.bankAccountNo} />
                                        <InfoItem icon={IconUser} label="Emp ID" value={data.employeeIdCard} />
                                        {/* Attendance Summary Mini-table */}
                                        <div className="bg-slate-50 p-4 rounded-2xl border flex justify-between text-center overflow-hidden">
                                            <StatItem label="Total Days" value={data.totalDays} />
                                            <StatItem label="Present" value={data.presentDays} color="text-emerald-600" />
                                            <StatItem label="Absent" value={data.absentDays} color="text-rose-600" />
                                            <StatItem label="OT Hrs" value={data.otHours} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Earnings & Deductions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Earnings */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black uppercase tracking-tight">Earnings</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Amount (৳)</span>
                                    </div>
                                    <div className="space-y-3">
                                        <FinancialRow label="Basic Salary" value={data.basicSalary} />
                                        <FinancialRow label="House Rent" value={(data.grossSalary - data.basicSalary) * 0.4} />
                                        <FinancialRow label="Medical Allowance" value={(data.grossSalary - data.basicSalary) * 0.2} />
                                        <FinancialRow label="Conveyance" value={(data.grossSalary - data.basicSalary) * 0.2} />
                                        <FinancialRow label="OT Allowance" value={data.otAmount} highlight />
                                        <FinancialRow label="Attendance Bonus" value={data.attendanceBonus} />
                                        <FinancialRow label="Other Allowances" value={data.otherAllowances} />
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl flex items-center justify-between font-black text-emerald-700">
                                        <span>Total Earnings</span>
                                        <span>৳{data.totalEarning.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black uppercase tracking-tight">Deductions</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Amount (৳)</span>
                                    </div>
                                    <div className="space-y-3">
                                        <FinancialRow label="Absent Deduction" value={data.absentDays * (data.grossSalary / data.totalDays)} />
                                        <FinancialRow label="Arrears / Advance" value={0} />
                                        <FinancialRow label="OT Deduction" value={0} />
                                        <FinancialRow label="Professional Tax" value={0} />
                                        {/* Spacer to align buttons */}
                                        <div className="h-20" />
                                    </div>
                                    <div className="bg-rose-50 p-4 rounded-xl flex items-center justify-between font-black text-rose-700">
                                        <span>Total Deductions</span>
                                        <span>৳{data.totalDeduction.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Net Payable */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative bg-slate-900 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150">
                                        <IconCash className="size-32" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Total Net Payable</p>
                                        <h4 className="text-5xl font-black tracking-tighter tabular-nums">৳{data.netPayable.toLocaleString()}</h4>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <p className="text-xs italic opacity-60 font-medium whitespace-pre-wrap max-w-[200px]">
                                            Authorized seal and signature required for paper validation.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Signatures */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-16 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <div className="space-y-4">
                                    <div className="h-px bg-slate-200" />
                                    <p>Employee Signature</p>
                                </div>
                                <div className="space-y-4 hidden md:block">
                                    <div className="h-px bg-slate-200" />
                                    <p>Accounts Officer</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-px bg-slate-200" />
                                    <p>Authorized Signatory</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em] mt-10 opacity-40">
                    This is a computer generated document • Hr Hub Enterprise System
                </p>
            </main>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Icon className="size-4" />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-800">{value || "N/A"}</p>
            </div>
        </div>
    )
}

function StatItem({ label, value, color = "text-slate-600" }: any) {
    return (
        <div className="flex flex-col flex-1">
            <span className={`text-base font-black ${color}`}>{value}</span>
            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">{label}</span>
        </div>
    )
}

function FinancialRow({ label, value, highlight }: any) {
    return (
        <div className={`flex items-center justify-between text-xs py-1 border-b border-dashed border-slate-100 last:border-0 ${highlight ? 'font-bold text-indigo-600' : 'text-slate-600'}`}>
            <span className="font-medium">{label}</span>
            <span className="tabular-nums font-bold">৳{value.toLocaleString()}</span>
        </div>
    )
}
