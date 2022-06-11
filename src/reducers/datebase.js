import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const articleSlice = createSlice({
  name: "toolsDatabase",
  initialState,
  reducers: {
    setDatabase: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setDatabase } = articleSlice.actions;

export default articleSlice.reducer;
