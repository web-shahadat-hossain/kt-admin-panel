import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserDetailResponse } from "@/types/user.ts";
import { Payment, PaymentResponse } from "@/types/payment.ts";
import { QuizResult, QuizResultResponse } from "@/types/quiz-result.ts";
import axiosInstance from "@/utils/network/AxiosInstance.ts";
import {
    getAllPayment,
    getUserCourseTracking,
    getUserDetails,
    getUserQuizResults,
} from "@/utils/constants/ApiEndPoints.ts";
import { CourseTracking, CourseTrackingResponse } from "@/types/course-tracking.ts";

export interface UserDetailsState {
    user?: User;
    isLoading: boolean;
    error: string;
    payments: Payment[];
    pyCurrentPage: number,
    pyTotalPage: number,
    quizResult: QuizResult[];
    qrCurrentPage: number;
    qrTotalPages: number;
    courseTracking: CourseTracking[];
    crCurrentPage: number;
    crTotalPage: number;
}

export const fetchUserPayment = createAsyncThunk(
    "fetchAllPayment",
    async (
        { page, userId }: { page: number; userId: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await axiosInstance.get(getAllPayment, {
                params: {
                    page,
                    userId,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const fetchUserQuizResult = createAsyncThunk(
    "fetchUserQuizResult",
    async ({ page, userId }: { page: number, userId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(getUserQuizResults, {
                page, userId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchUserCourseTracking = createAsyncThunk(
    "fetchUserCourseTracking",
    async ({ page, userId }: { page: number, userId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(getUserCourseTracking, {
                page, userId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchUserDetails = createAsyncThunk(
    "fetchUserDetails",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(getUserDetails, {
                userId,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const initialState: UserDetailsState = {
    error: "",
    isLoading: false,
    payments: [],
    pyCurrentPage: 1,
    pyTotalPage: 0,
    quizResult: [],
    qrCurrentPage: 1,
    qrTotalPages: 0,
    user: null,
    courseTracking: [],
    crCurrentPage: 1,
    crTotalPage: 0,
};

const userDetails = createSlice({
    name: "userDetail",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
            })

            .addCase(fetchUserCourseTracking.pending, (state, action) => {
            })
            .addCase(fetchUserCourseTracking.fulfilled, (state, action: PayloadAction<CourseTrackingResponse>) => {
                state.courseTracking = action.payload.courseTracking;
                // state.crCurrentPage = action.payload.currentPage;
                // state.crTotalPage = action.payload.totalPages;
            })
            .addCase(fetchUserCourseTracking.rejected, (state, action) => {
            })

            .addCase(fetchUserQuizResult.pending, (state, action) => {
            })
            .addCase(fetchUserQuizResult.fulfilled, (state, action: PayloadAction<QuizResultResponse>) => {
                state.quizResult = action.payload.docs;
                state.qrCurrentPage = action.payload.currentPage;
                state.qrTotalPages = action.payload.totalPages;
            })
            .addCase(fetchUserQuizResult.rejected, (state, action) => {
            })

            // Fetch All payments
            .addCase(fetchUserPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchUserPayment.fulfilled,
                (state, action: PayloadAction<PaymentResponse>) => {
                    state.isLoading = false;
                    state.payments = action.payload.docs;
                    state.pyCurrentPage = action.payload.currentPage;
                    state.pyTotalPage = action.payload.totalPages;
                },
            )
            .addCase(
                fetchUserPayment.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = action.payload;
                },
            );
    },
});

export default userDetails.reducer;