import { User } from "@/src/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/src/services/authService";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = { user: null, loading: false, error: null };

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMe = createAsyncThunk("user/me", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.me();
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { logout: (state) => { state.user = null; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(fetchMe.rejected, (state) => { state.loading = false; state.user = null; });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
