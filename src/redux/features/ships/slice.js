// src/features/shipyard/shipyardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ships: [],
  status: 'idle',
  error: null,
  successMessage: null,
  ship: null
};

const shipSlice = createSlice({
  name: 'ship',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.ships = action.payload;
      state.error = null;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    create: (state, action) => {
      const updatedShipsState = [action.payload, ...state.ships];
      state.ships = updatedShipsState;
      state.error = null;
      state.successMessage = 'Ship created successfully!';
    },
    getShip: (state, action) => {
      state.ship = action.payload;
      state.error = null;
    },
    update: (state, action) => {
      const index = state.ships.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.ships[index] = action.payload;
        state.successMessage = 'Shipyard updated successfully!';
      }
      state.error = null;
    },
    deleteShip: (state, action) => {
      state.ships = state.ships.filter((item) => item.id !== action.payload.id);
      state.successMessage = 'Shipyard deleted successfully!';
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.status = 'idle';
      state.successMessage = null;
    }
  }
});

export const { requestStart, requestSuccess, requestFailure, create, getShip, update, deleteShip, clearSuccessMessage } = shipSlice.actions;

export default shipSlice.reducer;
