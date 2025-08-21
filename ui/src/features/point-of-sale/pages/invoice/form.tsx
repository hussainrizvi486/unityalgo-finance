import moment from "moment";
import { DataForm, DataFormProvider } from "../../../../components/data-form";
import type { TypeField } from "../../../../components/data-form/types";
import api from "../../../../api";

const fields: Array<TypeField> = [
    {
        name: "details",
        type: "section",
        sectionBreak: true,
        label: "Details"
    },
    {
        label: "Company",
        name: "company",
        getOptions: async () => {
            //  http://127.0.0.1:8000/api/search-link/
            const response = await api.get("api/search-link/", {
                params: {
                    "model": "Company",
                    "app": "accounting",
                    "fields": "name"
                }
            });
            return response.data.map((row) => ({
                label: row.name,
                value: row.id
            }));

        }, type: "autocomplete",
        required: true
    },
    {
        name: "customer",
        type: "autocomplete",
        required: true,

        label: "Customer",
        getOptions: async () => {
            //  http://127.0.0.1:8000/api/search-link/
            const response = await api.get("api/search-link/", {
                params: {
                    "model": "Customer",
                    "app": "accounting",
                    "fields": "customer_name"
                }
            });
            return response.data.map((row) => ({
                label: row.customer_name,
                value: row.id
            }));
        },

        defaultValue: { "label": "Cash Customer", "value": "aba809f6-eed3-4804-9f0c-8bbd315af01f" },
    },
    {
        label: "Remarks",
        name: "remarks",
        type: "text",
        defaultValue: "test"
    },
    {
        label: "",
        columnBreak: true,
        type: "column",
        name: "column_break",
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
        defaultValue: moment().toDate(),
        type: "date",
        required: true
    },
    {
        label: "",
        columnBreak: true,
        type: "column",
        name: "column_break",
    },

    {
        label: "Is POS",
        name: "is_pos",
        // defaultValue: true,
        type: "checkbox"
    },
    {
        name: "pos_profile",
        dependsOn: (values) => Boolean(values.is_pos),
        requiredOn: (values) => Boolean(values.is_pos),
        type: "autocomplete",
        label: "POS Profile"
    },
    {
        label: "Is Return",
        name: "is_return",

        type: "checkbox"
    },
    {
        dependsOn: (values) => Boolean(values.is_return),
        requiredOn: (values) => Boolean(values.is_return),
        defaultValue: true,

        name: "return_against",
        type: "autocomplete",
        required: true,
        label: "Return Against"
    },
    {
        label: "",
        type: "section",
        sectionBreak: true,
        name: "items_section",
    },
    {
        label: "Item",
        type: "table",
        name: "items",
        required: true,
        fields: [
            {
                label: "Item",
                placeholder: "Select Item",
                required: true,
                name: "item",
                getOptions: async () => {
                    //  http://127.0.0.1:8000/api/search-link/
                    const response = await api.get("api/search-link/", {
                        params: {
                            "model": "Product",
                            "app": "stock",
                            "fields": "product_name"
                        }
                    });
                    return response.data.map((row) => ({
                        label: row.product_name,
                        value: row.id
                    }));
                },
                type: "autocomplete",
            },
            {
                label: "Quantity",
                name: "quantity",
                type: "decimal",
                defaultValue: 1,
            },
            {
                label: "Rate",
                name: "rate",
                type: "decimal",
            },
            {
                label: "Amount",
                name: "amount",
                type: "decimal",
            }
        ]
    },

    {
        name: "totals_section",
        type: "section",
        sectionBreak: true,
        label: "Totals"
    },
    {
        name: "total_quantity",
        type: "decimal",
        label: "Total Quantity"
    },
    {
        label: "",
        columnBreak: true,
        type: "column",
        name: "column_break",
    },
    {
        name: "total_amount",
        type: "decimal",
        label: "Total Amount"
    },
    {
        name: "grand_total",
        type: "decimal",
        label: "Grand Total"
    },
    {
        name: "Outstanding Amount",
        type: "decimal",
        label: "Outstanding Amount"
    }
]


const Index = () => {
    console.log(fields)
    return (<div>

        <DataFormProvider fields={fields} title="Sales Invoice">
            <DataForm />
        </DataFormProvider>
    </div>)
}


export default Index;