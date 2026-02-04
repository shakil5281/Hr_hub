"use client"

import * as React from "react"
import { IconSettings, IconLoader, IconCheck, IconPlayerPlay } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NativeSelect } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { payrollService } from "@/lib/services/payroll"
import { organogramService } from "@/lib/services/organogram"

const MONTHS = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 }
]

export default function SalaryProcessPage() {
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [departmentId, setDepartmentId] = React.useState("all")
    const [departments, setDepartments] = React.useState<any[]>([])

    const [status, setStatus] = React.useState<"idle" | "processing" | "success">("idle")
    const [progress, setProgress] = React.useState(0)
    const [message, setMessage] = React.useState("")

    React.useEffect(() => {
        organogramService.getDepartments().then(setDepartments)
    }, [])

    const handleProcess = async () => {
        setStatus("processing")
        setProgress(10)
        setMessage("Initializing payroll engine...")

        try {
            // Fake progress for UX
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return p + 2
                })
            }, 100)

            const res = await payrollService.processSalary({
                year,
                month,
                departmentId: departmentId === "all" ? undefined : parseInt(departmentId)
            })

            clearInterval(interval)
            setProgress(100)
            setStatus("success")
            setMessage(res.message || "Payroll processed successfully")
            toast.success("Payroll processed successfully")
        } catch (error: any) {
            setStatus("idle")
            toast.error(error.response?.data?.message || "Failed to process payroll")
        }
    }

    return (
        <div className="p-6 w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter italic bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Salary Processing</h2>
                <p className="text-muted-foreground font-medium">Execute the master payroll engine for the selected criteria.</p>
            </div>

            <Card className="border-2 shadow-2xl shadow-emerald-500/5">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-700">Process Configuration</CardTitle>
                    <CardDescription>Configure parameters for salary generation.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-1">Target Month</Label>
                            <NativeSelect value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-12 rounded-2xl border-2 font-bold">
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-1">Fiscal Year</Label>
                            <NativeSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="h-12 rounded-2xl border-2 font-bold">
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-1">Scope (Department)</Label>
                            <NativeSelect value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="h-12 rounded-2xl border-2 font-bold">
                                <option value="all">Entire Organization</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
                            </NativeSelect>
                        </div>
                    </div>

                    <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-4">
                        <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600">
                            <IconSettings className="size-5 animate-spin-slow" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-100">Ready for Execution</h4>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                The engine will calculate basic, OT, bonuses and deductions for <strong>{MONTHS.find(m => m.value === month)?.label} {year}</strong>. This process may take a few seconds depending on the headcount.
                            </p>
                        </div>
                    </div>

                    {status === "idle" && (
                        <Button
                            className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all transform hover:scale-[1.01]"
                            onClick={handleProcess}
                        >
                            <IconPlayerPlay className="mr-2 size-5 fill-current" />
                            Run Payroll Engine
                        </Button>
                    )}

                    {status === "processing" && (
                        <div className="space-y-4 py-4">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-black text-emerald-700 animate-pulse">{message}</span>
                                <span className="text-2xl font-black tabular-nums">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-4 bg-emerald-100 rounded-full" />
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4 py-8 animate-in zoom-in-95 duration-500">
                            <div className="size-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                                <IconCheck className="size-10 text-white" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-50">Operation Successful</h3>
                                <p className="text-sm font-medium text-muted-foreground mt-1">{message}</p>
                            </div>
                            <Button
                                variant="outline"
                                className="h-12 px-8 rounded-full border-2 font-bold hover:bg-muted"
                                onClick={() => setStatus("idle")}
                            >
                                Process Another Scope
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
