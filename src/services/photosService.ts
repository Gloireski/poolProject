import { api } from './api';
import { Photo, PhotosQuery, PhotosResponse } from '../types/photosTypes';

export const photosService = {
  async getPhotos(query: PhotosQuery = {}): Promise<PhotosResponse> {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.date) params.set('date', query.date);
    
    const response = await api.get(`/photos?${params.toString()}`);
    return response.data;
  },

  async getPhotoById(id: string): Promise<Photo> {
    const response = await api.get(`/photos/${id}`);
    return response.data;
  },

  async createPhoto(photoData: Partial<Photo>): Promise<Photo> {
    const response = await api.post('/photos', photoData);
    return response.data;
  },

  async deletePhoto(id: string): Promise<void> {
    await api.delete(`/photos/${id}`);
  }
};
