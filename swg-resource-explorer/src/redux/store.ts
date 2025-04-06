import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from './slices/resourcesSlice';
import filtersReducer from './slices/filtersSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    filters: filtersReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
