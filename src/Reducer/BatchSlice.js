import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const BatchSlice = createSlice(
    {
        name: 'batch',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder

        }
    }
)
export default BatchSlice.reducer;