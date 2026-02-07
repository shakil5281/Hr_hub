"use client"

import * as React from "react"
import {
    IconWallet,
    IconPlus,
    IconArrowUpRight,
    IconArrowDownRight,
    IconHistory,
    IconLayoutDashboard,
    IconCoin
} from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NativeSelect } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CashbookEntry = {
    id: string
    title: string
    type: "Income" | "Expense"
    amount: number
    balanceAfter: number
    date: string
    category: string
    accountItem: string // e.g., "Cash", "Bank", "bKash"
    remarks: string
}

const initialData: CashbookEntry[] = [
    {
        id: "CB-001",
        title: "Opening Balance",
        type: "Income",
        amount: 50000,
        balanceAfter: 50000,
        date: "2024-02-01",
        category: "System",
        accountItem: "Cash",
        remarks: "Initial balance"
    },
    {
        id: "CB-002",
        title: "Office Rent",
        type: "Expense",
        amount: 15000,
        balanceAfter: 35000,
        date: "2024-02-02",
        category: "Operations",
        accountItem: "Bank",
        remarks: "Feb 2024"
    },
]

export default function GeneralAccountsPage() {
    const [data, setData] = React.useState<CashbookEntry[]>(initialData)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingRecord, setEditingRecord] = React.useState<CashbookEntry | null>(null)
    const [formData, setFormData] = React.useState<Partial<CashbookEntry>>({
        type: "Income",
        category: "General",
        accountItem: "Cash"
    })

    const totalIncome = data.filter(d => d.type === "Income").reduce((sum, item) => sum + item.amount, 0)
    const totalExpense = data.filter(d => d.type === "Expense").reduce((sum, item) => sum + item.amount, 0)
    const currentBalance = totalIncome - totalExpense

    // Group Item Balances Calculation
    const groupBalances = React.useMemo(() => {
        const groups = ["Cash", "Bank", "bKash", "Nagad"]
        return groups.map(item => {
            const income = data.filter(d => d.accountItem === item && d.type === "Income").reduce((sum, d) => sum + d.amount, 0)
            const expense = data.filter(d => d.accountItem === item && d.type === "Expense").reduce((sum, d) => sum + d.amount, 0)
            return {
                name: item,
                balance: income - expense
            }
        })
    }, [data])

    const columns: ColumnDef<CashbookEntry>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "accountItem",
            header: "Account",
            cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.getValue("accountItem")}</Badge>,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("type") as string
                return (
                    <Badge variant={type === "Income" ? "default" : "destructive"}>
                        {type}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
                const amount = row.getValue("amount") as number
                const type = row.original.type
                return (
                    <div className={`font-bold ${type === "Income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {type === "Income" ? "+" : "-"}${amount.toLocaleString()}
                    </div>
                )
            },
        },
        {
            accessorKey: "balanceAfter",
            header: "Running Balance",
            cell: ({ row }) => <div className="font-semibold">${(row.getValue("balanceAfter") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "date",
            header: "Date",
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingRecord) {
            setData(data.map(item => item.id === editingRecord.id ? { ...item, ...formData } as CashbookEntry : item))
            toast.success("Entry updated successfully")
        } else {
            const amount = Number(formData.amount) || 0
            const type = formData.type || "Income"
            const newBalance = type === "Income" ? currentBalance + amount : currentBalance - amount

            const newRecord: CashbookEntry = {
                id: `CB-${String(data.length + 1).padStart(3, '0')}`,
                title: formData.title || "",
                type: type as any,
                amount: amount,
                balanceAfter: newBalance,
                date: formData.date || new Date().toISOString().split('T')[0],
                category: formData.category || "General",
                accountItem: formData.accountItem || "Cash",
                remarks: formData.remarks || "",
            }
            setData([...data, newRecord])
            toast.success("Entry added to Cashbook")
        }
        setIsSheetOpen(false)
        setEditingRecord(null)
        setFormData({ type: "Income", category: "General", accountItem: "Cash" })
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <IconLayoutDashboard className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Accounts General</h1>
                        <p className="text-sm text-muted-foreground">Manage your general ledger and cashbook balance.</p>
                    </div>
                </div>
                <Button onClick={() => setIsSheetOpen(true)} className="gap-2">
                    <IconPlus className="size-4" /> Add Transaction
                </Button>
            </div>

            {/* Main Summary Section */}
            <div className="grid gap-6 lg:grid-cols-4">
                {/* Balance Cards */}
                <div className="lg:col-span-3 grid gap-4 md:grid-cols-3">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
                            <IconWallet className="size-4 opacity-90" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">${currentBalance.toLocaleString()}</div>
                            <div className="flex items-center gap-1 mt-1 opacity-80 text-[10px]">
                                <IconArrowUpRight className="size-3" />
                                <span>+2.4% from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <IconArrowUpRight className="size-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">${totalIncome.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Accumulated this month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expense</CardTitle>
                            <div className="p-2 bg-rose-500/10 rounded-lg">
                                <IconArrowDownRight className="size-4 text-rose-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600">${totalExpense.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Spent this month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Group Item Balance Summary */}
                <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            Group Item Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {groupBalances.map((group) => (
                                <div key={group.name} className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground font-medium">{group.name}</span>
                                    <span className={`text-sm font-bold ${group.balance >= 0 ? "text-foreground" : "text-rose-600"}`}>
                                        ${group.balance.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1">
                    <IconHistory className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold tracking-tight">Recent Activity Summary</h2>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    onEditClick={(record) => {
                        setEditingRecord(record)
                        setFormData(record)
                        setIsSheetOpen(true)
                    }}
                    onDelete={(record) => {
                        setData(data.filter(d => d.id !== record.id))
                        toast.success("Entry removed")
                    }}
                />
            </div>

            {/* Form Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <IconCoin className="size-5 text-primary" />
                            {editingRecord ? "Edit Transaction" : "New Transaction"}
                        </SheetTitle>
                        <SheetDescription>
                            Enter the details of the financial movement.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Transaction Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title || ""}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Office Supplies, Product Sale"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accountItem">Account Group</Label>
                                    <NativeSelect
                                        id="accountItem"
                                        value={formData.accountItem || "Cash"}
                                        onChange={e => setFormData({ ...formData, accountItem: e.target.value })}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank">Bank</option>
                                        <option value="bKash">bKash</option>
                                        <option value="Nagad">Nagad</option>
                                    </NativeSelect>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <NativeSelect
                                        id="type"
                                        value={formData.type || "Income"}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="Income">Income (+)</option>
                                        <option value="Expense">Expense (-)</option>
                                    </NativeSelect>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={formData.amount || ""}
                                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date || ""}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <NativeSelect
                                    id="category"
                                    value={formData.category || "General"}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Utility">Utility</option>
                                    <option value="Salary">Salary</option>
                                </NativeSelect>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks (Optional)</Label>
                                <Input
                                    id="remarks"
                                    value={formData.remarks || ""}
                                    onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t">
                            <Button className="flex-1" type="submit">
                                {editingRecord ? "Save Changes" : "Create Transaction"}
                            </Button>
                            <Button variant="outline" type="button" onClick={() => setIsSheetOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
