"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PortfolioStore {
  watchlist: string[];
  toggleWatchlist: (propertyId: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      watchlist: ["mumbai-powai-lakefront-boulevard", "hyderabad-gachibowli-verde-homes"],
      toggleWatchlist: (propertyId) =>
        set((state) => ({
          watchlist: state.watchlist.includes(propertyId)
            ? state.watchlist.filter((item) => item !== propertyId)
            : [...state.watchlist, propertyId]
        }))
    }),
    {
      name: "propspace-watchlist"
    }
  )
);
