import axios from 'utils/dataApi';

export const fetchUsersAPI = async () => {
  const res = await axios.get('v1/users');
  return res.data;
};
export const createUserAPI = async (data) => {
  const { data: responseData } = await axios.post('v1/users', data);
  return responseData.user;
};
export const updateUserAPI = async (id, data) => {
  const { data: responseData } = await axios.put(`v1/users/${id}`, data);
  return responseData.data;
};

export const deleteUserAPI = async (id) => {
  await axios.delete(`v1/users/${id}`);
};
