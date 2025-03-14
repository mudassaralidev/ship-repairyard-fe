import { requestStart, requestSuccess, requestFailure } from './slice';
import { fetchRolesAPI } from 'api/role';
import { openSnackbar } from 'api/snackbar';

const handleError = (dispatch, error, message) => {
  dispatch(requestFailure(error.message));
  openSnackbar({
    open: true,
    message: `${message}: ${error.message}`,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    variant: 'alert',
    alert: { color: 'error' }
  });
};

export const fetchRoles = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await fetchRolesAPI();
    dispatch(requestSuccess(res.roles));
  } catch (error) {
    handleError(dispatch, error, 'Error while fetching shipyards');
  }
};
