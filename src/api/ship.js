import axios from 'utils/dataApi';

export const fetchShipsApi = async ({ shipyardID, queryParams = '' }) => {
  const { data } = await axios.get(`v1/ships?shipyard_id=${shipyardID}&${queryParams}`);
  return data.ships;
};

export const fetchShipApi = async (shipID) => {
  const { data } = await axios.get(`v1/ships/${shipID}`);
  return data.ship;
};

export const createShipApi = async (data) => {
  const { data: response } = await axios.post('v1/ships', data);
  return response.ship;
};

export const updateShipApi = async (id, data) => {
  const { data: response } = await axios.put(`v1/ships/${id}`, data);
  return response.ship;
};
