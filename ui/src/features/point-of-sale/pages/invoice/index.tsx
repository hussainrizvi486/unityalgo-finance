import type { ColumnDef } from "@tanstack/react-table";
import { ListView } from "../../../../components/listview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "../../../../api";

// Example Usage with Sample Data
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
}


interface TypeInvoice {
    invoice_no: string;
    id: string;
    customer: string;
    posting_date: string;
    status: string;
    grand_total: number;
}

const columns: ColumnDef<TypeInvoice>[] = [
    {
        accessorKey: 'invoice_no',
        header: 'Invoice No',
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.getValue('invoice_no')}</span>
        ),
    },
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <span className="text-gray-700">{row.getValue('id')}</span>
        ),
    },
    {
        accessorKey: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
            <span className="text-gray-900">{row.getValue('customer')}</span>
        ),
    },
    {
        accessorKey: 'posting_date',
        header: 'Posting Date',
        cell: ({ row }) => (
            <span className="text-gray-600">
                {new Date(row.getValue('posting_date')).toLocaleDateString()}
            </span>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const statusMap: Record<string, string> = {
                "draft": "Pending",
                "return": "Cancelled",
                "paid": "Paid",
                "unpaid": "Unpaid",
                "cancelled": "Cancelled",
                "overdue": "Overdue",
                "credit_note_issued": "Credit Note Issued"
            };
            const status = statusMap[row.getValue('status')];
            const statusColors: Record<string, string> = {
                Paid: 'bg-green-100 text-green-800',
                Unpaid: 'bg-red-100 text-red-800',
                Pending: 'bg-yellow-100 text-yellow-800',
                Cancelled: 'bg-gray-100 text-gray-800',
            };
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: 'grand_total',
        header: 'Grand Total',
        cell: ({ row }) => (
            <span className="text-gray-900">
                {Number(row.getValue('grand_total')).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </span>
        ),
    },
];



const useInvoiceQuery = () => {
    return useQuery<Array<TypeInvoice>>({
        queryKey: ['invoice-list'],
        queryFn: async () => {
            const response = await axios.get(SERVER_URL + 'api/pos/invoices/list');
            return response.data;
        },
        refetchOnWindowFocus: false,
    })
}


const Index = () => {
    const { data: invoices, isLoading, error } = useInvoiceQuery();
    console.log(invoices)

    return (
        <div className="">
            <h1>Invoice Page</h1>
            <ListView
                data={invoices || []}
                columns={columns}
                title="User Management"
                searchPlaceholder="Search users..."
                pageSize={8}
                showPagination={true}
            />
        </div>
    );
}



export default Index;