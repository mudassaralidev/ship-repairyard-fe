// material-ui
import { Modal, Stack } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { useEffect, useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, TextField, Autocomplete } from '@mui/material';
import axios from 'utils/dataApi';
import { updateSYUser } from '../../redux/features/shipyard/slice';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'api/snackbar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

const ClientAssignmentModal = ({ open, modalToggler, shipyard_id, user }) => {
  const closeModal = () => modalToggler(false);

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);

    try {
      (async () => {
        const { data } = await axios.get(`v1/shipyards/${shipyard_id}/clients`);
        setClients(data.clients || []);

        if (user.client?.id) {
          const defaultClient = data.clients.find((client) => client.id === user?.client?.id) || null;
          setSelectedClient(defaultClient);
        }
        setLoading(false);
      })();
    } catch (err) {
      console.error('Error getting clients', err);
      setLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.put(`v1/users/${user.id}/assign-client`, { client_user_id: selectedClient?.id });
      dispatch(updateSYUser(data));
      openSnackbar({
        open: true,
        message: 'Client Assigned Successfully',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    } catch (error) {
      console.error('Error while assigning client', error);
      openSnackbar({
        open: true,
        message: `Error while assigning client: ${error.message}`,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      closeModal();
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
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
                  flexDirection: 'column'
                }
              }}
            >
              {loading ? (
                <Stack alignItems="center">
                  <CircularWithPath />
                </Stack>
              ) : (
                <>
                  <DialogTitle>
                    {user?.client?.id ? 'Update Assigned Company to Superintendent ' : 'Assign Company to Superintendent'} "{user?.name}"
                  </DialogTitle>
                  <Divider />
                  <DialogContent sx={{ p: 2.5 }}>
                    <Autocomplete
                      value={selectedClient}
                      options={clients}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => setSelectedClient(value)}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => <TextField {...params} label="Select Company" />}
                    />
                  </DialogContent>
                  <Divider />
                  <DialogActions sx={{ p: 2.5 }}>
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={!selectedClient} onClick={handleSubmit}>
                      {user?.client?.id ? 'Update' : 'Assign'}
                    </Button>
                  </DialogActions>
                </>
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default ClientAssignmentModal;
