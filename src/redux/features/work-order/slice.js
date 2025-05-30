import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workOrders: [],
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
    clearSuccessMessage: (state) => {
      state.status = 'idle';
      state.successMessage = null;
    }
  }
});

export const { requestStart, requestSuccess, requestFailure, create, update, deleteWorkOrder, assignEmployees, clearSuccessMessage } =
  workOrderSlice.actions;

export default workOrderSlice.reducer;
