import { configureStore } from '@reduxjs/toolkit';
import shipyardsReducer from './features/shipyard/slice';
import userReducer from './features/users/slice';
import roleReducer from './features/roles/slice';
import shipyardReducer from './features/ships/slice';
import dockingReducer from './features/dockings/slice';

const store = configureStore({
  reducer: { shipyard: shipyardsReducer, user: userReducer, role: roleReducer, ship: shipyardReducer, docking: dockingReducer }
});

export default store;
