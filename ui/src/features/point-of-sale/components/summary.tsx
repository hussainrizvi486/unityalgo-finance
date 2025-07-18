import { useState } from "react";
import { Plus as PlusIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addSummary, selectSummary } from "../slices/summary";
import type { RootState } from "../../../store";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select"

interface TypeSummary {
    id: string
}


export const Summary = () => {
    const state = useSelector((state: RootState) => state.pos);
    const selected = state.selectedSummary.id;
    const dispatch = useDispatch();

    const items = state.summaries.find(summary => summary.id === selected)?.items || []

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
                    <div className="h-[60vh] overflow-x-scroll ">
                        <div>



                            {items && items?.length ?
                                items.map((item, i) => (
                                    <div key={i}>
                                        {item.product_name} - {item.quantity} x {item.price} = {item.quantity * item.price}
                                    </div>
                                    // <POSSummaryItem key={i} item={item} />
                                )) : <div className="p-2 text-sm text-center">No items have been added</div>
                            }

                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-sm">
                        <div className="mb-1">Total Quantity: </div>
                        <div className="mb-2"><span>Grand Total:</span> </div>
                    </div>
                </div>
                <div>

                    <div className="flex gap-2 items-center">
                        <button className="rounded-md bg-gray-900 px-3 py-2 text-sm  text-white  w-full">
                            Complete
                        </button>
                        <button className="rounded-md bg-gray-900 px-3 py-2 text-sm  text-white w-full">
                            Cancel
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

