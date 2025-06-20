import { useEffect, useState } from 'react';
// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Stack,
  TextField
} from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage } from '../../redux/features/work-order/slice';
import { toast } from 'react-toastify';
import { updateWorkOrder } from '../../redux/features/work-order/actions';

const UpdateStatusModal = ({ open, modalToggler, workOrder }) => {
  const { user } = useAuth();
  if (!['FOREMAN', 'ADMIN', 'PROJECT_MANAGER'].includes(user?.role)) modalToggler();

  const dispatch = useDispatch();
  const { successMessage } = useSelector((state) => state.workOrder);

  const [status, setStatus] = useState(workOrder.status);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      modalToggler();
    }
  }, [successMessage]);

  return (
    <>
      {open && (
        <Modal
          open={open}
          //   onClose={modalToggler}
          aria-labelledby="modal-user-add-label"
          aria-describedby="modal-user-add-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 480, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              <FormControl>
                <DialogTitle>Update Work Order Status</DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 2.5 }}>
                  <Grid container>
                    <Grid item xs={12} sm={12}>
                      <Stack spacing={1}>
                        <TextField value={status} select fullWidth label="Status" onChange={(e) => setStatus(e.target.value)}>
                          {['STARTED', 'BLOCKED', 'COMPLETED'].map((statusOption) => (
                            <MenuItem key={statusOption} value={statusOption}>
                              {statusOption.charAt(0) + statusOption.slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Stack>
                    </Grid>
                  </Grid>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 2.5 }}>
                  <Button color="error" onClick={modalToggler}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (status === workOrder.status) {
                        modalToggler();
                        return;
                      }

                      dispatch(updateWorkOrder(workOrder.id, { status }));
                    }}
                    variant="contained"
                  >
                    Update
                  </Button>
                </DialogActions>
              </FormControl>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default UpdateStatusModal;
