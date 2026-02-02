import axios from "utils/dataApi";

/**
 * Fetch all docking places for a shipyard with pagination
 * @param {number} shipyardID - Shipyard ID
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Records per page (default: 10)
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
export const fetchDockingPlacesApi = async (
  shipyardID,
  page = 1,
  pageSize = 10,
) => {
  try {
    const queryParams = new URLSearchParams({
      shipyard_id: shipyardID,
      page,
      pageSize,
    });

    const { data } = await axios.get(
      `v1/docking_places?${queryParams.toString()}`,
    );

    return {
      data: data.data || [],
      pagination: data.pagination || {},
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all available (unused) docking places for a shipyard
 * @param {number} shipyardID - Shipyard ID
 * @returns {Promise<Array>}
 */
export const getAvailableDockingPlaces = async (shipyardID) => {
  try {
    const { data } = await axios.get(
      `v1/docking_places?shipyard_id=${shipyardID}&is_used=false`,
    );
    return data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all available (unused) docking places for a shipyard
 * @param {number} shipyard_id - Shipyard ID
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - no of records per page
 * @param {string} search - Get specific name place from backend
 * @returns {Promise<Array>}
 */
export const getDockingPlacesOptions = async (cancelToken, params) => {
  try {
    const { data } = await axios.get("v1/docking_places/options", {
      params,
      cancelToken,
    });

    return {
      options: data?.data || [],
      pagination: data?.pagination || {},
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new docking place
 * @param {object} data - Docking place data (place_name, shipyard_id, created_by)
 * @returns {Promise<Object>}
 */
export const createDockingPlaceApi = async (data) => {
  try {
    const { data: response } = await axios.post("v1/docking_places", data);
    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update a docking place
 * @param {number} placeID - Docking place ID
 * @param {object} data - Updated docking place data
 * @returns {Promise<Object>}
 */
export const updateDockingPlaceApi = async (placeID, data) => {
  try {
    const { data: response } = await axios.put(
      `v1/docking_places/${placeID}`,
      data,
    );
    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a docking place
 * @param {number} placeID - Docking place ID
 * @returns {Promise<Object>}
 */
export const deleteDockingPlaceApi = async (placeID) => {
  try {
    const { data: response } = await axios.delete(
      `v1/docking_places/${placeID}`,
    );
    return {
      message: response.message || "Docking place deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Legacy function - Kept for backward compatibility
 * Use fetchDockingPlacesApi instead
 */
export const getDockingPlaces = async (shipyardID) => {
  try {
    const { data } = await axios.get(
      `v1/docking_places?shipyard_id=${shipyardID}`,
    );
    return data.data || [];
  } catch (error) {
    throw error;
  }
};
