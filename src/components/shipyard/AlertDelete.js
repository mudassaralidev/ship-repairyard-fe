import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { openSnackbar } from 'api/snackbar';

import { DeleteFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteShipyard } from '../../redux/features/shipyard/actions';
import { useEffect } from 'react';
import { clearSuccessMessage } from '../../redux/features/shipyard/slice';

export default function AlertShipyardDelete({ id, title, open, handleClose }) {
  const dispatch = useDispatch();
  const { successMessage, status } = useSelector((state) => state.shipyard);

  const deleteHandler = () => {
    dispatch(deleteShipyard(id));
  };

  useEffect(() => {
    if (successMessage) {
      openSnackbar({
        open: true,
        message: successMessage,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });

      dispatch(clearSuccessMessage());
      handleClose();
    }
    if (status === 'failed') {
      closeModal();
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, status]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              shipyard, all task assigned to that shipyard will also be deleted.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deleteHandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
