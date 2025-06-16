import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getLevels = createAsyncThunk(
    'getLevels',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/level/get-level`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const initialState = {
    loading: false,
    allLevels: [],
    error: false
}
const LevelSlice = createSlice(
    {
        'name': 'levelsData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getLevels.pending, (state) => {
                    state.loading = true
                })
                .addCase(getLevels.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allLevels = payload
                    state.error = false
                })
                .addCase(getLevels.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }

)
export default LevelSlice.reducer;