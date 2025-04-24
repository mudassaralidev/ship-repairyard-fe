// src/features/shipyard/shipyardActions.js
import { toast } from 'react-toastify';
import { requestStart, requestSuccess, requestFailure, create, update, deleteUser } from './slice';
import { fetchUsersAPI, createUserAPI, updateUserAPI, deleteUserAPI } from 'api/user';

const handleError = (dispatch, error, message) => {
  dispatch(requestFailure(error.message));
  toast.error(
    error?.response?.data?.message || error?.response?.data?.error?.message || 'Some error occurred while making action on shipyard',
    {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    }
  );
};

export const fetchUsers = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchUsersAPI();
    dispatch(requestSuccess(res.data));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching users');
  }
};

export const createUser = (userData) => async (dispatch) => {
  try {
    const newUser = await createUserAPI(userData);
    dispatch(create(newUser));
  } catch (error) {
    handleError(dispatch, error, 'Error while creating user');
  }
};

export const updateUser = (id, updates) => async (dispatch) => {
  try {
    const updatedUser = await updateUserAPI(id, updates);
    dispatch(update(updatedUser));
  } catch (error) {
    handleError(dispatch, error, 'Error while updating user');
  }
};

export const deleteUserData = (id) => async (dispatch) => {
  try {
    await deleteUserAPI(id);
    dispatch(deleteUser({ id }));
  } catch (error) {
    handleError(dispatch, error, 'Error while deleting user');
  }
};
