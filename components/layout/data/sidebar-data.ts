import {
    IconChartBar,
    IconDashboard,
    IconFingerprint,
    IconCash,
    IconCalendarEvent,
    IconReport,
    IconReportAnalytics,
    IconRefresh,
    IconInfoCircle,
    IconFolder,
    IconUsers,
    IconListDetails,
    IconSettings,
    IconHelp,
    IconSearch,
    IconDatabase,
    IconFileWord,
    IconShield,
    IconUserMinus,
    IconBuildingFactory2,
    IconCalculator,
    IconUsersGroup,
} from "@tabler/icons-react"

export const sidebarData = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    modules: [
        {
            name: "HR Management",
            logo: IconUsersGroup,
            plan: "Module",
            navMain: [
                { title: "Dashboard", url: "/", icon: IconDashboard },
                { title: "Lifecycle", url: "/lifecycle", icon: IconListDetails },
                { title: "Analytics", url: "/analytics", icon: IconChartBar },
            ],
            navGroup: [
                {
                    title: "Information",
                    url: "#",
                    icon: IconInfoCircle,
                    items: [
                        { title: "Company information", url: "/information/company-information" },
                        { title: "Address", url: "/information/address" },
                        { title: "Shift", url: "/information/shift" },
                    ],
                },
                {
                    title: "Human Resource",
                    url: "#",
                    icon: IconUsers,
                    items: [
                        { title: "Employee info", url: "/human-resource/employee-info" },
                        { title: "Manpower List", url: "/human-resource/manpower-list" },
                        { title: "Manpower Summary", url: "/human-resource/manpower-summary" },
                        { title: "Migration", url: "/human-resource/migration" },
                        { title: "Roster", url: "/human-resource/roster" },
                        { title: "Manpower Requirement", url: "/human-resource/manpower-requirement" },
                    ],
                },
                {
                    title: "Transactions",
                    url: "#",
                    icon: IconUserMinus,
                    items: [
                        { title: "Separation", url: "/transactions/separation" },
                    ],
                },
                {
                    title: "Attendance",
                    url: "/attendance",
                    icon: IconFingerprint,
                    items: [
                        { title: "Daily Input", url: "/attendance/daily-input" },
                        { title: "Daily Summary", url: "/attendance/daily-summary" },
                        { title: "Job Card", url: "/attendance/job-card" },
                        { title: "Missing Entry", url: "/attendance/missing-entry" },
                        { title: "Manual Entry", url: "/attendance/manual-entry" },
                        { title: "Continuous Status", url: "/attendance/continuous-status" },
                        { title: "Absent Status", url: "/attendance/absent-status" },
                        { title: "Counseling Report", url: "/attendance/counceling-report" },
                        { title: "Movement", url: "/attendance/movement" },
                        { title: "Daily OT Sheet", url: "/attendance/daily-ot-sheet" },
                        { title: "Daily OT Summary", url: "/attendance/daily-ot-summary" },
                        { title: "OT Deduction", url: "/attendance/ot-deduction" },
                    ],
                },
                {
                    title: "Payroll",
                    url: "/payroll",
                    icon: IconCash,
                    items: [
                        { title: "Salary Process", url: "/payroll/salary-process" },
                        { title: "Salary Sheet", url: "/payroll/salary-sheet" },
                        { title: "Daily Salary Sheet", url: "/payroll/daily-salary-sheet" },
                        { title: "Salary Summary", url: "/payroll/salary-summary" },
                        { title: "Pay Slip", url: "/payroll/pay-slip" },
                        { title: "Advance Salary Sheet", url: "/payroll/advance-salary-sheet" },
                        { title: "Increment Sheet", url: "/payroll/increment-sheet" },
                        { title: "Eid Bonus", url: "/payroll/eid-bonus" },
                    ],
                },
                {
                    title: "Leave",
                    url: "/leave",
                    icon: IconCalendarEvent,
                    items: [
                        { title: "Leave Management", url: "/leave" },
                        { title: "Leave Details", url: "/leave/details" },
                        { title: "Monthly Leave Report", url: "/leave/monthly-report" },
                    ],
                },
                {
                    title: "Reports",
                    url: "/reports",
                    icon: IconReport,
                    items: [
                        { title: "Employee Reports", url: "/reports" },
                        { title: "Attendance Reports", url: "/reports" },
                        { title: "Night Bill", url: "/reports/night-bill" },
                        { title: "Tiffin Bill", url: "/reports/tiffin-bill" },
                    ],
                },
                {
                    title: "Monthly Reports",
                    url: "/monthly-reports",
                    icon: IconReportAnalytics,
                    items: [
                        { title: "Monthly Salary", url: "/monthly-reports" },
                        { title: "Monthly Attendance", url: "/monthly-reports" },
                    ],
                },
                {
                    title: "Data Process",
                    url: "/data-process",
                    icon: IconRefresh,
                    items: [
                        { title: "Collect Data", url: "/data-process/collect-data" },
                        { title: "Daily Process", url: "/data-process/daily-process" },
                        { title: "Monthly Process", url: "/data-process/monthly-process" },
                    ],
                },
                {
                    title: "Administrator",
                    url: "/administrator",
                    icon: IconShield,
                    items: [
                        { title: "Users", url: "/administrator/users" },
                        { title: "Permissions", url: "/administrator/permissions" },
                        { title: "Backup Database", url: "/administrator/backup-database" },
                    ],
                },
            ]
        },
        {
            name: "New Production",
            logo: IconBuildingFactory2,
            plan: "Module",
            navMain: [
                { title: "Prod Dashboard", url: "/production", icon: IconDashboard },
                { title: "Planning", url: "/production/planning", icon: IconCalendarEvent },
            ],
            navGroup: [
                {
                    title: "Operations",
                    url: "#",
                    icon: IconRefresh,
                    items: [
                        { title: "Daily Output", url: "/production/daily-output" },
                        { title: "Machine Tracking", url: "/production/machines" },
                        { title: "Quality Check", url: "/production/quality" },
                    ],
                },
                {
                    title: "Inventory",
                    url: "#",
                    icon: IconDatabase,
                    items: [
                        { title: "Raw Material", url: "/production/inventory/raw" },
                        { title: "Finished Goods", url: "/production/inventory/finished" },
                    ],
                },
            ]
        },
        {
            name: "Accounts",
            logo: IconCalculator,
            plan: "Module",
            navMain: [
                { title: "Finance Overview", url: "/accounts", icon: IconDashboard },
            ],
            navGroup: [
                {
                    title: "General Ledger",
                    url: "#",
                    icon: IconCash,
                    items: [
                        { title: "Transcations", url: "/accounts/transactions" },
                        { title: "Journal Entry", url: "/accounts/journal" },
                        { title: "Balance Sheet", url: "/accounts/balance-sheet" },
                    ],
                },
                {
                    title: "Banking",
                    url: "#",
                    icon: IconBuildingFactory2,
                    items: [
                        { title: "Bank Accounts", url: "/accounts/banking/list" },
                        { title: "Reconciliation", url: "/accounts/banking/reconcile" },
                    ],
                },
            ]
        }
    ],
    navSecondary: [
        { title: "Settings", url: "/settings", icon: IconSettings },
        { title: "Get Help", url: "#", icon: IconHelp },
        { title: "Search", url: "#", icon: IconSearch },
    ],
}
