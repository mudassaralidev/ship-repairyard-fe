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
  TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage } from '../../redux/features/work-order/slice';
import { toast } from 'react-toastify';
import { assignWorkOrderEmployees } from '../../redux/features/work-order/actions';
import { getAvailableEmployees } from 'api/user';

const AssignUpdateEmployeesModal = ({ open, modalToggler, workOrder }) => {
  const { user } = useAuth();
  if (!['FOREMAN', 'ADMIN'].includes(user?.role)) modalToggler();

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
                <DialogTitle>Assign / Update Employees</DialogTitle>
                <Divider />
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
                  <Button onClick={handleSubmit} variant="contained">
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

export default AssignUpdateEmployeesModal;
