import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const setOneArticle = createSlice({
  name: "setArticle",
  initialState,
  reducers: {
    setArticle: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setArticle } = setOneArticle.actions;

export default setOneArticle.reducer;
