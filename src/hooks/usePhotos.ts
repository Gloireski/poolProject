import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { api } from "../services/api";
import { Photo } from "../types/photosTypes";

export function usePhotos() {
  return useQuery<Photo[], Error>({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await api.get("/photos");
      console.log("Fetched photos:", res.data);
      return res.data.items; // Assure-toi que c’est un array
    },
    staleTime: 1000 * 60, // facultatif
  });
}
