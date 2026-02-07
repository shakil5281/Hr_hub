"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  NativeSelect,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toast } from "sonner"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

// --- Context ---
const DataTableContext = React.createContext<{
  onEditClick?: (row: unknown) => void;
  onDelete?: (row: unknown) => void;
}>({})

// --- Components ---

export function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export function DraggableRow<TData extends { id?: string | number }>({ row }: { row: Row<TData> }) {
  const rowId = row.original.id || row.id;
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: rowId as UniqueIdentifier,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable<TData extends { id?: string | number }>({
  data: initialData,
  columns,
  showTabs = true,
  showActions = true,
  showColumnCustomizer = true,
  enableSelection = false,
  enableDrag = false,
  onAddClick,
  onEditClick,
  onDelete,
  onDeleteSelected,
  addLabel = "Add New",
  searchKey,
  filterKey,
  tabs,
  filters,
  isLoading = false,
  getRowId,
  onSelectionChange,
  footer,
}: {
  data: TData[]
  columns: ColumnDef<TData>[]
  showTabs?: boolean
  showActions?: boolean
  showColumnCustomizer?: boolean
  enableSelection?: boolean
  enableDrag?: boolean
  onAddClick?: () => void
  onEditClick?: (row: TData) => void
  onDelete?: (row: TData) => void
  onDeleteSelected?: (selectedRows: TData[]) => void
  addLabel?: string
  searchKey?: string
  filterKey?: string
  tabs?: { value: string; label: string; count?: number }[]
  filters?: {
    columnId: string
    title: string
    options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]
  }[]
  isLoading?: boolean
  getRowId?: (row: TData) => string
  onSelectionChange?: (selectedRows: TData[]) => void
  footer?: React.ReactNode
}) {
  const [data, setData] = React.useState(() => initialData)
  const [activeTab, setActiveTab] = React.useState("all")

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const tableColumns = React.useMemo(() => {
    const hasSelection = columns.some(c => c.id === 'select');
    const hasActions = columns.some(c => c.id === 'actions');
    const hasDrag = columns.some(c => c.id === 'drag');

    const result = [...columns];

    if (!hasActions && showActions) {
      result.push(getActionsColumn<TData>());
    }

    const base = getBaseColumns<TData>();
    if (!hasSelection && enableSelection) {
      result.unshift(base[1]);
    }
    if (!hasDrag && enableDrag) {
      result.unshift(base[0]);
    }

    return result;
  }, [columns, showActions, enableSelection, enableDrag]);

  const [rowSelection, setRowSelection] = React.useState({})
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fix for infinite loop: Use ref for onSelectionChange to avoid dependency cycle
  const onSelectionChangeRef = React.useRef(onSelectionChange)
  React.useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange
  }, [onSelectionChange])

  React.useEffect(() => {
    if (onSelectionChangeRef.current) {
      const selectedRows = Object.keys(rowSelection).map(id => {
        return data.find(item => {
          const itemId = (item.id || (item as any).leaveTypeId || "").toString()
          return itemId === id
        })
      }).filter(Boolean) as TData[]

      // Only fire if the selection count matches to avoid excessive updates during hydration
      // or check deep equality if needed, but for now breaking the loop is priority.
      onSelectionChangeRef.current(selectedRows)
    }
  }, [rowSelection, data])

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((row, index) => ((row.id || (row as any).leaveTypeId || index).toString()) as UniqueIdentifier) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) => {
      if (getRowId) return getRowId(row)
      return (row as any).id?.toString() || (row as any).leaveTypeId?.toString() || index.toString()
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const isFiltered = table.getState().columnFilters.length > 0


  // Handle Tab Filtering
  React.useEffect(() => {
    if (!filterKey) return

    const column = table.getColumn(filterKey)
    if (!column) return

    if (activeTab === "all") {
      column.setFilterValue(undefined)
    } else {
      // Handle boolean strings from tabs
      const filterValue = activeTab === "true" ? true : activeTab === "false" ? false : activeTab
      column.setFilterValue(filterValue)
    }
  }, [activeTab, filterKey, table])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  const tableContent = (
    <div className="flex flex-col gap-4 overflow-auto px-4">
      <div className="overflow-hidden rounded-md border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-10 **:data-[slot=table-cell]:nth-child(2):w-10">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {tableColumns.map((col, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {footer && <TableFooter>{footer}</TableFooter>}
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <NativeSelect
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 py-0"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DataTableContext.Provider value={{
      onEditClick: onEditClick as (row: unknown) => void,
      onDelete: onDelete as (row: unknown) => void
    }}>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between px-4 gap-4">
          <div className="flex flex-1 items-center gap-2">
            {searchKey && (
              <Input
                placeholder="Search..."
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="max-w-xs h-9"
              />
            )}
            {filters?.map((filter) => (
              table.getColumn(filter.columnId) && (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={table.getColumn(filter.columnId)}
                  title={filter.title}
                  options={filter.options}
                />
              )
            ))}
            {showTabs && (
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-3 text-xs">All</TabsTrigger>
                {tabs?.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="px-3 text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.resetColumnFilters()}
                className="h-8 text-destructive"
              >
                Reset
                <IconTrash className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          {showActions && (
            <div className="flex items-center gap-2 ml-auto">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <IconTrash className="size-4" />
                      <span>Delete ({table.getFilteredSelectedRowModel().rows.length})</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Delete {table.getFilteredSelectedRowModel().rows.length} selected records?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          const rows = table.getFilteredSelectedRowModel().rows.map(r => r.original);
                          onDeleteSelected?.(rows);
                          setRowSelection({});
                          toast.success("Records deleted successfully");
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {onAddClick && (
                <Button size="sm" className="gap-2" onClick={onAddClick}>
                  <IconPlus className="size-4" />
                  <span>{addLabel}</span>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="m-0 border-0 p-0 shadow-none">
          {tableContent}
        </div>
      </Tabs>
    </DataTableContext.Provider>
  )
}

// --- Column Helpers ---
export function getBaseColumns<TData extends { id?: string | number }>(): ColumnDef<TData>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={(row.original.id || (row.original as any).leaveTypeId || row.id) as UniqueIdentifier} />,
      size: 40,
      enableSorting: false,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={v => row.toggleSelected(!!v)}
          className="translate-y-[2px]"
        />
      ),
      size: 40,
      enableSorting: false,
    },
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RowActions({ row }: { row: Row<any> }) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showViewSheet, setShowViewSheet] = React.useState(false)
  const isMobile = useIsMobile()
  const { onEditClick, onDelete } = React.useContext(DataTableContext)

  const details = Object.entries(row.original as Record<string, unknown>).filter(([k]) => k !== 'id')

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 ml-auto">
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowViewSheet(true)}>View details</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEditClick?.(row.original)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
        <SheetContent className={cn("flex flex-col h-full", isMobile ? "w-full" : "sm:max-w-xl")}>
          <SheetHeader className="border-b pb-4 shrink-0">
            <SheetTitle>Details</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="text-sm border p-2 rounded-md bg-muted/50">
                    {value === null || value === undefined || String(value).trim() === ""
                      ? "-"
                      : (typeof value === 'object' ? JSON.stringify(value) : String(value))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowViewSheet(false);
                onEditClick?.(row.original);
              }}
            >
              Edit
            </Button>
            <SheetClose asChild>
              <Button variant="secondary" size="sm">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this record?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete?.(row.original)
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function getActionsColumn<TData extends { id?: string | number }>(): ColumnDef<TData> {
  return {
    id: "actions",
    header: () => <div className="text-right text-xs font-medium uppercase text-muted-foreground">Actions</div>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 50,
  }
}
