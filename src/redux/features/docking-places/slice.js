import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_PAGINATION } from "utils/pagination";

const initialState = {
  dockingPlaces: [],
  dockingPlace: null,
  pagination: {
    ...INITIAL_PAGINATION,
  },
  loading: false,
  error: null,
  successMessage: null,
};

const dockingPlacesSlice = createSlice({
  name: "dockingPlaces",
  initialState,
  reducers: {
    // Loading states
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Fetch docking places
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.dockingPlaces = action.payload.dockingPlaces;
      state.pagination = action.payload.pagination;
    },

    fetchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create docking place
    createSuccess: (state, action) => {
      state.loading = false;
      state.dockingPlaces.unshift(action.payload);
      state.successMessage = "Docking place created successfully!";
      // Update total records
      state.pagination.totalRecords += 1;
    },

    createError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update docking place
    updateSuccess: (state, action) => {
      state.loading = false;
      const index = state.dockingPlaces.findIndex(
        (place) => place.id === action.payload.id,
      );
      if (index !== -1) {
        state.dockingPlaces[index] = action.payload;
      }
      state.successMessage = "Docking place updated successfully!";
    },

    updateError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete docking place
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.dockingPlaces = state.dockingPlaces.filter(
        (place) => place.id !== action.payload,
      );
      state.successMessage = "Docking place deleted successfully!";
      // Update total records
      state.pagination.totalRecords -= 1;
    },

    deleteError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set selected docking place
    setSelectedDockingPlace: (state, action) => {
      state.dockingPlace = action.payload;
    },

    // Clear messages
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetState: () => initialState,
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchError,
  createSuccess,
  createError,
  updateSuccess,
  updateError,
  deleteSuccess,
  deleteError,
  setSelectedDockingPlace,
  clearSuccessMessage,
  clearError,
  resetState,
} = dockingPlacesSlice.actions;

export default dockingPlacesSlice.reducer;
