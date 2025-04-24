import { toast } from 'react-toastify';
import { requestStart, requestSuccess, requestFailure, create, update } from './slice';

import { createWorkOrderApi, fetchWorkOrdersApi, updateWorkOrderApi } from 'api/workOrder';

const handleError = (dispatch, error) => {
  dispatch(requestFailure(error.message));
  toast.error(
    error?.response?.data?.message || error?.response?.data?.error?.message || 'Some error occurred while making action on shipyard',
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

export const fetchWorkOrders = (shipyardID) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchWorkOrdersApi(shipyardID);
    dispatch(requestSuccess(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching work orders');
  }
};

export const createWorkOrder = (data) => async (dispatch) => {
  try {
    const res = await createWorkOrderApi(data);
    dispatch(create(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while creating work order');
  }
};

export const updateWorkOrder = (id, data) => async (dispatch) => {
  try {
    const res = await updateWorkOrderApi(id, data);
    dispatch(update(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating work order');
  }
};
