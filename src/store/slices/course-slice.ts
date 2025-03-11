import { CourseFormValues } from "@/lib/validations/course-schema";
import { Course, initialState } from "@/types/course";
import {
  coursesStatusToggle,
  coursesUpdate,
  createNewCourse,
  getAllCourses,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (
    { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(getAllCourses, {
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

export const createCourse = createAsyncThunk(
  "courses/addCourse",
  async (course: CourseFormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(createNewCourse, course);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (
    { id, courseData }: { id: string; courseData: Partial<CourseFormValues> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `${coursesUpdate}/${id}`,
        courseData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const toggleCourseStatus = createAsyncThunk(
  "courses/toggleStatus",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(coursesStatusToggle, {
        courseId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all course
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.docs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch courses";
      })

      // add course
      .addCase(createCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses.push(action.payload);
        state.courses.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update courses
      .addCase(updateCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })

      // toggle courses
      .addCase(toggleCourseStatus.pending, (state, action) => {
        // state.isLoading = true;
      })
      .addCase(toggleCourseStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleCourseStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index].isActive = !state.courses[index].isActive;
        }
      });
  },
});

export default courseSlice.reducer;
