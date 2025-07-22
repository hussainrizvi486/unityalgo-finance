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
    invoice_no: string
    customer: string
    posting_date: string
    grand_total: number
}


const sampleUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2024-01-16' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive', createdAt: '2024-01-17' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', createdAt: '2024-01-18' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-19' },
    { id: 6, name: 'Eva Davis', email: 'eva@example.com', role: 'Editor', status: 'inactive', createdAt: '2024-01-20' },
    { id: 7, name: 'Mike Miller', email: 'mike@example.com', role: 'User', status: 'active', createdAt: '2024-01-21' },
    { id: 8, name: 'Sarah Jones', email: 'sarah@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-22' },
    { id: 9, name: 'Tom Anderson', email: 'tom@example.com', role: 'User', status: 'inactive', createdAt: '2024-01-23' },
    { id: 10, name: 'Lisa Garcia', email: 'lisa@example.com', role: 'Editor', status: 'active', createdAt: '2024-01-24' },
    { id: 11, name: 'David Lee', email: 'david@example.com', role: 'User', status: 'active', createdAt: '2024-01-25' },
    { id: 12, name: 'Amy Taylor', email: 'amy@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-26' },
];

const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        size: 10,
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.getValue('id')}</span>
        ),

    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                        {(row.getValue('name') as string).charAt(0)}
                    </span>
                </div>
                <span className="font-medium text-gray-900">{row.getValue('name')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue('email')}</span>
        ),
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            const roleColors = {
                Admin: 'bg-purple-100 text-purple-800',
                Editor: 'bg-blue-100 text-blue-800',
                User: 'bg-gray-100 text-gray-800',
            };
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}>
                    {role}
                </span>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as 'active' | 'inactive';
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
            <span className="text-gray-600">
                {new Date(row.getValue('createdAt')).toLocaleDateString()}
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
                data={sampleUsers}
                columns={userColumns}
                title="User Management"
                searchPlaceholder="Search users..."
                pageSize={8}
                showPagination={true}
            />
        </div>
    );
}



export default Index;