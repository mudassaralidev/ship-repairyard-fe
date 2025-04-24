import { configureStore } from '@reduxjs/toolkit';
import shipyardsReducer from './features/shipyard/slice';
import userReducer from './features/users/slice';
import roleReducer from './features/roles/slice';
import shipyardReducer from './features/ships/slice';
import dockingReducer from './features/dockings/slice';
import repairReducer from './features/repair/slice';
import workOrderReducer from './features/work-order/slice';

const store = configureStore({
  reducer: {
    shipyard: shipyardsReducer,
    user: userReducer,
    role: roleReducer,
    ship: shipyardReducer,
    docking: dockingReducer,
    repair: repairReducer,
    workOrder: workOrderReducer
  }
});

export default store;
