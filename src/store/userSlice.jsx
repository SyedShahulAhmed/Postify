import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false, // 🔹 Checks if user is logged in
  user: null, // 🔹 Stores user data
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // ✅ Stores user object
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null; // ✅ Clears user data
    }
  }
});

// ✅ Exporting actions
export const { setUser, clearUser } = authSlice.actions;

// ✅ Exporting reducer for store configuration
export default authSlice.reducer;
