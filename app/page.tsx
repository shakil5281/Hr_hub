'use client'
import { IconLayoutDashboard, IconUsers, IconUserCheck, IconUserOff, IconClock, IconGift, IconCalendar, IconUserPlus, IconChartPie, IconChartBar, IconBriefcase } from "@tabler/icons-react"
import { SummaryCard } from "@/components/summary-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"

const attendanceData = [
  { name: "Mon", present: 140, target: 145 },
  { name: "Tue", present: 138, target: 145 },
  { name: "Wed", present: 142, target: 145 },
  { name: "Thu", present: 135, target: 145 },
  { name: "Fri", present: 141, target: 145 },
  { name: "Sat", present: 120, target: 145 },
  { name: "Sun", present: 0, target: 0 },
]

const deptData = [
  { name: "IT", value: 45 },
  { name: "HR", value: 12 },
  { name: "Ops", value: 65 },
  { name: "Fin", value: 18 },
  { name: "Sales", value: 32 },
]

const COLORS = ["oklch(0.53 0.14 150)", "oklch(0.65 0.12 250)", "oklch(0.75 0.10 50)", "oklch(0.45 0.18 320)", "oklch(0.55 0.15 200)"]

const recentHires = [
  { name: "Sarah Wilson", position: "Software Engineer", dept: "IT", date: "Jan 15, 2026", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Michael Ross", position: "Marketing Lead", dept: "Sales", date: "Jan 12, 2026", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
  { name: "Emma Thompson", position: "HR Specialist", dept: "HR", date: "Jan 10, 2026", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
]

const upcomingEvents = [
  { name: "David Miller", event: "Work Anniversary", date: "Tomorrow", icon: IconCalendar, color: "text-blue-500 bg-blue-500/10" },
  { name: "Sophia Garcia", event: "Birthday", date: "Jan 31", icon: IconGift, color: "text-pink-500 bg-pink-500/10" },
  { name: "James Anderson", event: "New Hire Orientation", date: "Feb 01", icon: IconUserPlus, color: "text-green-500 bg-green-500/10" },
]

export default function Page() {
  return (
    <div className="flex flex-col gap-0 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-6 lg:px-6 mb-6 border-b border-muted/40 bg-muted/5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <IconLayoutDashboard className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Management Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive overview of workforce, attendance, and recruitment metrics.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 lg:px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Employees"
            value="172"
            icon={IconUsers}
            trend={{ value: "4", label: "new this month", isUp: true }}
            status="primary"
            chartData={[...Array(8)].map((_, i) => ({ value: 160 + Math.random() * 20 }))}
          />
          <SummaryCard
            title="Present Today"
            value="141 / 145"
            icon={IconUserCheck}
            trend={{ value: "97.2%", label: "attendance rate", isUp: true }}
            status="success"
            chartData={[...Array(8)].map((_, i) => ({ value: 80 + Math.random() * 20 }))}
          />
          <SummaryCard
            title="On Leave"
            value="9"
            icon={IconUserOff}
            trend={{ value: "2", label: "pending requests", isUp: false }}
            status="warning"
            chartData={[...Array(8)].map((_, i) => ({ value: 5 + Math.random() * 10 }))}
          />
          <SummaryCard
            title="Open Positions"
            value="12"
            icon={IconBriefcase}
            trend={{ value: "3", label: "active campaigns", isUp: true }}
            status="info"
            chartData={[...Array(8)].map((_, i) => ({ value: 8 + Math.random() * 5 }))}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-muted/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Attendance Overview</CardTitle>
              <CardDescription>Daily attendance vs manpower target for the current week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="present" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={3} />
                    <Area type="monotone" dataKey="target" stroke="oklch(0.53 0.14 150 / 0.1)" fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Department Distribution</CardTitle>
              <CardDescription>Workforce allocation across main business units.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">172</span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {deptData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Hires */}
          <Card className="lg:col-span-2 border-muted/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">Recent Joiners</CardTitle>
                <CardDescription>New employees who joined in the last 15 days.</CardDescription>
              </div>
              <Badge variant="secondary" className="font-semibold uppercase tracking-wider text-[10px]">View Directory</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHires.map((hire) => (
                  <div key={hire.name} className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-muted/50 border border-transparent hover:border-muted/60">
                    <Avatar className="size-10 border border-primary/10">
                      <AvatarImage src={hire.image} />
                      <AvatarFallback>{hire.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold leading-none">{hire.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{hire.position}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">{hire.dept}</Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">{hire.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-muted/40 shadow-sm bg-primary/5 dark:bg-primary/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
              <CardDescription>Celebrations and milestones this week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {upcomingEvents.map((event) => (
                  <div key={event.name} className="relative pl-6 border-l-2 border-primary/20">
                    <div className="absolute -left-[9px] top-0 p-1.5 rounded-full bg-background border border-primary/20">
                      <event.icon className={`size-3 ${event.color.split(' ')[0]}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">{event.date}</p>
                      <h4 className="text-sm font-semibold">{event.name}</h4>
                      <p className="text-xs text-muted-foreground">{event.event}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 bg-background border-primary/10 hover:bg-primary/5 hover:text-primary">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
