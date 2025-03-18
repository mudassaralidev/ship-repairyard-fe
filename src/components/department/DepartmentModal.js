// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, TextField } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { useState } from 'react';
import { createDepartment, updateDepartment } from 'api/department';
import useAuth from 'hooks/useAuth';

const DepartmentModal = ({ open, modalToggler, department, handleUpdateDepartmentsState }) => {
  const closeModal = () => modalToggler(false);
  const [name, setName] = useState(department?.name ?? '');
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      let dept;
      if (department) {
        dept = await updateDepartment(department.id, { name });
      } else {
        dept = await createDepartment({ name, shipyard_id: user.shipyard_id, created_by: user.id });
      }

      handleUpdateDepartmentsState(dept);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-shipyard-add-label"
          aria-describedby="modal-shipyard-add-description"
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
                  flexDirection: 'column'
                }
              }}
            >
              <DialogTitle>{department ? 'Update Department' : 'Create Department'}</DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2.5 }}>
                <TextField fullWidth id="name" placeholder="Enter Department Name" value={name} onChange={(e) => setName(e.target.value)} />
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2.5 }}>
                <Button color="error" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={!name} onClick={handleSubmit}>
                  {department ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default DepartmentModal;
