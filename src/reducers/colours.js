import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colours: ["#000", "#b6b6b6", "#b6b6b6"],
};

export const setColour = createSlice({
  name: "setColours",
  initialState,
  reducers: {
    colour: (state, action) => {
      state.colours = action.payload;
    },
  },
});

export const { colour } = setColour.actions;

export default setColour.reducer;
