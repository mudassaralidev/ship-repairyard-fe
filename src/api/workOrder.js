import axios from 'utils/dataApi';

export const fetchWorkOrdersApi = async (shipyardID) => {
  try {
    return {};
  } catch (error) {
    throw error;
  }
};

export const createWorkOrderApi = async (data) => {
  try {
    const { data: response } = await axios.post(`v1/work-orders`, data);
    return response.repair;
  } catch (error) {
    throw error;
  }
};

export const updateWorkOrderApi = async (id, data) => {
  try {
    return {};
  } catch (error) {
    throw error;
  }
};
