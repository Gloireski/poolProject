import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PhotoItem = {
  id: string; // uuid / unique
  uri: string; // chemin local vers la photo (file://...)
  timestamp: string; // ISO string
  coords?: {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy?: number | null;
  };
  address?: string | null; // optionnel si reverse geocoding
  notes?: string | null;
};

type PhotosState = {
  items: PhotoItem[];
};

const initialState: PhotosState = { items: [] };

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    addPhoto(state, action: PayloadAction<PhotoItem>) {
      state.items.unshift(action.payload); // latest first
    },
    // other reducers possible: removePhoto, updatePhoto, clearPhotos...
    removePhoto(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPhoto, removePhoto } = photosSlice.actions;
export default photosSlice.reducer;