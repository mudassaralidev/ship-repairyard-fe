import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventories: [],
  inventory: {},
  status: 'idle',
  error: null,
  successMessage: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.inventories = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    createInventory: (state, action) => {
      state.inventories.unshift(action.payload);
      state.successMessage = 'Inventory created successfully!';
    },
    updateInventory: (state, action) => {
      const index = state.inventories.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.inventories[index] = action.payload;
        state.successMessage = 'Inventory updated successfully!';
      }
    },
    deleteInventory: (state, action) => {
      state.inventories = state.inventories.filter((item) => item.id !== action.payload.id);
      state.successMessage = 'Inventory deleted successfully!';
    },
    getInventory: (state, action) => {
      state.inventory = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.status = 'idle';
      state.successMessage = null;
    }
  }
});

export const {
  requestStart,
  requestSuccess,
  requestFailure,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventory,
  clearSuccessMessage
} = inventorySlice.actions;

export default inventorySlice.reducer;
