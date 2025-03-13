import { CourseFormValues } from '@/lib/validations/course-schema';
import { upComingLiveFormValues } from '@/lib/validations/upcomingLive-schema';
import { initialState, Live } from '@/types/upcoming-live';
import {
  coursesUpdate,
  createNewCourse,
  GET_UPCOMING_STREAM,
  START_STREAM,
} from '@/utils/constants/ApiEndPoints';
import axiosInstance from '@/utils/network/AxiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchUpcomingLive = createAsyncThunk(
  'live/fetchUpcomingLive',
  async (
    {},
    // { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(GET_UPCOMING_STREAM);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUpComingLive = createAsyncThunk(
  'live/startUpcomingLive',
  async (course: upComingLiveFormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(START_STREAM, course);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// export const updateCourse = createAsyncThunk(
//   "courses/updateCourse",
//   async (
//     { id, courseData }: { id: string; courseData: Partial<CourseFormValues> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.put(
//         `${coursesUpdate}/${id}`,
//         courseData
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const courseSlice = createSlice({
  name: 'upcomingLive',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all course
      .addCase(fetchUpcomingLive.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUpcomingLive.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upComingLives = action.payload.docs;
      })
      .addCase(fetchUpcomingLive.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      });

    // add course
    //   .addCase(createCourse.pending, (state, action) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(createCourse.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.courses.push(action.payload);
    //     state.courses.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    //   })
    //   .addCase(createCourse.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.error.message;
    //   })

    // update courses
    //   .addCase(updateCourse.pending, (state, action) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(updateCourse.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.error.message;
    //   })
    //   .addCase(updateCourse.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     const index = state.courses.findIndex(
    //       (course) => course._id === action.payload._id
    //     );
    //     if (index !== -1) {
    //       state.courses[index] = action.payload;
    //     }
    //   })
  },
});

export default courseSlice.reducer;
