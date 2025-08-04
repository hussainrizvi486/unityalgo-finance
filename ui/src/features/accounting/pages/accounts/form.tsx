import { Button } from "../../../../components/ui/button";
import { DataForm, DataFormProvider } from "../../../../components/data-form";
import type { FormValues, TypeField } from "../../../../components/data-form/types";
import axios from "axios";
import { SERVER_URL } from "../../../../api";
import { validDataE } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data-errors.js";
import toast from "react-hot-toast";

const Index = () => {

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>New Account</div>

                {/* <div>
                    <Button>Save</Button>
                </div> */}
            </div>
            <div>
                <Form />
            </div>
        </div>
    )
}

export default Index;
// // Example account type choices
//     ASSET = "asset", "Asset"
//     LIABILITY = "liability", "Liability"
//     EQUITY = "equity", "Equity"
//     REVENUE = "revenue", "Revenue"
//     EXPENSE = "expense", "Expense"

const ACCOUNT_TYPE_CHOICES = [
    { value: "asset", label: "Asset" },
    { value: "liability", label: "Liability" },
    { value: "equity", label: "Equity" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
];


const fields: TypeField[] = [
    {
        label: "Company",
        name: "company",
        type: "autocomplete",
        required: true,
        getOptions: async () => {

            const response = await axios.get(SERVER_URL + "api/search-link/?model=Company&app=accounting", {
                params: {
                    model: "Company",
                    app: "accounting",
                    fields: "id,name",

                }
            })
            return response.data.map((row) => ({
                label: row.name,
                value: row.id,
            }));
            // http://127.0.0.1:8000/api/search-link/?model=Company&app=accounting
        },
        options: [], // This should be populated with actual company options
    },
    {
        label: "Account Type",
        name: "account_type",
        type: "select",
        required: true,
        options: ACCOUNT_TYPE_CHOICES,
        defaultValue: "ASSET",
        // description: "Select the type of account.",
    },
    {
        label: "Parent Account",
        name: "parent",
        type: "autocomplete",
        required: false,
        getOptions: async () => {
            const response = await axios.get(SERVER_URL + "api/search-link/?model=Account&app=accounting", {
                params: {
                    model: "Account",
                    app: "accounting",
                    fields: "id,account_name,account_number,account_type",
                }
            })
            return response.data.map((row) => ({
                label: `${row.account_number} - ${row.account_name}`,
                value: row.id,
            }));
        }
    },
    {
        label: "Account Number",
        name: "account_number",
        type: "text",
        required: true,
        // description: "Enter the account number.",
    },
    {
        label: "Account Name",
        name: "account_name",
        type: "text",
        required: true,
    },
    {
        label: "Tax Rate",
        name: "tax_rate",
        type: "float",
        required: false,
        defaultValue: 0,
    },
    {
        label: "Frozen",
        name: "frozen",
        type: "checkbox",
        defaultValue: false,
    },
    {
        label: "Disabled",
        name: "disabled",
        type: "checkbox",
        defaultValue: false,
    }
];
const Form = () => {
    const handleSave = async (values: FormValues) => {
        const payload = values;
        payload.company = values.company?.value;
        payload.parent = values.parent?.value;
        try {

            const response = await axios.post(SERVER_URL + "api/account/add", payload);
            console.log("response:", response.data);
        }
        catch (error) {
            const errorValues = error.response.data;
            Object.keys(errorValues).forEach((key) => {
                toast.error(errorValues[key])
                // console.log("Error creating account:", error);
            })
        }
        // console.log("Response:", response);
        // if (response.status !== 201) {
        //     throw new Error("Failed to create account");
        // }
        // console.log("Account created:", response.data);
        // console.log("Form values:", values);
    }
    return (
        <DataFormProvider fields={fields} onSave={handleSave}>
            <DataForm />
        </DataFormProvider>
    )
};