import {
  board_POST,
  board_GET,
  board_GET_ID,
  board_UPDATA,
  board_status_UPDATA,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface BoardData {
  _id?: string;
  boardname: string;
  boardshortname: string;
  isActive: boolean;
  createdAt?: string;
}

interface BoardState {
  board: BoardData[];
  currentboard: BoardData | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BoardState = {
  board: [],
  currentboard: null,
  isLoading: false,
  error: null,
};

// Thunks
export const createboard = createAsyncThunk(
  "createboard",
  async (data: BoardData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(board_POST, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllboard = createAsyncThunk(
  "getAllboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(board_GET);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchboardById = createAsyncThunk(
  "boardById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(board_GET_ID.replace(":id", id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updataboard = createAsyncThunk(
  "updataboard",
  async (
    { _id, data }: { _id: string; data: BoardData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        board_UPDATA.replace(":id", _id),
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleboardStatus = createAsyncThunk(
  "toggleboard",
  async (data: { boardId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(board_status_UPDATA, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create board
      .addCase(createboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createboard.fulfilled,
        (state, action: PayloadAction<BoardData>) => {
          state.isLoading = false;
          state.board.push(action.payload);
          state.board.sort((a, b) => (a.createdAt! < b.createdAt! ? -1 : 1));
        }
      )
      .addCase(createboard.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All board
      .addCase(fetchAllboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllboard.fulfilled,
        (state, action: PayloadAction<BoardData[]>) => {
          state.isLoading = false;
          state.board = action.payload;
        }
      )
      .addCase(fetchAllboard.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch board By ID
      .addCase(fetchboardById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchboardById.fulfilled,
        (state, action: PayloadAction<BoardData>) => {
          state.isLoading = false;
          state.currentboard = action.payload;
        }
      )
      .addCase(fetchboardById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update board
      .addCase(updataboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updataboard.fulfilled,
        (state, action: PayloadAction<BoardData>) => {
          state.isLoading = false;
          const index = state.board.findIndex(
            (board) => board._id === action.payload._id
          );
          if (index !== -1) {
            state.board[index] = action.payload;
          }
        }
      )
      .addCase(updataboard.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Toggle board Status
      .addCase(toggleboardStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        toggleboardStatus.fulfilled,
        (state, action: PayloadAction<BoardData>) => {
          state.isLoading = false;
          const index = state.board.findIndex(
            (board) => board._id === action.payload._id
          );
          if (index !== -1) {
            state.board[index].isActive = !state.board[index].isActive;
          }
        }
      )
      .addCase(
        toggleboardStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default boardSlice.reducer;
