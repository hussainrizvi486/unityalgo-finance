import { useState } from "react";
import axios from 'axios';
import { Plus as PlusIcon, Satellite } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addSummary, selectSummary, setCustomer } from "../slices/summary";
import type { RootState } from "../../../store";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { SummaryItem } from "./summary-item";
import { AutoComplete } from "../../../components/ui/autocomplete";
import { SERVER_URL } from "../../../api";
import { decimal } from "../../../utils";
import toast from "react-hot-toast";

export const Summary = () => {
    const state = useSelector((state: RootState) => state.pos);
    const selected = state.selectedSummary.id;
    const dispatch = useDispatch();
    const summary = state.summaries.find(summary => summary.id === selected);
    const items = summary?.items || []

    if (!summary) { return <></> };

    const handleCheckout = async () => {
        const { profile } = state;

        if (!profile) {
            return alert("Please set the POS profile");
        }

        if (!summary.customer) {
            return alert("Please select a customer");
        }

        if (!summary.items.length) {
            return alert("Please add items to the summary");
        }


        const invoiceItems = summary.items.map(row => ({
            product: row.id,
            quantity: row.quantity,
            price_list: profile.price_list.id,
            price: row.price,

        }));

        const invoice = {
            pos_profile: profile.id,
            customer: summary.customer.id,
            items: invoiceItems,
        }

        const response = await axios.post(SERVER_URL + 'api/pos/create-invoice', invoice)
        if (response.status === 200) {
            toast.success("Invoice created successfully");
        }

    }
    const createSummary = () => {
        const { summaries } = state;
        dispatch(addSummary({ id: crypto.randomUUID(), items: [], total_quantity: 0, total_amount: 0, total_discount: 0, grand_total: 0, serial_no: summaries.length + 1 }));
    }

    return (
        <div>
            <div>
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="font-bold text-xl">Order Summary</h1>
                    <div className="flex gap-2 items-center">
                        <Select onValueChange={(value) => {
                            dispatch(selectSummary(value));
                        }} defaultValue={selected}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Summary" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        state.summaries.map((summary, i) => (
                                            <SelectItem key={i} value={summary.id}>
                                                {summary.serial_no.toFixed(2)}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <button onClick={createSummary} className="rounded-md bg-gray-200 p-2">
                            <PlusIcon className="stroke-3" />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <AutoComplete label="Select Customer"
                        value={summary.customer ? { label: summary.customer.customer_name, value: summary.customer.id } : null}
                        getOptions={async function () {
                            const request = await axios.get(SERVER_URL + 'api/customer');
                            return request.data.map((customer: { customer_name: string; id: string }) => ({ label: customer.customer_name, value: customer.id }));
                        }}

                        onChange={(val) => {
                            if (!val) {
                                dispatch(setCustomer(null));
                                return;
                            }
                            dispatch(setCustomer({ customer_name: val?.label, id: val.value }));

                        }}
                    />
                </div>

                <div className="mb-4">

                    <div className="h-[60vh] overflow-x-scroll ">
                        <div>


                            {items && items?.length ?
                                items.map((item, i) => (
                                    <div key={i}>
                                        <SummaryItem  {...item} />
                                    </div>
                                )) : <div className="p-2 text-sm text-center">No items have been added</div>
                            }

                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-sm">
                        <div className="mb-1">Total Quantity: {decimal(summary?.total_quantity)} </div>
                        <div className="mb-2"><span>Grand Total:</span> {decimal(summary?.grand_total)} </div>
                    </div>
                </div>

                <div>
                    <div className="flex gap-2 items-center">
                        <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white  w-full"
                            onClick={handleCheckout}
                        >
                            Complete
                        </button>
                        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white w-full">
                            Cancel
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

