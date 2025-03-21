import axios from 'utils/dataApi';

export const fetchClients = async (shipyardID) => {
  const { data } = await axios.get(`v1/shipyards/${shipyardID}/clients`);

  return data.clients;
};
