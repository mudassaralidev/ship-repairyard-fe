import axios from "utils/dataApi";

export const getDepartments = async (shipyardID) => {
  try {
    const { data } = await axios.get(`v1/shipyards/${shipyardID}/departments`);

    return data.departments || [];
  } catch (error) {
    throw error;
  }
};

export const getDepartmentOptions = async (cancelToken, params) => {
  try {
    const { shipyardId } = params;
    const { data } = await axios.get(
      `v1/shipyards/${shipyardId}/departments/options`,
      { cancelToken },
    );

    return { options: data.data || [], pagination: data.pagination || {} };
  } catch (error) {
    throw error;
  }
};

export const getDepartment = async (departmentID) => {
  try {
    const { data } = await axios.get(`v1/departments/${departmentID}`);

    return data.department || [];
  } catch (error) {
    throw error;
  }
};

export const createDepartment = async (data) => {
  try {
    const { data: response } = await axios.post(`v1/departments`, data);

    return response.department;
  } catch (error) {
    throw error;
  }
};

export const deleteDepartment = async (departmentID) => {
  try {
    await axios.delete(`v1/departments/${departmentID}`);
  } catch (error) {
    throw error;
  }
};

export const updateDepartment = async (departmentID, data) => {
  try {
    const { data: response } = await axios.put(
      `v1/departments/${departmentID}`,
      data,
    );

    return response.department;
  } catch (error) {
    throw error;
  }
};
