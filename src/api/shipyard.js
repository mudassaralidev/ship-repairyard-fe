import axios from "utils/dataApi";

export const fetchShipyardsApi = async (page = 1, pageSize = 50) => {
  const res = await axios.get(`v1/shipyards?page=${page}&pageSize=${pageSize}`);
  return res;
};

export const fetchShipyardOptionsApi = async ({
  search = "",
  page = 1,
  token = null,
}) => {
  const res = await axios.get("/v1/shipyards/options", {
    params: {
      search,
      page,
      pageSize: 50,
    },
    cancelToken: token,
  });

  return {
    options: res?.data?.data || [],
    pagination: res?.data?.pagination || {},
  };
};

export const fetchShipyardApi = async (id) => {
  const { data } = await axios.get(`v1/shipyards/${id}`);
  return data.data;
};
export const createShipyardApi = async (data) => {
  const { data: responseData } = await axios.post("v1/shipyards", data);
  return responseData.data;
};
export const updateShipyardApi = async (id, data) => {
  const { data: responseData } = await axios.put(`v1/shipyards/${id}`, data);
  return responseData.data;
};

export const deleteShipyardApi = async (id) => {
  await axios.delete(`v1/shipyards/${id}`);
};

export const shipyardSpecificUsersAPI = async ({
  shipyard_id,
  page = 1,
  pageSize = 50,
}) => {
  try {
    const { data } = await axios.get(
      `v1/shipyards/${shipyard_id}/users?page=${page}&pageSize=${pageSize}`,
    );
    return data;
  } catch (error) {
    console.error("Error while fetching users", error.message);
    throw error;
  }
};

export const createSYUserApi = async ({ shipyard_id, data }) => {
  try {
    const { data: responseData } = await axios.post(
      `v1/shipyards/${shipyard_id}/user`,
      data,
    );
    return responseData.user;
  } catch (error) {
    console.log("Error while creating user on shipyard", error.message);
    throw error;
  }
};

export const fetchInventoriesApi = async (id) => {
  try {
    const { data } = await axios.get(`v1/shipyards/${id}/inventories`);
    return data.inventories;
  } catch (error) {
    console.log("Error while fetching inventories on shipyard", error.message);
    throw error;
  }
};

export const createInventoryApi = async (id, data) => {
  try {
    const { data: responseData } = await axios.post(
      `v1/shipyards/${id}/inventory`,
      data,
    );
    return responseData.inventory;
  } catch (error) {
    console.log("Error while creating inventory on shipyard", error.message);
    throw error;
  }
};

export const updateInventoryApi = async (id, inventoryID, data) => {
  try {
    const { data: responseData } = await axios.put(
      `v1/shipyards/${id}/inventory/${inventoryID}`,
      data,
    );
    return responseData.inventory;
  } catch (error) {
    console.log("Error while updating inventory on shipyard", error.message);
    throw error;
  }
};

export const deleteInventoryApi = async () => {
  try {
    return {};
  } catch (error) {
    console.log("Error while creating user on shipyard", error.message);
    throw error;
  }
};

export const fetchInventoryApi = async () => {
  try {
    return {};
  } catch (error) {
    console.log("Error while creating user on shipyard", error.message);
    throw error;
  }
};
