import { LessonFormData } from "@/lib/validations/lesson-schema";
import {
  alllesson,
  createNewlesson,
  lessonToggleStatus,
  lessonUpdate,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, Lesson } from "@/types/lesson";

export const fetchlesson = createAsyncThunk(
  "lesson/fetchlesson",
  async (
    { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(alllesson, {
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

export const createlesson = createAsyncThunk(
  "lesson/addlesson",
  async (
    {
      courseId,
      lessons,
    }: { courseId: string; lessons: Partial<LessonFormData[]> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(createNewlesson, {
        courseId,
        lessons,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatelesson = createAsyncThunk(
  "lesson/updatelesson",
  async (
    { id, courseData }: { id: string; courseData: Partial<LessonFormData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `${lessonUpdate}/${id}`,
        courseData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const togglelessonStatus = createAsyncThunk(
  "lesson/toggleStatus",
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(lessonToggleStatus, {
        lessonId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all course
      .addCase(fetchlesson.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchlesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lessons = action.payload.docs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchlesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch courses";
      })

      // add course
      .addCase(createlesson.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        createlesson.fulfilled,
        (state, action: PayloadAction<Lesson[]>) => {
          state.isLoading = false;
          // console.log("createLesson", action.payload);
          state.lessons.push(...action.payload);
          state.lessons.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        }
      )
      .addCase(createlesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update courses
      .addCase(updatelesson.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updatelesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updatelesson.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.lessons.findIndex(
          (value) => value._id === action.payload._id
        );
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })

      // toggle courses
      .addCase(togglelessonStatus.pending, (state, action) => {
        // state.isLoading = true;
      })
      .addCase(togglelessonStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(togglelessonStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.lessons.findIndex(
          (value) => value._id === action.payload._id
        );
        if (index !== -1) {
          state.lessons[index].isActive = !state.lessons[index].isActive;
        }
      });
  },
});

export default lessonSlice.reducer;
