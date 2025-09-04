import { configureStore } from "@reduxjs/toolkit";
import photosReducer from "./features/photos/photoSlice";

export const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
