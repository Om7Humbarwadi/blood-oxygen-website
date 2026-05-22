import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

const TOKEN_KEY = "hem_access_token";
const USER_KEY = "hem_user";

const persistedToken = localStorage.getItem(TOKEN_KEY);
const persistedUser = localStorage.getItem(USER_KEY);

const initialState = {
  token: persistedToken || null,
  user: persistedUser ? JSON.parse(persistedUser) : null,
  isAuthenticated: Boolean(persistedToken),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const result = await authService.login(payload);
    return result;
  } catch (error) {
    const message = error?.response?.data?.message || "Login failed";
    return rejectWithValue(message);
  }
});

export const registerThunk = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const result = await authService.register(payload);
    return result;
  } catch (error) {
    const message = error?.response?.data?.message || "Registration failed";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.accessToken) {
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
