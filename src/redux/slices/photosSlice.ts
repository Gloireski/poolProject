import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Photo } from "../../types";

type PhotosState = {
  list: Photo[];
};

// Mock data (photos fictives avec images en ligne)
const initialState: PhotosState = {
  list: [
    {
      id: "1",
      uri: "https://picsum.photos/300?random=1",
      date: "2025-09-01",
      location: { latitude: 48.8566, longitude: 2.3522 }, // Paris
      description: "Paris"
    },
    {
      id: "2",
      uri: "https://picsum.photos/400?random=2",
      date: "2025-09-02",
      location: { latitude: 40.7128, longitude: -74.0060 }, // New York
      description: "New York"
    },
    {
      id: "3",
      uri: "https://picsum.photos/500?random=3",
      date: "2025-09-02",
      location: { latitude: 35.6895, longitude: 139.6917 }, // Tokyo
      description: "Tokyo"
    },
  ],
};

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.list.push(action.payload);
    },
    removePhoto: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPhoto, removePhoto } = photosSlice.actions;
export default photosSlice.reducer;
