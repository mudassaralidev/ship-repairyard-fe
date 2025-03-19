// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, TextField } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { createDockingPlace, updateDockingPlace } from 'api/dockingPlaces';
import { toast } from 'react-toastify';

const DockingPlaceModal = ({ open, modalToggler, place, handleUpdatePlaceState }) => {
  const closeModal = () => modalToggler(false);
  const [name, setName] = useState(place?.place_name ?? '');

  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      let dockingPlace;
      if (place) {
        dockingPlace = await updateDockingPlace(place.id, { place_name: name });
        toast.success('Docking Place updated successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: 'light'
        });
      } else {
        dockingPlace = await createDockingPlace({ place_name: name, shipyard_id: user.shipyard_id, created_by: user.id });
        toast.success('Docking Place created successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: 'light'
        });
      }

      handleUpdatePlaceState(dockingPlace);
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
              <DialogTitle>{place ? 'Update Docking Place' : 'Create Docking Place'}</DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2.5 }}>
                <TextField
                  fullWidth
                  id="name"
                  placeholder="Enter Docking Place Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2.5 }}>
                <Button color="error" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={!name} onClick={handleSubmit}>
                  {place ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

export default DockingPlaceModal;
