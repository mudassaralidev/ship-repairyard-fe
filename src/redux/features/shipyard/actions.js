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
  createShipyardUser,
} from "./slice";
import {
  fetchShipyardsApi,
  createShipyardApi,
  updateShipyardApi,
  deleteShipyardApi,
  shipyardSpecificUsersAPI,
  fetchShipyardApi,
  createSYUserApi,
} from "api/shipyard";
import { updateUserAPI } from "api/user";
import { toast } from "react-toastify";

const handleError = (dispatch, error, message) => {
  dispatch(requestFailure(error.message));
  toast.error(
    error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      "Some error occurred while making action on shipyard",
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    },
  );
};

export const fetchShipyards =
  (page = 1, pageSize = 50) =>
  async (dispatch) => {
    dispatch(requestStart());
    try {
      const res = await fetchShipyardsApi(page, pageSize);
      dispatch(requestSuccess(res.data));
    } catch (error) {
      handleError(dispatch, error, "Error while fetching shipyards");
    }
  };

export const fetchShipyard = (id) => async (dispatch) => {
  try {
    const shipyard = await fetchShipyardApi(id);
    dispatch(getShipyard(shipyard));
  } catch (error) {
    handleError(dispatch, error, "Error while fetching shipyard");
  }
};

export const createShipyard = (shipyardData) => async (dispatch) => {
  try {
    const newShipyard = await createShipyardApi(shipyardData);
    dispatch(create(newShipyard));
  } catch (error) {
    handleError(dispatch, error, "Error while creating shipyard");
  }
};

export const updateShipyard = (id, updates) => async (dispatch) => {
  try {
    const updatedShipyard = await updateShipyardApi(id, updates);
    dispatch(update(updatedShipyard));
  } catch (error) {
    handleError(dispatch, error, "Error while updating shipyard");
  }
};

export const deleteShipyard = (id) => async (dispatch) => {
  try {
    await deleteShipyardApi(id);
    dispatch(deleteYard({ id }));
  } catch (error) {
    handleError(dispatch, error, "Error while deleting shipyard");
  }
};

export const sySpecificUsers =
  ({ shipyard_id, page = 1, pageSize = 50 }) =>
  async (dispatch) => {
    dispatch(requestStart());
    try {
      const users = await shipyardSpecificUsersAPI({
        shipyard_id,
        page,
        pageSize,
      });
      dispatch(shipyardUsers(users));
    } catch (error) {
      console.error(
        "Error while fetching users",
        error.response?.data?.error?.message,
      );
      handleError(dispatch, error, "Error while fetching users");
    }
  };

export const updateUserSY = (id, updates) => async (dispatch) => {
  try {
    const updatedUser = await updateUserAPI(id, updates);
    dispatch(updateSYUser(updatedUser));
  } catch (error) {
    handleError(dispatch, error, "Error while updating user");
  }
};

export const createUserSY =
  ({ shipyard_id, data }) =>
  async (dispatch) => {
    try {
      const newUser = await createSYUserApi({ shipyard_id, data });
      dispatch(createShipyardUser(newUser));
    } catch (error) {
      handleError(dispatch, error, "Error while updating user");
    }
  };
