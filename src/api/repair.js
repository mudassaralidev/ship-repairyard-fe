import axios from 'utils/dataApi';

export const fetchRepairsApi = async (dockingID) => {
  try {
    const { data } = await axios.get(`v1/repairs?docking_id=${dockingID}`);
    return data.repairs;
  } catch (error) {
    throw error;
  }
};

export const createRepairApi = async (data) => {
  try {
    const { data: response } = await axios.post(`v1/repairs`, data);
    return response.repair;
  } catch (error) {
    throw error;
  }
};

export const updateRepairApi = async (id, data) => {
  try {
    const { data: response } = await axios.put(`v1/repairs/` + id, data);
    return response.repair;
  } catch (error) {
    throw error;
  }
};

export const updateRepairStatus = async (id, data) => {
  try {
    const { data: response } = await axios.put(`v1/repairs/${id}/status`, data);
    return response.repair;
  } catch (error) {
    throw error;
  }
};

export const getRepairHistory = async (id) => {
  try {
    const { data } = await axios.get(`v1/repairs/${id}/history`);
    return data.repair_history;
  } catch (error) {
    throw error;
  }
};

export const createInventoryOrder = async (repairID, data) => {
  try {
    const { data: res } = await axios.post(`v1/repairs/${repairID}/inventory-order`, data);
    return res.invOrder;
  } catch (error) {
    throw error;
  }
};
