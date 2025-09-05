export interface Photo {
  _id: string;
  uri?: string;          // chemin local (guest)
  downloadUrl?: string;  // chemin serveur (authenticated)
  latitude: number;
  longitude: number;
  capturedAt: string;
  address?: string;
  notes?: string;
  userId?: string;
  isProfilePicture?: boolean;
}

export interface PhotosResponse {
  items: Photo[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PhotosQuery {
  page?: number;
  limit?: number;
  date?: string;
}