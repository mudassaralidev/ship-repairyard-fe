import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dockings: [],
  status: 'idle',
  error: null,
  successMessage: null
};

const dockingSlice = createSlice({
  name: 'docking',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.dockings = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    create: (state, action) => {
      const updatedDockings = [action.payload, ...state.dockings];
      state.dockings = updatedDockings;
      state.successMessage = 'Docking created successfully!';
    },
    update: (state, action) => {
      const index = state.dockings.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.dockings[index] = action.payload;
        state.successMessage = 'Docking updated successfully!';
      }
    },
    deleteDocking: (state, action) => {
      state.dockings = state.dockings.filter((item) => item.id !== action.payload.id);
      state.successMessage = 'Docking deleted successfully!';
    },
    clearSuccessMessage: (state) => {
      state.status = 'idle';
      state.successMessage = null;
    }
  }
});

export const { requestStart, requestSuccess, requestFailure, create, update, deleteDocking, clearSuccessMessage } = dockingSlice.actions;

export default dockingSlice.reducer;
