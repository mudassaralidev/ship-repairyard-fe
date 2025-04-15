import axios from 'utils/dataApi';

export const getDockingPlaces = async (shipyardID) => {
  try {
    const { data } = await axios.get(`v1/docking_places?shipyard_id=${shipyardID}`);

    return data.dockingPlaces || [];
  } catch (error) {
    throw error;
  }
};

export const deleteDockingPlace = async (placeID) => {
  try {
    await axios.delete(`v1/docking_places/${placeID}`);
  } catch (error) {
    throw error;
  }
};

export const updateDockingPlace = async (placeId, data) => {
  try {
    const { data: response } = await axios.put(`v1/docking_places/${placeId}`, data);

    return response.dockingPlace;
  } catch (error) {
    throw error;
  }
};

export const createDockingPlace = async (data) => {
  try {
    const { data: response } = await axios.post(`v1/docking_places`, data);

    return response.dockingPlace;
  } catch (error) {
    throw error;
  }
};

export const getAvailableDockingPlaces = async (shipyardID) => {
  try {
    const { data } = await axios.get(`v1/docking_places?shipyard_id=${shipyardID}&available_places=true`);

    return data.dockingPlaces || [];
  } catch (error) {
    throw error;
  }
};
