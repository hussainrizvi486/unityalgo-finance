import { DataForm, DataFormProvider } from "../../../../components/data-form";
import type { TypeField } from "../../../../components/data-form/types";

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
        type: "autocomplete",
    },
    {
        name: "customer",
        type: "autocomplete",
        required: true,
        label: "Customer"
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
        type: "date",
        required: true
    },
    {
        name: "due_date",
        label: "Payment Due Date",
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
        type: "checkbox"
    },
    // {
    //     name: "pos_profile",
    //     type: "autocomplete",
    //     required: true,
    //     label: "POS Profile"
    // },
    {
        label: "Is Return",
        name: "is_return",
        type: "checkbox"
    },
    // {
    //     name: "return_against",
    //     type: "autocomplete",
    //     required: true,
    //     label: "Return Against"
    // },
    {
        label: "Items",
        type: "section",
        sectionBreak: true,
        name: "items_section",
    },
    {
        label: "Item",
        type: "table",
        name: "items",
        fields: [
            {
                label: "Item",
                placeholder: "Select Item",
                required: true,
                name: "item",
                type: "autocomplete",
            },
            {
                label: "Quantity",
                name: "quantity",
                type: "decimal",
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