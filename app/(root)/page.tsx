'use client'

import * as React from "react"
import {
  IconLayoutDashboard,
  IconUsers,
  IconUserCheck,
  IconUserOff,
  IconClock,
  IconGift,
  IconCalendar,
  IconUserPlus,
  IconChartPie,
  IconChartBar,
  IconBriefcase,
  IconTrendingUp,
  IconArrowUpRight,
  IconDotsVertical,
  IconTarget,
  IconBellRinging,
  IconChevronRight,
  IconRefresh
} from "@tabler/icons-react"
import { SummaryCard } from "@/components/summary-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { cn } from "@/lib/utils"

// --- Mock Data ---

const attendanceData = [
  { name: "Mon", present: 140, target: 145 },
  { name: "Tue", present: 138, target: 145 },
  { name: "Wed", present: 142, target: 145 },
  { name: "Thu", present: 135, target: 145 },
  { name: "Fri", present: 141, target: 145 },
  { name: "Sat", present: 120, target: 145 },
  { name: "Sun", present: 50, target: 145 },
]

const deptData = [
  { name: "Engineering", value: 45, color: "var(--primary)" },
  { name: "Marketing", value: 15, color: "#6366f1" },
  { name: "Sales", value: 20, color: "#a855f7" },
  { name: "HR/Ops", value: 10, color: "#f43f5e" },
  { name: "Support", value: 10, color: "#ec4899" },
]

const recentHires = [
  { name: "Sarah Wilson", position: "Software Engineer", dept: "IT", date: "Jan 15, 2026", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Michael Ross", position: "Marketing Lead", dept: "Sales", date: "Jan 12, 2026", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
  { name: "Emma Thompson", position: "HR Specialist", dept: "HR", date: "Jan 10, 2026", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
]

const upcomingEvents = [
  { name: "David Miller", event: "Work Anniversary", date: "Tomorrow", icon: IconCalendar, color: "text-blue-500 bg-blue-500/10" },
  { name: "Sophia Garcia", event: "Birthday", date: "Jan 31", icon: IconGift, color: "text-pink-500 bg-pink-500/10" },
  { name: "James Anderson", event: "New Hire Orientation", date: "Feb 01", icon: IconUserPlus, color: "text-emerald-500 bg-emerald-500/10" },
]

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background/50 animate-in fade-in duration-1000">

      {/* Header Area */}
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6 lg:px-8 max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                <IconLayoutDashboard className="size-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Management Dashboard
                </h1>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Enterprise Pulse • Session Active
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-4 border-2">
                <IconRefresh className="mr-2 size-4" />
                Refresh Stats
              </Button>
              <Button size="sm" className="rounded-full px-6 shadow-xl shadow-primary/20">
                <IconUserPlus className="mr-2 size-4" />
                Hire Talent
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <IconBellRinging className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-[1600px] space-y-8 animate-in slide-in-from-bottom-6 duration-1000 delay-150">

        {/* 1. KPI Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Workforce"
            value="1,284"
            icon={IconUsers}
            trend={{ value: "4.2%", label: "growth", isUp: true }}
            status="primary"
            chartData={[40, 45, 42, 50, 48, 55, 60, 65].map((v) => ({ value: v }))}
          />
          <SummaryCard
            title="Attendance"
            value="97.2%"
            icon={IconUserCheck}
            trend={{ value: "0.8%", label: "vs yesterday", isUp: true }}
            status="success"
            chartData={[90, 92, 94, 91, 95, 96, 97, 98].map((v) => ({ value: v }))}
          />
          <SummaryCard
            title="On Leave"
            value="14"
            icon={IconUserOff}
            trend={{ value: "2", label: "urgent", isUp: false }}
            status="warning"
            chartData={[10, 15, 12, 14, 18, 16, 14, 12].map((v) => ({ value: v }))}
          />
          <SummaryCard
            title="Open Positions"
            value="42"
            icon={IconBriefcase}
            trend={{ value: "3", label: "new", isUp: true }}
            status="info"
            chartData={[30, 32, 35, 38, 40, 39, 41, 42].map((v) => ({ value: v }))}
          />
        </div>

        {/* 2. Primary Analytics & Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Attendance Analysis */}
          <Card className="xl:col-span-2 border-2 shadow-xl shadow-accent/5 overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-xl font-bold">Attendance Velocity</CardTitle>
                <CardDescription>Real-time monitoring of workplace presence.</CardDescription>
              </div>
              <SelectGroup />
            </CardHeader>
            <CardContent className="h-[350px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="var(--primary)"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorMain)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="var(--muted-foreground)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Mix & Premium Insights */}
          <div className="space-y-8">
            <Card className="border-2 shadow-xl shadow-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Workforce Allocation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[220px] w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptData}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center animate-pulse">
                    <span className="text-3xl font-black">1284</span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Total Staff</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 w-full gap-x-4 gap-y-2 mt-4">
                  {deptData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 group cursor-help">
                      <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase group-hover:text-primary transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Premium Dark Widget */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-2xl relative overflow-hidden group border-4 border-primary/10">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <IconTarget className="size-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60">Strategic Audit</span>
                </div>
                <h3 className="text-lg font-bold leading-tight">
                  Utilization at <span className="text-primary">94%</span> capacity
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Resources are highly optimized this quarter. Recommend reviewing open headcount for upcoming Q3 projects to avoid burnout.
                </p>
                <Button variant="outline" size="sm" className="w-full rounded-full border-slate-700 bg-transparent text-white hover:bg-slate-900 h-9 text-xs">
                  Analyze Workforce Health
                  <IconChevronRight className="ml-1 size-3" />
                </Button>
              </div>
              <div className="absolute top-0 right-0 size-32 bg-primary/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* 3. Operational Details Row */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

          {/* Recent Joiners Table */}
          <Card className="xl:col-span-3 border-none bg-accent/5 shadow-none overflow-hidden">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Latest Talent</CardTitle>
                  <CardDescription>Verified onboarding records for this month.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold uppercase tracking-tight">
                  Explore Directory
                  <IconArrowUpRight className="ml-1 size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pt-4">
              <div className="grid gap-3">
                {recentHires.map((hire) => (
                  <div key={hire.name} className="flex items-center justify-between p-4 bg-background border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all group group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-11 border-2 border-muted group-hover:border-primary/30 transition-colors shadow-sm">
                        <AvatarImage src={hire.image} />
                        <AvatarFallback>{hire.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-bold">{hire.name}</h4>
                        <p className="text-xs text-muted-foreground">{hire.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex flex-col items-end">
                        <Badge variant="outline" className="bg-primary/5 text-[10px] font-black border-primary/20">{hire.dept}</Badge>
                        <span className="text-[10px] text-muted-foreground mt-1 font-bold">{hire.date}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full">
                        <IconDotsVertical className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones & Events */}
          <Card className="xl:col-span-2 border-2 shadow-xl shadow-accent/5 bg-accent/30 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-white dark:bg-slate-900 border rounded-2xl w-fit mb-2 shadow-sm">
                <IconCalendar className="size-5 text-indigo-500" />
              </div>
              <CardTitle className="text-lg">Organization Milestones</CardTitle>
              <CardDescription>Celebrating personal and professional growth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className={cn("size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border group-hover:scale-110 transition-transform", event.color)}>
                    <event.icon className="size-5 shadow-inner" />
                  </div>
                  <div className="flex-1 border-b border-muted pb-4 last:border-0 group-hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold">{event.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{event.event}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-black bg-white dark:bg-slate-800 border uppercase">{event.date}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full rounded-xl border-dashed border-2 hover:bg-white dark:hover:bg-slate-900 transition-colors h-11">
                <IconGift className="mr-2 size-4 text-pink-500" />
                Workforce Milestone Report
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

/* --- Styled Components & Helpers --- */

function SelectGroup() {
  return (
    <div className="flex bg-muted/50 p-1 rounded-full border">
      <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter bg-background rounded-full shadow-sm text-primary">Week</button>
      <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter text-muted-foreground hover:text-foreground">Month</button>
      <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter text-muted-foreground hover:text-foreground">Year</button>
    </div>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border bg-background/95 p-4 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{payload[0].payload.name}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-bold text-muted-foreground">Active Staff</span>
            <span className="text-sm font-black text-primary">{payload[0].value}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-bold text-muted-foreground">Target</span>
            <span className="text-sm font-black">{payload[1].value}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}
