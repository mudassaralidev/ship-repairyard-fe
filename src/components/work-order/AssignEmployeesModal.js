import { useEffect, useState } from 'react';
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
  TextField,
  Typography,
  Link as MuiLink
} from '@mui/material';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage } from '../../redux/features/work-order/slice';
import { toast } from 'react-toastify';
import { assignWorkOrderEmployees } from '../../redux/features/work-order/actions';
import { getAvailableEmployees } from 'api/user';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const AssignUpdateEmployeesModal = ({ open, modalToggler, workOrder }) => {
  const { user } = useAuth();
  const statusCompleted = workOrder.status === 'COMPLETED';
  if (!['FOREMAN', 'ADMIN', 'PROJECT_MANAGER'].includes(user?.role)) modalToggler();

  const dispatch = useDispatch();
  const { successMessage } = useSelector((state) => state.workOrder);

  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const alreadyAssignedIds = workOrder?.employees?.map((emp) => emp.id) || [];

  useEffect(() => {
    (async () => {
      const { id = 0, department_id = 0 } = workOrder?.foreman || {};
      const employees = await getAvailableEmployees({ foreman_id: id, department_id });
      setAvailableEmployees(employees);
    })();
  }, []);

  useEffect(() => {
    if (workOrder?.employees) {
      setSelectedEmployees(alreadyAssignedIds);
    }
  }, [workOrder]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      modalToggler();
    }
  }, [successMessage]);

  const handleSubmit = () => {
    const toAssign = selectedEmployees.filter((id) => !alreadyAssignedIds.includes(id));
    const toRemove = alreadyAssignedIds.filter((id) => !selectedEmployees.includes(id));

    if (toAssign.length === 0 && toRemove.length === 0) {
      modalToggler();
      return;
    }

    dispatch(
      assignWorkOrderEmployees(workOrder.id, {
        assignEmployees: toAssign,
        removeEmployees: toRemove
      })
    );
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          aria-labelledby="modal-assign-employees"
          aria-describedby="modal-assign-employees-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
          onClose={_.isEmpty(availableEmployees) ? modalToggler : () => {}}
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
                <DialogTitle>Assign / Un-Assign Employees</DialogTitle>
                <Divider />
                {_.isEmpty(availableEmployees) && _.isEmpty(alreadyAssignedIds) ? (
                  <DialogContent sx={{ p: 2.5 }}>
                    <Typography variant="body1" sx={{ marginTop: '12px' }}>
                      There are no available employees of <b>{workOrder.foreman.name}</b> Foreman of{' '}
                      <b>{workOrder.foreman.department.name}</b> department, please Visit to{' '}
                      <MuiLink component={Link} to={'/dashboard/dept-users'} underline="hover">
                        <b>Departmental Users</b>
                      </MuiLink>{' '}
                      to manage them.
                    </Typography>
                  </DialogContent>
                ) : (
                  <>
                    <DialogContent sx={{ p: 2.5 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <TextField
                              label="Assign Employees"
                              select
                              SelectProps={{ multiple: true }}
                              value={selectedEmployees}
                              onChange={(e) => setSelectedEmployees(e.target.value)}
                              fullWidth
                              disabled={statusCompleted}
                            >
                              {[...(workOrder?.employees || []), ...availableEmployees].map((emp) => (
                                <MenuItem key={emp.id} value={emp.id}>
                                  {emp.name}
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
                      <Button onClick={handleSubmit} variant="contained" disabled={statusCompleted}>
                        Update
                      </Button>
                    </DialogActions>
                  </>
                )}
              </FormControl>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default AssignUpdateEmployeesModal;
