import { requestStart, requestSuccess, requestFailure } from './slice';
import { fetchRolesAPI } from 'api/role';
import { toast } from 'react-toastify';

const handleError = (dispatch, error, message) => {
  dispatch(requestFailure(error.message));
  toast.error(`${message}: ${error.message}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  });
};

export const fetchRoles = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchRolesAPI();
    dispatch(requestSuccess(res.roles));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching roles');
  }
};
