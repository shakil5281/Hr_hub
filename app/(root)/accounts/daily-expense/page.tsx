"use client"

import * as React from "react"
import { IconCash, IconFilter, IconFileTypePdf, IconFileSpreadsheet } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { NativeSelect } from "@/components/ui/select"
import { accountsService, CashTransaction } from "@/lib/services/accounts"
import { companyService, Company } from "@/lib/services/company"
import { DatePicker } from "@/components/ui/date-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { startOfMonth, endOfMonth, format, setMonth, setYear } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { TableRow, TableCell } from "@/components/ui/table"

export default function DailyExpensePage() {
    const [data, setData] = React.useState<CashTransaction[]>([])
    const [companies, setCompanies] = React.useState<Company[]>([])
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [editingRecord, setEditingRecord] = React.useState<CashTransaction | null>(null)
    const [formData, setFormData] = React.useState<Partial<CashTransaction>>({
        transactionDate: new Date().toISOString().split('T')[0],
        paymentMethod: "Cash",
        branch: "",
        description: "",
        referenceNumber: ""
    })
    const [isLoading, setIsLoading] = React.useState(true)

    // Filter State
    const [filters, setFilters] = React.useState({
        month: String(new Date().getMonth() + 1),
        year: String(new Date().getFullYear()),
        dateRange: {
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date())
        } as DateRange | undefined
    })

    const fetchInitialData = async () => {
        try {
            setIsLoading(true)
            const params: any = { type: "Expense" }

            if (filters.dateRange?.from) {
                params.fromDate = format(filters.dateRange.from, "yyyy-MM-dd")
            }
            if (filters.dateRange?.to) {
                params.toDate = format(filters.dateRange.to, "yyyy-MM-dd")
            }

            const [transactions, companyList] = await Promise.all([
                accountsService.getTransactions(params),
                companyService.getAll()
            ])
            setData(transactions)
            setCompanies(companyList)
            if (companyList.length > 0 && !formData.branch) {
                setFormData(prev => ({ ...prev, branch: companyList[0].companyNameEn }))
            }
        } catch (error) {
            toast.error("Failed to fetch data")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchInitialData()
    }, [filters.dateRange])

    const handleMonthChange = (month: string) => {
        const m = parseInt(month) - 1
        const currentFrom = filters.dateRange?.from || new Date()
        const newDate = setMonth(currentFrom, m)
        setFilters(prev => ({
            ...prev,
            month,
            dateRange: {
                from: startOfMonth(newDate),
                to: endOfMonth(newDate)
            }
        }))
    }

    const handleYearChange = (year: string) => {
        const y = parseInt(year)
        const currentFrom = filters.dateRange?.from || new Date()
        const newDate = setYear(currentFrom, y)
        setFilters(prev => ({
            ...prev,
            year,
            dateRange: {
                from: startOfMonth(newDate),
                to: endOfMonth(newDate)
            }
        }))
    }

    const columns: ColumnDef<CashTransaction>[] = [
        {
            id: "sl",
            header: "SL",
            cell: ({ row }) => <div className="text-xs">{row.index + 1}</div>,
        },
        {
            accessorKey: "transactionDate",
            header: "Date",
            cell: ({ row }) => <div>{new Date(row.original.transactionDate).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <div className="font-bold text-red-600">৳{(row.getValue("amount") as number).toLocaleString()}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div className="max-w-[200px] truncate" title={row.original.description}>{row.original.description || "-"}</div>
        },
        {
            accessorKey: "paymentMethod",
            header: "Method",
        },
        {
            accessorKey: "branch",
            header: "Branch",
        },
        {
            accessorKey: "referenceNumber",
            header: "Ref No",
        }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingRecord && editingRecord.id) {
                await accountsService.updateTransaction(editingRecord.id, formData as CashTransaction)
                toast.success("Expense updated successfully")
            } else {
                await accountsService.expenseCash({ ...formData, transactionType: "Expense", referenceNumber: formData.referenceNumber || "N/A" } as CashTransaction)
                toast.success("Expense recorded successfully")
            }
            fetchInitialData()
            setIsSheetOpen(false)
            setFormData({
                transactionDate: new Date().toISOString().split('T')[0],
                paymentMethod: "Cash",
                branch: companies[0]?.companyNameEn || "",
                transactionType: "Expense",
                description: "",
                referenceNumber: "N/A"
            })
        } catch (error) {
            toast.error("Failed to save expense")
        }
    }

    const startEdit = (record: CashTransaction) => {
        setEditingRecord(record)
        setFormData({
            ...record,
            transactionDate: new Date(record.transactionDate).toISOString().split('T')[0]
        })
        setIsSheetOpen(true)
    }

    const handleDelete = async (record: CashTransaction) => {
        if (!record.id) return
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await accountsService.deleteTransaction(record.id)
                toast.success("Expense deleted successfully")
                fetchInitialData()
            } catch (error) {
                toast.error("Failed to delete expense")
            }
        }
    }

    const totalAmount = React.useMemo(() => {
        return data.reduce((sum, item) => sum + (item.amount || 0), 0)
    }, [data])

    const handleExportExcel = async () => {
        const params: any = { type: "Expense" }
        if (filters.dateRange?.from) params.fromDate = format(filters.dateRange.from, "yyyy-MM-dd")
        if (filters.dateRange?.to) params.toDate = format(filters.dateRange.to, "yyyy-MM-dd")
        await accountsService.exportExcel(params)
    }

    const handleExportPdf = async () => {
        const params: any = { type: "Expense" }
        if (filters.dateRange?.from) params.fromDate = format(filters.dateRange.from, "yyyy-MM-dd")
        if (filters.dateRange?.to) params.toDate = format(filters.dateRange.to, "yyyy-MM-dd")
        await accountsService.exportPdf(params)
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center gap-2 px-4 lg:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <IconCash className="size-6 text-red-600" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Daily Expense</h1>
                    <p className="text-sm text-muted-foreground">
                        Track daily company expenses and payments.
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-9 gap-2">
                        <IconFileSpreadsheet className="size-4 text-green-600" />
                        <span className="hidden sm:inline">Excel</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPdf} className="h-9 gap-2">
                        <IconFileTypePdf className="size-4 text-red-600" />
                        <span className="hidden sm:inline">PDF</span>
                    </Button>
                </div>
            </div>

            {/* Quick Filter Section */}
            <Card className="mx-4 lg:mx-6 border-none shadow-sm bg-muted/20">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <IconFilter className="size-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">Quick Filters:</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Month</Label>
                            <NativeSelect
                                className="h-9 text-xs w-32"
                                value={filters.month}
                                onChange={(e) => handleMonthChange(e.target.value)}
                            >
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                                    <option key={m} value={String(i + 1)}>{m}</option>
                                ))}
                            </NativeSelect>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Year</Label>
                            <NativeSelect
                                className="h-9 text-xs w-24"
                                value={filters.year}
                                onChange={(e) => handleYearChange(e.target.value)}
                            >
                                {[2023, 2024, 2025, 2026, 2027].map(y => (
                                    <option key={y} value={String(y)}>{y}</option>
                                ))}
                            </NativeSelect>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Date Range</Label>
                            <DateRangePicker
                                className="w-64"
                                date={filters.dateRange}
                                setDate={(d) => setFilters(prev => ({ ...prev, dateRange: d }))}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-9"
                            onClick={() => {
                                setFilters({
                                    month: String(new Date().getMonth() + 1),
                                    year: String(new Date().getFullYear()),
                                    dateRange: {
                                        from: startOfMonth(new Date()),
                                        to: endOfMonth(new Date())
                                    }
                                })
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <DataTable
                data={data}
                columns={columns}
                addLabel="New Expense Entry"
                onAddClick={() => {
                    setEditingRecord(null)
                    setFormData({
                        transactionDate: new Date().toISOString().split('T')[0],
                        paymentMethod: "Cash",
                        branch: companies[0]?.companyNameEn || "",
                        transactionType: "Expense",
                        description: "",
                        referenceNumber: "N/A"
                    })
                    setIsSheetOpen(true)
                }}
                onEditClick={startEdit}
                onDelete={handleDelete}
                showTabs={true}
                enableSelection={true}
                enableDrag={true}
                isLoading={isLoading}
                footer={
                    <TableRow className="bg-muted/50 font-bold text-sm">
                        <TableCell colSpan={4} className="text-right">Total Expenses:</TableCell>
                        <TableCell className="text-red-600 text-base underline decoration-double tracking-wider">৳{totalAmount.toLocaleString()}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                }
            />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{editingRecord ? "Edit Expense" : "New Expense Entry"}</SheetTitle>
                        <SheetDescription>
                            {editingRecord ? "Modify the expense details." : "Enter details for the new expense payment."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="date">Date</Label>
                            <DatePicker
                                date={formData.transactionDate ? new Date(formData.transactionDate) : undefined}
                                setDate={(date) => setFormData({ ...formData, transactionDate: date?.toISOString() })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount || ""}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Expense Details)</Label>
                            <Input
                                id="description"
                                value={formData.description || ""}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="method">Payment Method</Label>
                            <NativeSelect
                                id="method"
                                value={formData.paymentMethod || "Cash"}
                                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Mobile Money">Mobile Money</option>
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch">Branch (Company)</Label>
                            <NativeSelect
                                id="branch"
                                value={formData.branch || ""}
                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.companyNameEn}>
                                        {c.companyNameEn}
                                    </option>
                                ))}
                                {companies.length === 0 && <option value="">No companies found</option>}
                            </NativeSelect>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="referenceNumber">Reference Number</Label>
                            <Input
                                id="referenceNumber"
                                value={formData.referenceNumber || ""}
                                onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                                placeholder="Ref No..."
                            />
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingRecord ? "Save Changes" : "Record Expense"}</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
