// src/features/users/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  status: 'idle',
  error: null,
  successMessage: null
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    create: (state, action) => {
      state.users.unshift(action.payload);
      state.successMessage = 'User created successfully!';
    },
    update: (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        state.successMessage = 'User updated successfully!';
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
      state.successMessage = 'User deleted successfully!';
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
      state.status = 'idle';
    }
  }
});

export const { requestStart, requestSuccess, requestFailure, create, update, deleteUser, clearSuccessMessage } = usersSlice.actions;

export default usersSlice.reducer;
