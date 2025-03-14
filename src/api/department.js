import axios from 'utils/dataApi';

export const getDepartments = async (shipyardID) => {
  try {
    const departments = await axios.get(`v1/shipyards/${shipyardID}/departments`);

    return departments;
  } catch (error) {
    throw new Error(error);
  }
};

export const createDepartment = async (data) => {
  try {
    const department = await axios.post(`v1/departments`, data);

    return department;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteDepartment = async (departmentID) => {
  try {
    await axios.delete(`v1/departments/${departmentID}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateDepartment = async (departmentID, data) => {
  try {
    const updatedDepartment = await axios.put(`v1/departments/${departmentID}`, data);

    return updatedDepartment;
  } catch (error) {
    throw new Error(error);
  }
};
