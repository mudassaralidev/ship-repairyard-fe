import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roles: [],
  status: 'idle',
  error: null,
  successMessage: null
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestSuccess: (state, action) => {
      state.status = 'succeeded';
      state.roles = action.payload;
    },
    requestFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const { requestStart, requestSuccess, requestFailure } = roleSlice.actions;
export default roleSlice.reducer;
