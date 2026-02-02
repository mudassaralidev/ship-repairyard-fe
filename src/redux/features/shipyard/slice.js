// src/features/shipyard/shipyardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_PAGINATION } from "utils/pagination";

const initialState = {
  shipyards: [],
  shipyardUsers: [],
  shipyard: {},
  shipyardsPagination: {
    ...INITIAL_PAGINATION,
  },
  shipyardUsersPagination: {
    ...INITIAL_PAGINATION,
  },
  status: "idle",
  error: null,
  successMessage: null,
};

const shipyardSlice = createSlice({
  name: "shipyard",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = "loading";
      state.error = null;
      state.shipyardUsers = [];
    },
    requestSuccess: (state, action) => {
      state.status = "succeeded";
      state.shipyards = action.payload.data || action.payload;
      if (action.payload.pagination) {
        state.shipyardsPagination = action.payload.pagination;
      }
    },
    requestFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    create: (state, action) => {
      state.shipyards.unshift(action.payload);
      state.shipyardsPagination.totalRecords =
        state.shipyardsPagination.totalRecords + 1;
      state.successMessage = "Shipyard created successfully!";
    },
    update: (state, action) => {
      const index = state.shipyards.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.shipyards[index] = action.payload;
        state.successMessage = "Shipyard updated successfully!";
      }
    },
    deleteYard: (state, action) => {
      state.shipyards = state.shipyards.filter(
        (item) => item.id !== action.payload.id,
      );
      state.successMessage = "Shipyard deleted successfully!";
    },
    shipyardUsers: (state, action) => {
      state.shipyardUsers = action.payload.data || action.payload || [];
      if (action.payload.pagination) {
        state.shipyardUsersPagination = action.payload.pagination;
      }
    },
    updateSYUser: (state, action) => {
      const index = state.shipyardUsers.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.shipyardUsers[index] = action.payload;
        state.successMessage = "User updated successfully!";
      }
    },
    createShipyardUser: (state, action) => {
      state.shipyardUsers.unshift(action.payload);
      state.shipyardUsersPagination.totalRecords =
        state.shipyardUsersPagination.totalRecords + 1;
      state.successMessage = "User created successfully!";
    },
    getShipyard: (state, action) => {
      state.shipyard = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.status = "idle";
      state.successMessage = null;
    },
    resetShipyardState: (state) => {
      console.log("Resetting shipyard state");
      state.shipyardUsers = [];
      state.shipyards = [];
      state.shipyardsPagination = { ...INITIAL_PAGINATION };
      state.shipyardUsersPagination = { ...INITIAL_PAGINATION };
    },
  },
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
  clearSuccessMessage,
  resetShipyardState,
} = shipyardSlice.actions;

export default shipyardSlice.reducer;
