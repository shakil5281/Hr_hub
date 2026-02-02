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
    IconShirt,
    IconTag,
    IconClipboardList,
    IconTruckDelivery,
    IconCalendarStats,
    IconScissors,
    IconBuildingFactory2,
    IconCalculator,
    IconBook,
    IconUserCircle,
    IconStack,
    IconUsersGroup,
    IconUserMinus,
    IconShield,
    IconPackages,
    IconBoxSeam,
    IconPackageExport,
} from "@tabler/icons-react"

export const sidebarData = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    modules: [
        {
            name: "Management",
            logo: IconUsersGroup,
            plan: "Module",
            roles: ["SuperAdmin", "Admin", "HR", "Management", "IT Officer", "HR Officer"],
            navMain: [
                { title: "Dashboard", url: "/", icon: IconDashboard },
                { title: "Lifecycle", url: "/management/lifecycle", icon: IconListDetails },
                { title: "Analytics", url: "/management/analytics", icon: IconChartBar },
            ],
            navGroup: [
                {
                    title: "Information",
                    url: "#",
                    icon: IconInfoCircle,
                    items: [
                        { title: "Company information", url: "/management/information/company-information" },
                        { title: "Company Organogram", url: "/management/information/company-organogram" },
                        { title: "Address", url: "/management/information/address-management" },
                        { title: "Shift", url: "/management/information/shift" },
                    ],
                },
                {
                    title: "Human Resource",
                    url: "#",
                    icon: IconUsers,
                    roles: ["SuperAdmin", "Admin", "HR", "Management", "HR Officer"],
                    items: [
                        { title: "Employee info", url: "/management/human-resource/employee-info" },
                        { title: "Manpower List", url: "/management/human-resource/manpower-list" },
                        { title: "Manpower Summary", url: "/management/human-resource/manpower-summary" },
                        { title: "Migration", url: "/management/human-resource/migration" },
                        { title: "Roster", url: "/management/human-resource/roster" },
                        { title: "Manpower Requirement", url: "/management/human-resource/manpower-requirement" },
                    ],
                },
                {
                    title: "Transactions",
                    url: "#",
                    icon: IconUserMinus,
                    roles: ["SuperAdmin", "Admin", "HR", "Management", "HR Officer"],
                    items: [
                        { title: "Separation", url: "/management/transactions/separation" },
                    ],
                },
                {
                    title: "Attendance",
                    url: "/management/attendance",
                    icon: IconFingerprint,
                    roles: ["SuperAdmin", "Admin", "HR", "Management", "HR Officer"],
                    items: [
                        { title: "Daily Input", url: "/management/attendance/daily-input" },
                        { title: "Daily Summary", url: "/management/attendance/daily-summary" },
                        { title: "Job Card", url: "/management/attendance/job-card" },
                        { title: "Missing Entry", url: "/management/attendance/missing-entry" },
                        { title: "Manual Entry", url: "/management/attendance/manual-entry" },
                        { title: "Continuous Status", url: "/management/attendance/continuous-status" },
                        { title: "Absent Status", url: "/management/attendance/absent-status" },
                        { title: "Counseling Report", url: "/management/attendance/counceling-report" },
                        { title: "Movement", url: "/management/attendance/movement" },
                        { title: "Daily OT Sheet", url: "/management/attendance/daily-ot-sheet" },
                        { title: "Daily OT Summary", url: "/management/attendance/daily-ot-summary" },
                        { title: "OT Deduction", url: "/management/attendance/ot-deduction" },
                    ],
                },
                {
                    title: "Payroll",
                    url: "/management/payroll",
                    icon: IconCash,
                    roles: ["SuperAdmin", "Admin", "HR", "Management"], // HR Officer excluded from Payroll
                    items: [
                        { title: "Salary Process", url: "/management/payroll/salary-process" },
                        { title: "Salary Sheet", url: "/management/payroll/salary-sheet" },
                        { title: "Daily Salary Sheet", url: "/management/payroll/daily-salary-sheet" },
                        { title: "Salary Summary", url: "/management/payroll/salary-summary" },
                        { title: "Pay Slip", url: "/management/payroll/pay-slip" },
                        { title: "Advance Salary Sheet", url: "/management/payroll/advance-salary-sheet" },
                        { title: "Increment Sheet", url: "/management/payroll/increment-sheet" },
                        { title: "Eid Bonus", url: "/management/payroll/eid-bonus" },
                    ],
                },
                {
                    title: "Leave",
                    url: "/management/leave",
                    icon: IconCalendarEvent,
                    roles: ["SuperAdmin", "Admin", "HR", "Management", "HR Officer"],
                    items: [
                        { title: "Leave Management", url: "/management/leave" },
                        { title: "Leave Details", url: "/management/leave/details" },
                        { title: "Monthly Leave Report", url: "/management/leave/monthly-report" },
                    ],
                },
                {
                    title: "Reports",
                    url: "/management/reports",
                    icon: IconReport,
                    items: [
                        { title: "Employee Reports", url: "/management/reports" },
                        { title: "Attendance Reports", url: "/management/reports" },
                        { title: "Night Bill", url: "/management/reports/night-bill" },
                        { title: "Tiffin Bill", url: "/management/reports/tiffin-bill" },
                    ],
                },
                {
                    title: "Monthly Reports",
                    url: "/management/monthly-reports",
                    icon: IconReportAnalytics,
                    items: [
                        { title: "Monthly Salary", url: "/management/monthly-reports" },
                        { title: "Monthly Attendance", url: "/management/monthly-reports" },
                    ],
                },
                {
                    title: "Data Process",
                    url: "/management/data-process",
                    icon: IconRefresh,
                    items: [
                        { title: "Collect Data", url: "/management/data-process/collect-data" },
                        { title: "Daily Process", url: "/management/data-process/daily-process" },
                        { title: "Monthly Process", url: "/management/data-process/monthly-process" },
                    ],
                },
                {
                    title: "Administrator",
                    url: "/management/administrator",
                    icon: IconShield,
                    roles: ["SuperAdmin", "Admin"],
                    items: [
                        { title: "Users", url: "/management/administrator/users" },
                        { title: "Permissions", url: "/management/administrator/permissions" },
                        { title: "Backup Database", url: "/management/administrator/backup-database" },
                    ],
                },
            ]
        },
        {
            name: "Production",
            logo: IconBuildingFactory2,
            plan: "Module",
            roles: ["SuperAdmin", "Admin", "Production", "ProductionManager"],
            navMain: [
                { title: "Dashboard", url: "/production/dashboard", icon: IconDashboard },
            ],
            navGroup: [
                {
                    title: "Production",
                    url: "#",
                    icon: IconRefresh,
                    items: [
                        { title: "Production list", url: "/production/production-list" },
                        { title: "Line assign", url: "/production/line-assign" },
                        { title: "Target", url: "/production/target" },
                        { title: "Daily Production report", url: "/production/daily-report" },
                        { title: "Monthly Production Report", url: "/production/monthly-report" },
                        { title: "Profit & loss", url: "/production/profit-loss" },
                    ],
                },
                {
                    title: "Expense",
                    url: "#",
                    icon: IconCash,
                    items: [
                        { title: "Summary", url: "/production/expense/summary" },
                        { title: "Daily expense", url: "/production/expense/daily-expense" },
                        { title: "Monthly expense", url: "/production/expense/monthly-expense" },
                        { title: "Others expense", url: "/production/expense/others-expense" },
                    ],
                },
            ]
        },
        {
            name: "Accounts",
            logo: IconCalculator,
            plan: "Module",
            roles: ["SuperAdmin", "Admin", "Accounts", "Accountant", "Account Officer"],
            navMain: [
                { title: "Dashboard", url: "/accounts/dashboard", icon: IconDashboard },
            ],
            navGroup: [
                {
                    title: "Accounts",
                    url: "#",
                    icon: IconCash,
                    items: [
                        { title: "Finance Overview", url: "/accounts/finance-overview" },
                        { title: "Daily Cash received", url: "/accounts/daily-cash-received" },
                        { title: "Daily expense", url: "/accounts/daily-expense" },
                        { title: "Monthly Report", url: "/accounts/monthly-report" },
                        { title: "Fund Transfer", url: "/accounts/fund-transfer" },
                    ],
                },
            ]
        },
        {
            name: "Cutting",
            logo: IconScissors,
            plan: "Module",
            roles: ["SuperAdmin", "Admin", "Cutting"],
            navMain: [
                { title: "Dashboard", url: "/cutting/dashboard", icon: IconDashboard },
            ],
            navGroup: [
                {
                    title: "Pre-Cutting",
                    url: "#",
                    icon: IconClipboardList,
                    items: [
                        { title: "Cutting Plans", url: "/cutting/plan" },
                        { title: "Marker Management", url: "/cutting/markers" },
                    ],
                },
                {
                    title: "Fabric Floor",
                    url: "#",
                    icon: IconBoxSeam,
                    items: [
                        { title: "Fabric Rolls Input", url: "/cutting/fabric-rolls" },
                        { title: "Spreading / Lay", url: "/cutting/spreading" },
                    ],
                },
                {
                    title: "Execution",
                    url: "#",
                    icon: IconScissors,
                    items: [
                        { title: "Production Entry", url: "/cutting/production" },
                        { title: "Bundle Management", url: "/cutting/bundling" },
                        { title: "Issue to Sewing", url: "/cutting/issue" },
                    ],
                },
                {
                    title: "Analysis",
                    url: "#",
                    icon: IconChartBar,
                    items: [
                        { title: "Cutting Reports", url: "/cutting/reports" },
                    ],
                },
            ]
        },
        {
            name: "Store",
            logo: IconPackages,
            plan: "Module",
            roles: ["SuperAdmin", "Admin", "Store", "StoreKeeper"],
            navMain: [
                { title: "Dashboard", url: "/store/dashboard", icon: IconDashboard },
            ],
            navGroup: [
                {
                    title: "Inventory",
                    url: "#",
                    icon: IconBoxSeam,
                    items: [
                        { title: "Items Master", url: "/store/items" },
                        { title: "GRN (Goods Receive)", url: "/store/grn" },
                        { title: "Material Issue", url: "/store/issue" },
                        { title: "Stock Ledger", url: "/store/ledger" },
                    ],
                },
                {
                    title: "Transactions",
                    url: "#",
                    icon: IconTruckDelivery,
                    items: [
                        { title: "Material Receive", url: "/store/material-receive" },
                        { title: "Material Issue Log", url: "/store/material-issue" },
                    ],
                },
            ]
        },
        {
            name: "Merchandising",
            logo: IconShirt,
            plan: "Module",
            roles: ["SuperAdmin", "Admin", "Merchandising", "Merchandiser"],
            navMain: [
                { title: "Dashboard", url: "/merchandising/dashboard", icon: IconDashboard },
            ],
            navGroup: [
                {
                    title: "Setup & CRM",
                    url: "#",
                    icon: IconUserCircle,
                    items: [
                        { title: "Buyers", url: "/merchandising/buyers" },
                        { title: "Seasons & Brands", url: "/merchandising/setup/seasons" },
                    ],
                },
                {
                    title: "Development",
                    url: "#",
                    icon: IconScissors,
                    items: [
                        { title: "Style & Techpack", url: "/merchandising/styles" },
                        { title: "Costing (FOB)", url: "/merchandising/costing" },
                        { title: "Sample Tracking", url: "/merchandising/samples" },
                    ],
                },
                {
                    title: "Order Management",
                    url: "#",
                    icon: IconClipboardList,
                    items: [
                        { title: "Purchase Orders", url: "/merchandising/orders" },
                        { title: "T&A Calendar", url: "/merchandising/ta-calendar" },
                    ],
                },
                {
                    title: "Supply Chain",
                    url: "#",
                    icon: IconStack,
                    items: [
                        { title: "Bookings (Fabric/Trims)", url: "/merchandising/bookings" },
                        { title: "In-house Tracking", url: "/merchandising/inventory" },
                    ],
                },
                {
                    title: "Operations",
                    url: "#",
                    icon: IconBuildingFactory2,
                    items: [
                        { title: "Production Follow-up", url: "/merchandising/production" },
                        { title: "Shipment Tracking", url: "/merchandising/shipment" },
                    ],
                },
                {
                    title: "Reports",
                    url: "/merchandising/reports",
                    icon: IconChartBar,
                    items: [
                        { title: "Order Analytics", url: "/merchandising/reports" },
                        { title: "Export Docs", url: "/merchandising/shipment/docs" },
                    ],
                },
            ]
        }
    ],
    navSecondary: [
        { title: "Settings", url: "/settings", icon: IconSettings },
        { title: "Get Help", url: "/help", icon: IconHelp },
        { title: "Search", url: "/search", icon: IconSearch },
    ],
}
