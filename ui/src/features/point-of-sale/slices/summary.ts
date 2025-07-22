import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TypeProduct, TypePOSProfile } from '../types'


export interface TypeSummaryItem extends TypeProduct {
    quantity: number
    price: number,
}

interface TypeSummary {
    serial_no: number
    id: string
    customer?: {
        id: string
        customer_name: string
    } | null,
    items: Array<TypeSummaryItem>
    total_quantity: number
    total_amount: number
    total_discount: number
    grand_total: number
}

interface TypeSummaryState {
    profile?: TypePOSProfile
    selectedSummary: TypeSummary
    summaries: Array<TypeSummary>
}


const defaultSummary: TypeSummary = {
    customer: null,
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

function calculateSummary(summary: TypeSummary) {
    summary.total_quantity = summary.items.reduce((acc, item) => acc + item.quantity, 0);
    summary.total_amount = summary.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    summary.grand_total = summary.total_amount - summary.total_discount;
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

        removeSummary(state, action: PayloadAction<string>) {
            state.summaries = state.summaries.filter(summary => summary.id !== action.payload);
            state.summaries.forEach((summary, idx) => {
                summary.serial_no = idx + 1;
            });
        },

        setCustomer(state, action: PayloadAction<{ id: string, customer_name: string } | null>) {
            const summary = state.summaries.find(summary => summary.id === state.selectedSummary.id);
            if (!summary) return;

            if (!action.payload) {
                summary.customer = null;
                return;
            }
            const { id, customer_name } = action.payload;
            summary.customer = { id, customer_name };
        },

        setProfile(state, action: PayloadAction<TypePOSProfile>) {
            state.profile = action.payload;
            console.log("Profile set:", action.payload);
        },

        updateItemQty(state, action: PayloadAction<{ id: string, summaryId: string, quantity: number }>) {
            const { id, summaryId, quantity } = action.payload;
            const summary = state.summaries.find(summary => summary.id === summaryId);

            if (!summary) return;

            if (quantity <= 0) {
                summary.items = summary.items.filter(item => item.id !== id)
                return
            };


            const item = summary.items.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                calculateSummary(summary);
            }
        },

        deleteItem(state, action: PayloadAction<{ id: string, summaryId: string }>) {
            const { id, summaryId } = action.payload;
            const summary = state.summaries.find(summary => summary.id === summaryId);
            if (!summary) return;

            summary.items = summary.items.filter(item => item.id !== id);
            calculateSummary(summary);
        },

        addItem(state, action: PayloadAction<{ product: TypeSummaryItem, id: string }>) {
            const { product, id } = action.payload;
            const summary = state.summaries.find(summary => summary.id === id);

            if (!summary) return;

            const item = summary.items.find(item => item.id === product.id);
            if (item) {
                item.quantity += product.quantity;
            }
            else {
                summary.items.push(product);
            }

            calculateSummary(summary);
        }
    }
})


export const { addSummary, setProfile, addItem, selectSummary, deleteItem, updateItemQty, setCustomer, removeSummary } = summarySlice.actions;
export default summarySlice.reducer;
