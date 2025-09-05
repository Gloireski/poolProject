import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { photosService } from '../../services/photosService';
import { Photo, PhotosQuery, PhotosResponse } from '../../types/photosTypes';
import { RootState } from '../index';
import { localPhotosService } from '../../services/localPhotosService';

interface PhotosState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalPages: number;
  totalPhotos: number;
}

const initialState: PhotosState = {
  photos: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  totalPages: 1,
  totalPhotos: 0,
};

export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (query: PhotosQuery = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const status = state.auth.status;
      if (status === 'guest') {
        const local = await localPhotosService.getPhotos();
        return { items: local };
      } else {
        const server = await photosService.getPhotos(query);
        return server;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch photos');
    }
  }
);

export const addLocalPhoto = createAsyncThunk(
  'photos/addLocalPhoto',
  async (photo: Photo) => {
    await localPhotosService.savePhoto(photo);
    return photo;
  }
);


export const loadMorePhotos = createAsyncThunk(
  'photos/loadMorePhotos',
  async (query: PhotosQuery, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { photos: PhotosState };
      const nextPage = state.photos.currentPage + 1;
      return await photosService.getPhotos({ ...query, page: nextPage });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load more photos');
    }
  }
);

export const refreshPhotos = createAsyncThunk(
  'photos/refreshPhotos',
  async (query: PhotosQuery = {}, { rejectWithValue }) => {
    try {
      return await photosService.getPhotos({ ...query, page: 1 });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh photos');
    }
  }
);

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearPhotos: (state) => {
      state.photos = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.totalPages = 1;
      state.totalPhotos = 0;
    },
    setDateFilter: (state, action: PayloadAction<string | undefined>) => {
      // Reset pagination when date filter changes
      state.photos = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPhotos
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action: PayloadAction<PhotosResponse | { items: Photo[] }>) => {
        state.loading = false;
        if ('page' in action.payload) {
          state.photos = action.payload.items;
          state.currentPage = action.payload.page;
          state.hasMore = action.payload.page < action.payload.pages;
          state.totalPages = action.payload.pages;
          state.totalPhotos = action.payload.total;
        } else {
          state.photos = action.payload.items;
          state.currentPage = 1;
          state.hasMore = false;
          state.totalPages = 1;
          state.totalPhotos = action.payload.items.length;
        }
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // loadMorePhotos
      .addCase(loadMorePhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMorePhotos.fulfilled, (state, action: PayloadAction<PhotosResponse>) => {
        state.loading = false;
        state.photos = [...state.photos, ...action.payload.items];
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.page < action.payload.pages;
        state.totalPages = action.payload.pages;
        state.totalPhotos = action.payload.total;
      })
      .addCase(loadMorePhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // refreshPhotos
      .addCase(refreshPhotos.pending, (state) => {
        state.loading = false; // Don't show loading for refresh
        state.error = null;
      })
      .addCase(refreshPhotos.fulfilled, (state, action: PayloadAction<PhotosResponse>) => {
        state.loading = false;
        state.photos = action.payload.items;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.page < action.payload.pages;
        state.totalPages = action.payload.pages;
        state.totalPhotos = action.payload.total;
      })
      .addCase(refreshPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});

export const { clearPhotos, setDateFilter } = photosSlice.actions;
export default photosSlice.reducer;
