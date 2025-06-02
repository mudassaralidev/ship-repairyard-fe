// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import shipyardsReducer from './features/shipyard/slice';
import userReducer from './features/users/slice';
import roleReducer from './features/roles/slice';
import shipyardReducer from './features/ships/slice';
import dockingReducer from './features/dockings/slice';
import repairReducer from './features/repair/slice';
import workOrderReducer from './features/work-order/slice';
import inventoryReducer from './features/inventory/slice';

const appReducer = combineReducers({
  shipyard: shipyardsReducer,
  user: userReducer,
  role: roleReducer,
  ship: shipyardReducer,
  docking: dockingReducer,
  repair: repairReducer,
  workOrder: workOrderReducer,
  inventory: inventoryReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    state = {}; // ← reset entire store to empty object
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer
});

export default store;
