import { requestStart, requestSuccess, requestFailure, create, update } from './slice';
import { createDockingApi, fetchDockingsApi, updateDockingApi } from 'api/docking';
import { toast } from 'react-toastify';

const handleError = (dispatch, error, message) => {
  console.error('Error occurred in docking action', error);
  dispatch(requestFailure(error.message));
  toast.error(error?.response?.data?.message || error?.response?.data?.error?.message || message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  });
};

export const fetchDockings = (shipyardID) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchDockingsApi(shipyardID);
    dispatch(requestSuccess(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching dockings');
  }
};

export const createDocking = (data) => async (dispatch) => {
  try {
    const res = await createDockingApi(data);
    dispatch(create(res));
  } catch (error) {
    console.error(error);
    handleError(dispatch, error, 'Error while creating docking');
  }
};

export const updateDocking = (id, data) => async (dispatch) => {
  try {
    const res = await updateDockingApi(id, data);
    dispatch(update(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating docking');
  }
};
