import { requestStart, requestSuccess, requestFailure, create, update } from './slice';
import { createRepairApi, fetchRepairsApi, updateRepairApi, updateRepairStatus } from 'api/repair';
import { toast } from 'react-toastify';

const handleError = (dispatch, error, message) => {
  console.error('Error occurred in repair action', error);
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

export const fetchRepairs = (dockingID) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchRepairsApi(dockingID);
    dispatch(requestSuccess(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching repairs');
  }
};

export const createRepair = (data) => async (dispatch) => {
  try {
    const res = await createRepairApi(data);
    dispatch(create(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while creating repair');
  }
};

export const updateRepair = (id, data) => async (dispatch) => {
  try {
    const res = await updateRepairApi(id, data);
    dispatch(update(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating repair');
  }
};

export const updateStatus = (id, data) => async (dispatch) => {
  try {
    const res = await updateRepairStatus(id, data);
    dispatch(update(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating repair status');
  }
};
