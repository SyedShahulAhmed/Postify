import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, // 🔹 Represents authentication status
  userData: null, // 🔹 Stores authenticated user data
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload; // ✅ Ensure payload contains user object
    },
    logout: (state) => {
      state.status = false;
      state.userData = null; // ✅ Clears user data properly
    }
  }
});

// ✅ Exporting actions for easy dispatch
export const { login, logout } = authSlice.actions;

// ✅ Exporting the reducer for store configuration
export default authSlice.reducer;
