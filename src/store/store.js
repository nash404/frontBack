import { configureStore } from "@reduxjs/toolkit";
import articleSlice from "../reducers/datebase";
import errorsSlice from "../reducers/errors";
import colour from "../reducers/colours";
import setSaved from "../reducers/savedArticle";
import setOneArticle from "../reducers/article";
export const store = configureStore({
  reducer: {
    toolsDatabase: articleSlice,
    errorsSlice: errorsSlice,
    colours: colour,
    setArticle: setOneArticle,
    getSavedArticle: setSaved,
  },
});
