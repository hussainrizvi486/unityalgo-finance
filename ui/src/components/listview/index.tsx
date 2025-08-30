import React, { useEffect, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,

} from '@tanstack/react-table';
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    RowSelectionState,
    Table,
} from '@tanstack/react-table';
// import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Trash2, Edit, MoreHorizontal, Check } from 'lucide-react';

import type { UseQueryResult } from '@tanstack/react-query';
import { cn } from '@/utils';
import { Checkbox } from '@/components/ui/checkbox';


interface ListViewProps<T> {
    data?: T[];
    query?: UseQueryResult<T[], Error>;
    columns: ColumnDef<T>[];
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



const ListViewHeader = <T,>({ table }: { table: Table<T> }) => {
    return (
        <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}
                    className='bg-accent border-b'
                >
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            className="px-3 py-2 text-left text-sm font-medium cursor-pointer"
                            style={{ width: header.column.getSize() }}
                        // onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}

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
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}

const ListView = <T,>({ selectable = true, ...props }: ListViewProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [data, setData] = useState<Array<T>>([]);
    const { query, onSelectionChange } = props;

    useEffect(() => {
        setIsLoading(true);
        if (props.data) {
            setData(props.data);
            setIsLoading(false);
            return
        }

        if (query && query.data && query.isSuccess) {
            setData(query.data);
            setIsLoading(false);
            return
        }

    }, [query, props.data]);



    const getColumns = () => {
        if (!selectable) {
            return props.columns;
        }
        const selectCol: ColumnDef<T> = {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    name="select"
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    name={row.id}
                />
            ),
            enableSorting: false,
            size: 25,
        };

        return [selectCol, ...props.columns]
    }
    const columns = getColumns()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        getRowId: props.getRowId,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: props.pageSize,
            },
        },
    });

    useEffect(() => {
        const selectedRowIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
        const selectedRows = selectedRowIds.map(id => {
            const row = table.getRowModel().rows.find(r => r.id === id);
            return row?.original;
        }).filter(Boolean) as T[];
        onSelectionChange?.(selectedRows, selectedRowIds);
    }, [rowSelection, onSelectionChange, table]);


    const selectedRows = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(id => {
            const row = table.getRowModel().rows.find(r => r.id === id);
            return row?.original;
        })
        .filter(Boolean) as T[];

    const selectedCount = selectedRows.length;

    return (
        <div className={cn("w-full ", props.className)}>
            {selectedCount > 0 && (
                <div className="font-medium text-sm mb-4">
                    <div >{selectedCount} Selected  <span className="text-destructive hover:underline cursor-pointer" onClick={() => setRowSelection({})} > Clear selection</span>
                    </div>
                </div>
            )}


            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full table-fixed">
                    <ListViewHeader table={table} />

                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className={cn("hover:bg-gray-50 transition-colors cursor-pointer", row.getIsSelected() ? 'bg-blue-50 border-blue-200' : 'bg-white')}
                                onClick={(e) => {
                                    if (!['INPUT', 'BUTTON', "A"].includes((e.target as HTMLElement).tagName)) {
                                        row.toggleSelected();
                                    }
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-900"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {table.getRowModel().rows.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No data found</p>
                    <p className="text-gray-400 text-sm mt-1">
                        {globalFilter ? 'Try adjusting your search terms' : 'No records available'}
                    </p>
                </div>
            )}
        </div>
    );
}

export { ListView };