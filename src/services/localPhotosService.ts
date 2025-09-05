import * as FileSystem from 'expo-file-system';
import { Photo } from '../types/photosTypes';

const LOCAL_PHOTOS_DIR = FileSystem.documentDirectory + 'guest_photos/';

async function ensureDir() {
  const dirInfo = await FileSystem.getInfoAsync(LOCAL_PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(LOCAL_PHOTOS_DIR, { intermediates: true });
  }
}

export const localPhotosService = {
  async savePhoto(photo: Photo) {
    await ensureDir();
    const filePath = `${LOCAL_PHOTOS_DIR}${photo._id}.json`;
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(photo));
    return photo;
  },

  async getPhotos(): Promise<Photo[]> {
    await ensureDir();
    const files = await FileSystem.readDirectoryAsync(LOCAL_PHOTOS_DIR);
    const photos: Photo[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await FileSystem.readAsStringAsync(LOCAL_PHOTOS_DIR + file);
        photos.push(JSON.parse(content));
      }
    }
    return photos;
  },

  async deletePhoto(id: string) {
    const filePath = `${LOCAL_PHOTOS_DIR}${id}.json`;
    await FileSystem.deleteAsync(filePath, { idempotent: true });
  },
};
