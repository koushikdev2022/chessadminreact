import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

export const addBatch = createAsyncThunk(
    'addBatch',
    async (userInput, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/add-batch', userInput);
            if (response?.data?.status_code === 201) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const courseListForBatch = createAsyncThunk(
    'courseListForBatch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/oparational-head/batch/list');
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const ohBatchList = createAsyncThunk(
    'batchList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/oparational-head/batch/oh-batch-list');
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }

)

export const eligibleCoach = createAsyncThunk(
    'eligibleCoach',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/eligible-coaches', user_input);
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }

)

export const batchValidation = createAsyncThunk(
    'batchValidation',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post('/oparational-head/batch/validate-batch', user_input);
            if (response?.data?.status_code === 200) {
                return response.data;
            } else {
                if (response?.data?.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    return rejectWithValue('Something went wrong.');
                }
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }

)


const initialState = {
    loading: false,
    batchData: {},
    error: false,
    courseData: [],
    batchList: [],
    coachesData: [],
    validateData: []
};

const BatchSlice = createSlice(
    {
        name: 'batch',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(addBatch.pending, (state) => {
                    state.loading = true
                })
                .addCase(addBatch.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.batchData = payload
                    state.error = false
                })
                .addCase(addBatch.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(courseListForBatch.pending, (state) => {
                    state.loading = true
                })
                .addCase(courseListForBatch.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.courseData = payload
                    state.error = false
                })
                .addCase(courseListForBatch.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(ohBatchList.pending, (state) => {
                    state.loading = true
                })
                .addCase(ohBatchList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.batchList = payload
                    state.error = false
                })
                .addCase(ohBatchList.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(eligibleCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(eligibleCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachesData = payload
                })
                .addCase(eligibleCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(batchValidation.pending, (state) => {
                    state.loading = true
                })
                .addCase(batchValidation.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.validateData = payload
                    state.error = false
                })
                .addCase(batchValidation.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

        }
    }
)
export default BatchSlice.reducer;