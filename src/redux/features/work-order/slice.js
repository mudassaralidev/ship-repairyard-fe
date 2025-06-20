import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workOrders: [],
  inventoryOrders: [],
  status: 'idle',
  error: null,
  successMessage: null
};

const workOrderSlice = createSlice({
  name: 'workOrder',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.workOrders = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    create: (state, action) => {
      state.workOrders = [action.payload, ...state.workOrders];
      state.successMessage = 'Work order created successfully!';
    },
    update: (state, action) => {
      const index = state.workOrders.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.workOrders[index] = action.payload;
        state.successMessage = 'Work order updated successfully!';
      } else {
        state.successMessage = 'Work order updated successfully!';
      }
    },
    assignEmployees: (state, action) => {
      state.successMessage = action.payload || 'Employees are assigned successfully!';
    },
    deleteWorkOrder: (state, action) => {
      state.workOrders = state.workOrders.filter((item) => item.id !== action.payload.id);
      state.successMessage = 'Work order deleted successfully!';
    },
    setInventoryOrders: (state, action) => {
      state.inventoryOrders = action.payload;
    },
    updateInventoryOrder: (state, action) => {
      const index = state.inventoryOrders.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.inventoryOrders[index] = action.payload;
        state.successMessage = 'Inventory Order updated successfully!';
      } else {
        state.successMessage = 'Inventory order updated successfully!';
      }
    },
    createInventoryOrder: (state, action) => {
      state.inventoryOrders = [action.payload, ...state.inventoryOrders];
      state.successMessage = 'Inventory order created successfully!';
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
  create,
  update,
  deleteWorkOrder,
  assignEmployees,
  setInventoryOrders,
  updateInventoryOrder,
  createInventoryOrder,
  clearSuccessMessage
} = workOrderSlice.actions;

export default workOrderSlice.reducer;
