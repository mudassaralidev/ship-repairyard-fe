import axios from 'utils/dataApi';

export const fetchRolesAPI = async () => {
  const res = await axios.get('v1/roles');
  return res.data;
};
