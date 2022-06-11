import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const savedSlice = createSlice({
  name: "setSaved",
  initialState,
  reducers: {
    setSaved: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSaved } = savedSlice.actions;

export default savedSlice.reducer;
