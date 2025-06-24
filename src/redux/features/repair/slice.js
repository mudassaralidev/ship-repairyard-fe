import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  repairs: [],
  status: 'idle',
  error: null,
  successMessage: null,
  lastAction: ''
};

const repairSlice = createSlice({
  name: 'repair',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.repairs = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    create: (state, action) => {
      state.repairs = [action.payload, ...state.repairs];
      state.successMessage = 'Repair created successfully!';
      state.lastAction = state.lastAction === 'created' ? 'created again' : 'created';
    },
    update: (state, action) => {
      const index = state.repairs.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.repairs[index] = action.payload;
      }
      state.successMessage = 'Repair updated successfully!';
      state.lastAction = state.lastAction === 'updated' ? 'updated again' : 'updated';
    },
    deleteRepair: (state, action) => {
      state.repairs = state.repairs.filter((item) => item.id !== action.payload.id);
      state.successMessage = 'Repair deleted successfully!';
      state.lastAction = 'deleted';
    },
    clearSuccessMessage: (state) => {
      state.status = 'idle';
      state.successMessage = null;
    }
  }
});

export const { requestStart, requestSuccess, requestFailure, create, update, deleteRepair, clearSuccessMessage } = repairSlice.actions;

export default repairSlice.reducer;
