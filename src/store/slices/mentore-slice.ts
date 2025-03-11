import axiosInstance from "@/utils/network/AxiosInstance";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState} from "@/types/mentore";
import {createMentore, MentorListing, MentorToggleStatus, UpdateMentor,} from "@/utils/constants/ApiEndPoints";
import {MentorFormData} from "@/lib/validations/mentore-schema";
import {toast} from "@/components/ui/use-toast";

export const creatementore = createAsyncThunk(
    "creatementore",
    async (mentore: MentorFormData, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(createMentore, mentore);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchmentore = createAsyncThunk(
    "fetchmentore",
    async ({page, search}: { page: number, search: string }, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(MentorListing, {
                params: {
                    page,
                    search,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updatementore = createAsyncThunk(
    "updatementore",
    async (
        {id, mentoreData}: { id: string; mentoreData: Partial<MentorFormData> },
        {rejectWithValue}
    ) => {
        try {
            const response = await axiosInstance.put(
                `${UpdateMentor}/${id}`,
                mentoreData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const togglementoreStatus = createAsyncThunk(
    "togglementoreStatus",
    async (mentorId: string, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(MentorToggleStatus, {
                mentorId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const mentoreSlice = createSlice({
    name: "mentors",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // add mentors
            .addCase(creatementore.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(creatementore.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mentors.push(action.payload);
                state.mentors.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
            })
            .addCase(creatementore.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload.response.data.message;
                toast({
                    title: "Error",
                    description: action.payload.response.data.message,
                    variant: "destructive",
                });
            })

            // get all mentors
            .addCase(fetchmentore.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchmentore.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mentors = action.payload.docs;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchmentore.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload.response.data.message;
                toast({
                    title: "Error",
                    description: action.payload.response.data.message,
                    variant: "destructive",
                });
            })

            // update mentors
            .addCase(updatementore.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updatementore.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload.response.data.message;
                toast({
                    title: "Error",
                    description: action.payload.response.data.message,
                    variant: "destructive",
                });
            })
            .addCase(updatementore.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.mentors.findIndex(
                    (value) => value._id === action.payload._id
                );
                if (index !== -1) {
                    state.mentors[index] = action.payload;
                }
            })

            // toggle mentors
            .addCase(togglementoreStatus.pending, (state, action) => {
                // state.isLoading = true;
            })
            .addCase(togglementoreStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(togglementoreStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.mentors.findIndex(
                    (value) => value._id === action.payload._id
                );
                if (index !== -1) {
                    state.mentors[index].isActive = !state.mentors[index].isActive;
                }
            });
    },
});

export default mentoreSlice.reducer;
