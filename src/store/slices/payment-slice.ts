import { initialState, PaymentResponse } from '@/types/payment';
import {
  getAllPayment,
  getAllTransactions,
} from '@/utils/constants/ApiEndPoints';
import axiosInstance from '@/utils/network/AxiosInstance';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const fetchAllPayment = createAsyncThunk(
  'fetchAllPayment',
  async (
    { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(getAllPayment, {
        params: {
          page,
          search,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All payments
      .addCase(fetchAllPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllPayment.fulfilled,
        (state, action: PayloadAction<PaymentResponse>) => {
          state.isLoading = false;
          state.payments = action.payload.docs;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(
        fetchAllPayment.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default paymentSlice.reducer;
