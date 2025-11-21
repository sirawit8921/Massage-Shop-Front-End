import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// ดึง user จาก localStorage
let user = null;

try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
} catch (err) {
  console.error("Invalid user JSON found in localStorage. Clearing it.");
  localStorage.removeItem("user");
}


const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Login user
export const login = createAsyncThunk('auth/login', async(user,thunkAPI)=>{
    try {
        return await authService.login(user)
    } catch (error) {
        const message=(error.response && error.response.data && error.response.data.message)||error.message||error.toString();
        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    logout: (state) => {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.fulfilled,(state, action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected,(state, action)=>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user=null
      })
  },
})



export const { reset, logout } = authSlice.actions
export default authSlice.reducer
