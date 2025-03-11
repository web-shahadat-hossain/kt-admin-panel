import { Standard } from "@/types/standard";
import {
  standard_POST,
  standard_GET,
  standard_GET_ID,
  standard_UPDATA,
  standard_status_UPDATA,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface UpdateStandardPayload {
  id: string;
  data: Partial<Standard>;
}

// Thunks
export const createStandard = createAsyncThunk<
  Standard,
  Standard,
  { rejectValue: string }
>("create", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(standard_POST, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Unknown error");
  }
});

export const fetchAllStandards = createAsyncThunk<
  Standard[],
  void,
  { rejectValue: string }
>("fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(standard_GET);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Unknown error");
  }
});

export const fetchStandardById = createAsyncThunk<
  Standard,
  string,
  { rejectValue: string }
>("fetchStandardById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      standard_GET_ID.replace(":id", id)
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Unknown error");
  }
});

export const updateStandard = createAsyncThunk<
  Standard,
  UpdateStandardPayload,
  { rejectValue: string }
>("updateStandard", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      standard_UPDATA.replace(":id", id),
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Unknown error");
  }
});

export const toggleStandardStatus = createAsyncThunk<
  Standard,
  string,
  { rejectValue: string }
>("toggleStandardStatus", async (stdId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(standard_status_UPDATA, {
      stdId,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Unknown error");
  }
});

// Slice
const standardSlice = createSlice({
  name: "standard",
  initialState: {
    standards: [],
    currentStandard: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Standard
      .addCase(createStandard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createStandard.fulfilled,
        (state, action: PayloadAction<Standard>) => {
          state.isLoading = false;
          state.standards.push(action.payload);
        }
      )
      .addCase(createStandard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create standard.";
      })

      // Fetch All Standards
      .addCase(fetchAllStandards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllStandards.fulfilled,
        (state, action: PayloadAction<Standard[]>) => {
          state.isLoading = false;
          state.standards = action.payload;
        }
      )
      .addCase(fetchAllStandards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch standards.";
      })

      // Fetch Standard By ID
      .addCase(fetchStandardById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchStandardById.fulfilled,
        (state, action: PayloadAction<Standard>) => {
          state.isLoading = false;
          state.currentStandard = action.payload;
        }
      )
      .addCase(fetchStandardById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch standard by ID.";
      })

      // Update Standard
      .addCase(updateStandard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateStandard.fulfilled,
        (state, action: PayloadAction<Standard>) => {
          state.isLoading = false;
          state.standards = state.standards.map((std) =>
            std._id === action.payload._id ? action.payload : std
          );
        }
      )
      .addCase(updateStandard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update standard.";
      })

      // Toggle Standard Status
      .addCase(toggleStandardStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        toggleStandardStatus.fulfilled,
        (state, action: PayloadAction<Standard>) => {
          state.isLoading = false;
          const index = state.standards.findIndex(
            (std) => std._id === action.payload._id
          );
          if (index !== -1) {
            state.standards[index].isActive = !state.standards[index].isActive;
          }
        }
      )
      .addCase(toggleStandardStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to toggle standard status.";
      });
  },
});

export default standardSlice.reducer;
