import {
  Modal,
  Divider,
  DialogTitle,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { PhoneOutlined, ApartmentOutlined } from '@ant-design/icons';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import MainCard from 'components/MainCard';

const EmployeesModal = ({ open, employees, modalToggler, departmentName }) => {
  return (
    open && (
      <Modal
        open={open}
        aria-labelledby="modal-assign-employees"
        aria-describedby="modal-assign-employees-description"
        sx={{
          '& .MuiPaper-root:focus': {
            outline: 'none'
          }
        }}
        onClose={modalToggler}
      >
        <MainCard
          sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 480, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
          modal
          content={false}
        >
          <SimpleBar
            style={{
              maxHeight: 'calc(100vh - 48px)'
            }}
          >
            <DialogTitle>Employees</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Box p={2} display="flex" flexDirection="column" gap={2}>
                {employees?.length > 0 ? (
                  employees.map((emp) => (
                    <Card key={emp.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Name: {emp.name || `${emp.first_name} ${emp.last_name}`}
                        </Typography>

                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneOutlined fontSize="small" />
                            <Typography variant="body2">Phone: {emp.phone || 'N/A'}</Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ApartmentOutlined fontSize="small" />
                            <Typography variant="body2">Department: {departmentName}</Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" textAlign="center">
                    No employees found.
                  </Typography>
                )}
              </Box>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Button color="error" onClick={modalToggler}>
                Close
              </Button>
            </DialogActions>
          </SimpleBar>
        </MainCard>
      </Modal>
    )
  );
};

export default EmployeesModal;
