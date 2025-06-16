import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getTopics = createAsyncThunk(
    'getTopics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`admin/topic/list`);
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
    allTopics: [],
    error: false
}
const TopicSlice = createSlice(
    {
        'name': 'topicsData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getTopics.pending, (state) => {
                    state.loading = true
                })
                .addCase(getTopics.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allTopics = payload
                    state.error = false
                })
                .addCase(getTopics.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }

)
export default TopicSlice.reducer;