// src/features/shipyard/shipyardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipyards: [],
  shipyardUsers: [],
  shipyard: {},
  status: 'idle',
  error: null,
  successMessage: null
};

const shipyardSlice = createSlice({
  name: 'shipyard',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.shipyards = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    create: (state, action) => {
      state.shipyards.unshift(action.payload);
      state.successMessage = 'Shipyard created successfully!';
    },
    update: (state, action) => {
      const index = state.shipyards.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.shipyards[index] = action.payload;
        state.successMessage = 'Shipyard updated successfully!';
      }
    },
    deleteYard: (state, action) => {
      state.shipyards = state.shipyards.filter((item) => item.id !== action.payload.id);
      state.successMessage = 'Shipyard deleted successfully!';
    },
    shipyardUsers: (state, action) => {
      state.shipyardUsers = action.payload || [];
    },
    updateSYUser: (state, action) => {
      const index = state.shipyardUsers.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.shipyardUsers[index] = action.payload;
        state.successMessage = 'User updated successfully!';
      }
    },
    createShipyardUser: (state, action) => {
      state.shipyardUsers.unshift(action.payload);
      state.successMessage = 'User created successfully!';
    },
    getShipyard: (state, action) => {
      state.shipyard = action.payload;
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
  deleteYard,
  shipyardUsers,
  updateSYUser,
  createShipyardUser,
  getShipyard,
  clearSuccessMessage
} = shipyardSlice.actions;

export default shipyardSlice.reducer;
