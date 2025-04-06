import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceFilters } from '../../types/Resource';

// Define the initial state
const initialState: ResourceFilters = {
  name: '',
  type: '',
  planet: '',
  stats: {},
  page: 1,
  limit: 50,
  sortBy: null as string | null,
  sortDirection: 'desc' as 'asc' | 'desc',
  sortStats: [] as string[],
};

// Create the filters slice
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.page = 1; // Reset to first page when filter changes
    },
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
      state.page = 1;
    },
    setPlanetFilter: (state, action: PayloadAction<string>) => {
      state.planet = action.payload;
      state.page = 1;
    },
    setStatFilter: (
      state,
      action: PayloadAction<{
        stat: string;
        range: { min?: number; max?: number };
      }>
    ) => {
      const { stat, range } = action.payload;
      if (!state.stats) {
        state.stats = {};
      }
      state.stats[stat] = range;
      state.page = 1;
    },
    clearStatFilter: (state, action: PayloadAction<string>) => {
      const stat = action.payload;
      if (state.stats && state.stats[stat]) {
        delete state.stats[stat];
      }
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page when limit changes
    },
    resetFilters: () => initialState,
    setSortBy: (state, action: PayloadAction<string | null>) => {
      state.sortBy = action.payload;
      if (action.payload !== 'average') {
        state.sortStats = [];
      }
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortDirection = action.payload;
    },
    addStatToAverage: (state, action: PayloadAction<string>) => {
      if (!state.sortStats) {
        state.sortStats = [];
      }
      if (!state.sortStats.includes(action.payload)) {
        state.sortStats.push(action.payload);
      }
      state.sortBy = 'average';
    },
    removeStatFromAverage: (state, action: PayloadAction<string>) => {
      if (!state.sortStats) {
        state.sortStats = [];
        return;
      }
      state.sortStats = state.sortStats.filter(stat => stat !== action.payload);
      if (state.sortStats.length === 0) {
        state.sortBy = null;
      }
    },
    clearSortStats: (state) => {
      state.sortStats = [];
      state.sortBy = null;
    },
  },
});

// Export actions and reducer
export const {
  setNameFilter,
  setTypeFilter,
  setPlanetFilter,
  setStatFilter,
  clearStatFilter,
  setPage,
  setLimit,
  resetFilters,
  setSortBy,
  setSortDirection,
  addStatToAverage,
  removeStatFromAverage,
  clearSortStats,
} = filtersSlice.actions;
export default filtersSlice.reducer;
