"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconArrowLeft,
    IconUpload,
    IconFileSpreadsheet,
    IconAlertCircle,
    IconCircleCheck,
    IconInfoCircle,
    IconLoader2
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { organogramService, ImportResult } from "@/lib/services/organogram"

export default function ImportOrganogramPage() {
    const router = useRouter()
    const [file, setFile] = React.useState<File | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const [result, setResult] = React.useState<ImportResult | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
            setFile(droppedFile)
            setResult(null)
        } else {
            toast.error("Please upload a valid Excel file (.xlsx or .xls)")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setResult(null)
        }
    }

    const handleDownloadTemplate = async () => {
        try {
            await organogramService.downloadTemplate()
            toast.success("Template downloaded successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to download template")
        }
    }

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file to upload")
            return
        }

        setIsUploading(true)
        try {
            const importResult = await organogramService.importFromExcel(file)
            setResult(importResult)

            if (importResult.errorCount === 0 && importResult.warningCount === 0) {
                toast.success(`Import successful! Created ${importResult.createdCount}, Updated ${importResult.updatedCount}`)
            } else if (importResult.errorCount > 0) {
                toast.error(`Import completed with ${importResult.errorCount} errors`)
            } else {
                toast.success(`Import completed with ${importResult.warningCount} warnings`)
            }
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Failed to import data"
            toast.error(message)
        } finally {
            setIsUploading(false)
        }
    }

    const successRate = result ? (result.successCount / result.totalRows) * 100 : 0

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-5xl mx-auto w-full mb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <IconArrowLeft className="size-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Import Company Organogram</h1>
                    <p className="text-sm text-muted-foreground">Upload Excel file to import departments, sections, designations, and lines</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Instructions */}
                <Alert className="border-blue-200 bg-blue-50/50">
                    <IconInfoCircle className="size-5 text-blue-600" />
                    <AlertTitle className="text-blue-900">Before You Begin</AlertTitle>
                    <AlertDescription className="text-blue-800">
                        <ol className="list-decimal list-inside space-y-1 mt-2">
                            <li>Download the Excel template by clicking the button below</li>
                            <li>Fill in your organizational data (Company, Department, Section, Designation, Line)</li>
                            <li>Upload the completed file using the upload area</li>
                            <li>If duplicate names are found, they will be updated instead of creating duplicates</li>
                        </ol>
                    </AlertDescription>
                </Alert>

                {/* Download Template */}
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                        <CardTitle className="text-green-900 flex items-center gap-2">
                            <IconFileSpreadsheet className="size-5" />
                            Step 1: Download Template
                        </CardTitle>
                        <CardDescription className="text-green-700">
                            Get the standardized Excel template with sample data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleDownloadTemplate}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <IconFileSpreadsheet className="size-4" />
                            Download Excel Template
                        </Button>
                    </CardContent>
                </Card>

                {/* Upload File */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconUpload className="size-5 text-primary" />
                            Step 2: Upload Completed File
                        </CardTitle>
                        <CardDescription>
                            Select or drag & drop your Excel file here
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
                                    ? 'border-primary bg-primary/5'
                                    : file
                                        ? 'border-green-500 bg-green-50/50'
                                        : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className={`size-16 rounded-full flex items-center justify-center ${file ? 'bg-green-100' : 'bg-muted'
                                    }`}>
                                    {file ? (
                                        <IconCircleCheck className="size-8 text-green-600" />
                                    ) : (
                                        <IconUpload className="size-8 text-muted-foreground" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="space-y-2">
                                        <p className="font-medium text-green-700">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFile(null)}
                                            className="mt-2"
                                        >
                                            Remove File
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-lg font-medium">Drag & drop your Excel file here</p>
                                        <p className="text-sm text-muted-foreground">or click to browse</p>
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload">
                                            <Button variant="outline" className="cursor-pointer mt-2" asChild>
                                                <span>Browse Files</span>
                                            </Button>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="w-full h-12 text-base gap-2 bg-[#108545] hover:bg-[#0d6e39]"
                        >
                            {isUploading ? (
                                <>
                                    <IconLoader2 className="size-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <IconUpload className="size-5" />
                                    Upload & Import Data
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {result && (
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <IconCircleCheck className="size-5 text-green-600" />
                                Import Results
                            </CardTitle>
                            <CardDescription>Summary of the import operation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-600 font-medium">Total Rows</p>
                                    <p className="text-2xl font-bold text-blue-900">{result.totalRows}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-600 font-medium">Created</p>
                                    <p className="text-2xl font-bold text-green-900">{result.createdCount}</p>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-600 font-medium">Updated</p>
                                    <p className="text-2xl font-bold text-amber-900">{result.updatedCount}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <p className="text-sm text-red-600 font-medium">Errors</p>
                                    <p className="text-2xl font-bold text-red-900">{result.errorCount}</p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Success Rate</span>
                                    <span className="font-medium">{successRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={successRate} className="h-2" />
                            </div>

                            {/* Errors */}
                            {result.errors.length > 0 && (
                                <Alert variant="destructive">
                                    <IconAlertCircle className="size-5" />
                                    <AlertTitle>Errors ({result.errors.length})</AlertTitle>
                                    <AlertDescription>
                                        <ul className="mt-2 space-y-1 text-sm max-h-60 overflow-y-auto">
                                            {result.errors.map((error, idx) => (
                                                <li key={idx} className="flex gap-2">
                                                    <span className="font-medium">Row {error.rowNumber}:</span>
                                                    <span>{error.field} - {error.message}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Warnings */}
                            {result.warnings.length > 0 && (
                                <Alert className="border-amber-200 bg-amber-50/50">
                                    <IconInfoCircle className="size-5 text-amber-600" />
                                    <AlertTitle className="text-amber-900">Warnings ({result.warnings.length})</AlertTitle>
                                    <AlertDescription className="text-amber-800">
                                        <ul className="mt-2 space-y-1 text-sm max-h-60 overflow-y-auto">
                                            {result.warnings.map((warning, idx) => (
                                                <li key={idx}>
                                                    <span className="font-medium">Row {warning.rowNumber}:</span> {warning.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => router.back()} className="flex-1">
                                    Back to Organogram
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        setFile(null)
                                        setResult(null)
                                    }}
                                    className="flex-1 bg-[#108545] hover:bg-[#0d6e39]"
                                >
                                    Import Another File
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
