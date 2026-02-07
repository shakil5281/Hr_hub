"use client"

import * as React from "react"
import { IconClipboardList, IconPrinter, IconDownload, IconScale } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const balanceSheetData = {
    assets: {
        current: [
            { name: "Cash and Equivalents", amount: 45000 },
            { name: "Accounts Receivable", amount: 35000 },
            { name: "Inventory", amount: 75000 },
            { name: "Prepaid Expenses", amount: 5000 },
        ],
        nonCurrent: [
            { name: "Property & Equipment", amount: 150000 },
            { name: "Intangible Assets", amount: 20000 },
            { name: "Accumulated Depreciation", amount: -50000 },
        ]
    },
    liabilities: {
        current: [
            { name: "Accounts Payable", amount: 25000 },
            { name: "Accrued Expenses", amount: 10000 },
            { name: "Short-term Loans", amount: 15000 },
        ],
        longTerm: [
            { name: "Long-term Debt", amount: 65000 },
        ]
    },
    equity: [
        { name: "Retained Earnings", amount: 115000 },
        { name: "Common Stock", amount: 50000 },
    ]
}

export default function BalanceSheetPage() {
    const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, item) => sum + item.amount, 0)
    const totalNonCurrentAssets = balanceSheetData.assets.nonCurrent.reduce((sum, item) => sum + item.amount, 0)
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets

    const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, item) => sum + item.amount, 0)
    const totalLongTermLiabilities = balanceSheetData.liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0)
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities

    const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0)
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-8 bg-muted/5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                        <IconClipboardList className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Balance Sheet</h1>
                        <p className="text-sm text-muted-foreground">As of Feb 06, 2026</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <IconPrinter className="mr-2 size-4" /> Print
                    </Button>
                    <Button size="sm" className="h-9">
                        <IconDownload className="mr-2 size-4" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Assets Side */}
                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-emerald-500/5">
                        <CardTitle className="text-emerald-700">Assets</CardTitle>
                        <CardDescription>What the company owns</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Current Assets */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Assets</h4>
                            {balanceSheetData.assets.current.map((item) => (
                                <div key={item.name} className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between font-bold text-sm">
                                <span>Total Current Assets</span>
                                <span>${totalCurrentAssets.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Non-Current Assets */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Non-Current Assets</h4>
                            {balanceSheetData.assets.nonCurrent.map((item) => (
                                <div key={item.name} className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span className={`font-medium ${item.amount < 0 ? 'text-rose-600' : ''}`}>
                                        ${item.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between font-bold text-sm">
                                <span>Total Non-Current Assets</span>
                                <span>${totalNonCurrentAssets.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Total Assets Footer */}
                        <div className="mt-8 p-4 rounded-xl bg-emerald-600 text-white flex justify-between items-center shadow-lg">
                            <span className="font-bold text-lg">Total Assets</span>
                            <span className="font-bold text-2xl">${totalAssets.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Liabilities & Equity Side */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-rose-500/5">
                            <CardTitle className="text-rose-700">Liabilities & Equity</CardTitle>
                            <CardDescription>What the company owes</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Current Liabilities */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Liabilities</h4>
                                {balanceSheetData.liabilities.current.map((item) => (
                                    <div key={item.name} className="flex justify-between text-sm">
                                        <span>{item.name}</span>
                                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-sm">
                                    <span>Total Current Liabilities</span>
                                    <span>${totalCurrentLiabilities.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Long-Term Liabilities */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Long-Term Liabilities</h4>
                                {balanceSheetData.liabilities.longTerm.map((item) => (
                                    <div key={item.name} className="flex justify-between text-sm">
                                        <span>{item.name}</span>
                                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-sm">
                                    <span>Total Long-Term Liabilities</span>
                                    <span>${totalLongTermLiabilities.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Stockholders' Equity */}
                            <div className="space-y-3 pt-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stockholders' Equity</h4>
                                {balanceSheetData.equity.map((item) => (
                                    <div key={item.name} className="flex justify-between text-sm">
                                        <span>{item.name}</span>
                                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-sm">
                                    <span>Total Equity</span>
                                    <span>${totalEquity.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Total Liabilities & Equity Footer */}
                            <div className="mt-8 p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center shadow-lg">
                                <div className="flex items-center gap-2">
                                    <IconScale className="size-5 text-violet-400" />
                                    <span className="font-bold text-lg">Total Liabilities & Equity</span>
                                </div>
                                <span className="font-bold text-2xl">${totalLiabilitiesAndEquity.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Audit Check */}
                    <div className={`p-4 rounded-xl flex items-center justify-center gap-3 font-bold ${totalAssets === totalLiabilitiesAndEquity ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200' : 'bg-rose-500/10 text-rose-700 border border-rose-200'}`}>
                        {totalAssets === totalLiabilitiesAndEquity ? '✓ Balance Sheet is Balanced' : '⚠ Balance Sheet is Not Balanced'}
                    </div>
                </div>
            </div>
        </div>
    )
}
