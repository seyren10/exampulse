import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./type";
import type { RootState } from "../../store";

const initialState: UserState = {
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const selectUser = (state: RootState) => state.users.user;
export const selectUserIsVerified = (state: RootState) => {
  if (!state.users.user) return false;
  return state.users.user.email_verified_at !== null;
};

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
