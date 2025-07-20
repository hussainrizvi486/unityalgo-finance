import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TypePOSProfile } from '../types';

const initialState = {
    profile: {} as TypePOSProfile
};

const POSSlice = createSlice({
    name: "pos-slice",
    initialState: initialState,
    reducers: {
        setProfile(state, action: PayloadAction<TypePOSProfile>) {
            state.profile = action.payload;
        }
    }
})

export const { setProfile } = POSSlice.actions;
export const posReducer = POSSlice.reducer;
