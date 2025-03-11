import { AdminLoginUrl, getMyProfile } from "@/utils/constants/ApiEndPoints";
import axiosInstance from "@/utils/network/AxiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Define the shape of the state
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  email: string | null;
  activeQuiz: number;
  payment: number;
  totalUser: number;
}

// Define the shape of credentials and response
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  totalSum: number;
  activeQuiz: number;
  totalUser: number;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  email: null,
  activeQuiz: 0,
  payment: 0,
  totalUser: 0,
};

// Login action
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      AdminLoginUrl,
      credentials
    );
    const { accessToken, refreshToken } = response.data;
    Cookies.set("accessToken", accessToken);
    Cookies.set("refreshToken", refreshToken);
    // document.cookie = `accessToken=${accessToken};`;
    // document.cookie = `refreshToken=${refreshToken};`;

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "An error occurred"
    );
  }
});

export const getProfile = createAsyncThunk(
  "getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getMyProfile);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("logout :>> ");
      Cookies.set("accessToken", "");
      Cookies.set("refreshToken", "");
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loginUser.pending,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.email = action.payload.email;
        }
      )
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An unknown error occurred";
        }
      )

      .addCase(
        getProfile.pending,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.email = action.payload.email;
          state.payment = action.payload.totalSum;
          state.activeQuiz = action.payload.activeQuiz;
          state.totalUser = action.payload.totalUser;
        }
      )
      .addCase(getProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
