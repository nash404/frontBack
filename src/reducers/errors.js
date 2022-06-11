import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errors: [],
};

export const errorsSlice = createSlice({
  name: "setErrors",
  initialState,
  reducers: {
    setErrors: (state, action) => {
      state.errors.push(...action.payload);
    },
    deleteError: (state, action) => {
      state.errors.splice(action.payload, 1);
    },
    clearError: (state) => {
      state.errors = [];
    },
  },
});

export const { setErrors, deleteError, clearError } = errorsSlice.actions;

export default errorsSlice.reducer;
