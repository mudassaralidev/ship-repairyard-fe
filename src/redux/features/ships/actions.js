import { requestStart, requestSuccess, requestFailure, create, update, getShip } from './slice';
import { createShipApi, fetchShipApi, fetchShipsApi, updateShipApi } from 'api/ship';
import { toast } from 'react-toastify';

const handleError = (dispatch, error, message) => {
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

export const fetchShips = (shipyardID) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchShipsApi(shipyardID);
    dispatch(requestSuccess(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching ships');
  }
};

export const fetchShip = (shipID) => async (dispatch) => {
  try {
    const res = await fetchShipApi(shipID);
    dispatch(getShip(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching ship data');
  }
};

export const createShip = (data) => async (dispatch) => {
  try {
    const res = await createShipApi(data);
    dispatch(create(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching ships');
  }
};

export const updateShip = (id, data) => async (dispatch) => {
  try {
    const res = await updateShipApi(id, data);
    dispatch(update(res));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching ships');
  }
};
