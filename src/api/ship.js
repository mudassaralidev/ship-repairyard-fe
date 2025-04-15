import axios from 'utils/dataApi';

export const fetchShipsApi = async (shipyardID) => {
  const { data } = await axios.get(`v1/ships?shipyard_id=${shipyardID}`);
  return data.ships;
};

export const createShipApi = async (data) => {
  const { data: response } = await axios.post('v1/ships', data);
  return response.ship;
};

export const updateShipApi = async (id, data) => {
  const { data: response } = await axios.put(`v1/ships/${id}`, data);
  return response.ship;
};
