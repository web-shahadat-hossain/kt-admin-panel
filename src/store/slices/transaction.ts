import { getAllTransactions } from '@/utils/constants/ApiEndPoints';
import axiosInstance from '@/utils/network/AxiosInstance';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, TransactionResponse } from '@/types/trnasactions';

export const fetchAllTransactions = createAsyncThunk(
  'fetchAllTransactions',
  async (
    { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(getAllTransactions, {
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

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All payments
      .addCase(fetchAllTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllTransactions.fulfilled,
        (state, action: PayloadAction<TransactionResponse>) => {
          state.isLoading = false;
          state.transactions = action.payload.docs;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(
        fetchAllTransactions.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default transactionSlice.reducer;
