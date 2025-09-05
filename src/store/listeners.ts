// store/listeners.ts
import { login, logout } from "./slices/authSlice";
import { QueryClient } from "@tanstack/react-query";

export const setupAuthListeners = (queryClient: QueryClient, store: any) => {
  store.subscribe(() => {
    const action = store.getState().lastAction; // ou utilise middleware
    if (!action) return;

    switch (action.type) {
      case login.fulfilled.type:
        queryClient.invalidateQueries({ queryKey: ["photos"] });
        break;
      case logout.fulfilled.type:
        queryClient.removeQueries({ queryKey: ["photos"] }); // vide le cache
        break;
    }
  });
};
