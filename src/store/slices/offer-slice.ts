import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/network/AxiosInstance";
import {
  GET_OFFERS,
  POST_OFFER,
  GET_OFFER_DETAILS,
  PUT_OFFER,
  DELETE_OFFER,
  GET_ELIGIBLE_QUIZZES,
  GET_ELIGIBLE_COURSES,
} from "@/utils/constants/ApiEndPoints";
import { Course, Offer, OfferResponse, OfferState } from "@/types/offer";
import { OfferFormSchema } from "@/lib/validations/offer-schema";
import { toast } from "@/hooks/use-toast";

const initialState: OfferState = {
  offers: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  courses: [],
  isLoadingCourse: false,
  quizzes: [],
  isLoadingQuiz: false,
};

// Async thunks
export const fetchOffers = createAsyncThunk(
  "fetchOffers",
  async (
    { page, search }: { page: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(GET_OFFERS, {
        params: { page, search },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createOffer = createAsyncThunk(
  "createOffer",
  async (offer: Partial<OfferFormSchema>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(POST_OFFER, offer);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOfferDetails = createAsyncThunk(
  "fetchOfferDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(GET_OFFER_DETAILS(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOffer = createAsyncThunk(
  "updateOffer",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<OfferFormSchema> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(PUT_OFFER(id), updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "deleteOffer",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(DELETE_OFFER(id));
      return { ...response.data, id: id };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchEligibleQuizzes = createAsyncThunk(
  "searchEligibleQuizzes",
  async (searchParams: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        GET_ELIGIBLE_QUIZZES,
        searchParams
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchEligibleCourses = createAsyncThunk(
  "searchEligibleCourses",
  async (searchParams: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        GET_ELIGIBLE_COURSES,
        searchParams
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all offers
      .addCase(fetchOffers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOffers.fulfilled,
        (state, action: PayloadAction<OfferResponse>) => {
          state.isLoading = false;
          state.offers = action.payload.offers;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchOffers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create offer
      .addCase(createOffer.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.isLoading = false;
        state.offers.push(action.payload);
      })
      .addCase(createOffer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        toast({
          title: "Error",
          description: action.payload.message,
          variant: "destructive",
        });
      })

      // Fetch offer details
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOfferDetails.fulfilled,
        (state, action: PayloadAction<Offer>) => {
          state.isLoading = false;
          const index = state.offers.findIndex(
            (offer) => offer._id === action.payload._id
          );
          if (index === -1) {
            state.offers.push(action.payload);
          }
        }
      )
      .addCase(
        fetchOfferDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Update offer
      .addCase(updateOffer.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.isLoading = false;
        const index = state.offers.findIndex(
          (offer) => offer._id === action.payload._id
        );
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
      })
      .addCase(updateOffer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        toast({
          title: "Error",
          description: action.payload.message,
          variant: "destructive",
        });
      })

      // Delete offer
      .addCase(deleteOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.offers = state.offers.filter(
          (offer) => offer._id !== action.payload.id
        );
      })
      .addCase(deleteOffer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // fetch courses for offer
      .addCase(searchEligibleCourses.pending, (state) => {
        state.isLoadingCourse = true;
        state.error = null;
      })
      .addCase(
        searchEligibleCourses.fulfilled,
        (state, action: PayloadAction<{ courses: Course[] }>) => {
          state.isLoadingCourse = false;
          state.courses = action.payload.courses;
        }
      )
      .addCase(
        searchEligibleCourses.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoadingCourse = false;
          state.error = action.payload;
        }
      )

      // fetch quiz for offer
      .addCase(searchEligibleQuizzes.pending, (state) => {
        state.isLoadingQuiz = true;
        state.error = null;
      })
      .addCase(
        searchEligibleQuizzes.fulfilled,
        (state, action: PayloadAction<{ quizzes: Course[] }>) => {
          state.isLoadingQuiz = false;
          state.quizzes = action.payload.quizzes;
        }
      )
      .addCase(
        searchEligibleQuizzes.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoadingQuiz = false;
          state.error = action.payload;
        }
      );
  },
});

export default offerSlice.reducer;
