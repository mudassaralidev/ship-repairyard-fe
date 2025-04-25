import { requestStart, requestSuccess, requestFailure, createInventory, updateInventory, deleteInventory, getInventory } from './slice';

import { fetchInventoriesApi, createInventoryApi, updateInventoryApi, deleteInventoryApi, fetchInventoryApi } from 'api/shipyard';

import { toast } from 'react-toastify';

const handleError = (dispatch, error, fallbackMsg) => {
  dispatch(requestFailure(error.message));
  toast.error(
    error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      fallbackMsg ||
      'Something went wrong while performing inventory action',
    {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    }
  );
};

export const fetchInventories = (shipyardID) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const data = await fetchInventoriesApi(shipyardID);
    dispatch(requestSuccess(data));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching inventories');
  }
};

export const fetchInventory = (shipyardID, inventoryID) => async (dispatch) => {
  try {
    const inventory = await fetchInventoryApi(shipyardID, inventoryID);
    dispatch(getInventory(inventory));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching inventory');
  }
};

export const createNewInventory = (shipyardID, inventoryData) => async (dispatch) => {
  try {
    const newInventory = await createInventoryApi(shipyardID, inventoryData);
    dispatch(createInventory(newInventory));
  } catch (error) {
    handleError(dispatch, error, 'Error while creating inventory');
  }
};

export const updateExistingInventory = (shipyardID, inventoryID, updates) => async (dispatch) => {
  try {
    const updatedInventory = await updateInventoryApi(shipyardID, inventoryID, updates);
    dispatch(updateInventory(updatedInventory));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating inventory');
  }
};

export const deleteExistingInventory = (id) => async (dispatch) => {
  try {
    await deleteInventoryApi(id);
    dispatch(deleteInventory({ id }));
  } catch (error) {
    handleError(dispatch, error, 'Error while deleting inventory');
  }
};
