import {
  fetchStart,
  fetchSuccess,
  fetchError,
  createSuccess,
  createError,
  updateSuccess,
  updateError,
  deleteSuccess,
  deleteError,
} from "./slice";
import {
  fetchDockingPlacesApi,
  createDockingPlaceApi,
  updateDockingPlaceApi,
  deleteDockingPlaceApi,
} from "api/dockingPlaces";
import { toast } from "react-toastify";

const handleError = (dispatch, error, fallbackMsg) => {
  const errorMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    fallbackMsg ||
    "Something went wrong";

  dispatch(fetchError(errorMessage));

  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

/**
 * Fetch all docking places for a shipyard with pagination
 * @param {number} shipyardID - Shipyard ID
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Records per page (default: 10)
 */
export const fetchDockingPlaces =
  (shipyardID, page = 1, pageSize = 10) =>
  async (dispatch) => {
    dispatch(fetchStart());
    try {
      const response = await fetchDockingPlacesApi(shipyardID, page, pageSize);
      dispatch(
        fetchSuccess({
          dockingPlaces: response.data,
          pagination: response.pagination,
        }),
      );
    } catch (error) {
      handleError(dispatch, error, "Error while fetching docking places");
    }
  };

/**
 * Create a new docking place
 * @param {object} data - Docking place data (place_name, shipyard_id, created_by)
 */
export const createDockingPlace = (data) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const response = await createDockingPlaceApi(data);
    dispatch(createSuccess(response.data));

    toast.success(response.message || "Docking place created successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  } catch (error) {
    dispatch(
      createError(
        error?.response?.data?.message || "Error creating docking place",
      ),
    );
    handleError(dispatch, error, "Error while creating docking place");
  }
};

/**
 * Update an existing docking place
 * @param {number} placeID - Docking place ID
 * @param {object} data - Updated docking place data
 */
export const updateDockingPlaceAction = (placeID, data) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const response = await updateDockingPlaceApi(placeID, data);
    dispatch(updateSuccess(response.data));

    toast.success(response.message || "Docking place updated successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  } catch (error) {
    dispatch(
      updateError(
        error?.response?.data?.message || "Error updating docking place",
      ),
    );
    handleError(dispatch, error, "Error while updating docking place");
  }
};

/**
 * Delete a docking place
 * @param {number} placeID - Docking place ID
 */
export const deleteDockingPlaceAction = (placeID) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const response = await deleteDockingPlaceApi(placeID);

    dispatch(deleteSuccess(placeID));

    toast.success(response.message || "Docking place deleted successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  } catch (error) {
    dispatch(
      deleteError(
        error?.response?.data?.message || "Error deleting docking place",
      ),
    );
    handleError(dispatch, error, "Error while deleting docking place");
  }
};
