"use client";

import { create } from "zustand";

import type { PropertyFilters } from "@/types";

export const defaultFilters: PropertyFilters = {
  query: "",
  city: null,
  propertyType: "all",
  minPrice: 0,
  maxPrice: 60000000,
  bhk: null,
  furnishing: "all",
  possession: "all",
  verifiedOnly: false,
  minAiScore: 0
};

interface SearchStore {
  filters: PropertyFilters;
  setFilters: (nextFilters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: defaultFilters,
  setFilters: (nextFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...nextFilters
      }
    })),
  resetFilters: () =>
    set({
      filters: defaultFilters
    })
}));
