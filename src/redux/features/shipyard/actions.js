// src/features/shipyard/shipyardActions.js
import {
  requestStart,
  requestSuccess,
  requestFailure,
  create,
  update,
  deleteYard,
  shipyardUsers,
  updateSYUser,
  getShipyard,
  createShipyardUser
} from './slice';
import {
  fetchShipyardsApi,
  createShipyardApi,
  updateShipyardApi,
  deleteShipyardApi,
  shipyardSpecificUsersAPI,
  fetchShipyardApi,
  createSYUserApi
} from 'api/shipyard';
import { openSnackbar } from 'api/snackbar';
import { updateUserAPI } from 'api/user';

const handleError = (dispatch, error, message) => {
  dispatch(requestFailure(error.message));
  openSnackbar({
    open: true,
    message: `${message}: ${error?.response?.data?.error?.message || error.message}`,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    variant: 'alert',
    alert: { color: 'error' }
  });
};

export const fetchShipyards = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchShipyardsApi();
    dispatch(requestSuccess(res.data));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching shipyards');
  }
};

export const fetchShipyard = (id) => async (dispatch) => {
  try {
    const shipyard = await fetchShipyardApi(id);
    dispatch(getShipyard(shipyard));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching shipyard');
  }
};

export const createShipyard = (shipyardData) => async (dispatch) => {
  try {
    const newShipyard = await createShipyardApi(shipyardData);
    dispatch(create(newShipyard));
  } catch (error) {
    handleError(dispatch, error, 'Error while creating shipyard');
  }
};

export const updateShipyard = (id, updates) => async (dispatch) => {
  try {
    const updatedShipyard = await updateShipyardApi(id, updates);
    dispatch(update(updatedShipyard));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating shipyard');
  }
};

export const deleteShipyard = (id) => async (dispatch) => {
  try {
    await deleteShipyardApi(id);
    dispatch(deleteYard({ id }));
  } catch (error) {
    handleError(dispatch, error, 'Error while deleting shipyard');
  }
};

export const sySpecificUsers =
  ({ shipyard_id, query_params }) =>
  async (dispatch) => {
    dispatch(requestStart());
    try {
      const users = await shipyardSpecificUsersAPI({ shipyard_id, query_params });
      dispatch(shipyardUsers(users));
    } catch (error) {
      console.error('Error while fetching users', error.response.data.error.message);
      handleError(dispatch, error, 'Error while fetching users');
    }
  };

export const updateUserSY = (id, updates) => async (dispatch) => {
  try {
    const updatedUser = await updateUserAPI(id, updates);
    dispatch(updateSYUser(updatedUser));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating user');
  }
};

export const createUserSY =
  ({ shipyard_id, data }) =>
  async (dispatch) => {
    try {
      const newUser = await createSYUserApi({ shipyard_id, data });
      dispatch(createShipyardUser(newUser));
    } catch (error) {
      handleError(dispatch, error, 'Error while updating user');
    }
  };
