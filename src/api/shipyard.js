import axios from 'utils/dataApi';

export const fetchShipyardsApi = async () => {
  const res = await axios.get('v1/shipyards');
  return res.data;
};

export const fetchShipyardApi = async (id) => {
  const { data } = await axios.get(`v1/shipyards/${id}`);
  return data.data;
};
export const createShipyardApi = async (data) => {
  const { data: responseData } = await axios.post('v1/shipyards', data);
  return responseData.data;
};
export const updateShipyardApi = async (id, data) => {
  const { data: responseData } = await axios.put(`v1/shipyards/${id}`, data);
  return responseData.data;
};

export const deleteShipyardApi = async (id) => {
  await axios.delete(`v1/shipyards/${id}`);
};

export const shipyardSpecificUsersAPI = async ({ shipyard_id, query_params }) => {
  try {
    const { data } = await axios.get(`v1/shipyards/${shipyard_id}/users?${query_params}`);
    return data.users;
  } catch (error) {
    console.error('Error while fetching users', error.message);
    throw error;
  }
};

export const createSYUserApi = async ({ shipyard_id, data }) => {
  const { data: responseData } = await axios.post(`v1/shipyards/${shipyard_id}/user`, data);
  return responseData.user;
};
