export type Photo = {
  id: string;
  uri: string;
  date: string;
  location?: { latitude: number; longitude: number };
  description?: string;
};

