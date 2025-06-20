import axios from 'utils/dataApi';

export const fetchWorkOrdersApi = async () => {
  try {
    const { data } = await axios.get(`v1/work-orders`);
    return data.work_orders;
  } catch (error) {
    throw error;
  }
};

export const createWorkOrderApi = async (data) => {
  try {
    const { data: response } = await axios.post(`v1/work-orders`, data);
    return response.work_order;
  } catch (error) {
    throw error;
  }
};

export const updateWorkOrderApi = async (id, data) => {
  try {
    const { data: response } = await axios.put(`v1/work-orders/${id}`, data);
    return response.work_order;
  } catch (error) {
    throw error;
  }
};

export const AssignWorkOrderEmployeesApi = async (id, data) => {
  try {
    const { data: response } = await axios.put(`v1/work-orders/${id}/assign-employees`, data);
    return response.message;
  } catch (error) {
    throw error;
  }
};
