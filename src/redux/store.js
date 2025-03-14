import { configureStore } from '@reduxjs/toolkit';
import shipyardsReducer from './features/shipyard/slice';
import userReducer from './features/users/slice';
import roleReducer from './features/roles/slice';

const store = configureStore({
  reducer: { shipyard: shipyardsReducer, user: userReducer, role: roleReducer }
});

export default store;
