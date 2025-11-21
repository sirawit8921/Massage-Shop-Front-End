import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import reservationReducer from "../features/reservation/reservationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservation: reservationReducer,
  },
});
