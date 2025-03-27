/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuizFormSchema } from "@/lib/validations/quiz-schema";
import { Quiz, QuizResponse } from "@/types/quiz";
import {
  createNewQuiz,
  allQuiz,
  quizUpdate,
  quizToggleStatus,
  getQuizByID,
  quizResult,
} from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { QuizResult, QuizResultResponse } from "@/types/quiz-result.ts";

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  error: string | null;
  quizResult: QuizResult[];
  qrCurrentPage: number;
  qrTotalPages: number;
  isQuizResultLoading: boolean;
}

// Create Async Thunks for CRUD operations
export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData: Partial<QuizFormSchema>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(createNewQuiz, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (
    { page, search = "" }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(allQuiz, {
        params: {
          page: page,
          search: search,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${getQuizByID}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async (
    { id, quizData }: { id: string; quizData: Partial<QuizFormSchema> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`${quizUpdate}/${id}`, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleQuiz = createAsyncThunk(
  "quiz/toggleQuiz",
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(quizToggleStatus, { quizId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getQuizResult = createAsyncThunk(
  "quiz/getQuizResult",
  async (
    { quizId, page }: { quizId: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(quizResult, { quizId, page });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getQuizLeaderboard = createAsyncThunk(
  "quiz/quiz-leader-board",
  async (
    { quizId, page }: { quizId: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(quizResult);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  error: null,
  quizResult: [],
  isQuizResultLoading: false,
  qrCurrentPage: 1,
  qrTotalPages: 1,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      console.log("currentQuiz :>> ", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch quiz
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchQuizzes.fulfilled,
        (state, action: PayloadAction<QuizResponse>) => {
          state.isLoading = false;
          state.quizzes = action.payload.docs;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchQuizzes.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message || "Something went wrong";
      })

      // create quiz
      .addCase(createQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false;
        state.quizzes.push(action.payload);
        state.quizzes.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      })
      .addCase(createQuiz.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message || "Something went wrong";
      })

      // update quiz
      .addCase(updateQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false;
        const index = state.quizzes.findIndex(
          (quiz) => quiz._id === action.payload._id
        );
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      .addCase(updateQuiz.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get quiz
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchQuizById.fulfilled,
        (state, action: PayloadAction<Quiz>) => {
          state.isLoading = false;
          state.currentQuiz = action.payload;
        }
      )
      .addCase(fetchQuizById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // toggle quiz
      .addCase(toggleQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false;
        const index = state.quizzes.findIndex(
          (quiz) => quiz._id === action.payload._id
        );
        if (index !== -1) {
          state.quizzes[index].isActive = !state.quizzes[index].isActive;
        }
      })
      .addCase(toggleQuiz.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getQuizResult.pending, (state) => {
        state.isQuizResultLoading = true;
        state.error = null;
      })
      .addCase(
        getQuizResult.fulfilled,
        (state, action: PayloadAction<QuizResultResponse>) => {
          state.isQuizResultLoading = false;
          state.error = null;
          state.quizResult = action.payload.docs;
          state.qrCurrentPage = action.payload.currentPage;
          state.qrTotalPages = action.payload.totalPages;
        }
      )
      .addCase(getQuizResult.rejected, (state, action: PayloadAction<any>) => {
        state.isQuizResultLoading = false;
        state.error = action.payload.message || "Something went wrong";
      });
  },
});

export const { setCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;
