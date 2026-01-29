"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { IconPrinter, IconSearch } from "@tabler/icons-react"

export default function PaySlipPage() {
    return (
        <div className="p-6 space-y-6 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Pay Slip Generation</h1>
            </div>

            <Card className="p-4 flex gap-4 items-end">
                <div className="grid gap-2 flex-1">
                    <label className="text-sm font-medium">Employee ID</label>
                    <Input placeholder="Enter Employee ID (e.g. EMP001)" />
                </div>
                <div className="grid gap-2 flex-1">
                    <label className="text-sm font-medium">Month</label>
                    <Input type="month" />
                </div>
                <Button>
                    <IconSearch className="size-4 mr-2" />
                    Find
                </Button>
            </Card>

            <div className="border rounded-lg bg-white p-8 shadow-sm min-h-[500px]">
                {/* Mock Payslip Visual */}
                <div className="flex justify-between border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-xl font-bold">HRHub Inc.</h2>
                        <p className="text-sm text-gray-500">123 Corporate Blvd, City</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-lg font-semibold">PAY SLIP</h3>
                        <p className="text-sm">May 2024</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-1 text-sm">
                        <p><span className="font-semibold">Employee Name:</span> John Doe</p>
                        <p><span className="font-semibold">Designation:</span> Software Engineer</p>
                        <p><span className="font-semibold">Department:</span> Engineering</p>
                    </div>
                    <div className="space-y-1 text-sm text-right">
                        <p><span className="font-semibold">Emp ID:</span> EMP001</p>
                        <p><span className="font-semibold">Date Paid:</span> 2024-05-30</p>
                        <p><span className="font-semibold">Bank Acc:</span> **** 1234</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-medium bg-gray-100 p-2 mb-2">Earnings</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Basic Salary</span> <span>30,000</span></div>
                            <div className="flex justify-between"><span>HRA</span> <span>15,000</span></div>
                            <div className="flex justify-between"><span>Medical</span> <span>5,000</span></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium bg-gray-100 p-2 mb-2">Deductions</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Tax</span> <span>2,000</span></div>
                            <div className="flex justify-between"><span>Provident Fund</span> <span>1,500</span></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Computer generated slip.
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">Net Payable</p>
                        <p className="text-2xl font-bold">$46,500</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button variant="outline">
                    <IconPrinter className="size-4 mr-2" />
                    Print / Download PDF
                </Button>
            </div>
        </div>
    )
}
