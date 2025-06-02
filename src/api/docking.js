import axios from 'utils/dataApi';

export const fetchDockingsApi = async ({ shipyardID, queryParams = '' }) => {
  try {
    const { data } = await axios.get(`v1/dockings?shipyard_id=${shipyardID}&${queryParams}`);
    return data.dockings;
  } catch (error) {
    throw error;
  }
};

export const createDockingApi = async (data) => {
  try {
    const { data: res } = await axios.post(`v1/dockings`, data);

    return res.docking;
  } catch (error) {
    throw error;
  }
};

export const updateDockingApi = async (id, data) => {
  try {
    const { data: response } = await axios.put(`v1/dockings/${id}`, data);

    return response.docking;
  } catch (error) {
    throw error;
  }
};

export const getDockingNamesForRepair = async (shipyardID) => {
  try {
    const { data } = await axios.get(`v1/dockings/names?shipyard_id=${shipyardID}`);
    return data.dockings;
  } catch (error) {
    throw error;
  }
};
