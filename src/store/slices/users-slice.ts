import { toast } from "@/hooks/use-toast";
import { initialState, User, UserResponse, UserUpdate } from "@/types/user";
import {
  getAllUsers,
  updateUserDetails,
  userToggleBlocks,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchAllUsers = createAsyncThunk(
  "fetchAllUser",
  async (
    { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(getAllUsers, {
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

export const toggleUserBlock = createAsyncThunk(
  "toggleUserBlock",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(userToggleBlocks, {
        userId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (data: Partial<UserUpdate>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(updateUserDetails, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.isLoading = false;
          state.users = action.payload.docs;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchAllUsers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // update user
      .addCase(updateUser.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        const index = state.users.findIndex(
          (value) => value._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        toast({
          title: "Error",
          description: action.payload.message,
        });
      })

      // toggle user block
      .addCase(toggleUserBlock.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(
        toggleUserBlock.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          const index = state.users.findIndex(
            (value) => value._id === action.payload._id
          );
          if (index !== -1) {
            state.users[index].isBlocked = !state.users[index].isBlocked;
          }
        }
      )
      .addCase(
        toggleUserBlock.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default userSlice.reducer;
