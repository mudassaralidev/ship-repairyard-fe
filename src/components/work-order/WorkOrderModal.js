// material-ui
import { Grid, MenuItem, Modal, Stack, TextField, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import FormAddEditWorkOrder from './FormAddEditWorkOrder';
import { useState } from 'react';
import FormAddEditInventoryOrder from './FormAddEditInventoryOrder';

const WorkOrderModal = ({ open, modalToggler, repair, departments, inventories }) => {
  const [selectedOrder, setSelectedOrder] = useState('Work Order');
  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={modalToggler}
          aria-labelledby="modal-user-add-label"
          aria-describedby="modal-user-add-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: selectedOrder ? '16px !important' : '0px'
                }
              }}
            >
              <Grid container spacing={3}>
                <Grid item sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <TextField value={selectedOrder} select fullWidth label="Order Type" onChange={(e) => setSelectedOrder(e.target.value)}>
                      {['Work Order', 'Inventory Order'].map((statusOption) => (
                        <MenuItem key={statusOption} value={statusOption}>
                          <strong>{statusOption}</strong>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Grid>
                <Grid item sm={3}></Grid>
              </Grid>

              {selectedOrder === 'Work Order' && (
                <FormAddEditWorkOrder closeModal={modalToggler} repair={repair} departments={departments} />
              )}
              {selectedOrder === 'Inventory Order' && (
                <FormAddEditInventoryOrder closeModal={modalToggler} repair={repair} departments={departments} inventories={inventories} />
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default WorkOrderModal;
