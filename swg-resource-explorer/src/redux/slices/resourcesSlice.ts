import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Resource, ResourcesResponse, ResourceFilters, ResourceCategories } from '../../types/Resource';
import { getResources, getResourceById, getResourceCategories } from '../../utils/api';

// Define the initial state
interface ResourcesState {
  resources: Resource[];
  selectedResource: Resource | null;
  categories: ResourceCategories | null;
  loading: boolean;
  error: string | null;
  totalResources: number;
  currentPage: number;
  pageSize: number;
}

const initialState: ResourcesState = {
  resources: [],
  selectedResource: null,
  categories: null,
  loading: false,
  error: null,
  totalResources: 0,
  currentPage: 1,
  pageSize: 50,
};

// Define async thunks
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (filters: ResourceFilters) => {
    const response = await getResources(filters);
    return response;
  }
);

export const fetchResourceById = createAsyncThunk(
  'resources/fetchResourceById',
  async (id: number) => {
    const response = await getResourceById(id);
    return response;
  }
);

export const fetchResourceCategories = createAsyncThunk(
  'resources/fetchResourceCategories',
  async () => {
    const response = await getResourceCategories();
    return response;
  }
);

// Create the resources slice
const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearSelectedResource: (state) => {
      state.selectedResource = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchResources
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action: PayloadAction<ResourcesResponse>) => {
        state.loading = false;
        state.resources = action.payload.resources;
        state.totalResources = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.limit;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resources';
      });

    // Handle fetchResourceById
    builder
      .addCase(fetchResourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action: PayloadAction<Resource>) => {
        state.loading = false;
        state.selectedResource = action.payload;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resource';
      });

    // Handle fetchResourceCategories
    builder
      .addCase(fetchResourceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceCategories.fulfilled, (state, action: PayloadAction<ResourceCategories>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchResourceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resource categories';
      });
  },
});

// Export actions and reducer
export const { setCurrentPage, setPageSize, clearSelectedResource } = resourcesSlice.actions;
export default resourcesSlice.reducer;
