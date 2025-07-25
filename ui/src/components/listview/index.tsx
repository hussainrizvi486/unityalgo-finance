import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    RowSelectionState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils';

// Generic ListView Props Interface
interface ListViewProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    title?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    pageSize?: number;
    showPagination?: boolean;
    className?: string;
    selectable?: boolean;
    multiSelect?: boolean;
    onSelectionChange?: (selectedRows: T[], selectedRowIds: string[]) => void;
    showBulkActions?: boolean;
    bulkActions?: Array<{
        label: string;
        icon?: React.ReactNode;
        onClick: (selectedRows: T[]) => void;
        variant?: 'default' | 'danger';
    }>;
    getRowId?: (row: T) => string;
}

// Generic ListView Component
function ListView<T>({
    data,
    columns,
    title = 'Data Table',
    searchable = true,
    searchPlaceholder = 'Search...',
    pageSize = 10,
    showPagination = true,
    className = '',
    selectable = true,
    multiSelect = true,
    onSelectionChange,
    showBulkActions = true,
    bulkActions = [],
    getRowId,
}: ListViewProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Enhanced columns with selection checkbox if selectable is true
    const enhancedColumns = React.useMemo(() => {
        if (!selectable) return columns;

        const selectionColumn: ColumnDef<T> = {
            id: 'select',
            header: ({ table }) => (
                multiSelect ? (
                    <input
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                ) : null
            ),
            cell: ({ row }) => (
                <input
                    type={multiSelect ? "checkbox" : "radio"}
                    name={multiSelect ? undefined : "row-selection"}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
            ),
            enableSorting: false,
            size: 25,
        };

        return [selectionColumn, ...columns];
    }, [columns, selectable, multiSelect]);

    const table = useReactTable({
        data,
        columns: enhancedColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: selectable,
        enableMultiRowSelection: multiSelect,
        getRowId: getRowId,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    // Handle selection changes
    React.useEffect(() => {
        if (!selectable || !onSelectionChange) return;

        const selectedRowIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
        const selectedRows = selectedRowIds.map(id => {
            const row = table.getRowModel().rows.find(r => r.id === id);
            return row?.original;
        }).filter(Boolean) as T[];

        onSelectionChange(selectedRows, selectedRowIds);
    }, [rowSelection, selectable, onSelectionChange, table]);

    // Get selected rows for bulk actions
    const selectedRows = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(id => {
            const row = table.getRowModel().rows.find(r => r.id === id);
            return row?.original;
        })
        .filter(Boolean) as T[];

    const selectedCount = selectedRows.length;

    return (
        <div className={cn("w-full bg-white rounded-lg shadow-lg", className)}>


            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-3 py-2 text-left text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                        style={{ width: header.column.getSize() }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </span>
                                            {/* {header.column.getCanSort() && (
                                                <div className="flex flex-col">
                                                    {header.column.getIsSorted() === 'asc' ? (
                                                        <ChevronUp className="w-4 h-4 text-blue-600" />
                                                    ) : header.column.getIsSorted() === 'desc' ? (
                                                        <ChevronDown className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <div className="w-4 h-4 text-gray-400">
                                                            <ChevronUp className="w-3 h-2" />
                                                            <ChevronDown className="w-3 h-2 -mt-1" />
                                                        </div>
                                                    )}
                                                </div>
                                            )} */}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row, _) => (
                            <tr
                                key={row.id}
                                className={cn("hover:bg-gray-50 transition-colors cursor-pointer", row.getIsSelected() ? 'bg-blue-50 border-blue-200' : 'bg-white')}
                                onClick={(e) => {
                                    if (selectable && !['INPUT', 'BUTTON'].includes((e.target as HTMLElement).tagName)) {
                                        row.toggleSelected();
                                    }
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-6">
                <div>
                    {selectable && selectedCount > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
                            <span>{selectedCount} selected</span>
                            <button
                                onClick={() => setRowSelection({})}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Clear selection
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {table.getRowModel().rows.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No data found</p>
                    <p className="text-gray-400 text-sm mt-1">
                        {globalFilter ? 'Try adjusting your search terms' : 'No records available'}
                    </p>
                </div>
            )}
            {/* {selectable && showBulkActions && selectedCount > 0 && bulkActions.length > 0 && (
                <div className="flex items-center space-x-2">
                    {bulkActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => action.onClick(selectedRows)}
                            className={cn("flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ", action.variant === 'danger' && "bg-red-100 text-red-700 hover:bg-red-200", action.variant !== 'danger' && "bg-gray-100 text-gray-700 hover:bg-gray-200")}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            )} */}

            {/* Pagination */}
            {/* {showPagination && table.getRowModel().rows.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * pageSize,
                                table.getFilteredRowModel().rows.length
                            )}{' '}
                            of {table.getFilteredRowModel().rows.length} results
                        </span>

                        {selectable && selectedCount > 0 && (
                            <span className="text-sm text-blue-600 font-medium">
                                {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === table.getPageCount() ||
                                        Math.abs(page - (table.getState().pagination.pageIndex + 1)) <= 1
                                )
                                .map((page, index, array) => {
                                    const showEllipsis =
                                        index > 0 && page - array[index - 1] > 1;
                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && (
                                                <span className="px-2 py-1 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => table.setPageIndex(page - 1)}
                                                className={`px-3 py-1 text-sm border rounded transition-colors ${table.getState().pagination.pageIndex === page - 1
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export { ListView };