import {
  activity_POST,
  activity_GET,
  activity_GET_ID,
  activity_UPDATA,
  activity_status_UPDATA,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Activity {
  _id: string;
  name: string;
  isActive: boolean;
  [key: string]: any; // For additional properties
}

interface ActivityState {
  activitys: Activity[];
  currentactivity: Activity | null;
  isLoading: boolean;
  error: string | null;
}

interface UpdateActivityPayload {
  id: string;
  data: Partial<Activity>;
}

// Initial State
const initialState: ActivityState = {
  activitys: [],
  currentactivity: null,
  isLoading: false,
  error: null,
};

// Thunks
export const createactivity = createAsyncThunk(
  "createactivity",
  async (data: Partial<Activity>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(activity_POST, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllactivity = createAsyncThunk(
  "getAllactivity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(activity_GET);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchactivityById = createAsyncThunk(
  "activityById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        activity_GET_ID.replace(":id", id)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updataactivity = createAsyncThunk(
  "updataactivity",
  async ({ id, data }: UpdateActivityPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        activity_UPDATA.replace(":id", id),
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleactivityStatus = createAsyncThunk(
  "toggleactivity",
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(activity_status_UPDATA, {
        activityId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create activities
      .addCase(createactivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createactivity.fulfilled,
        (state, action: PayloadAction<Activity>) => {
          state.isLoading = false;
          state.activitys.push(action.payload);
        }
      )
      .addCase(createactivity.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All activities
      .addCase(fetchAllactivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllactivity.fulfilled,
        (state, action: PayloadAction<Activity[]>) => {
          state.isLoading = false;
          state.activitys = action.payload;
        }
      )
      .addCase(
        fetchAllactivity.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Fetch activities By ID
      .addCase(fetchactivityById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchactivityById.fulfilled,
        (state, action: PayloadAction<Activity>) => {
          state.isLoading = false;
          state.currentactivity = action.payload;
        }
      )
      .addCase(
        fetchactivityById.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Update activities
      .addCase(updataactivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updataactivity.fulfilled,
        (state, action: PayloadAction<Activity>) => {
          state.isLoading = false;
          state.activitys = state.activitys.map((value) =>
            value._id === action.payload._id ? action.payload : value
          );
        }
      )
      .addCase(updataactivity.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Toggle activities Status
      .addCase(toggleactivityStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        toggleactivityStatus.fulfilled,
        (state, action: PayloadAction<Activity>) => {
          state.isLoading = false;
          const index = state.activitys.findIndex(
            (value) => value._id === action.payload._id
          );
          if (index !== -1) {
            state.activitys[index].isActive = !state.activitys[index].isActive;
          }
        }
      )
      .addCase(
        toggleactivityStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default activitySlice.reducer;
