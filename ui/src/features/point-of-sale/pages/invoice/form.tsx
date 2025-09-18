/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useParams } from '@tanstack/react-router'
import { DataForm, type TypeDFStore } from "@/components/data-form/zustand-version";
import type { GridFieldChangeHandler, GridFormState, TypeField } from "@/components/grid-form/types";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/loaders/spinner";
import { decimal } from "@/utils";
import type { TypeGridFormStore } from "@/components/grid-form/zustand-grid-form";



const calculateTotal: GridFieldChangeHandler = (args) => {

    args.grid.rows.forEach((row) => {
        const amount = decimal(row.values.quantity) * decimal(row.values.price);
        args.grid.setValue({ name: "amount", value: amount, id: row.id });
    })

    const totals = args.grid.rows.reduce((acc, row) => {
        acc.quantity += decimal(row.values.quantity)
        acc.amount += decimal(row.values.price) * decimal(row.values.quantity);
        return acc;
    }, { quantity: 0, amount: 0 })


    args.dataform?.setValue({ name: "total_quantity", value: totals.quantity });
    args.dataform?.setValue({ name: "total_amount", value: totals.amount });
    args.dataform?.setValue({ name: "grand_total", value: totals.amount });
    args.dataform?.setValue({ name: "outstanding_amount", value: totals.amount });
    console.log(totals);

}
const fields: Array<TypeField> = [
    {
        name: "details",
        type: "section",

        label: "Details"
    },
    {
        label: "Company",
        name: "company",
        getOptions: async () => {
            try {
                const response = await api.get("api/search-link/", {
                    params: {
                        model: "Company",
                        app: "accounting",
                        fields: "name"
                    }
                });
                return response.data?.map((row: any) => ({
                    label: row.name,
                    value: row.id
                })) || [];
            } catch (error) {
                console.error("Error fetching companies:", error);
                return [];
            }
        },
        type: "autocomplete",
        required: true
    },
    {
        name: "customer",
        type: "autocomplete",
        required: true,
        label: "Customer",
        getOptions: async () => {
            try {
                const response = await api.get("api/search-link/", {
                    params: {
                        model: "Customer",
                        app: "accounting",
                        fields: "customer_name"
                    }
                });
                return response.data?.map((row: any) => ({
                    label: row.customer_name,
                    value: row.id
                })) || [];
            } catch (error) {
                console.error("Error fetching customers:", error);
                return [];
            }
        },
        // defaultValue: {
        //     label: "Cash Customer",
        //     value: "aba809f6-eed3-4804-9f0c-8bbd315af01f"
        // },
    },
    {
        label: "Remarks",
        name: "remarks",
        type: "text",
        defaultValue: ""
    },
    {
        label: "",

        type: "column",
        name: "column_break_1",
    },
    {
        name: "posting_date",
        label: "Posting Date",
        defaultValue: moment().toDate(),
        type: "date",
        required: true
    },
    {
        name: "due_date",
        label: "Payment Due Date",
        defaultValue: moment().add(30, 'days').toDate(), // More realistic default
        type: "date",
        required: true
    },
    {
        label: "",

        type: "column",
        name: "column_break_2",
    },
    {
        label: "Is POS",
        name: "is_pos",
        type: "checkbox"
    },
    {
        name: "pos_profile",
        dependsOn: (values) => Boolean(values.is_pos),
        requiredOn: (values) => Boolean(values.is_pos),
        type: "autocomplete",
        label: "POS Profile",
        getOptions: async () => {
            try {
                const response = await api.get("api/search-link/", {
                    params: {
                        model: "POSProfile",
                        app: "pos",
                        fields: "name"
                    }
                });
                return response.data?.map((row: any) => ({
                    label: row.name,
                    value: row.id
                })) || [];
            } catch (error) {
                console.error("Error fetching POS profiles:", error);
                return [];
            }
        }
    },
    {
        label: "Is Return",
        name: "is_return",
        type: "checkbox"
    },
    {
        dependsOn: (values) => Boolean(values.is_return),
        requiredOn: (values) => Boolean(values.is_return),
        name: "return_against",
        type: "autocomplete",
        label: "Return Against",
        getOptions: async () => {
            try {
                const response = await api.get("api/search-link/", {
                    params: {
                        model: "Invoice",
                        app: "pos",
                        fields: "name"
                    }
                });
                return response.data?.map((row: any) => ({
                    label: row.name,
                    value: row.id
                })) || [];
            } catch (error) {
                console.error("Error fetching invoices:", error);
                return [];
            }
        }
    },
    {
        label: "",
        type: "section",

        name: "items_section",
    },
    {
        label: "Items",
        type: "table",
        name: "items",
        required: true,
        fields: [
            {
                label: "Product",
                placeholder: "Select Product",
                required: true,
                name: "product",
                getOptions: async () => {
                    try {
                        const response = await api.get("api/search-link/", {
                            params: {
                                model: "Product",
                                app: "stock",
                                fields: "product_name"
                            }
                        });
                        return response.data?.map((row: any) => ({
                            label: row.product_name,
                            value: row.id
                        })) || [];
                    } catch (error) {
                        console.error("Error fetching products:", error);
                        return [];
                    }
                },
                type: "autocomplete",
                // onChange: (grid) => {}
            },
            {
                label: "Quantity",
                name: "quantity",
                type: "decimal",
                defaultValue: 1,
                required: true,
                onChange: (args) => {
                    calculateTotal(args);
                }
            },
            {
                label: "Price",
                name: "price",
                type: "decimal",
                required: true,
                onChange: (args) => {
                    calculateTotal(args);
                }
            },
            {
                label: "Amount",
                name: "amount",
                type: "decimal",
                readOnly: true,

            },
        ]
    },
    {
        name: "totals_section",
        type: "section",

        label: "Totals"
    },
    {
        name: "total_quantity",
        type: "decimal",
        label: "Total Quantity",
        readOnly: true,
        // Calculate from items
        // calculate: (values: any) => {
        //     if (!values.items || !Array.isArray(values.items)) return 0;
        //     return values.items.reduce((sum: number, item: any) => {
        //         return sum + (parseFloat(item.quantity) || 0);
        //     }, 0);
        // }
    },
    {
        label: "",

        type: "column",
        name: "column_break_3",
    },
    {
        name: "total_amount",
        type: "decimal",
        label: "Total Amount",
        readOnly: true,
        // calculate: (values: any) => {
        //     if (!values.items || !Array.isArray(values.items)) return 0;
        //     return values.items.reduce((sum: number, item: any) => {
        //         const quantity = parseFloat(item.quantity) || 0;
        //         const rate = parseFloat(item.rate) || 0;
        //         return sum + (quantity * rate);
        //     }, 0);
        // }
    },
    {
        name: "grand_total",
        type: "decimal",
        label: "Grand Total",
        readOnly: true,
        // calculate: (values: any) => {
        //     // For now, grand total equals total amount
        //     // You can add tax calculations here later
        //     if (!values.items || !Array.isArray(values.items)) return 0;
        //     return values.items.reduce((sum: number, item: any) => {
        //         const quantity = parseFloat(item.quantity) || 0;
        //         const rate = parseFloat(item.rate) || 0;
        //         return sum + (quantity * rate);
        //     }, 0);
        // }
    },
    {
        name: "outstanding_amount",
        type: "decimal",
        label: "Outstanding Amount",
        readOnly: true,
        // calculate: (values: any) => {
        //     // Outstanding amount typically equals grand total for new invoices
        //     // Subtract any payments made
        //     return values.grand_total || 0;
        // }
    }
];

const useInvoiceQuery = (id: string | undefined) => {
    return useQuery({
        queryKey: ['invoice-detail', id],
        queryFn: async () => {
            if (!id) return null;
            try {
                const response = await api.get(`api/pos/invoice`, {
                    params: { id }
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching invoice:", error);
                throw error;
            }
        },
        enabled: id != "new",
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

const InvoiceForm = () => {
    const params = useParams({ from: '/app/invoice/$action'});
    const { data, isLoading, error, isError } = useInvoiceQuery(params.action);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner />
                <span className="ml-2">Loading invoice...</span>
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-2">
                        Error loading invoice: {error?.message || 'Unknown error'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Determine if this is a new invoice or editing existing
    const isNewInvoice = !params.id;
    const formTitle = isNewInvoice ? "New POS Invoice" : "Edit POS Invoice";

    // Prepare form values
    const formValues = data || {};
    console.log(formValues)
    const handleSave = (values: Record<string, any>) => {
        // Handle form submission
        console.log("Saving invoice:", values);
    }

    return (
        <div className="mx-auto p-4">
            <DataForm fields={fields} title="POS Invoice" values={formValues}
                onSave={handleSave}
            />
            {/* <DataFormProvider
                fields={fields}
                title={formTitle}
                values={formValues}
            >
                <DataForm />
            </DataFormProvider> */}
        </div>
    );
};

export default InvoiceForm;