import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TypeProduct } from '../types'


interface TypeSummaryItem extends TypeProduct {
    quantity: number
    price: number,
}

interface TypeSummary {
    serial_no: number
    id: string
    customer?: {
        id: string
        customer_name: string
    },
    items: Array<TypeSummaryItem>
    total_quantity: number
    total_amount: number
    total_discount: number
    grand_total: number
}

interface TypeSummaryState {
    selectedSummary: TypeSummary
    summaries: Array<TypeSummary>
}
const defaultSummary: TypeSummary = {
    id: crypto.randomUUID(),
    serial_no: 1,
    items: [],
    total_quantity: 0,
    total_amount: 0,
    total_discount: 0,
    grand_total: 0
}
const initialState: TypeSummaryState = {
    summaries: [defaultSummary],
    selectedSummary: defaultSummary
}


export const summarySlice = createSlice({
    name: "summary-slice",
    initialState: initialState,
    reducers: {
        selectSummary(state, action: PayloadAction<string>) {
            const selected = state.summaries.find(summary => summary.id === action.payload);
            if (selected) {
                state.selectedSummary = selected
            }
        },
        addSummary(state, action: { payload: TypeSummary }) {
            state.summaries.push(action.payload);
        },
        addItem(state, action: PayloadAction<{ product: TypeSummaryItem, id: string }>) {
            console.log(action.payload);
            state.summaries.find(summary => summary.id === action.payload.id)?.items.push(action.payload.product);
        }
    }
})


export const { addSummary, addItem, selectSummary } = summarySlice.actions;
export default summarySlice.reducer;
