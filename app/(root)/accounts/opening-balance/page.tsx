"use client"

import * as React from "react"
import {
    IconDoorEnter,
    IconPlus,
    IconHistory,
    IconBuildingBank,
    IconWallet,
    IconDeviceMobile,
    IconTrash,
    IconEdit
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

type OpeningBalanceEntry = {
    id: string
    accountName: string
    category: "Cash" | "Bank" | "Mobile Banking" | "Other"
    amount: number
    date: string
    remarks: string
}

const initialBalances: OpeningBalanceEntry[] = [
    { id: "OB-001", accountName: "Main Cash", category: "Cash", amount: 50000, date: "2026-01-01", remarks: "System startup cash" },
    { id: "OB-002", accountName: "Dutch Bangla Bank", category: "Bank", amount: 250000, date: "2026-01-01", remarks: "Main operating account" },
    { id: "OB-003", accountName: "bKash Merchant", category: "Mobile Banking", amount: 15000, date: "2026-01-01", remarks: "Digital collections" },
]

import { openingBalanceService, OpeningBalance } from "@/lib/services/opening-balance"

export default function OpeningBalancePage() {
    const [balances, setBalances] = React.useState<OpeningBalance[]>([])
    const [formData, setFormData] = React.useState<Partial<OpeningBalance>>({
        category: "Cash",
        date: new Date().toISOString().split('T')[0]
    })
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchBalances = async () => {
        try {
            setIsLoading(true)
            const data = await openingBalanceService.getBalances()
            setBalances(data)
        } catch (error) {
            toast.error("Failed to fetch balances")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchBalances()
    }, [])

    const totalOpening = balances.reduce((sum, item) => sum + item.amount, 0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.accountName || !formData.amount) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            if (editingId) {
                await openingBalanceService.updateBalance(editingId, formData as OpeningBalance)
                toast.success("Opening balance updated successfully")
            } else {
                await openingBalanceService.createBalance(formData as OpeningBalance)
                toast.success("Opening balance recorded successfully")
            }
            setFormData({ category: "Cash", date: new Date().toISOString().split('T')[0] })
            setEditingId(null)
            fetchBalances()
        } catch (error) {
            toast.error("Failed to save opening balance")
        }
    }

    const startEdit = (entry: OpeningBalance) => {
        setFormData({
            ...entry,
            date: entry.date.split('T')[0]
        })
        setEditingId(entry.id || null)
    }

    const deleteEntry = async (id: number) => {
        if (confirm("Are you sure you want to delete this entry?")) {
            try {
                await openingBalanceService.deleteBalance(id)
                toast.success("Entry removed")
                fetchBalances()
            } catch (error) {
                toast.error("Failed to delete entry")
            }
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <IconDoorEnter className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Account Opening Balance</h1>
                        <p className="text-sm text-muted-foreground">Set initial balances for your accounts to begin financial tracking.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Entry Form */}
                <Card className="border-none shadow-md h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">New Opening Balance</CardTitle>
                        <CardDescription>Enter account details and starting amount.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account/Bank Name</Label>
                                <Input
                                    id="accountName"
                                    placeholder="e.g., City Bank - 1029..."
                                    value={formData.accountName || ""}
                                    onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <NativeSelect
                                        id="category"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank">Bank</option>
                                        <option value="Mobile Banking">Mobile Banking</option>
                                        <option value="Other">Other</option>
                                    </NativeSelect>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Opening Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.amount || ""}
                                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Balance Effective Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks (Optional)</Label>
                                <Input
                                    id="remarks"
                                    placeholder="Source of funds, notes..."
                                    value={formData.remarks || ""}
                                    onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2 mt-2">
                                <IconPlus className="size-4" /> {editingId ? "Update" : "Save"} Opening Balance
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Right Side: Summary and List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-none shadow-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium opacity-90">Total Opening Value</CardTitle>
                                <IconWallet className="size-4 opacity-90" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">${totalOpening.toLocaleString()}</div>
                                <p className="text-[10px] opacity-80 mt-1">Consolidated initial capital</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Accounts Setup</CardTitle>
                                <IconBuildingBank className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{balances.length}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Total linked financial items</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Historical List */}
                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <IconHistory className="size-5 text-muted-foreground" />
                                    Opening Balance Records
                                </CardTitle>
                                <CardDescription>List of all initial account balances set in the system.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Account Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Opening Balance</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {balances.map((balance) => (
                                        <TableRow key={balance.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{balance.accountName}</span>
                                                    <span className="text-[10px] text-muted-foreground">{balance.remarks || "No remarks"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 capitalize text-xs bg-muted px-2 py-0.5 rounded-full w-fit">
                                                    {balance.category === "Cash" && <IconWallet size={12} className="text-amber-600" />}
                                                    {balance.category === "Bank" && <IconBuildingBank size={12} className="text-blue-600" />}
                                                    {balance.category === "Mobile Banking" && <IconDeviceMobile size={12} className="text-rose-600" />}
                                                    {balance.category}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">{balance.date}</TableCell>
                                            <TableCell className="text-right font-bold text-emerald-600">
                                                ${balance.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => startEdit(balance)}>
                                                        <IconEdit className="size-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => balance.id && deleteEntry(balance.id)}>
                                                        <IconTrash className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {balances.length === 0 && (
                                <div className="py-10 text-center text-muted-foreground">
                                    No opening balances recorded yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
