import { configureStore } from "@reduxjs/toolkit";
import photosReducer from "./slices/photosSlice";
import userReducer from "./slices/userSlice";

// Création du store
export const store = configureStore({
  reducer: {
    photos: photosReducer,
    user: userReducer,
  },
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
