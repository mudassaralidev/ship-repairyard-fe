import { toast } from 'react-toastify';
import { requestStart, requestSuccess, requestFailure, create, update, assignEmployees } from './slice';

import { AssignWorkOrderEmployeesApi, createWorkOrderApi, fetchWorkOrdersApi, updateWorkOrderApi } from 'api/workOrder';

const handleError = (dispatch, error, hardCodedError) => {
  dispatch(requestFailure(error.message));
  toast.error(error?.response?.data?.message || error?.response?.data?.error?.message || hardCodedError, {
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

export const assignWorkOrderEmployees = (id, data) => async (dispatch) => {
  try {
    const res = await AssignWorkOrderEmployeesApi(id, data);
    dispatch(assignEmployees(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while assigning/updating employees to work order');
  }
};
