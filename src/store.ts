import { create } from "zustand";

type LocationStore = {
  lat: number | null;
  lng: number | null;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  lat: null,
  lng: null,
  setLat: (lat: number) => set({ lat }),
  setLng: (lng: number) => set({ lng }),
}));
