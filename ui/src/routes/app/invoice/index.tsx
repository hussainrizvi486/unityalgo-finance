import { createFileRoute } from '@tanstack/react-router';
import axios from "axios";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { ListView } from "@/components/listview/index";
import { SERVER_URL } from "@/api";
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils';




interface TypeInvoice {
  invoice_no: string;
  // id: string;
  customer: string;
  posting_date: string;
  status: string;
  grand_total: number;
}



const columns: ColumnDef<TypeInvoice>[] = [
  {
    accessorKey: 'invoice_no',
    header: 'Invoice No',
    cell: ({ row }) => {
      return (
        <Link to={`/app/invoice/${row.original?.id}`} className="font-medium hover:underline">#{row.getValue('invoice_no')}</Link>
      )
    },
  },

  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => (
      <span>{row.getValue('customer')}</span>
    ),
  },
  {
    accessorKey: 'posting_date',
    header: 'Posting Date',
    cell: ({ row }) => (
      <span >
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
    header: () => <div className="text-right">Grand Total</div>,
    cell: ({ row }) => (
      <div className="text-gray-900 text-right">
        {formatCurrency(row.getValue('grand_total'))}
      </div>
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
  const query = useInvoiceQuery();

  return <div>
    <div>
      <div className="flex">

        <div className="min-w-0 flex-auto">
          <header className='mb-6 flex items-center justify-between'>
            <div>
              <h1 className="font-bold text-lg">POS Invoice</h1>
            </div>
            <Link to="/app/invoice/new">
              <Button size='sm'>Add new</Button>
            </Link>
          </header>

          <ListView
            query={query}
            columns={columns}
            pageSize={8}
            showPagination={true}

          />
        </div>
      </div>
    </div>
  </div>
}


export const Route = createFileRoute('/app/invoice/')({
  component: Index,
})


