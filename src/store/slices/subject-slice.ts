// src/redux/standardSlice.ts
import { Standard } from "@/types/standard";
import {
  subject_POST,
  subject_GET,
  subject_GET_ID,
  subject_UPDATA,
  subject_status_UPDATA,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Subject {
  _id: string;
  subject: string;
  isActive: boolean;
  standard?: Standard;
}

interface SubjectState {
  subjects: Subject[];
  currentsubject: Subject | null;
  isLoading: boolean | null;
  error: string | null;
}

interface UpdateSubjectPayload {
  id: string;
  data: Partial<Subject>;
}

// Initial state
const initialState: SubjectState = {
  subjects: [],
  currentsubject: null,
  isLoading: null,
  error: null,
};

// Thunks
export const createsubject = createAsyncThunk(
  "createsubject",
  async (data: Partial<Subject>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(subject_POST, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllsubject = createAsyncThunk(
  "getAllsubject",
  async (standard: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(subject_GET, {
        params: { standard },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchsubjectById = createAsyncThunk(
  "subjectById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        subject_GET_ID.replace(":id", id)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatasubject = createAsyncThunk(
  "updatasubject",
  async ({ id, data }: UpdateSubjectPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        subject_UPDATA.replace(":id", id),
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const togglesubjectStatus = createAsyncThunk(
  "togglesubject",
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(subject_status_UPDATA, {
        subjectId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create subject
      .addCase(createsubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createsubject.fulfilled,
        (state, action: PayloadAction<Subject>) => {
          state.isLoading = false;
          state.subjects.unshift(action.payload);
        }
      )
      .addCase(createsubject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All subjects
      .addCase(fetchAllsubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllsubject.fulfilled,
        (state, action: PayloadAction<Subject[]>) => {
          state.isLoading = false;
          state.subjects = action.payload;
        }
      )
      .addCase(
        fetchAllsubject.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Fetch subject By ID
      .addCase(fetchsubjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchsubjectById.fulfilled,
        (state, action: PayloadAction<Subject>) => {
          state.isLoading = false;
          state.currentsubject = action.payload;
        }
      )
      .addCase(
        fetchsubjectById.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Update subject
      .addCase(updatasubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updatasubject.fulfilled,
        (state, action: PayloadAction<Subject>) => {
          state.isLoading = false;
          state.subjects = state.subjects.map((value) =>
            value._id === action.payload._id ? action.payload : value
          );
        }
      )
      .addCase(updatasubject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Toggle subject Status
      .addCase(togglesubjectStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        togglesubjectStatus.fulfilled,
        (state, action: PayloadAction<Subject>) => {
          state.isLoading = false;
          const index = state.subjects.findIndex(
            (value) => value._id === action.payload._id
          );
          if (index !== -1) {
            state.subjects[index].isActive = !state.subjects[index].isActive;
          }
        }
      )
      .addCase(
        togglesubjectStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default subjectSlice.reducer;
