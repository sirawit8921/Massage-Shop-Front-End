import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reservationService from './reservationService'

const initialState = {
  reservations: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const getMyReservations = createAsyncThunk(
  "reservation/getMyReservations",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reservationService.getMyReservations(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
)

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservations = action.payload;
      })
      .addCase(getMyReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
})

export default reservationSlice.reducer
