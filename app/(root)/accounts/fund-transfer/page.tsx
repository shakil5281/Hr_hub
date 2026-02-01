"use client"

import * as React from "react"
import {
    IconBuildingBank,
    IconArrowRight,
    IconCheck,
    IconX,
    IconClock,
    IconSend,
    IconDownload,
    IconTrendingUp,
    IconEdit
} from "@tabler/icons-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
type TransferStatus = "pending" | "approved" | "completed" | "rejected"
type BranchType = "Main Branch" | "Dhaka Branch" | "Chittagong Branch" | "Gazipur Factory"

interface TransferRequest {
    id: string
    fromBranch: BranchType
    toBranch: BranchType
    requestedAmount: number
    approvedAmount?: number
    reason: string
    status: TransferStatus
    requestDate: string
    approvedDate?: string
    completedDate?: string
}

// Mock Data
const initialRequests: TransferRequest[] = [
    {
        id: "TRF-001",
        fromBranch: "Dhaka Branch",
        toBranch: "Main Branch",
        requestedAmount: 50000,
        reason: "Urgent material procurement for Q1",
        status: "pending",
        requestDate: "2026-01-30 09:00 AM",
    },
    {
        id: "TRF-002",
        fromBranch: "Gazipur Factory",
        toBranch: "Main Branch",
        requestedAmount: 120000,
        approvedAmount: 100000,
        reason: "Monthly worker wages supplement",
        status: "approved",
        requestDate: "2026-01-29 10:30 AM",
        approvedDate: "2026-01-29 02:00 PM",
    },
    {
        id: "TRF-003",
        fromBranch: "Chittagong Branch",
        toBranch: "Main Branch",
        requestedAmount: 25000,
        approvedAmount: 25000,
        reason: "Office maintenance and utilities",
        status: "completed",
        requestDate: "2026-01-28 11:15 AM",
        approvedDate: "2026-01-28 01:00 PM",
        completedDate: "2026-01-28 03:45 PM",
    },
]

export default function FundTransferPage() {
    const [requests, setRequests] = React.useState<TransferRequest[]>(initialRequests)
    const [role, setRole] = React.useState<"branch" | "gm">("gm") // Simulator for Role

    // Form State
    const [requestAmount, setRequestAmount] = React.useState("")
    const [requestReason, setRequestReason] = React.useState("")
    const [selectedBranch, setSelectedBranch] = React.useState<BranchType>("Dhaka Branch")

    // GM Action State
    const [selectedRequest, setSelectedRequest] = React.useState<TransferRequest | null>(null)
    const [modifiedAmount, setModifiedAmount] = React.useState<number>(0)
    const [isReviewOpen, setIsReviewOpen] = React.useState(false)

    // Handlers
    const handleCreateRequest = () => {
        if (!requestAmount || !requestReason) {
            toast.error("Please fill in all fields")
            return
        }

        const newRequest: TransferRequest = {
            id: `TRF-${Math.floor(Math.random() * 10000)}`,
            fromBranch: selectedBranch,
            toBranch: "Main Branch",
            requestedAmount: Number(requestAmount),
            reason: requestReason,
            status: "pending",
            requestDate: new Date().toLocaleString(),
        }

        setRequests([newRequest, ...requests])
        toast.success("Fund request submitted successfully")
        setRequestAmount("")
        setRequestReason("")
    }

    const openReviewModal = (request: TransferRequest) => {
        setSelectedRequest(request)
        setModifiedAmount(request.requestedAmount)
        setIsReviewOpen(true)
    }

    const handleGMApproval = () => {
        if (!selectedRequest) return

        const updatedRequests = requests.map(req =>
            req.id === selectedRequest.id
                ? {
                    ...req,
                    status: "approved" as TransferStatus,
                    approvedAmount: modifiedAmount,
                    approvedDate: new Date().toLocaleString()
                }
                : req
        )

        setRequests(updatedRequests)
        setIsReviewOpen(false)

        // Simulate Notification
        toast.success(`Request approved for ${modifiedAmount.toLocaleString()} BDT`)
    }

    const handleGMRejection = () => {
        if (!selectedRequest) return
        const updatedRequests = requests.map(req =>
            req.id === selectedRequest.id
                ? { ...req, status: "rejected" as TransferStatus }
                : req
        )
        setRequests(updatedRequests)
        setIsReviewOpen(false)
        toast.info("Request rejected")
    }

    const handleBranchAcceptance = (id: string) => {
        const updatedRequests = requests.map(req =>
            req.id === id
                ? {
                    ...req,
                    status: "completed" as TransferStatus,
                    completedDate: new Date().toLocaleString()
                }
                : req
        )
        setRequests(updatedRequests)
        toast.success("Funds received and added to branch balance")
    }

    // Filtered Views
    const pendingGMReviews = requests.filter(r => r.status === "pending")
    const incomingToBranch = requests.filter(r => r.status === "approved") // Ready to receive
    const myHistory = requests // All requests for branch view

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Inter-Branch Fund Transfers</h1>
                <p className="text-muted-foreground">
                    Request funds, manage approvals, and track transaction status.
                </p>
            </div>

            {/* Role Simulator Toggle (For Demo Purpose) */}
            <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg w-fit">
                <span className="text-xs font-semibold px-2">Simulate View As:</span>
                <div className="flex bg-background rounded-md border p-0.5">
                    <Button
                        variant={role === "branch" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setRole("branch")}
                    >
                        Branch Manager
                    </Button>
                    <Button
                        variant={role === "gm" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setRole("gm")}
                    >
                        General Manager (GM)
                    </Button>
                </div>
            </div>

            {role === "branch" ? (
                /* ================= BRANCH MANAGER VIEW ================= */
                <Tabs defaultValue="request" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="request">New Request</TabsTrigger>
                        <TabsTrigger value="incoming">
                            Incoming Funds
                            {incomingToBranch.length > 0 && (
                                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500 text-[10px]">{incomingToBranch.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="history">Request History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="request">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Request Funds from HQ</CardTitle>
                                    <CardDescription>Submit a formal request for fund allocation.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Branch</Label>
                                        <Select value={selectedBranch} onValueChange={(v: string) => setSelectedBranch(v as BranchType)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dhaka Branch">Dhaka Branch</SelectItem>
                                                <SelectItem value="Chittagong Branch">Chittagong Branch</SelectItem>
                                                <SelectItem value="Gazipur Factory">Gazipur Factory</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Amount Required (BDT)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">৳</span>
                                            <Input
                                                type="number"
                                                className="pl-8"
                                                placeholder="0.00"
                                                value={requestAmount}
                                                onChange={(e) => setRequestAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reason / Note</Label>
                                        <Textarea
                                            placeholder="Explain why these funds are needed..."
                                            value={requestReason}
                                            onChange={(e) => setRequestReason(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleCreateRequest} className="w-full">
                                        <IconSend className="mr-2 size-4" /> Submit Request
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card className="bg-muted/10 border-dashed">
                                <CardHeader>
                                    <CardTitle className="text-base">Current Balance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">৳ 42,500.00</div>
                                    <p className="text-sm text-muted-foreground mt-1">Last updated: Just now</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="incoming">
                        <Card>
                            <CardHeader>
                                <CardTitle>Approved & In-Transit</CardTitle>
                                <CardDescription>Funds approved by GM. Please verify receipts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {incomingToBranch.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">No pending funds to receive.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {incomingToBranch.map((req) => (
                                            <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-emerald-50/50 border-emerald-100">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-emerald-500">Approved</Badge>
                                                        <span className="text-sm text-muted-foreground">{req.id}</span>
                                                    </div>
                                                    <div className="font-semibold text-lg flex items-center gap-2">
                                                        Requested: <span className="line-through text-muted-foreground text-sm">৳{req.requestedAmount.toLocaleString()}</span>
                                                        <IconArrowRight className="size-4" />
                                                        <span className="text-emerald-700">৳{req.approvedAmount?.toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{req.reason}</p>
                                                </div>
                                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleBranchAcceptance(req.id)}>
                                                    <IconDownload className="mr-2 size-4" /> Accept & Add to Balance
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <div className="space-y-4">
                                        {myHistory.map((req) => (
                                            <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{req.id}</span>
                                                        <Badge variant={req.status === 'completed' ? 'default' : req.status === 'pending' ? 'outline' : 'destructive'}>
                                                            {req.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{req.requestDate}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold">৳{req.requestedAmount.toLocaleString()}</div>
                                                    {req.approvedAmount && req.approvedAmount !== req.requestedAmount && (
                                                        <div className="text-xs text-muted-foreground">Approved: ৳{req.approvedAmount.toLocaleString()}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            ) : (
                /* ================= GM VIEW ================= */
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingGMReviews.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Disbursed (Today)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">৳ 145,000</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fund Requests Overview</CardTitle>
                            <CardDescription>Review and approve fund allocation requests from branches.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {requests.length === 0 ? (
                                    <div className="text-center py-10">No requests found.</div>
                                ) : (
                                    requests.map((req) => (
                                        <div key={req.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2 rounded-full mt-1 ${req.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                        req.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                                            req.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                                'bg-red-100 text-red-600'
                                                    }`}>
                                                    <IconBuildingBank className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold">{req.fromBranch}</h4>
                                                        <Badge variant="outline" className="capitalize">{req.status}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">Requested: <span className="font-medium text-foreground">৳{req.requestedAmount.toLocaleString()}</span></p>
                                                    <p className="text-xs text-muted-foreground">{req.reason} • {req.requestDate}</p>
                                                </div>
                                            </div>

                                            {req.status === 'pending' && (
                                                <Button onClick={() => openReviewModal(req)} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                                    Review Request
                                                </Button>
                                            )}
                                            {req.status === 'approved' && (
                                                <div className="text-right">
                                                    <span className="text-xs font-medium text-blue-600">Waiting for Branch Acceptance</span>
                                                    <div className="text-sm font-bold">Approved: ৳{req.approvedAmount?.toLocaleString()}</div>
                                                </div>
                                            )}
                                            {req.status === 'completed' && (
                                                <div className="text-right">
                                                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 justify-end">
                                                        <IconCheck className="size-3" /> Completed
                                                    </span>
                                                    <div className="text-sm font-bold">Paid: ৳{req.approvedAmount?.toLocaleString()}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* GM Review Modal */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review Fund Request</DialogTitle>
                        <DialogDescription>
                            Review the request details and authorize the exact amount to be transferred.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Branch</span>
                                    <span className="font-medium">{selectedRequest.fromBranch}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Request ID</span>
                                    <span className="font-medium">{selectedRequest.id}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-muted-foreground block">Reason</span>
                                    <span className="font-medium">{selectedRequest.reason}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>Requested Amount</Label>
                                <div className="text-lg font-bold">৳ {selectedRequest.requestedAmount.toLocaleString()}</div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="approved-amount">Authorized Amount (Editable)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">৳</span>
                                    <Input
                                        id="approved-amount"
                                        type="number"
                                        className="pl-8 font-semibold"
                                        value={modifiedAmount}
                                        onChange={(e) => setModifiedAmount(Number(e.target.value))}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    You can approve a partial amount or increase it if necessary.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={handleGMRejection} className="text-destructive hover:bg-destructive/10">
                            Reject Request
                        </Button>
                        <Button onClick={handleGMApproval} className="bg-emerald-600 hover:bg-emerald-700">
                            Approve & Transfer ৳{modifiedAmount.toLocaleString()}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
